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
    console.error('❌ RESEND_API_KEY manquant dans les variables d\'environnement.');
    process.exit(1);
}

const resend = new Resend(apiKey);

// Parse arguments: email, firstName, lastName
const email = process.argv[2] ? process.argv[2].trim() : null;
const firstName = process.argv[3] ? process.argv[3].trim() : '';
const lastName = process.argv[4] ? process.argv[4].trim() : '';

if (!email || !email.includes('@')) {
    console.error('❌ Usage: node scripts/send_candidate_confirmation.js <email> [prenom] [nom]');
    process.exit(1);
}

async function main() {
    const htmlPath = path.join(process.cwd(), 'emails_marketing', 'email_candidats_commercial.html');
    if (!fs.existsSync(htmlPath)) {
        console.error(`❌ Fichier HTML non trouvé à ${htmlPath}`);
        process.exit(1);
    }

    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Personnalisation du prénom si fourni
    if (firstName) {
        // Remplace "Bonjour et merci" par "Bonjour [Prénom] et merci"
        htmlContent = htmlContent.replace(
            'Bonjour et merci pour votre candidature ! 👋',
            `Bonjour ${firstName} et merci pour votre candidature ! 👋`
        );
    }

    const subject = 'Confirmation de candidature — Consultant Commercial B2B Indépendant | Gainable.fr';
    const copyEmail = 'contact@gainable.fr';

    const textContent = `Bonjour ${firstName || ''},

Merci pour votre candidature au poste de Consultant Commercial B2B Indépendant chez Gainable.fr.

Nous avons bien reçu votre profil et votre dossier est actuellement en cours d'examen par notre direction commerciale.

Résumé des conditions du poste :
- Commission Directe (10 % à 17 % HT) selon votre profil et expérience, avec réévaluation systématique au bout de 1 mois d'activité.
- 100 % Télétravail, gestion autonome de votre planning.
- Outils fournis : Fichiers qualifiés nationaux (37 000 professionnels CVC), CRM intégré, scripts d'appels et simulateur.
- Commissions versées immédiatement dès encaissement des souscriptions.

Pour découvrir notre plateforme et nos outils de prospection :
https://www.gainable.fr/carrieres/commercial-independant

Ligne directe recrutement : 06 63 94 57 42
Email : contact@gainable.fr

Bien cordialement,
L'équipe Recrutement Gainable.fr
https://www.gainable.fr
`;

    console.log(`🚀 Envoi de la confirmation à : ${email} (${firstName} ${lastName})`);
    console.log(`📬 Copie conforme cachée (BCC) à : ${copyEmail}`);

    try {
        const response = await resend.emails.send({
            from: 'Gainable.fr Recrutement <conseil@gainable.ch>',
            replyTo: 'contact@gainable.fr',
            to: email,
            bcc: [copyEmail],
            subject: subject,
            html: htmlContent,
            text: textContent
        });

        if (response.error) {
            console.error(`❌ Échec de l'envoi à ${email}:`, response.error);
            process.exit(1);
        }

        console.log(`✅ Email envoyé avec succès ! ID Resend: ${response.data.id}`);

        // Mise à jour du log d'envois
        const logFile = path.join(process.cwd(), 'emails_marketing', 'candidats_batch_send_log.json');
        try {
            let existingLog = [];
            if (fs.existsSync(logFile)) {
                existingLog = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
            }
            existingLog.push({
                email: email,
                firstName: firstName || null,
                lastName: lastName || null,
                copyTo: copyEmail,
                status: 'success',
                resendId: response.data.id,
                timestamp: new Date().toISOString()
            });
            fs.writeFileSync(logFile, JSON.stringify(existingLog, null, 2), 'utf-8');
            console.log(`📝 Log enregistré dans ${logFile}`);
        } catch (e) {
            console.warn('⚠️ Impossible de mettre à jour le fichier log:', e.message);
        }

    } catch (err) {
        console.error(`❌ Exception lors de l'envoi:`, err.message || err);
        process.exit(1);
    }
}

main();

