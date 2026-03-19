import https from 'https';

https.get('https://1000logos.net/wp-content/uploads/2017/08/Baskin-Robbins-logo.png', (res) => {
  console.log('Status Code:', res.statusCode);
});
