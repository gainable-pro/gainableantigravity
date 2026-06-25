// generate_gainable_simple.js
// Minimal PDF generation respecting Gainable visual identity (colors, fonts) without images.
// Uses only built‑in Helvetica to avoid encoding issues.

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

(async () => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const addPage = (title, body) => {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const MARGIN = 50;
    let y = height - MARGIN;

    // Title (blue‑600)
    page.drawText(title, { x: MARGIN, y, size: 22, font, color: rgb(0, 0.42, 0.78) });
    y -= 30;

    // Body (replace any non‑ASCII characters with spaces)
    const lines = body.replace(/[\u202f\u00a0]/g, ' ').split('\n');
    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y, size: 12, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 16;
    }
  };

  // -----------------------------------------------------------------
  // Cover page – simple gradient background using rectangles
  // -----------------------------------------------------------------
  const cover = pdfDoc.addPage();
  const { width, height } = cover.getSize();
  // Top half – blue‑600
  cover.drawRectangle({ x: 0, y: height / 2, width, height: height / 2, color: rgb(0.149, 0.388, 0.847) });
  // Bottom half – blue‑400
  cover.drawRectangle({ x: 0, y: 0, width, height: height / 2, color: rgb(0.263, 0.784, 0.804) });
  const title = 'Gainable.fr – Présentation Commerciale';
  const titleSize = 28;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  cover.drawText(title, {
    x: (width - titleWidth) / 2,
    y: height / 2 - titleSize - 20,
    size: titleSize,
    font,
    color: rgb(0.84, 0.61, 0.17) // gold
  });

  // -----------------------------------------------------------------
  // Sections (text only)
  // -----------------------------------------------------------------
  addPage(
    'Problématiques SEO & Volume',
    `• Référencement GEO très concurrentiel
• 58 000 articles publiés depuis le lancement
• Phase de test d’une année pour valider la viabilité du modèle
• Risques liés à une plateforme de rente à grande échelle`
  );

  addPage(
    'Moteur de recherche multi‑filtre',
    `Le site propose un moteur de recherche avancé avec :
- Marque
- Type (Gainable, Mural, Console, Groupe Extérieur)
- Fluide, SEER, SCOP
- Fourchette de prix estimée
Les utilisateurs peuvent combiner plusieurs filtres pour cibler le produit exact.`
  );

  addPage(
    'Formulaire de demande ultra‑détaillé',
    `Le formulaire capture :
- Nom / Prénom
- Email, Téléphone
- Type de client (particulier / professionnel)
- Ciblage : Bureau d’études, Diag Immo, Expert CVC
- Référence produit, description du besoin
Il génère automatiquement un devis personnalisé et alimente le CRM.`
  );

  addPage(
    'Espace Pro – Exemple Air G Energie',
    `Air G Energie utilise le tableau de bord professionnel pour :
- Suivre le nombre de demandes entrantes
- Accéder aux fiches techniques générées par IA
- Exporter des rapports PDF
- Gérer contacts et devis depuis un même espace.`
  );

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const outPath = path.join(__dirname, 'gainable_presentation.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log('PDF generated at', outPath);
})();
