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
if (!apiKey) {
    console.error('CRITICAL: RESEND_API_KEY missing.');
    process.exit(1);
}

const resend = new Resend(apiKey);

async function sendCandidateEmail(candidateEmail) {
    if (!candidateEmail) {
        console.error('Usage: node scripts/send-candidat-with-cc.js <candidate_email>');
        process.exit(1);
    }

    const htmlPath = path.join(process.cwd(), 'emails_marketing', 'email_candidats_commercial.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const subject = 'Confirmation de candidature — Consultant Commercial B2B Indépendant | Gainable.fr';

    console.log(`Sending candidate email to: ${candidateEmail} with CC to gmaroann@gmail.com...`);

    try {
        const response = await resend.emails.send({
            from: 'Gainable.fr Recrutement <conseil@gainable.ch>',
            replyTo: 'contact@gainable.fr',
            to: candidateEmail.trim(),
            cc: 'gmaroann@gmail.com',
            subject: subject,
            html: htmlContent
        });

        console.log('✅ CANDIDATE EMAIL SENT WITH CC!');
        console.log('Response:', response);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}

const targetEmail = process.argv[2];
sendCandidateEmail(targetEmail);
