import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = 'C:/Users/recor/OneDrive/Desktop/BR Rating';
const DATA_FILE = join(ROOT, 'src/data.ts');
const IMG_DIR = join(ROOT, 'public/images');

// Ensure images directory exists
mkdirSync(IMG_DIR, { recursive: true });

// Read data.ts
let content = readFileSync(DATA_FILE, 'utf-8');

// Step 0: Update 땅콩로켓 (id 215) imageUrl first
const oldPeanutUrl = 'https://i.namu.wiki/i/KuL5l-1a2uVkBl4zXQCUp-GVvChmBVpePRFhneNcgpS-IgbqW0-W_0w4H0m7sMfDZRMfAZsi-mq3Px7mjY3aYg.webp';
const newPeanutUrl = 'https://i.namu.wiki/i/AY1fP_FrSaMB1HgCt_asfPFOtH9txQXAW7kZRCWySq8_qOS9sXDQjHQVsEZPOUEkY58RwL7P_T1Ez8ctD5w-WBgKBIFROuTXY2bgqLGXzp8.webp';
content = content.replace(oldPeanutUrl, newPeanutUrl);
writeFileSync(DATA_FILE, content, 'utf-8');
console.log('Updated 땅콩로켓 imageUrl');

// Extract all menu items with imageUrl from menuData array
// We need to find items in the menuData array that have id and imageUrl
const itemRegex = /"id":\s*(\d+),[\s\S]*?"imageUrl":\s*"(https?:\/\/[^"]+)"/g;

// Also handle tier imageUrls - we'll collect those too but with a tier- prefix
// First, let's get menuData items
const menuDataStart = content.indexOf('export const menuData');
const menuDataContent = content.slice(menuDataStart);

const items = [];
let match;
while ((match = itemRegex.exec(menuDataContent)) !== null) {
  items.push({ id: match[1], url: match[2] });
}

// Also get tier imageUrls
const tierContent = content.slice(0, menuDataStart);
const tierRegex = /"imageUrl":\s*"(https?:\/\/[^"]+)"/g;
const tierItems = [];
let tierIdx = 0;
while ((match = tierRegex.exec(tierContent)) !== null) {
  tierItems.push({ id: `tier-${tierIdx}`, url: match[1] });
  tierIdx++;
}

const allItems = [...tierItems, ...items];
console.log(`Found ${tierItems.length} tier images and ${items.length} menu item images (${allItems.length} total)`);

// Download function with retry
async function downloadImage(url, filepath, label) {
  try {
    const response = await fetch(url, {
      headers: {
        'Referer': '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'follow',
    });
    if (!response.ok) {
      console.error(`  FAIL [${label}] HTTP ${response.status}: ${url.slice(0, 80)}...`);
      return false;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(filepath, buffer);
    console.log(`  OK [${label}] ${buffer.length} bytes`);
    return true;
  } catch (err) {
    console.error(`  FAIL [${label}] ${err.message}`);
    return false;
  }
}

// Download all images with concurrency limit
const CONCURRENCY = 5;
const results = new Map(); // id -> success

async function downloadBatch(batch) {
  return Promise.all(batch.map(async (item) => {
    const ext = item.url.endsWith('.png') ? '.png' : '.webp';
    const filepath = join(IMG_DIR, `${item.id}${ext}`);
    if (existsSync(filepath)) {
      console.log(`  SKIP [${item.id}] already exists`);
      results.set(item.id, { success: true, ext });
      return;
    }
    const success = await downloadImage(item.url, filepath, item.id);
    results.set(item.id, { success, ext });
  }));
}

// Process in batches
for (let i = 0; i < allItems.length; i += CONCURRENCY) {
  const batch = allItems.slice(i, i + CONCURRENCY);
  console.log(`Downloading batch ${Math.floor(i/CONCURRENCY) + 1}/${Math.ceil(allItems.length/CONCURRENCY)}...`);
  await downloadBatch(batch);
}

// Now update data.ts - replace each successful download's URL with local path
console.log('\nUpdating data.ts...');
let updatedContent = readFileSync(DATA_FILE, 'utf-8');
let replacements = 0;

for (const item of allItems) {
  const result = results.get(item.id);
  if (result && result.success) {
    const localPath = `/images/${item.id}${result.ext}`;
    const before = updatedContent;
    updatedContent = updatedContent.replace(item.url, localPath);
    if (updatedContent !== before) {
      replacements++;
    }
  }
}

writeFileSync(DATA_FILE, updatedContent, 'utf-8');
console.log(`Done! Replaced ${replacements} URLs out of ${allItems.length} total items.`);

const failed = [...results.entries()].filter(([, r]) => !r.success);
if (failed.length > 0) {
  console.log(`\nFailed downloads (${failed.length}):`);
  for (const [id] of failed) {
    const item = allItems.find(i => i.id === id);
    console.log(`  ${id}: ${item?.url?.slice(0, 80)}...`);
  }
}
