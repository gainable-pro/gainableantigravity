// generate_gainable_pdf_nologo.js
// PDF presentation respecting Gainable visual identity – without embedding the logo (to avoid PNG parsing issues).
// Uses only built‑in Times Roman font; colors match the site palette.

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

(async () => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Helper to add a page with optional image
  const addPage = async (title, body, imagePath) => {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const MARGIN = 50;
    let y = height - MARGIN;
    // Title (blue‑600)
    page.drawText(title, { x: MARGIN, y, size: 22, font, color: rgb(0, 0.42, 0.78) });
    y -= 30;
    // Body text
    const lines = body.split('\n');
    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y, size: 12, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 16;
    }
    // Image (centered at bottom) if provided
    if (imagePath) {
      const imgBytes = fs.readFileSync(imagePath);
      const img = imagePath.toLowerCase().endsWith('.png')
        ? await pdfDoc.embedPng(imgBytes)
        : await pdfDoc.embedJpg(imgBytes);
      const imgDims = img.scale(0.6);
      const imgX = (width - imgDims.width) / 2;
      const imgY = MARGIN;
      page.drawImage(img, { x: imgX, y: imgY, width: imgDims.width, height: imgDims.height });
    }
  };

  // -----------------------------------------------------------------
  // Paths to assets (generated earlier – stored in the brain folder)
  // -----------------------------------------------------------------
  const assetsDir = path.resolve('C:/Users/gmaro/.gemini/antigravity-ide/brain/6dc63433-b219-4b63-9ae4-97ad0b88eac3');
  const searchPath = path.join(assetsDir, 'gainable_homepage_search_1781636621979.png');
  const formPath = path.join(assetsDir, 'gainable_contact_form_1781636635477.png');
  const dashPath = path.join(assetsDir, 'gainable_dashboard_1781636688880.png');

  // ---------------------------------------------------------------
  // Cover page – gradient background and title only (no logo)
  // ---------------------------------------------------------------
  const cover = pdfDoc.addPage();
  const { width, height } = cover.getSize();
  // Top half – blue‑600
  cover.drawRectangle({ x: 0, y: height / 2, width, height: height / 2, color: rgb(0.149, 0.388, 0.847) });
  // Bottom half – blue‑400
  cover.drawRectangle({ x: 0, y: 0, width, height: height / 2, color: rgb(0.263, 0.784, 0.804) });
  // Title centered
  const title = 'Gainable.fr – Présentation Commerciale';
  const titleSize = 28;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  cover.drawText(title, {
    x: (width - titleWidth) / 2,
    y: height / 2 - titleSize - 20,
    size: titleSize,
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
    `Le site propose un moteur de recherche avancé avec :\n- Marque\n- Type (Gainable, Mural, Console, Groupe Extérieur)\n- Fluide, SEER, SCOP\n- Fourchette de prix estimée\nLes utilisateurs combinent plusieurs filtres pour cibler le produit exact.`,
    searchPath
  );

  // ---------------------------------------------------------------
  // Section 3 – Formulaire ultra‑détaillé
  // ---------------------------------------------------------------
  await addPage(
    'Formulaire de demande ultra‑détaillé',
    `Le formulaire capture :\n- Nom / Prénom\n- Email, Téléphone\n- Type de client (particulier / professionnel)\n- Ciblage : Bureau d’études, Diag Immo, Expert CVC\n- Référence produit, description du besoin\nIl génère automatiquement un devis personnalisé et alimente le CRM.`,
    formPath
  );

  // ---------------------------------------------------------------
  // Section 4 – Espace Pro – Exemple Air G Energie
  // ---------------------------------------------------------------
  await addPage(
    'Espace Pro – Exemple Air G Energie',
    `Air G Energie utilise le tableau de bord professionnel pour :\n- Suivre le nombre de demandes entrantes\n- Accéder aux fiches techniques générées par IA\n- Exporter des rapports PDF\n- Gérer contacts et devis depuis un même espace.`,
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
