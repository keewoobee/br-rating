const https = require('https');

https.get('https://www.baskinrobbins.co.kr/menu/list.php?top=A', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const fs = require('fs');
    fs.writeFileSync('br_list.html', data);
    console.log('Saved to br_list.html');
  });
});
