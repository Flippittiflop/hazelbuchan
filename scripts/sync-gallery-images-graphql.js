const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { writeFileSync, mkdirSync, existsSync, createWriteStream } = require('fs');
const { join } = require('path');
const { finished } = require('stream/promises');

const APPSYNC_ENDPOINT = process.env.APPSYNC_URL;
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

// Helper function to normalize category names for file system operations
function normalizeCategory(category) {
    return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

async function fetchCategoryData(categoryName) {
    const query = `
    query ListCategories($filter: ModelCategoryFilterInput) {
      listCategories(filter: $filter) {
        items {
          createdAt
          images {
            items {
              id
              isActive
              metadata
              s3Key
              s3Url
              sequence
              createdAt
            }
          }
          name
          id
        }
      }
    }
  `;

    const variables = {
        filter: {
            name: { eq: categoryName }
        }
    };

    try {
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(APPSYNC_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': APPSYNC_API_KEY
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        const data = await response.json();
        if (data.errors) {
            throw new Error(`GraphQL Errors: ${JSON.stringify(data.errors)}`);
        }

        return data.data.listCategories.items[0];
    } catch (error) {
        console.error('Failed to fetch category data:', error);
        throw error;
    }
}

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

function createItemFromGraphQL(image, normalizedCategory) {
    if (!image.isActive) return null;

    let metadata;
    try {
        metadata = JSON.parse(image.metadata);
    } catch (error) {
        console.error(`Failed to parse metadata for image ${image.id}:`, error);
        return null;
    }

    const filename = image.s3Key.split('/').pop();

    return {
        id: image.id,
        src: `/gallery/${normalizedCategory}/${filename}`,
        alt: metadata.title || 'No Title',
        title: metadata.title,
        description: metadata.description,
        date: new Date(image.createdAt).toISOString().split('T')[0],
        sequence: image.sequence,
        ...metadata // Spread the rest of the metadata fields
    };
}

async function syncGalleryImages(config) {
    console.log('Starting sync with config:', config);
    const client = new S3Client({});
    const items = [];

    // Normalize category name for filesystem operations
    const normalizedCategory = normalizeCategory(config.categoryName);

    const publicGalleryPath = join(process.cwd(), 'public', 'gallery', normalizedCategory);
    const dataPath = join(process.cwd(), 'data');

    // Ensure directories exist
    [publicGalleryPath, dataPath].forEach(path => {
        if (!existsSync(path)) {
            console.log(`Creating directory: ${path}`);
            mkdirSync(path, { recursive: true });
        }
    });

    try {
        const categoryData = await fetchCategoryData(config.categoryName);
        if (!categoryData) {
            console.log(`No category found with name: ${config.categoryName}`);
            return;
        }

        const images = categoryData.images.items;
        console.log(`Found ${images.length} images in category`);

        for (const image of images) {
            if (!image.isActive) {
                console.log(`Skipping inactive image: ${image.s3Key}`);
                continue;
            }

            try {
                const filename = image.s3Key.split('/').pop();
                const outputPath = join(publicGalleryPath, filename);

                // Download the image from S3
                await downloadImage(client, config.bucketName, image.s3Key, outputPath);

                // Create flattened item from GraphQL data
                const item = createItemFromGraphQL(image, normalizedCategory);
                if (item) {
                    items.push(item);
                    console.log(`Processed: ${filename}`);
                }
            } catch (error) {
                console.error(`Error processing image ${image.s3Key}:`, error);
                continue;
            }
        }

        // Sort items by sequence
        items.sort((a, b) => a.sequence - b.sequence);

        // Write output file using normalized category name
        const outputPath = join(dataPath, `${normalizedCategory}.json`);
        writeFileSync(outputPath, JSON.stringify({ items }, null, 2));

        console.log(`Successfully synced ${items.length} items for ${normalizedCategory}`);
    } catch (error) {
        console.error('Sync failed:', error);
        throw error;
    }
}

if (require.main === module) {
    const categoryName = process.argv[2];
    const bucketName = process.env.GALLERY_BUCKET_NAME;

    if (!categoryName || !bucketName || !APPSYNC_ENDPOINT || !APPSYNC_API_KEY) {
        console.error(`
Usage: 
GALLERY_BUCKET_NAME=mybucket 
APPSYNC_ENDPOINT=https://xxx.appsync-api.region.amazonaws.com/graphql 
APPSYNC_API_KEY=da2-xxx 
npm run sync-gallery -- category-name
    `);
        process.exit(1);
    }

    syncGalleryImages({
        bucketName,
        categoryName
    }).catch(error => {
        console.error('Sync failed:', error);
        process.exit(1);
    });
}

module.exports = { syncGalleryImages };
