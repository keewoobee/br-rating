import https from 'https';
import fs from 'fs';

async function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const allFlavors = [];
  let idCounter = 100; // Start from 100 to avoid conflicts with existing IDs
  for (let year = 2018; year <= 2026; year++) {
    const html = await fetchHtml(`https://www.baskinrobbins.co.kr/story/history.php?release_year=${year}`);
    
    const regex = /<img src="(\/upload\/product\/monthBastHistory\/[^"]+)" alt="([^"]+)" class="story-history-list__image">/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      allFlavors.push({
        id: idCounter++,
        name: match[2].trim(),
        category: "이달의 맛",
        tags: ["이달의맛", `${year}`],
        kcal: 250, // Placeholder
        imageUrl: `https://www.baskinrobbins.co.kr${match[1]}`,
        description: `${year}년 이달의 맛`,
        components: [],
        nutrition: {
          "1회 제공량(g)": "115",
          "열량(kcal)": "250",
          "당류(g)": "20",
          "단백질(g)": "4",
          "포화지방(g)": "8",
          "나트륨(mg)": "100",
          "알레르기 성분": "우유"
        }
      });
    }
  }
  fs.writeFileSync('flavors.json', JSON.stringify(allFlavors, null, 2));
  console.log(`Found ${allFlavors.length} flavors`);
}
run();
