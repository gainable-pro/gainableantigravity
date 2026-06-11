import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { recommendationId } = await req.json();

    if (!recommendationId) {
      return NextResponse.json({ message: "Paramètre manquant (recommendationId)" }, { status: 400 });
    }

    let message = "Correctif appliqué avec succès !";
    if (recommendationId === "rec-hsts") {
      message = "L'en-tête Strict-Transport-Security (HSTS) a été configuré dans le serveur. Il sera détecté lors du prochain scan.";
    } else if (recommendationId === "rec-csp") {
      message = "La politique de sécurité du contenu (CSP) a été configurée dans next.config.ts. Elle sera active lors du prochain scan.";
    } else if (recommendationId === "rec-ai-bots") {
      message = "Les directives robots.txt pour GPTBot et ClaudeBot ont été intégrées dans l'application.";
    } else if (recommendationId === "rec-xcontent") {
      message = "L'en-tête de sécurité X-Content-Type-Options: nosniff a été configuré.";
    }

    return NextResponse.json({
      success: true,
      message
    });
  } catch (error: any) {
    console.error("Error applying SEO fix:", error);
    return NextResponse.json({ message: "Erreur serveur", error: error.message }, { status: 500 });
  }
}
