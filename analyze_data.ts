import { menuData } from './src/data.ts';

const totalCount = menuData.length;
console.log(`Total menu items: ${totalCount}`);

const nameCounts: Record<string, number> = {};
menuData.forEach(item => {
  nameCounts[item.name] = (nameCounts[item.name] || 0) + 1;
});

const duplicates = Object.entries(nameCounts).filter(([name, count]) => count > 1);
if (duplicates.length > 0) {
  console.log('Duplicate names found:');
  duplicates.forEach(([name, count]) => console.log(`- ${name}: ${count}`));
} else {
  console.log('No duplicate names found.');
}

const tagIssues: string[] = [];
menuData.forEach(item => {
  const years = item.tags.filter(tag => tag.match(/^\d{4}$/));
  const yearNyeons = item.tags.filter(tag => tag.match(/^\d{4}년$/));
  
  years.forEach(year => {
    if (yearNyeons.includes(`${year}년`)) {
      tagIssues.push(`Item ID ${item.id} (${item.name}) has both "${year}" and "${year}년"`);
    }
  });
});

if (tagIssues.length > 0) {
  console.log('Tag issues found:');
  tagIssues.forEach(issue => console.log(`- ${issue}`));
} else {
  console.log('No tag issues found.');
}
