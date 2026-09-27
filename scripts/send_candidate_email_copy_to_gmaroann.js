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
    console.error('❌ RESEND_API_KEY manquant.');
    process.exit(1);
}

const resend = new Resend(apiKey);
const recipient = "gmaroann@gmail.com";

async function main() {
    const htmlPath = path.join(process.cwd(), 'emails_marketing', 'email_candidats_commercial.html');
    if (!fs.existsSync(htmlPath)) {
        console.error(`❌ Fichier HTML non trouvé à ${htmlPath}`);
        process.exit(1);
    }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const subject = '[COPIE] Confirmation de candidature — Consultant Commercial B2B Indépendant | Gainable.fr';

    console.log(`🚀 Envoi de la copie du mail de candidature à ${recipient}...`);

    try {
        const response = await resend.emails.send({
            from: 'Gainable.fr Recrutement <conseil@gainable.ch>',
            replyTo: 'contact@gainable.fr',
            to: recipient,
            subject: subject,
            html: htmlContent
        });

        if (response.error) {
            console.error(`❌ Échec de l'envoi à ${recipient}:`, response.error);
        } else {
            console.log(`✅ Copie envoyée à ${recipient} avec succès ! ID Resend: ${response.data.id}`);
        }
    } catch (err) {
        console.error(`❌ Exception lors de l'envoi à ${recipient}:`, err.message || err);
    }
}

main();
