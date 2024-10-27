import { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

interface GalleryItem {
    id: number;
    src: string;
    alt: string;
    title: string;
    date: string;
    description: string;
}

interface GalleryConfig {
    bucketName: string;
    prefix: string;
    outputPath: string;
    galleryType: string;
}

async function downloadImage(client: S3Client, bucket: string, key: string, outputPath: string): Promise<void> {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const response = await client.send(command);
    if (!response.Body) throw new Error('No body in response');

    const body = response.Body as Readable;
    const writer = createWriteStream(outputPath);
    await finished(body.pipe(writer));
}

async function getObjectMetadata(client: S3Client, bucket: string, key: string) {
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        const response = await client.send(command);
        return {
            title: response.Metadata?.['title'] || 'No Title',
            description: response.Metadata?.['description'] || 'No Description',
            date: response.LastModified?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        };
    } catch (error) {
        console.error(`Error fetching metadata for ${key}:`, error);
        return {
            title: 'No Title',
            description: 'No Description',
            date: new Date().toISOString().split('T')[0],
        };
    }
}

async function syncGalleryImages(config: GalleryConfig): Promise<void> {
    const client = new S3Client({});
    const galleryItems: GalleryItem[] = [];
    let id = 1;

    // Ensure output directories exist
    const publicGalleryPath = join(process.cwd(), 'public', 'gallery', config.galleryType);
    const dataPath = join(process.cwd(), 'data');

    [publicGalleryPath, dataPath].forEach(path => {
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
        }
    });

    try {
        const command = new ListObjectsV2Command({
            Bucket: config.bucketName,
            Prefix: config.prefix,
        });

        const response = await client.send(command);

        if (!response.Contents) {
            console.log('No objects found in bucket');
            return;
        }

        for (const object of response.Contents) {
            if (!object.Key) continue;

            // Skip if not an image
            if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(object.Key)) continue;

            const filename = object.Key.split('/').pop();
            if (!filename) continue;

            // Download image to public folder
            const outputImagePath = join(publicGalleryPath, filename);
            await downloadImage(client, config.bucketName, object.Key, outputImagePath);

            // Get metadata
            const metadata = await getObjectMetadata(client, config.bucketName, object.Key);

            // Add to gallery items
            galleryItems.push({
                id: id++,
                src: `/gallery/${config.galleryType}/${filename}`,
                alt: metadata.title,
                title: metadata.title,
                date: metadata.date,
                description: metadata.description,
            });
        }

        // Write gallery data to JSON file
        const outputDataPath = join(dataPath, `${config.galleryType}.json`);
        writeFileSync(outputDataPath, JSON.stringify(galleryItems, null, 2));

        console.log(`Successfully synced ${galleryItems.length} images for ${config.galleryType}`);
    } catch (error) {
        console.error('Error syncing gallery images:', error);
        throw error;
    }
}

// Run the sync if called directly
if (require.main === module) {
    const galleryType = process.argv[2];
    const bucketName = process.env.GALLERY_BUCKET_NAME;
    const prefix = process.env.GALLERY_PREFIX || 'galleries';  // Default to 'galleries'

    if (!galleryType || !bucketName) {
        console.error('Usage: GALLERY_BUCKET_NAME=mybucket [GALLERY_PREFIX=galleries] npm run sync-gallery -- gallery-type');
        process.exit(1);
    }

    syncGalleryImages({
        bucketName,
        prefix: `${prefix}/${galleryType}/`,// Changed to use forward slash between prefix and galleryType
        outputPath: `public/gallery/${galleryType}`,
        galleryType,
    }).catch(error => {
        console.error('Failed to sync gallery:', error);
        process.exit(1);
    });
}

export { syncGalleryImages, type GalleryConfig };
