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

async function getObjectMetadata(client, bucket, key, type = 'gallery') {
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        const response = await client.send(command);

        if (type === 'products') {
            const mediaType = /\.(mp4|webm|ogg)$/i.test(key) ? 'video' : 'image';
            return {
                title: response.Metadata?.['title'] || 'No Title',
                price: parseInt(response.Metadata?.['price']) || 0,
                mediaType,
                sequence: parseInt(response.Metadata?.['sequence']) || 99,
            };
        }

        // Default gallery metadata
        return {
            title: response.Metadata?.['title'] || 'No Title',
            description: response.Metadata?.['description'] || 'No Description',
            category: response.Metadata?.['category'] || 'No Category',
            date: response.LastModified?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            sequence: parseInt(response.Metadata?.['sequence']) || 99,
        };
    } catch (error) {
        console.error(`Error fetching metadata for ${key}:`, error);

        if (type === 'products') {
            return {
                title: 'No Title',
                price: 0,
                mediaType: 'image',
                sequence: 99,
            };
        }

        return {
            title: 'No Title',
            description: 'No Description',
            date: new Date().toISOString().split('T')[0],
            category: 'No Category',
            sequence: 99,
        };
    }
}

async function syncGalleryImages(config) {
    const client = new S3Client({});
    const items = [];
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
        console.log('bucket: ' + config.bucketName);
        console.log('prefix: ' + config.prefix);

        const response = await client.send(command);

        if (!response.Contents) {
            console.log('No objects found in bucket');
            return;
        }

        // Sort objects by sequence number and LastModified
        const sortedObjects = response.Contents.sort((a, b) => {
            const seqA = parseInt(a.Metadata?.sequence) || 99;
            const seqB = parseInt(b.Metadata?.sequence) || 99;
            if (seqA !== seqB) return seqA - seqB;
            return new Date(b.LastModified) - new Date(a.LastModified);
        });

        for (const object of sortedObjects) {
            if (!object.Key) continue;

            if (!/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg)$/i.test(object.Key)) continue;

            const filename = object.Key.split('/').pop();
            if (!filename) continue;

            const outputImagePath = join(publicGalleryPath, filename);
            await downloadImage(client, config.bucketName, object.Key, outputImagePath);

            const metadata = await getObjectMetadata(client, config.bucketName, object.Key, config.type);

            if (config.type === 'products') {
                items.push({
                    id: id++,
                    title: metadata.title,
                    price: metadata.price,
                    mediaType: metadata.mediaType,
                    mediaUrl: `/gallery/${config.galleryType}/${filename}`,
                    sequence: metadata.sequence
                });
            }
            else if (config.type === 'basic') {
                items.push({
                    id: id++,
                    title: metadata.title,
                    src: `/gallery/${config.galleryType}/${filename}`,
                    sequence: metadata.sequence
                });
            }
            else {
                items.push({
                    id: id++,
                    src: `/gallery/${config.galleryType}/${filename}`,
                    alt: metadata.title,
                    title: metadata.title,
                    category: metadata.category,
                    date: metadata.date,
                    description: metadata.description,
                    sequence: metadata.sequence
                });
            }
        }

        // Sort items by sequence
        items.sort((a, b) => a.sequence - b.sequence);

        const outputDataPath = join(dataPath, `${config.galleryType}.json`);
        writeFileSync(outputDataPath, JSON.stringify({ items }, null, 2));

        console.log(`Successfully synced ${items.length} items for ${config.galleryType}`);
    } catch (error) {
        console.error('Error syncing gallery images:', error);
        throw error;
    }
}

if (require.main === module) {
    const galleryType = process.argv[2];
    const type = process.argv[3] || 'gallery'; // Default to gallery type if not specified
    const bucketName = process.env.GALLERY_BUCKET_NAME;

    if (!galleryType || !bucketName) {
        console.error('Usage: GALLERY_BUCKET_NAME=mybucket npm run sync-gallery -- gallery-type [type]');
        process.exit(1);
    }

    syncGalleryImages({
        bucketName,
        prefix: `media-files/${galleryType}/`,
        outputPath: `public/gallery/${galleryType}`,
        galleryType,
        type,
    }).catch(error => {
        console.error('Failed to sync gallery:', error);
        process.exit(1);
    });
}

module.exports = { syncGalleryImages };
