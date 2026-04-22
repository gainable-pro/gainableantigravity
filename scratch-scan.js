const https = require('https');

const urlsToTest = [
    'https://www.gainable.fr/climatisation/paris-15e-arrondissement',
    'https://www.gainable.fr/climatisation/marseille-8e-arrondissement',
    'https://www.gainable.fr/climatisation/lyon-3e-arrondissement',
    'https://www.gainable.fr/climatisation/nice',
    'https://www.gainable.fr/climatisation/bordeaux',
    'https://www.gainable.fr/climatisation/toulouse'
];

async function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve({ url, status: res.statusCode });
        }).on('error', (e) => {
            resolve({ url, status: 'Error: ' + e.message });
        });
    });
}

async function run() {
    console.log("Scanning test URLs for 404s on Vercel Production...");
    
    // Test base URLs
    for (const url of urlsToTest) {
        const result = await checkUrl(url);
        console.log(`${result.status === 200 ? '✅ 200 OK' : '❌ ' + result.status} - ${result.url}`);
    }
}

run();
