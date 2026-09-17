import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), "data", "video_clicks.json");
        let clicks: any[] = [];
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, "utf-8");
            try {
                clicks = JSON.parse(raw);
            } catch (e) {
                clicks = [];
            }
        }

        const todayFr = new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
        const clicksToday = clicks.filter(c => c.dateFr === todayFr);

        const sourceStats: Record<string, number> = {};
        clicks.forEach(c => {
            sourceStats[c.source || 'inconnu'] = (sourceStats[c.source || 'inconnu'] || 0) + 1;
        });

        return NextResponse.json({
            success: true,
            totalClicks: clicks.length,
            totalClicksToday: clicksToday.length,
            todayDate: todayFr,
            sourcesBreakdown: sourceStats,
            recentClicks: clicks.slice(-50).reverse()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Erreur lors de la lecture des statistiques" }, { status: 500 });
    }
}
