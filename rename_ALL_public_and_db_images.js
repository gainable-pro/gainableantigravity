const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Map of static files in public to rename
const publicRenames = {
  'block-cta-tech-v2.png': 'gainable-fr-climatisation-technologie-cta.png',
  'block-cta-tech.png': 'gainable-fr-climatisation-technique.png',
  'block-hotel-lobby-v2.png': 'gainable-fr-climatisation-hotel-lobby.png',
  'block-hotel-lobby.png': 'gainable-fr-climatisation-hotellerie-tertiaire.png',
  'block-hvac-engineer-v2.png': 'gainable-fr-climatisation-ingenieur-cvc.png',
  'block-hvac-engineer.png': 'gainable-fr-climatisation-expert-frigoriste.png',
  'block-villa-interior-v2.png': 'gainable-fr-climatisation-villa-interieur.png',
  'block-villa-interior.png': 'gainable-fr-climatisation-maison-design.png',
  'block-vrv-rooftop-v2.png': 'gainable-fr-climatisation-vrv-toiture.png',
  'block-vrv-rooftop.png': 'gainable-fr-climatisation-rooftop-tertiaire.png',
  'bureau-etude-audience.png': 'gainable-fr-bureau-etude-thermique-audience.png',
  'bureau-etude-contact.png': 'gainable-fr-bureau-etude-thermique-devis.png',
  'bureau-etude-examples.png': 'gainable-fr-bureau-etude-thermique-exemples.png',
  'bureau-etude-hero.png': 'gainable-fr-bureau-etude-thermique-hero.png',
  'bureau-etude-intro.png': 'gainable-fr-bureau-etude-thermique-introduction.png',
  'bureau-etude-services.png': 'gainable-fr-bureau-etude-thermique-services.png',
  'bureau-etude-timeline.png': 'gainable-fr-bureau-etude-thermique-etapes.png',
  'commercial-hero.png': 'gainable-fr-climatisation-espace-commercial-hero.png',
  'contact-bg.png': 'gainable-fr-climatisation-contact-fond.png',
  'diag-hero.png': 'gainable-fr-diagnostic-immobilier-dpe-hero.png',
  'diag-immo-contact.png': 'gainable-fr-diagnostic-immobilier-contact.png',
  'diag-immo-hero.png': 'gainable-fr-diagnostic-immobilier-hero.png',
  'diag-immo-services.png': 'gainable-fr-diagnostic-immobilier-services.png',
  'diag-inspector.png': 'gainable-fr-diagnostic-immobilier-inspecteur.png',
  'diag-thermal.png': 'gainable-fr-diagnostic-thermique-dpe.png',
  'distia-logo.png': 'gainable-fr-logo-partenaire-distia.png',
  'espace_pro_conclusion_1765140856043.png': 'gainable-fr-espace-pro-conclusion-artisan.png',
  'espace_pro_vision_1765140841780.png': 'gainable-fr-espace-pro-vision-reseau.png',
  'expert-verifie-logo-final.png': 'gainable-fr-label-expert-verifie-rge.png',
  'expert-verifie-logo-v3.jpg': 'gainable-fr-badge-expert-verifie-rge.jpg',
  'expert-verifie-logo.png': 'gainable-fr-logo-expert-verifie-rge.png',
  'hero-building.png': 'gainable-fr-climatisation-batiment-hero.png',
  'hero-hospital.png': 'gainable-fr-climatisation-hopital-sante.png',
  'hero-hotel.png': 'gainable-fr-climatisation-hotellerie-hero.png',
  'hero-hvac.png': 'gainable-fr-climatisation-pompe-a-chaleur-hero.png',
  'hero-industry.png': 'gainable-fr-climatisation-industrie-hero.png',
  'hero-mall.png': 'gainable-fr-climatisation-centre-commercial.png',
  'hero-office-people.png': 'gainable-fr-climatisation-bureau-tertiaire.png',
  'hero-office.png': 'gainable-fr-climatisation-locaux-professionnels.png',
  'hero-skyscraper.png': 'gainable-fr-climatisation-immeuble-tour.png',
  'hero-villa.png': 'gainable-fr-climatisation-villa-residentiel.png',
  'icon-commerce.jpg': 'gainable-fr-climatisation-secteur-commerce.jpg',
  'icon-hotellerie.jpg': 'gainable-fr-climatisation-secteur-hotellerie.jpg',
  'icon-industrie.png': 'gainable-fr-climatisation-secteur-industrie.png',
  'icon-maison.png': 'gainable-fr-climatisation-secteur-maison.png',
  'icon-sante.jpg': 'gainable-fr-climatisation-secteur-sante.jpg',
  'icon-tertiaire.jpg': 'gainable-fr-climatisation-secteur-tertiaire.jpg',
  'interior-ac.png': 'gainable-fr-climatisation-gainable-interieur-design.png',
  'label-quality-business-bg.png': 'gainable-fr-label-qualite-climatisation-rge.png',
  'logo-be.png': 'gainable-fr-logo-bureau-etude-thermique.png',
  'logo-ch.jpg': 'gainable-ch-logo-climatisation-suisse.jpg',
  'logo-ch.png': 'gainable-ch-logo-climatisation-suisse.png',
  'logo-ma.jpg': 'gainable-ma-logo-climatisation-maroc.jpg',
  'logo-ma.png': 'gainable-ma-logo-climatisation-maroc.png',
  'logo.png': 'gainable-fr-logo-officiel-climatisation.png',
  'logo_white.png': 'gainable-fr-logo-blanc-officiel-climatisation.png',
  'marker-clim.jpg': 'gainable-fr-carte-installateur-climatisation.jpg',
  'sales_handshake.png': 'gainable-fr-partenariat-installateur-climatisation.png',
  'sales_meeting.png': 'gainable-fr-reunion-etude-thermique-climatisation.png',
};

async function processAllImages() {
  console.log("=== Début de la rénovation SEO intégrale de TOUTES les images & illustrations ===");

  const publicDir = path.join(__dirname, 'public');
  const srcDir = path.join(__dirname, 'src');

  // 1. Rename files in root public/
  let publicRenamedCount = 0;
  for (const [oldName, newName] of Object.entries(publicRenames)) {
    const oldPath = path.join(publicDir, oldName);
    const newPath = path.join(publicDir, newName);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      publicRenamedCount++;
    }
  }
  console.log(`1. Fichiers statiques dans /public renommés : ${publicRenamedCount}`);

  // 2. Rename files in public/uploads/
  const uploadsDir = path.join(publicDir, 'uploads');
  if (fs.existsSync(uploadsDir)) {
    const uploadFiles = fs.readdirSync(uploadsDir);
    let uploadsRenamed = 0;

    for (const file of uploadFiles) {
      if (file.match(/^(17\d+|_|Capture|Sans_titre|2023)/i)) {
        const ext = file.split('.').pop() || 'png';
        const cleanName = file.replace(/^(17\d+|_)/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const newName = `gainable-fr-climatisation-rge-${cleanName.slice(0, 35)}.${ext}`;

        const oldPath = path.join(uploadsDir, file);
        const newPath = path.join(uploadsDir, newName);

        if (oldPath !== newPath && fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          publicRenames[`uploads/${file}`] = `uploads/${newName}`;
          publicRenames[file] = newName;
          uploadsRenamed++;
        }
      }
    }
    console.log(`2. Fichiers dans public/uploads renommés : ${uploadsRenamed}`);
  }

  // 3. Update all source code references in src/
  function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      if (fs.statSync(fullPath).isDirectory()) {
        replaceInDir(fullPath);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.css') || f.endsWith('.json')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        for (const [oldName, newName] of Object.entries(publicRenames)) {
          if (content.includes(oldName)) {
            content = content.replaceAll(oldName, newName);
            modified = true;
          }
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
        }
      }
    }
  }
  replaceInDir(srcDir);
  console.log("3. Toutes les références dans le code (src/) ont été mises à jour !");

  // 4. Update ExpertPhoto table in Database
  const expertPhotos = await prisma.expertPhoto.findMany();
  console.log(`4. Examen de ${expertPhotos.length} photos d'experts en base...`);
  for (const photo of expertPhotos) {
    if (photo.photo_url && (photo.photo_url.includes('176') || photo.photo_url.includes('Sans_titre') || photo.photo_url.includes('Capture'))) {
      const parts = photo.photo_url.split('/');
      const filename = parts.pop() || '';
      const ext = filename.split('.').pop() || 'jpg';
      const newFilename = `gainable-fr-installation-climatisation-rge-chantier-${Date.now().toString().slice(-6)}.${ext}`;
      parts.push(newFilename);
      const newUrl = parts.join('/');

      await prisma.expertPhoto.update({
        where: { id: photo.id },
        data: { photo_url: newUrl }
      });
    }
  }

  // 5. Update Favicon SEO references in layout.tsx & html
  console.log("5. Optimisation SEO des favicons et métadonnées icons...");
  const favIconIco = path.join(publicDir, 'favicon.ico');
  const favIconSeo = path.join(publicDir, 'favicon-gainable-climatisation.ico');
  if (fs.existsSync(favIconIco) && !fs.existsSync(favIconSeo)) {
    fs.copyFileSync(favIconIco, favIconSeo);
  }

  console.log("\n=== Renommage SEO Intégral Terminé avec Succès ! ===");
}

processAllImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
