const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const dashboardUrl = "https://gainable.fr/dashboard";

const getHtmlContent = (expertName) => {
    const templatePath = path.join(__dirname, '../src/emails/pwa-marketing.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    return html.replace('{{name}}', expertName);
};

async function main() {
    console.log('🚀 Launching PWA Marketing Campaign...');

    const experts = await prisma.expert.findMany({
        include: { user: true }
    });

    console.log(`📊 Found ${experts.length} experts.`);

    for (const expert of experts) {
        const email = expert.user.email;
        const name = expert.representant_prenom || 'expert';
        
        console.log(`✉️ Sending to: ${email}...`);
        
        try {
            await resend.emails.send({
                from: 'Gainable.fr <contact@gainable.fr>',
                to: email,
                subject: '🚀 Gainable.fr explose : Votre nouvelle application est disponible !',
                html: getHtmlContent(name)
            });
            console.log(`✅ Success for ${email}`);
        } catch (error) {
            console.error(`❌ Failed for ${email}:`, error);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
    }

    console.log('\n🏁 Campaign finished.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
