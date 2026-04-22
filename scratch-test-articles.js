const https = require('https');

const url = 'https://www.gainable.fr/articles';

const start = Date.now();
https.get(url, (res) => {
    console.log(`Status: ${res.statusCode} in ${Date.now() - start}ms`);
}).on('error', (e) => {
    console.log(`Error: ${e.message}`);
});
