const { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { writeFileSync, mkdirSync, existsSync, createWriteStream } = require('fs');
const { join } = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

async function downloadImage(client, bucket, key, outputPath) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const response = await client.send(command);
    if (!response.Body) throw new Error('No body in response');

    const body = response.Body;
    const writer = createWriteStream(outputPath);
    await finished(body.pipe(writer));
}

async function getObjectMetadata(client, bucket, key) {
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

async function syncGalleryImages(config) {
    const client = new S3Client({});
    const galleryItems = [];
    let id = 1;

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
        console.log('bucket'+config.bucketName);
        console.log('prefix'+config.prefix);

        const response = await client.send(command);

        if (!response.Contents) {
            console.log('No objects found in bucket');
            return;
        }

        for (const object of response.Contents) {
            if (!object.Key) continue;

            if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(object.Key)) continue;

            const filename = object.Key.split('/').pop();
            if (!filename) continue;

            const outputImagePath = join(publicGalleryPath, filename);
            await downloadImage(client, config.bucketName, object.Key, outputImagePath);

            const metadata = await getObjectMetadata(client, config.bucketName, object.Key);

            galleryItems.push({
                id: id++,
                src: `/gallery/${config.galleryType}/${filename}`,
                alt: metadata.title,
                title: metadata.title,
                date: metadata.date,
                description: metadata.description,
            });
        }

        const outputDataPath = join(dataPath, `${config.galleryType}.json`);
        writeFileSync(outputDataPath, JSON.stringify({ items: galleryItems }, null, 2));

        console.log(`Successfully synced ${galleryItems.length} images for ${config.galleryType}`);
    } catch (error) {
        console.error('Error syncing gallery images:', error);
        throw error;
    }
}

if (require.main === module) {
    const galleryType = process.argv[2];
    const bucketName = process.env.GALLERY_BUCKET_NAME;
    const prefix = process.env.GALLERY_PREFIX || 'galleries';

    if (!galleryType || !bucketName) {
        console.error('Usage: GALLERY_BUCKET_NAME=mybucket [GALLERY_PREFIX=galleries] npm run sync-gallery -- gallery-type');
        process.exit(1);
    }

    syncGalleryImages({
        bucketName,
        prefix: `${prefix}/${galleryType}/`,
        outputPath: `public/gallery/${galleryType}`,
        galleryType,
    }).catch(error => {
        console.error('Failed to sync gallery:', error);
        process.exit(1);
    });
}

module.exports = { syncGalleryImages };
