const { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { writeFileSync, mkdirSync, existsSync, createWriteStream } = require('fs');
const { join } = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

// Template for product metadata
const productTemplate = {
    title: { key: 'title', default: 'No Title' },
    price: { key: 'price', default: "Enquire" },
    mediaType: {
        key: 'mediaType',
        default: 'image',
    },
    description: { key: 'description', default: "No Description" },
    type: { key: 'type', default: "Static" },
    sequence: { key: 'sequence', default: 99, transform: parseInt },
};

const galleryTemplate = {
    title: { key: 'title', default: 'No Title' },
    date: { key: 'date', default: "2021-01-01" },
    description: { key: 'description', default: "No Description" },
};

const featureTemplate = {
    title: { key: 'title', default: 'No Title' },
    date: { key: 'date', default: "2021-01-01" },
    description: { key: 'description', default: "No Description" },
    category: { key: 'category', default: "PaperSculpture" },
}

const basicTemplate = {
    title: { key: 'title', default: 'No Title' },
}

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

        // Convert the metadata to key-value pairs
        const metadata = [];
        if (response.Metadata) {
            for (const [key, value] of Object.entries(response.Metadata)) {
                metadata.push({ key, value });
                console.log("Meta Data Key ",key);
                console.log("Meta Data Value ",value);
            }
        }

        return metadata;

    } catch (error) {
        console.error(`Error fetching metadata for ${key}:`, error);
        // Return an empty array on error
        return [];
    }
}

// Function to get metadata values from key-value array
function getMetadataValue(keyValueArray, key, defaultValue, transform = (x) => x) {
    const entry = keyValueArray.find(item => item.key === key);
    return entry ? transform(entry.value) : defaultValue;
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

            const metadata = await getObjectMetadata(client, config.bucketName, object.Key);

            if (config.type === 'product') {
                items.push({
                    id: id++,
                    title: getMetadataValue(metadata, productTemplate.title.key, productTemplate.title.default),
                    price: getMetadataValue(metadata, productTemplate.price.key, productTemplate.price.default, parseFloat),
                    mediaType: productTemplate.mediaType.compute(object.Key),
                    mediaUrl: `/gallery/${config.galleryType}/${filename}`,
                    sequence: getMetadataValue(metadata, productTemplate.sequence.key, productTemplate.sequence.default, parseInt),
                });
            } else if (config.type === 'gallery') {
                items.push({
                    id: id++,
                    title: getMetadataValue(metadata, galleryTemplate.title.key, galleryTemplate.title.default),
                    date: getMetadataValue(metadata, galleryTemplate.date.key, galleryTemplate.date.default),
                    description: getMetadataValue(metadata, galleryTemplate.description.key, galleryTemplate.description.default),
                });
            } else if (config.type === 'feature') {
                items.push({
                    id: id++,
                    title: getMetadataValue(metadata, featureTemplate.title.key, featureTemplate.title.default),
                    date: getMetadataValue(metadata, featureTemplate.date.key, featureTemplate.date.default),
                    description: getMetadataValue(metadata, featureTemplate.description.key, featureTemplate.description.default),
                    category: getMetadataValue(metadata, featureTemplate.category.key, featureTemplate.category.default),
                });
            } else if (config.type === 'basic') {
                items.push({
                    id: id++,
                    title: getMetadataValue(metadata, basicTemplate.title.key, basicTemplate.title.default),
                });
            }
        }
        // Sort items by sequence
        // items.sort((a, b) => a.sequence - b.sequence);
        console.log("JSON Items ",items);
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
