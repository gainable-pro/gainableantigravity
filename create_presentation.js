// create_presentation.js
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

(async () => {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Helper to add a page with text and optional image
  const addPage = async (title, body, imagePath) => {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;
    // Title
    const titleSize = 24;
    page.drawText(title, { x: margin, y, size: titleSize, font: timesRoman, color: rgb(0, 0, 0) });
    y -= titleSize + 10;
    // Body text
    const fontSize = 12;
    const lines = body.split('\n');
    for (const line of lines) {
      page.drawText(line, { x: margin, y, size: fontSize, font: timesRoman, color: rgb(0.2, 0.2, 0.2) });
      y -= fontSize + 4;
    }
    // Image if provided
    if (imagePath) {
      const imgBytes = fs.readFileSync(imagePath);
      let img; let imgDims;
      if (imagePath.toLowerCase().endsWith('.png')) {
        img = await pdfDoc.embedPng(imgBytes);
      } else {
        img = await pdfDoc.embedJpg(imgBytes);
      }
      imgDims = img.scale(0.5);
      const imgY = margin;
      const imgX = (width - imgDims.width) / 2;
      page.drawImage(img, { x: imgX, y: imgY, width: imgDims.width, height: imgDims.height });
    }
  };

  // Paths to images (generated assets)
  const assetsDir = path.resolve(__dirname, '..', '..', '..', 'brain', '6dc63433-b219-4b63-9ae4-97ad0b88eac3');
  const logoPath = path.join(assetsDir, 'gainable_logo_1781636652620.png');
  const searchPath = path.join(assetsDir, 'gainable_homepage_search_1781636621979.png');
  const formPath = path.join(assetsDir, 'gainable_contact_form_1781636635477.png');
  const dashboardPath = path.join(assetsDir, 'gainable_dashboard_1781636688880.png');

  // Title page
  const titlePage = pdfDoc.addPage();
  const { width, height } = titlePage.getSize();
  const logoImgBytes = fs.readFileSync(logoPath);
  const logoImg = await pdfDoc.embedPng(logoImgBytes);
  const logoDims = logoImg.scale(0.4);
  titlePage.drawImage(logoImg, {
    x: (width - logoDims.width) / 2,
    y: height - logoDims.height - 100,
    width: logoDims.width,
    height: logoDims.height,
  });
  const title = 'Gainable.fr – Présentation Commerciale';
  titlePage.drawText(title, {
    x: 50,
    y: height - logoDims.height - 150,
    size: 28,
    font: timesRoman,
    color: rgb(0, 0.4, 0.8),
  });

  // Section 1 – Problématiques SEO & Volume
  await addPage(
    'Problématiques SEO & Volume',
    `• Référencement GEO très concurrentiel\n• 58 000 articles en ligne depuis le lancement\n• Phase de test d’un an pour valider la viabilité du modèle\n• Risques de plateforme de rente et de monétisation à grande échelle`,
    null
  );

  // Section 2 – Moteur de recherche multi‑filtre
  await addPage(
    'Moteur de recherche multi‑filtre',
    `Le site propose un moteur de recherche avancé avec filtres :\n- Marque\n- Type (Gainable, Mural, Console, Groupe Extérieur)\n- Fluide, SEER, SCOP\n- Gamme de prix estimée\n\nLes utilisateurs peuvent combiner plusieurs critères pour affiner le catalogue.`,
    searchPath
  );

  // Section 3 – Demandes multiples (particulier & professionnel)
  await addPage(
    'Demandes multiples',
    `Les visiteurs peuvent soumettre des demandes via le formulaire ultra‑détaillé.\n- Type de client : particulier ou professionnel\n- Ciblage possible : Bureau d’études, Diag Immo, Expert CVC\n- Le formulaire capture toutes les informations nécessaires pour un devis personnalisé.`,
    formPath
  );

  // Section 4 – Espace Pro – Exemple Air G Energie
  await addPage(
    'Espace Pro – Exemple Air G Energie',
    `Air G Energie utilise le tableau de bord professionnel pour :\n- Suivre le nombre de demandes entrantes\n- Accéder aux fiches techniques générées par IA\n- Exporter des rapports PDF pour chaque projet\n- Gérer les contacts et les devis dans un même espace.`,
    dashboardPath
  );

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  const outPath = path.join(__dirname, 'gainable_presentation.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log('PDF generated at', outPath);
})();
