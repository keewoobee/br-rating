const fs = require('fs');
const dataContent = fs.readFileSync('src/data.ts', 'utf8');
const jsonStrMatch = dataContent.match(/export const menuData: MenuItem\[\] = (\[[\s\S]+?\]);/);
if (jsonStrMatch) {
  const menuData = JSON.parse(jsonStrMatch[1]);
  const missing = menuData.filter(m => !m.imageUrl || m.imageUrl.includes('picsum'));
  console.log('Missing images for:', missing.map(m => m.name));
}
