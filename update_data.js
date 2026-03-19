const fs = require('fs');

let content = fs.readFileSync('src/data.ts', 'utf8');

// Find the menuData array
const startIndex = content.indexOf('export const menuData: MenuItem[] = [');
const endIndex = content.lastIndexOf('];') + 2;

if (startIndex !== -1 && endIndex !== -1) {
  const arrayString = content.substring(startIndex + 'export const menuData: MenuItem[] = '.length, endIndex);
  
  // Parse the array
  let menuData;
  try {
    menuData = eval('(' + arrayString + ')');
  } catch (e) {
    console.error("Failed to parse menuData", e);
    process.exit(1);
  }

  // Update items
  menuData.forEach(item => {
    if (item.category === '이달의 맛') {
      // Check if description already has year and month
      let yearMatch = item.description?.match(/20\d{2}년/);
      let monthMatch = item.description?.match(/\d{1,2}월/);
      
      let year = yearMatch ? yearMatch[0] : null;
      let month = monthMatch ? monthMatch[0] : null;
      
      if (!year) {
        // Fallback or skip
        return;
      }
      
      if (!item.tags) {
        item.tags = [];
      }
      
      if (year && !item.tags.includes(year)) {
        item.tags.push(year);
      }
      if (month && !item.tags.includes(month)) {
        item.tags.push(month);
      }
      
      if (year && month) {
        item.description = `${year} ${month} 이달의 맛`;
      } else if (year) {
        item.description = `${year} 이달의 맛`;
      }
    }
  });

  // Write back
  const newArrayString = JSON.stringify(menuData, null, 2);
  const newContent = content.substring(0, startIndex) + 'export const menuData: MenuItem[] = ' + newArrayString + ';\n';
  
  fs.writeFileSync('src/data.ts', newContent, 'utf8');
  console.log('Updated data.ts');
} else {
  console.log('Could not find menuData');
}
