const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

// Load environment variables
const envFiles = ['.env.development.local', '.env.local', '.env.development', '.env'];
envFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        dotenv.config({ path: filePath });
    }
});

const apiKey = process.env.RESEND_API_KEY;
console.log('RESEND_API_KEY present:', !!apiKey);

if (!apiKey) {
    console.error('CRITICAL: RESEND_API_KEY missing in environment variables.');
    process.exit(1);
}

const resend = new Resend(apiKey);

async function main() {
    const testRecipient = 'gmaroann@gmail.com';
    const htmlPath = path.join(process.cwd(), 'emails_marketing', 'email_candidats_commercial.html');

    if (!fs.existsSync(htmlPath)) {
        console.error(`HTML file not found at ${htmlPath}`);
        process.exit(1);
    }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const subject = 'Confirmation de candidature — Consultant Commercial B2B Indépendant | Gainable.fr';

    console.log(`Sending test email to ${testRecipient}...`);

    try {
        const response = await resend.emails.send({
            from: 'Gainable.fr Recrutement <conseil@gainable.ch>',
            replyTo: 'contact@gainable.fr',
            to: testRecipient,
            subject: subject,
            html: htmlContent
        });

        console.log('✅ TEST EMAIL SENT SUCCESSFULLY!');
        console.log('Response:', response);
    } catch (error) {
        console.error('❌ Error sending email via Resend:', error);
    }
}

main();
