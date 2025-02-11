const { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { writeFileSync, mkdirSync, existsSync, createWriteStream } = require('fs');
const { join } = require('path');
const { finished } = require('stream/promises');

// Templates for metadata handling
const templates = {
    product: {
        isActive: { key: 'x-amz-meta-is-active', default: 'true' },
        title: { key: 'x-amz-meta-title', default: 'No Title' },
        price: { key: 'x-amz-meta-price', default: 'Enquire' },
        mediaType: { key: 'x-amz-meta-media-type', default: 'image' },
        sequence: { key: 'x-amz-meta-sequence', default: '99' }
    },
    gallery: {
        isActive: { key: 'x-amz-meta-is-active', default: 'true' },
        title: { key: 'x-amz-meta-title', default: 'No Title' },
        date: { key: 'x-amz-meta-date', default: new Date().toISOString().split('T')[0] },
        description: { key: 'x-amz-meta-description', default: 'No Description' },
        sequence: { key: 'x-amz-meta-sequence', default: '99' }
    },
    featured: {
        isActive: { key: 'x-amz-meta-is-active', default: 'true' },
        title: { key: 'x-amz-meta-title', default: 'No Title' },
        date: { key: 'x-amz-meta-date', default: new Date().toISOString().split('T')[0] },
        description: { key: 'x-amz-meta-description', default: 'No Description' },
        category: { key: 'x-amz-meta-category', default: 'PaperSculpture' },
        sequence: { key: 'x-amz-meta-sequence', default: '99' }
    },
    basic: {
        isActive: { key: 'x-amz-meta-is-active', default: 'true' },
        title: { key: 'x-amz-meta-title', default: 'No Title' },
        sequence: { key: 'x-amz-meta-sequence', default: '99' }
    }
};

async function downloadImage(client, bucket, key, outputPath) {
    console.log(`Downloading: s3://${bucket}/${key}`);
    try {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const response = await client.send(command);

        if (!response.Body) throw new Error('Empty response body');

        const writer = createWriteStream(outputPath);
        await finished(response.Body.pipe(writer));
        console.log(`Downloaded to: ${outputPath}`);
    } catch (error) {
        console.error(`Failed to download ${key}:`, error);
        throw error;
    }
}

async function getObjectMetadata(client, bucket, key) {
    try {
        const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
        const response = await client.send(command);

        // Convert S3 metadata to our format
        const metadata = {};
        if (response.Metadata) {
            Object.entries(response.Metadata).forEach(([key, value]) => {
                metadata[`x-amz-meta-${key}`] = value;
            });
        }

        console.log(`Metadata for ${key}:`, metadata);
        return metadata;
    } catch (error) {
        console.error(`Failed to get metadata for ${key}:`, error);
        return {};
    }
}

function getMetadataValue(metadata, key, defaultValue) {
    return metadata[key] || defaultValue;
}

function createItemFromMetadata(type, metadata, filename, id, config) {
    const template = templates[type];
    if (!template) return null;

    const isActive = getMetadataValue(metadata, template.isActive.key, template.isActive.default) === 'true';
    if (!isActive) return null;

    const baseItem = {
        id,
        src: `/gallery/${config.galleryType}/${filename}`,
        alt: getMetadataValue(metadata, template.title.key, template.title.default),
        sequence: parseInt(getMetadataValue(metadata, template.sequence.key, template.sequence.default))
    };

    switch (type) {
        case 'product':
            return {
                ...baseItem,
                title: getMetadataValue(metadata, template.title.key, template.title.default),
                price: getMetadataValue(metadata, template.price.key, template.price.default),
                mediaType: getMetadataValue(metadata, template.mediaType.key, template.mediaType.default),
                src: baseItem.src
            };
        case 'gallery':
            return {
                ...baseItem,
                title: getMetadataValue(metadata, template.title.key, template.title.default),
                date: getMetadataValue(metadata, template.date.key, template.date.default),
                description: getMetadataValue(metadata, template.description.key, template.description.default)
            };
        case 'featured':
            return {
                ...baseItem,
                title: getMetadataValue(metadata, template.title.key, template.title.default),
                date: getMetadataValue(metadata, template.date.key, template.date.default),
                description: getMetadataValue(metadata, template.description.key, template.description.default),
                category: getMetadataValue(metadata, template.category.key, template.category.default)
            };
        case 'basic':
            return {
                ...baseItem,
                title: getMetadataValue(metadata, template.title.key, template.title.default)
            };
        default:
            return null;
    }
}

async function syncGalleryImages(config) {
    console.log('Starting sync with config:', config);
    const client = new S3Client({});
    const items = [];
    let id = 1;

    const publicGalleryPath = join(process.cwd(), 'public', 'gallery', config.galleryType);
    const dataPath = join(process.cwd(), 'data');

    // Ensure directories exist
    [publicGalleryPath, dataPath].forEach(path => {
        if (!existsSync(path)) {
            console.log(`Creating directory: ${path}`);
            mkdirSync(path, { recursive: true });
        }
    });

    try {
        const command = new ListObjectsV2Command({
            Bucket: config.bucketName,
            Prefix: config.prefix
        });

        const response = await client.send(command);
        console.log(`Found ${response.Contents?.length || 0} objects in bucket`);

        if (!response.Contents?.length) {
            console.log('No objects found in bucket');
            return;
        }

        for (const object of response.Contents) {
            if (!object.Key) continue;

            // Only process media files
            if (!/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg)$/i.test(object.Key)) {
                console.log(`Skipping non-media file: ${object.Key}`);
                continue;
            }

            const filename = object.Key.split('/').pop();
            if (!filename) continue;

            try {
                // Download the file
                const outputPath = join(publicGalleryPath, filename);
                await downloadImage(client, config.bucketName, object.Key, outputPath);

                // Get and process metadata
                const metadata = await getObjectMetadata(client, config.bucketName, object.Key);
                const item = createItemFromMetadata(config.type, metadata, filename, id++, config);

                if (item) {
                    items.push(item);
                    console.log(`Processed: ${filename}`);
                } else {
                    console.log(`Skipped inactive or invalid item: ${filename}`);
                }
            } catch (error) {
                console.error(`Error processing ${filename}:`, error);
                continue;
            }
        }

        // Sort items by sequence
        items.sort((a, b) => a.sequence - b.sequence);

        // Write output file
        const outputPath = join(dataPath, `${config.galleryType}.json`);
        writeFileSync(outputPath, JSON.stringify({ items }, null, 2));

        console.log(`Successfully synced ${items.length} items for ${config.galleryType}`);
    } catch (error) {
        console.error('Sync failed:', error);
        throw error;
    }
}

if (require.main === module) {
    const galleryType = process.argv[2];
    const type = process.argv[3] || 'gallery';
    const bucketName = process.env.GALLERY_BUCKET_NAME;

    if (!galleryType || !bucketName) {
        console.error('Usage: GALLERY_BUCKET_NAME=mybucket npm run sync-gallery -- gallery-type [type]');
        process.exit(1);
    }

    syncGalleryImages({
        bucketName,
        prefix: `media-files/${galleryType}/`,
        galleryType,
        type,
    }).catch(error => {
        console.error('Sync failed:', error);
        process.exit(1);
    });
}

module.exports = { syncGalleryImages };
