
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma"; // Adjust import path if needed
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'welcome' or 'label'
    const email = searchParams.get('email'); // 'contact@airgenergie.fr'

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    console.log('[DEBUG_EMAIL] Route called for:', email, 'Type:', type);
    console.log('[DEBUG_EMAIL] Env keys:', Object.keys(process.env));
    console.log('[DEBUG_EMAIL] RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);

    let resend;
    try {
        resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Fallback to match other routes
    } catch (err) {
        console.error('[DEBUG_EMAIL] Resend init error:', err);
        return NextResponse.json({ error: "Resend init failed" }, { status: 500 });
    }

    try {
        if (type === 'welcome') {
            // Logic from register route
            await resend.emails.send({
                from: "Gainable.fr <conseil@gainable.ch>",
                to: email,
                subject: "Bienvenue sur Gainable.fr – démarche de labellisation",
                html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
             <img src="https://www.gainable.fr/logo.png" alt="Gainable.fr" style="max-height: 50px;" />
        </div>
        
        <h2 style="color: #1F2D3D;">Bonjour,</h2>
        
        <p>Nous vous souhaitons la bienvenue au sein du réseau <strong style="color: #D32F2F; background-color: #0F172A; color: white; padding: 2px 6px; border-radius: 4px;">Gainable.fr</strong>.</p>
        <p>Votre inscription a bien été enregistrée.</p>

        <h3 style="color: #D59B2B; margin-top: 30px;">Votre espace professionnel</h3>
        <div style="border-top: 1px solid #eee; margin: 10px 0;"></div>

        <div style="background-color: #FFF8E1; padding: 15px; border-left: 4px solid #D59B2B; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Le Label Gainable.fr s'inscrit dans une démarche volontaire de qualité et d'alignement professionnel.</p>
            <p style="margin-top: 10px;">Un membre de notre équipe prendra contact avec vous afin d’échanger et de valider que nous partageons la même vision du métier, les mêmes standards d'installation et la même exigence de satisfaction client.</p>
            <p style="margin-top: 10px; font-weight: bold;">Ce label est attribué aux professionnels qui incarnent pleinement les valeurs du réseau.</p>
        </div>

        <p style="margin-top: 40px;">Nous sommes ravis de vous compter parmi les entreprises référencées sur Gainable.fr et nous réjouissons de cette future collaboration.</p>
        
        <div style="margin-top: 40px; text-align: center;">
            <a href="https://www.gainable.fr" style="background-color: #1F2D3D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Accéder à mon espace pro</a>
        </div>

        <p style="margin-top: 40px; font-size: 14px; color: #666;">
            Cordialement,<br>
            <strong>L'équipe Gainable.fr</strong>
        </p>

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
            <p style="margin: 0; margin-bottom: 5px;">Ceci est un email automatique, merci de ne pas y répondre directement.<br>
            Pour toute demande, veuillez utiliser le formulaire de contact ou nous écrire à <a href="mailto:contact@gainable.fr" style="color: #999; text-decoration: underline;">contact@gainable.fr</a></p>
        </div>
    </div>
                `
            });
            return NextResponse.json({ success: true, message: `Welcome email sent to ${email}` });

        } else if (type === 'label') {
            // Logic from manual script/label route
            const expert = await prisma.expert.findFirst({
                where: { user: { email: email } },
                include: { user: true }
            });

            if (!expert) return NextResponse.json({ error: "Expert not found for email" }, { status: 404 });

            const slug = expert.slug;
            const profileUrl = `https://www.gainable.fr/pro/${slug}`;
            const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
            const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;

            // Load attachment
            const imagePath = path.join(process.cwd(), 'public', 'assets', 'label-gainable-verified.png');
            let attachments: { filename: string; content: Buffer }[] = [];
            if (fs.existsSync(imagePath)) {
                const imageBuffer = fs.readFileSync(imagePath);
                attachments = [{ filename: 'label-gainable-verified.png', content: imageBuffer }];
            }

            await resend.emails.send({
                from: 'Gainable.fr <conseil@gainable.ch>',
                to: email,
                subject: 'Félicitations ! Votre entreprise a reçu le label "Compte Certifié" Gainable.fr',
                html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://www.gainable.fr/logo.png" alt="Gainable.fr" style="max-height: 50px;" />
        </div>
        <p>Bonjour,</p>
        <p>Nous vous remercions pour votre confiance et sommes ravis de vous accueillir parmi les professionnels référencés sur <strong>Gainable.fr</strong>.</p>
        <p>Suite à nos échanges et à l’analyse de votre dossier, nous avons le plaisir de vous confirmer l’attribution du label <strong>Gainable.fr – Compte certifié</strong> à votre entreprise.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #1e293b;">Votre label de confiance</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Ce label valorise votre fiabilité et votre engagement auprès de vos clients. Il atteste de la cohérence de vos informations professionnelles et de votre sérieux.</p>
        </div>

        <p>Vous trouverez en pièce jointe le visuel « <strong>Expert vérifié Gainable.fr</strong> ».</p>
        <p>Nous vous invitons à l’intégrer à votre signature e-mail, à votre site internet ou à tout autre support de communication pertinent.</p>

        <p>Afin d’optimiser son impact, nous vous recommandons d’y associer un lien de redirection vers votre fiche Gainable.fr, permettant à vos clients de consulter et vérifier votre référencement.</p>

        <p>Gainable.fr a pour vocation de mettre en relation des particuliers avec des professionnels qualifiés, tout en renforçant la visibilité et la crédibilité des entreprises partenaires.</p>

        <p>Nous vous souhaitons la bienvenue sur la plateforme et restons à votre disposition pour toute question.</p>
        
        <p style="font-size: 14px; color: #64748b;">
            Cordialement,<br>
            <strong>L'équipe Gainable.fr</strong><br>
            <a href="https://www.gainable.fr" style="color: #F59E0B; text-decoration: none;">www.gainable.fr</a>
        </p>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #94a3b8; text-align: center;">
            <p style="margin: 0; margin-bottom: 5px;">Ceci est un email automatique, merci de ne pas y répondre directement.<br>
            Pour toute demande, veuillez utiliser le formulaire de contact ou nous écrire à <a href="mailto:contact@gainable.fr" style="color: #94a3b8; text-decoration: underline;">contact@gainable.fr</a></p>
        </div>
    </div>
                `,
                attachments: attachments
            });
            return NextResponse.json({ success: true, message: `Label email sent to ${email}` });

        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }
    } catch (e: any) {
        console.error('[DEBUG_EMAIL] Execution error:', e);
        return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
    }
}
