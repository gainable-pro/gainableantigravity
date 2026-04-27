const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const dashboardUrl = "https://gainable.fr/dashboard";

const getHtmlContent = (expertName) => `
    <div style="font-family: 'Montserrat', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; shadow: 0 10px 25px rgba(0,0,0,0.1);">
        <div style="background-color: #1F2D3D; padding: 40px 20px; text-align: center;">
            <img src="https://gainable.fr/logo.png" alt="Gainable.fr" style="max-height: 50px; margin-bottom: 20px;" />
            <h1 style="color: white; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">LA RÉVOLUTION GAINABLE EST EN MARCHE</h1>
        </div>
        
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px;">Bonjour ${expertName},</p>
            
            <p>Le réseau <strong>Gainable.fr</strong> explose ! 🚀</p>
            
            <p>Grâce à notre stratégie SEO, nous comptons aujourd'hui <strong>plus de 7 500 pages indexées</strong> sur Google, et <strong>23 000 nouvelles pages</strong> sont en cours d'indexation.</p>
            
            <div style="background-color: #FFFBEB; border-left: 4px solid #D59B2B; padding: 20px; margin: 30px 0; border-radius: 0 12px 12px 0;">
                <p style="margin: 0; font-weight: bold; color: #92400E; font-size: 18px;">Surfez sur la vague ! 🌊</p>
                <p style="margin: 10px 0 0 0; font-size: 15px; color: #B45309;">Publiez vos articles et photos de chantiers pour dominer les résultats de recherche dans votre ville.</p>
            </div>

            <h2 style="color: #1F2D3D; font-size: 20px; margin-top: 40px; display: flex; items-center: center; gap: 10px;">
                <img src="https://gainable.fr/favicon.jpg" style="width: 24px; height: 24px; border-radius: 4px;" />
                Votre nouvelle Application Pro
            </h2>
            <p>Nous avons lancé l'application **Gainable.fr** pour vous permettre de gérer vos leads et vos articles directement depuis votre smartphone.</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${dashboardUrl}" style="background-color: #D59B2B; color: #1F2D3D; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: 900; display: inline-block; font-size: 16px; box-shadow: 0 4px 15px rgba(213, 155, 43, 0.3);">
                    INSTALLER L'APPLICATION
                </a>
            </div>

            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 25px;">
                <p style="margin-top: 0; font-weight: bold; color: #1F2D3D;">Installation en 2 secondes :</p>
                <p style="font-size: 14px; margin-bottom: 0; color: #64748B;">Une fois sur votre tableau de bord, une <strong>bannière intelligente</strong> apparaîtra en bas de votre écran pour vous guider dans l'installation (iPhone & Android).</p>
            </div>

            <p style="font-size: 13px; color: #94A3B8; text-align: center; margin-top: 40px; font-style: italic;">
                L'application est 100% compatible avec tous les smartphones.
            </p>
        </div>
        
        <div style="background-color: #F8FAFC; padding: 30px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="font-size: 14px; color: #64748B; margin: 0;">
                À très vite sur votre espace expert,<br>
                <strong>L'équipe Gainable.fr</strong>
            </p>
            <div style="margin-top: 20px;">
                <a href="https://gainable.fr" style="color: #D59B2B; text-decoration: none; font-weight: bold; font-size: 13px;">www.gainable.fr</a>
            </div>
        </div>
    </div>
`;

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
