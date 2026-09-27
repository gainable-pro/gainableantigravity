const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function fullAudit() {
  console.log("🚀 Lancement de l'audit complet Google Search Console pour https://www.gainable.fr/ ...\n");

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../gsc-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/webmasters'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });
  const siteUrl = "https://www.gainable.fr/";

  // 1. Sitemaps Status
  console.log("📁 1. Analyse des Sitemaps transmis :");
  try {
    const sitemapsRes = await searchconsole.sitemaps.list({ siteUrl });
    if (sitemapsRes.data.sitemap) {
      sitemapsRes.data.sitemap.forEach(sm => {
        console.log(`  - ${sm.path} | Type: ${sm.type} | Dernier téléch.: ${sm.lastDownloaded || 'N/A'} | Warnings: ${sm.warnings || 0} | Errors: ${sm.errors || 0}`);
      });
    } else {
      console.log("  ⚠️ Aucun sitemap répertorié.");
    }
  } catch (err) {
    console.error("  Error sitemaps:", err.message);
  }

  // 2. Top 15 Pages par Clics & Impressions (30 derniers jours)
  console.log("\n📊 2. Top 15 des pages les plus vues sur Google (30 derniers jours) :");
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const pagesRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 15
    }
  });

  if (pagesRes.data.rows) {
    pagesRes.data.rows.forEach((row, idx) => {
      console.log(`  ${idx + 1}. ${row.keys[0]}`);
      console.log(`     Clics: ${row.clicks} | Impressions: ${row.impressions} | CTR: ${(row.ctr * 100).toFixed(2)}% | Pos. Moy.: ${row.position.toFixed(1)}`);
    });
  }

  // 3. Opportunités SEO : Fortes impressions mais CTR < 2% (Pages avec fort potentiel d'optimisation Title/Meta)
  console.log("\n⚡ 3. Opportunités 'Quick Wins' (Fortes impressions, position 1-20, CTR faible) :");
  const oppsRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query', 'page'],
      rowLimit: 50
    }
  });

  if (oppsRes.data.rows) {
    const quickWins = oppsRes.data.rows
      .filter(r => r.impressions >= 20 && r.ctr < 0.03 && r.position <= 20)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10);

    quickWins.forEach((w, idx) => {
      console.log(`  ${idx + 1}. Mot-clé: "${w.keys[0]}"`);
      console.log(`     URL: ${w.keys[1]}`);
      console.log(`     Impressions: ${w.impressions} | Clics: ${w.clicks} | CTR: ${(w.ctr * 100).toFixed(2)}% | Pos: ${w.position.toFixed(1)}`);
    });
  }

  console.log("\n✅ Audit préliminaire terminé.");
}

fullAudit().catch(console.error);
