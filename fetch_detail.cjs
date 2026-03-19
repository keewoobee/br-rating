const https = require('https');
const fs = require('fs');

https.get('https://www.baskinrobbins.co.kr/menu/view.php?seq=17', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('br_detail_17.html', data);
    console.log('Saved to br_detail_17.html');
  });
});
