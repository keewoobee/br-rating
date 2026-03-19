import { menuData } from './src/data';

const ids = menuData.map(m => m.id);
const duplicateIds = ids.filter((item, index) => ids.indexOf(item) !== index);
console.log("Duplicate IDs:", Array.from(new Set(duplicateIds)));
