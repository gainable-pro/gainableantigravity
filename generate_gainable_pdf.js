// generate_gainable_pdf.js
// Simple script that respects the Gainable visual identity (colors, logo, screenshots)
// Uses only built‑in fonts from pdf‑lib (Times Roman) to avoid external font files.

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

(async () => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // ---------------------------------------------------------------
  // Helper to add a page with optional image
  // ---------------------------------------------------------------
  const addPage = async (title, body, imagePath) => {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const MARGIN = 50;
    let y = height - MARGIN;

    // Title
    page.drawText(title, { x: MARGIN, y, size: 22, font, color: rgb(0, 0.42, 0.78) }); // blue‑600
    y -= 30;

    // Body (split by \n)
    const lines = body.split('\n');
    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y, size: 12, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 16;
    }

    // Image (centered at bottom)
    if (imagePath) {
      const imgBytes = fs.readFileSync(imagePath);
      const img = imagePath.toLowerCase().endsWith('.png') ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
      const imgDims = img.scale(0.6);
      const imgX = (width - imgDims.width) / 2;
      const imgY = MARGIN;
      page.drawImage(img, { x: imgX, y: imgY, width: imgDims.width, height: imgDims.height });
    }
  };

  // ---------------------------------------------------------------
  // Paths to assets (generated earlier)
  // ---------------------------------------------------------------
  const assets = path.resolve(__dirname, '..', '..', '..', 'brain', '6dc63433-b219-4b63-9ae4-97ad0b88eac3');
  const logoPath = path.join(assets, 'gainable_logo_1781636652620.png');
  const searchPath = path.join(assets, 'gainable_homepage_search_1781636621979.png');
  const formPath = path.join(assets, 'gainable_contact_form_1781636635477.png');
  const dashPath = path.join(assets, 'gainable_dashboard_1781636688880.png');

  // ---------------------------------------------------------------
  // Cover page – logo + title
  // ---------------------------------------------------------------
  const cover = pdfDoc.addPage();
  const { width, height } = cover.getSize();
  const logoBytes = fs.readFileSync(logoPath);
  const logoImg = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImg.scale(0.4);
  cover.drawImage(logoImg, { x: (width - logoDims.width) / 2, y: height - logoDims.height - 80, width: logoDims.width, height: logoDims.height });
  cover.drawText('Gainable.fr – Présentation Commerciale', {
    x: 60,
    y: height - logoDims.height - 130,
    size: 28,
    font,
    color: rgb(0.84, 0.61, 0.17) // #D59B2B (gold)
  });

  // ---------------------------------------------------------------
  // Section 1 – SEO & volume
  // ---------------------------------------------------------------
  await addPage(
    'Problématiques SEO & Volume',
    `• Référencement GEO très concurrentiel\n• 58 000 articles publiés depuis le lancement\n• Phase de test d’une année pour valider la viabilité du modèle\n• Risques liés à une plateforme de rente à grande échelle`,
    null
  );

  // ---------------------------------------------------------------
  // Section 2 – Moteur de recherche multi‑filtre
  // ---------------------------------------------------------------
  await addPage(
    'Moteur de recherche multi‑filtre',
    `Le site propose un moteur de recherche avancé avec :\n- Marque\n- Type (Gainable, Mural, Console, Groupe Extérieur)\n- Fluide, SEER, SCOP\n- Fourchette prix estimée\nLes utilisateurs combinent les filtres pour obtenir le produit précis.`,
    searchPath
  );

  // ---------------------------------------------------------------
  // Section 3 – Formulaire de demande ultra‑détaillé
  // ---------------------------------------------------------------
  await addPage(
    'Formulaire de demande',
    `Le formulaire collecte :\n- Nom / Prénom\n- Email, Téléphone\n- Type de projet (particulier / professionnel)\n- Ciblage : Bureau d’études, Diag Immo, Expert CVC\n- Description du besoin, Référence produit\nIl génère automatiquement un devis personnalisé.`,
    formPath
  );

  // ---------------------------------------------------------------
  // Section 4 – Espace Pro – Exemple Air G Energie
  // ---------------------------------------------------------------
  await addPage(
    'Espace Pro – Air G Energie',
    `Air G Energie utilise le tableau de bord pour :\n- Suivre le nombre de demandes\n- Accéder aux fiches techniques générées par IA\n- Exporter des rapports PDF\n- Gérer contacts et devis.`,
    dashPath
  );

  // ---------------------------------------------------------------
  // Save PDF
  // ---------------------------------------------------------------
  const pdfBytes = await pdfDoc.save();
  const outPath = path.join(__dirname, 'gainable_presentation.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log('PDF generated at', outPath);
})();
