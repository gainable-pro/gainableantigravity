import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    // Optional Vercel Cron Security check
    // const authHeader = req.headers.get("authorization");
    // if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // }

    try {
        console.log(`[Cron] Checking for articles to publish...`);

        // 1. Find all articles that are DRAFT and their publishedAt is in the past
        const articlesToPublish = await prisma.article.findMany({
            where: {
                status: 'DRAFT',
                publishedAt: {
                    lte: new Date()
                }
            },
            include: {
                expert: {
                    include: { user: true }
                }
            }
        });

        if (articlesToPublish.length === 0) {
            return NextResponse.json({ success: true, message: "No articles to publish at this time." });
        }

        console.log(`[Cron] Found ${articlesToPublish.length} articles to publish.`);

        const results = [];

        // 2. Update status and trigger automations
        for (const article of articlesToPublish) {
            // Update to PUBLISHED
            await prisma.article.update({
                where: { id: article.id },
                data: { status: 'PUBLISHED' }
            });

            // Try to trigger Make.com webhook if configured
            let makeWebhookStatus = "skipped";
            const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
            if (makeWebhookUrl) {
                try {
                    await fetch(makeWebhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            articleId: article.id,
                            title: article.title,
                            slug: article.slug,
                            expertName: article.expert.nom_entreprise,
                            expertEmail: article.expert.user.email,
                            url: `https://www.gainable.fr/entreprise/${article.expert.slug}/articles/${article.slug}`
                        })
                    });
                    makeWebhookStatus = "success";
                } catch (e) {
                    console.error("[Cron] Make.com webhook error for article", article.id, e);
                    makeWebhookStatus = "failed";
                }
            }

            results.push({
                articleId: article.id,
                title: article.title,
                published: true,
                makeWebhookStatus
            });
        }

        return NextResponse.json({ success: true, publishedCount: articlesToPublish.length, results });

    } catch (e) {
        console.error("[Cron] Publish error", e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
