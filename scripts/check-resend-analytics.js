const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

const envFiles = ['.env.development.local', '.env.local', '.env.development', '.env'];
envFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        dotenv.config({ path: filePath });
    }
});

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
    console.error('No RESEND_API_KEY');
    process.exit(1);
}

const resend = new Resend(apiKey);

async function main() {
    try {
        console.log('Fetching sent emails list from Resend...');
        // Try listing emails or checking individual status
        const list = await resend.emails.get('01a0af9e-5763-74c2-86ec-dbe56eaa91e2');
        console.log('Sample email status:', list);
    } catch (e) {
        console.error('Resend check error:', e);
    }
}

main();
