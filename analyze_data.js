
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data.ts', 'utf8').replace('export const menuData: MenuItem[] = ', '').replace(/;$/, ''));

const idCounts = {};
const nameCounts = {};
const tagIssues = [];

data.forEach(item => {
  // Check ID duplicates
  idCounts[item.id] = (idCounts[item.id] || 0) + 1;

  // Check Name duplicates
  nameCounts[item.name] = (nameCounts[item.name] || 0) + 1;

  // Check Tag inconsistencies (e.g., "2025" vs "2025년")
  if (item.tags) {
    const years = item.tags.filter(t => t.includes('202'));
    if (years.length > 1) {
      tagIssues.push(`Item ID ${item.id} (${item.name}) has multiple year tags: ${years.join(', ')}`);
    }
  }
});

const duplicateIds = Object.entries(idCounts).filter(([id, count]) => count > 1);
const duplicateNames = Object.entries(nameCounts).filter(([name, count]) => count > 1);

console.log('--- Analysis Report ---');
console.log('Duplicate IDs:', duplicateIds);
console.log('Duplicate Names:', duplicateNames);
console.log('Tag Issues:', tagIssues);
