const https = require('https');

https.get('https://www.baskinrobbins.co.kr/menu/view.php?seq=17', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src="([^">]+)"/g);
    if (matches) {
      console.log(matches.filter(m => m.includes('menu') || m.includes('upload')));
    }
  });
});
