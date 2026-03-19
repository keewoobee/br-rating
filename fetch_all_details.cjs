const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

const dataPath = 'src/data.ts';
let dataContent = fs.readFileSync(dataPath, 'utf8');

const jsonStrMatch = dataContent.match(/export const menuData: MenuItem\[\] = (\[[\s\S]+?\]);/);
if (!jsonStrMatch) {
  console.log('Could not find menuData array in data.ts');
  process.exit(1);
}

const menuData = JSON.parse(jsonStrMatch[1]);

const listHtml = fs.readFileSync('br_list.html', 'utf8');
const $list = cheerio.load(listHtml);

const seqMap = {};
$list('.menu-list__item').each((i, el) => {
  const link = $list(el).find('.menu-list__link').attr('href');
  const title = $list(el).find('.menu-list__title').text().replace(/&#40;/g, '(').replace(/&#41;/g, ')').trim();
  if (link && title) {
    const seqMatch = link.match(/seq=(\d+)/);
    if (seqMatch) {
      seqMap[title] = seqMatch[1];
    }
  }
});

function fetchDetail(seq) {
  return new Promise((resolve, reject) => {
    https.get(`https://www.baskinrobbins.co.kr/menu/view.php?seq=${seq}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

async function run() {
  for (let item of menuData) {
    let seq = seqMap[item.name];
    if (!seq) {
      // Try partial match
      const foundKey = Object.keys(seqMap).find(k => k.includes(item.name) || item.name.includes(k));
      if (foundKey) seq = seqMap[foundKey];
    }
    
    if (seq) {
      console.log(`Fetching details for ${item.name} (seq: ${seq})...`);
      const detailHtml = await fetchDetail(seq);
      const $ = cheerio.load(detailHtml);
      
      const enName = $('.menu-view-header__title--en').text().trim();
      const description = $('.menu-view-header__text').text().trim();
      
      const components = [];
      $('.menu-view-ingredients__name').each((i, el) => {
        components.push($(el).text().trim());
      });
      
      const nutrition = {};
      $('.menu-view-nutrition__item').each((i, el) => {
        const name = $(el).find('.menu-view-nutrition__name').text().trim();
        const text = $(el).find('.menu-view-nutrition__text').text().trim();
        if (name && text) {
          nutrition[name] = text;
        }
      });
      
      item.englishName = enName || undefined;
      item.description = description || undefined;
      item.components = components.length > 0 ? components : undefined;
      item.nutrition = Object.keys(nutrition).length > 0 ? nutrition : undefined;
    } else {
      console.log(`No seq found for ${item.name}`);
    }
  }
  
  // Update interface
  let newInterface = `export interface MenuItem {
  id: number;
  name: string;
  category: string;
  tags: string[];
  kcal: number;
  imageUrl?: string;
  englishName?: string;
  description?: string;
  components?: string[];
  nutrition?: Record<string, string>;
}`;
  
  dataContent = dataContent.replace(/export interface MenuItem \{[\s\S]+?\}/, newInterface);
  dataContent = dataContent.replace(jsonStrMatch[1], JSON.stringify(menuData, null, 2));
  
  fs.writeFileSync(dataPath, dataContent);
  console.log('Updated data.ts with detailed information');
}

run();
