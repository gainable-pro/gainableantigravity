const { google } = require('googleapis');
const path = require('path');

async function cleanSitemap() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../gsc-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });
  const siteUrl = "https://www.gainable.fr/";
  const badSitemapUrl = "https://www.gainable.fr/sitemap.xmlsitemap.xmlsitemap.xmlasssitemap.xml";

  console.log(`🧹 Suppresion du sitemap corrompu dans GSC : ${badSitemapUrl}`);
  try {
    await searchconsole.sitemaps.delete({
      siteUrl,
      feedpath: badSitemapUrl
    });
    console.log("✅ Sitemap corrompu supprimé avec succès de Google Search Console !");
  } catch (err) {
    console.error("❌ Erreur suppression :", err.message);
  }
}

cleanSitemap();
