import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const to = searchParams.get("to") || "airgenergie@gmail.com";

    const apiKey = process.env.RESEND_API_KEY;
    const fromEnv = process.env.RESEND_FROM_EMAIL;

    if (!apiKey) {
        return NextResponse.json({
            status: "error",
            message: "RESEND_API_KEY non configurée dans process.env",
            envPresent: false
        });
    }

    const resend = new Resend(apiKey);
    const results: any = {};

    // 1. Try process.env.RESEND_FROM_EMAIL or contact@gainable.fr
    try {
        const res1 = await resend.emails.send({
            from: fromEnv || "Gainable.fr <contact@gainable.fr>",
            to,
            subject: "Test Resend Gainable.fr (Domain)",
            html: "<p>Ceci est un email de test depuis Gainable.fr</p>"
        });
        results.attemptDomain = res1;
    } catch (e: any) {
        results.attemptDomain = { exception: e.message };
    }

    // 2. Try onboarding@resend.dev (Resend Sandbox)
    try {
        const res2 = await resend.emails.send({
            from: "Gainable.fr <onboarding@resend.dev>",
            to,
            subject: "Test Resend Gainable.fr (Sandbox)",
            html: "<p>Ceci est un email de test depuis Gainable.fr (Sandbox)</p>"
        });
        results.attemptSandbox = res2;
    } catch (e: any) {
        results.attemptSandbox = { exception: e.message };
    }

    return NextResponse.json({
        apiKeyConfigured: true,
        keyPrefix: apiKey.slice(0, 5) + "...",
        fromEnv: fromEnv || "non définie",
        results
    });
}
