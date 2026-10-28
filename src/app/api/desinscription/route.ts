import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function recordUnsubscribe(email: string) {
    try {
        const dataDir = path.join(process.cwd(), "data");
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        const filePath = path.join(dataDir, "unsubscribed_emails.json");
        let list: string[] = [];
        if (fs.existsSync(filePath)) {
            try {
                list = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            } catch (e) {
                list = [];
            }
        }
        const clean = email.trim().toLowerCase();
        if (!list.includes(clean)) {
            list.push(clean);
            fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
        }
    } catch (err) {
        console.warn("[UNSUBSCRIBE_SAVE_ERROR]", err);
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || searchParams.get("utm_content") || "";

    if (email) {
        recordUnsubscribe(email);
    }

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Désinscription confirmée - Gainable.fr</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; color: #1E293B; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: white; max-width: 500px; width: 100%; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); text-align: center; }
        .icon { width: 56px; height: 56px; border-radius: 50%; background: #DEF7EC; color: #046C4E; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px; }
        h1 { font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #0F172A; }
        p { font-size: 15px; color: #64748B; line-height: 1.6; margin-bottom: 24px; }
        .btn { display: inline-block; background: #D59B2B; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">✓</div>
        <h1>Désinscription prise en compte</h1>
        <p>L'adresse <strong>${email ? email.replace(/[<>]/g, '') : "associée"}</strong> a bien été retirée de nos listes de diffusion. Vous ne recevrez plus d'invitations ni d'emails de notre part.</p>
        <p style="font-size: 13px; color: #94A3B8;">Nous vous souhaitons une excellente réussite dans vos chantiers.</p>
        <a href="https://www.gainable.fr" class="btn">Retour au site Gainable.fr</a>
    </div>
</body>
</html>`;

    return new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
}

export async function POST(request: NextRequest) {
    // Support RFC 8058 One-Click POST
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "";
    if (email) {
        recordUnsubscribe(email);
    }
    return NextResponse.json({ ok: true, message: "Unsubscribed" });
}
