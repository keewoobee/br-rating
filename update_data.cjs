const fs = require('fs');
const html = fs.readFileSync('br_list.html', 'utf8');

const regex = /<img src="([^"]+)" alt="([^"]+)" class="menu-list__image">/g;
const imageMap = {};
let match;
while ((match = regex.exec(html)) !== null) {
  let name = match[2].replace(/&#40;/g, '(').replace(/&#41;/g, ')').trim();
  imageMap[name] = 'https://www.baskinrobbins.co.kr' + match[1];
}

const dataPath = 'src/data.ts';
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Parse the JSON array from data.ts
const jsonStrMatch = dataContent.match(/export const menuData: MenuItem\[\] = (\[[\s\S]+?\]);/);
if (jsonStrMatch) {
  const menuData = JSON.parse(jsonStrMatch[1]);
  
  menuData.forEach(item => {
    // Try to find exact match or partial match
    let imgUrl = imageMap[item.name];
    if (!imgUrl) {
      // Try replacing spaces or checking includes
      const foundKey = Object.keys(imageMap).find(k => k.includes(item.name) || item.name.includes(k));
      if (foundKey) {
        imgUrl = imageMap[foundKey];
      }
    }
    if (imgUrl) {
      item.imageUrl = imgUrl;
    } else {
      item.imageUrl = 'https://picsum.photos/seed/' + encodeURIComponent(item.name) + '/400/400';
    }
  });

  // Update interface
  dataContent = dataContent.replace('kcal: number;', 'kcal: number;\n  imageUrl?: string;');
  
  // Update the array
  dataContent = dataContent.replace(jsonStrMatch[1], JSON.stringify(menuData, null, 2));
  
  fs.writeFileSync(dataPath, dataContent);
  console.log('Updated data.ts with image URLs');
} else {
  console.log('Could not find menuData array in data.ts');
}
