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

const recipients = [
    "veroniquefall26@gmail.com",
    "amarachelydia@gmail.com",
    "sabrineaden7_i8v@indeedemail.com",
    "paulinefernandes.26@gmail.com",
    "cherif.ketrandji@gmail.com",
    "francisdenita07@gmail.com",
    "litime.sawsen@yahoo.com"
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const htmlPath = path.join(process.cwd(), 'emails_marketing', 'email_candidats_commercial.html');
    if (!fs.existsSync(htmlPath)) {
        console.error(`❌ Fichier HTML non trouvé à ${htmlPath}`);
        process.exit(1);
    }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const subject = 'Confirmation de candidature — Consultant Commercial B2B Indépendant | Gainable.fr';

    console.log(`🚀 Début d'envoi aux ${recipients.length} candidats...`);

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < recipients.length; i++) {
        const email = recipients[i].trim();
        console.log(`[${i + 1}/${recipients.length}] Envoi à ${email}...`);

        try {
            const response = await resend.emails.send({
                from: 'Gainable.fr Recrutement <conseil@gainable.ch>',
                replyTo: 'contact@gainable.fr',
                to: email,
                subject: subject,
                html: htmlContent
            });

            if (response.error) {
                console.error(`❌ Échec [${email}]:`, response.error);
                failureCount++;
                results.push({ email, status: 'error', error: response.error, timestamp: new Date().toISOString() });
            } else {
                console.log(`✅ Succès [${email}] ID Resend: ${response.data.id}`);
                successCount++;
                results.push({ email, status: 'success', resendId: response.data.id, timestamp: new Date().toISOString() });
            }
        } catch (err) {
            console.error(`❌ Exception [${email}]:`, err.message || err);
            failureCount++;
            results.push({ email, status: 'error', error: err.message || String(err), timestamp: new Date().toISOString() });
        }

        await sleep(350);
    }

    console.log('\n========================================');
    console.log(`ENVOI TERMINÉ: ${successCount} Succès, ${failureCount} Échecs`);
    console.log('========================================\n');
}

main();
