import https from 'https';
import fs from 'fs';

https.get('https://www.baskinrobbins.co.kr/story/history.php?release_year=2024', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('2024.html', data);
    console.log('Saved 2024.html');
  });
});
