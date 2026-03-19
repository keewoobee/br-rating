import fs from 'fs';

const dataTsContent = fs.readFileSync('src/data.ts', 'utf-8');
const flavorsJson = JSON.parse(fs.readFileSync('flavors.json', 'utf-8'));

// Extract existing names from data.ts
const existingNames = [];
const nameRegex = /"name":\s*"([^"]+)"/g;
let match;
while ((match = nameRegex.exec(dataTsContent)) !== null) {
  existingNames.push(match[1]);
}

console.log(`Found ${existingNames.length} existing flavors.`);

// Filter new flavors
const newFlavors = flavorsJson.filter(f => !existingNames.includes(f.name));
console.log(`Found ${newFlavors.length} new flavors to add.`);

if (newFlavors.length > 0) {
  // Find the end of the array in data.ts
  const endOfArrayMatch = dataTsContent.lastIndexOf('];');
  if (endOfArrayMatch !== -1) {
    let newContent = dataTsContent.substring(0, endOfArrayMatch);
    
    // Remove trailing whitespace/newlines before the bracket
    newContent = newContent.replace(/,\s*$/, '');
    
    // Append new flavors
    for (const flavor of newFlavors) {
      newContent += ',\n  ' + JSON.stringify(flavor, null, 2).replace(/\n/g, '\n  ');
    }
    
    newContent += '\n];\n';
    fs.writeFileSync('src/data.ts', newContent);
    console.log('Successfully updated src/data.ts');
  } else {
    console.error('Could not find the end of the menuData array in src/data.ts');
  }
}
