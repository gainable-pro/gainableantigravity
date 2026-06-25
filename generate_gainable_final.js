// generate_gainable_final.js
// PDF presentation for Gainable.fr with real‑style screenshots and respecting the visual identity.
// Uses Helvetica (standard font) and embeds the generated mockup images.

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// Utility to sanitise text for WinAnsi encoding (remove exotic characters)
const sanitize = (str) =>
  str
    .replace(/[\u202F\u00A0]/g, ' ') // nbsp → space
    .replace(/[\u2011\u2013\u2014]/g, '-') // various dashes
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'") // quotes
    .replace(/[^\x00-\xFF]/g, '') // drop remaining non‑ASCII
;

(async () => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Helper to embed images based on extension
  const embedImageFromPath = async (imgPath) => {
    try {
      const imgBytes = fs.readFileSync(imgPath);
      const ext = path.extname(imgPath).toLowerCase();
      if (ext === '.png') return await pdfDoc.embedPng(imgBytes);
      if (ext === '.jpg' || ext === '.jpeg') return await pdfDoc.embedJpg(imgBytes);
      console.warn(`Unsupported image format: ${ext}`);
      return null;
    } catch (err) {
      console.error(`Failed to embed image at ${imgPath}:`, err);
      return null;
    }
  };

  // -----------------------------------------------------------------
  // Paths to the assets (images generated previously in the brain folder)
  // -----------------------------------------------------------------
  const assetsDir = path.resolve('C:/Users/gmaro/.gemini/antigravity-ide/brain/6dc63433-b219-4b63-9ae4-97ad0b88eac3');
  const logoPath = path.join(assetsDir, 'gainable_logo_1781636652620.png'); // original logo (kept)
  const homeImg = path.join(assetsDir, 'gainable_homepage_real_1781637456552.png');
  const formImg = path.join(assetsDir, 'gainable_contact_form_real_1781637471023.png');
  // Dashboard example – reuse previous mockup (still acceptable)


  // -----------------------------------------------------------------
  // Helper to add a page with title, body and optional image
  // -----------------------------------------------------------------
  const addPage = async (title, body, imgPath) => {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const MARGIN = 50;
    let y = height - MARGIN;
    // Title in blue‑600
    page.drawText(sanitize(title), { x: MARGIN, y, size: 22, font, color: rgb(0, 0.42, 0.78) });
    y -= 30;
    // Body text (sanitize to avoid encoding errors)
    const lines = sanitize(body).split('\n');
    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y, size: 12, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 16;
    }
    // Image (if any) – centre it at the bottom of the page
    if (imgPath) {
      const img = await embedImageFromPath(imgPath);
      if (img) {
        const imgDims = img.scale(0.5);
        const imgX = (width - imgDims.width) / 2;
        const imgY = MARGIN; // leave margin at bottom
        page.drawImage(img, { x: imgX, y: imgY, width: imgDims.width, height: imgDims.height });
      }
    }
  };

  // -----------------------------------------------------------------
  // Cover page – gradient background with logo and title
  // -----------------------------------------------------------------
  const cover = pdfDoc.addPage();
  const { width, height } = cover.getSize();
  // Top half – blue‑600
  cover.drawRectangle({ x: 0, y: height / 2, width, height: height / 2, color: rgb(0.149, 0.388, 0.847) });
  // Bottom half – blue‑400
  cover.drawRectangle({ x: 0, y: 0, width, height: height / 2, color: rgb(0.263, 0.784, 0.804) });
  // Logo (centered) – optional
  let logoImg = null;
  try {
    logoImg = await embedImageFromPath(logoPath);
  } catch (e) {
    console.warn('Logo image not found or failed to embed:', e);
  }
  if (logoImg) {
    const logoDims = logoImg.scale(0.4);
    cover.drawImage(logoImg, { x: (width - logoDims.width) / 2, y: height - logoDims.height - 80, width: logoDims.width, height: logoDims.height });
  }
  // Title text (gold accent)
  const title = 'Gainable.fr – Présentation Commerciale';
  const titleSize = 28;
  const titleWidth = font.widthOfTextAtSize(sanitize(title), titleSize);
  cover.drawText(sanitize(title), {
    x: (width - titleWidth) / 2,
    y: height / 2 - titleSize - 20,
    size: titleSize,
    font,
    color: rgb(0.84, 0.61, 0.17) // gold
  });

  // -----------------------------------------------------------------
  // Section 1 – Problématiques SEO & Volume (no image)
  // -----------------------------------------------------------------
  await addPage(
    'Problématiques SEO & Volume',
    `• Référencement GEO très concurrentiel\n• 58 000 articles publiés depuis le lancement\n• Phase de test d’une année pour valider la viabilité du modèle\n• Risques liés à une plateforme de rente à grande échelle`,
    null
  );

  // -----------------------------------------------------------------
  // Section 2 – Moteur de recherche multi‑filtre (homepage screenshot)
  // -----------------------------------------------------------------
  await addPage(
    'Moteur de recherche multi‑filtre',
    `Le site propose un moteur de recherche avancé avec :\n- Marque\n- Type (Gainable, Mural, Console, Groupe Extérieur)\n- Fluide, SEER, SCOP\n- Fourchette de prix estimée\nLes filtres peuvent être combinés pour affiner le catalogue et accéder directement aux fiches produit.`,
    homeImg
  );

  // -----------------------------------------------------------------
  // Section 3 – Formulaire de demande ultra‑détaillé (contact form screenshot)
  // -----------------------------------------------------------------
  await addPage(
    'Formulaire de demande ultra‑détaillé',
    `Le formulaire capture :\n- Nom / Prénom\n- Email, Téléphone\n- Type de client (particulier / professionnel)\n- Ciblage : Bureau d’études, Diag Immo, Expert CVC\n- Référence produit, description du besoin\nUn devis personnalisé est généré automatiquement et envoyé au client.`,
    formImg
  );

  // -----------------------------------------------------------------
  // Section 4 – Espace Pro – Exemple Air G Energie (dashboard screenshot)
  // -----------------------------------------------------------------


  // -----------------------------------------------------------------
  // Save the PDF
  // -----------------------------------------------------------------
  const pdfBytes = await pdfDoc.save();
  const outPath = path.join(__dirname, 'gainable_presentation_final.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log('✅ PDF generated at', outPath);
})();
