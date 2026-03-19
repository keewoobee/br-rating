import https from 'https';
import fs from 'fs';

const options = {
  hostname: 'upload.wikimedia.org',
  path: '/wikipedia/commons/8/86/Baskin-Robbins_2022_logo.svg',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const base64 = Buffer.from(data).toString('base64');
    fs.writeFileSync('br_logo.txt', `data:image/svg+xml;base64,${base64}`);
    console.log('Saved base64 logo');
  });
});
