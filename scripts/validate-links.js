const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

async function validateUrl(url) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    return response.status < 400;
  } catch (error) {
    return false;
  }
}

async function validateImageUrl(url) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    return response.status < 400 && Boolean(contentType && contentType.startsWith('image/'));
  } catch (error) {
    return false;
  }
}

async function main() {
  const projectRoot = process.cwd();
  const errors = [];

  // Validate image URLs in components and pages
  const files = getAllFiles(projectRoot, ['.tsx', '.ts', '.js', '.jsx']);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const imageUrls = content.match(/src=["'](https?:\/\/[^"']+)["']/g) || [];

    for (const imageUrl of imageUrls) {
      const url = imageUrl.match(/["'](https?:\/\/[^"']+)["']/)?.[1];
      if (url) {
        const isValid = await validateImageUrl(url);
        if (!isValid) {
          errors.push(`Invalid image URL in ${file}: ${url}`);
        }
      }
    }
  }

  // Validate links in markdown files
  const markdownFiles = getAllFiles(projectRoot, ['.md']);

  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];

    for (const link of links) {
      const url = link.match(/\]\((https?:\/\/[^)]+)\)/)?.[1];
      if (url) {
        const isValid = await validateUrl(url);
        if (!isValid) {
          errors.push(`Invalid link in ${file}: ${url}`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error('Found broken links/images:');
    errors.forEach(error => console.error(error));
    process.exit(1);
  } else {
    console.log('All links and images are valid!');
  }
}

function getAllFiles(dir, extensions) {
  const files = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(entry.name)) {
        files.push(...getAllFiles(fullPath, extensions));
      }
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { validateUrl, validateImageUrl, getAllFiles };
