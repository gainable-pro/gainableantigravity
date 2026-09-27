const { google } = require('googleapis');
const path = require('path');

async function inspectUrl(targetUrl) {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../gsc-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/webmasters'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });
  const siteUrl = "https://www.gainable.fr/";

  console.log(`🔍 Inspection GSC en direct pour : ${targetUrl}`);
  try {
    const res = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: targetUrl,
        siteUrl: siteUrl
      }
    });

    const result = res.data.inspectionResult;
    console.log("📌 Verdict global :", result.indexStatusResult.verdict);
    console.log("📌 Statut de couverture :", result.indexStatusResult.coverageState);
    console.log("📌 Robot.txt :", result.indexStatusResult.robotsTxtState);
    console.log("📌 Indexation autorisée ? :", result.indexStatusResult.indexingState);
    console.log("📌 Canonical déclaré :", result.indexStatusResult.userCanonical);
    console.log("📌 Canonical retenu par Google :", result.indexStatusResult.googleCanonical);
    console.log("📌 Sitemap trouvé :", result.indexStatusResult.sitemap);
    console.log("📌 Page de provenance (referringUrls) :", result.indexStatusResult.referringUrls);

  } catch (err) {
    console.error("❌ Erreur inspection :", err.message);
    if (err.response) console.error(err.response.data);
  }
}

const testUrl = process.argv[2] || "https://www.gainable.fr/entreprise/gainable-fr/articles/bureau-detude-thermique-fontenay-aux-roses";
inspectUrl(testUrl);
