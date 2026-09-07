const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'public', 'blog');
const b2bDataFile = path.join(__dirname, 'src', 'lib', 'b2b-articles-data.ts');

const mapping = {
  'art1-hero.png': 'gainable-fr-climatisation-artisan-hero.png',
  'art1-bataille.png': 'gainable-fr-climatisation-bataille-commerciale.png',
  'art1-baisse.png': 'gainable-fr-climatisation-baisse-marges.png',
  'art1-solution.png': 'gainable-fr-climatisation-solution-exclusive.png',
  'art2-hero.png': 'gainable-fr-climatisation-loi-prospection-hero.png',
  'art2-loi.png': 'gainable-fr-climatisation-reglementation-loi.png',
  'art2-consent.png': 'gainable-fr-climatisation-consentement-client.png',
  'art2-solution.png': 'gainable-fr-climatisation-prospection-legale.png',
  'art3-hero.png': 'gainable-fr-climatisation-site-vitrine-hero.png',
  'art3-web.png': 'gainable-fr-climatisation-site-obsolete.png',
  'art4-hero.png': 'gainable-fr-climatisation-marathon-seo-hero.png',
  'art4-seo.png': 'gainable-fr-climatisation-croissance-seo.png',
  'art5-hero.png': 'gainable-fr-climatisation-outil-exclusif-hero.png',
  'art5-outil.png': 'gainable-fr-climatisation-artisan-client-partenaire.png',
  'art6-hero.png': 'gainable-fr-climatisation-tarifs-transparents-hero.png',
  'art6-mythe.png': 'gainable-fr-climatisation-concurrence-prix.png',
  'art6-danger.png': 'gainable-fr-climatisation-dangers-installation.png',
  'art6-valeur.png': 'gainable-fr-climatisation-vendre-valeur-rge.png',
  'art6-exclu.png': 'gainable-fr-climatisation-exclusivite-service.png',
  'art7-hero.png': 'gainable-fr-climatisation-gestion-rentabilite-hero.png',
  'art7-illusion.png': 'gainable-fr-climatisation-factures-gestion.png',
  'art7-temps.png': 'gainable-fr-climatisation-gain-temps-artisan.png',
  'art7-spirale.png': 'gainable-fr-climatisation-optimisation-couts.png',
  'art7-rentabilite.png': 'gainable-fr-climatisation-rentabilite-ascendante.png',
  'art8-hero.png': 'gainable-fr-climatisation-intelligence-artificielle-hero.png',
  'art8-ia.png': 'gainable-fr-climatisation-assistant-ia-frigoriste.png',
  'art9-hero.png': 'gainable-fr-climatisation-developpement-ca-hero.png',
  'art9-case.png': 'gainable-fr-climatisation-croissance-chiffre-affaires.png',
  'art10-hero.png': 'gainable-fr-climatisation-avis-google-hero.png',
  'art10-map.png': 'gainable-fr-climatisation-preuve-sociale-google.png',
  'art11-hero.png': 'gainable-fr-climatisation-devis-digital-hero.png',
  'art11-digi.png': 'gainable-fr-climatisation-signature-electronique.png',
  'art12-hero-badge.png': 'gainable-fr-climatisation-expert-verifie-hero.png',
  'art12-expert.png': 'gainable-fr-climatisation-technicien-vrv.png',
};

console.log("=== Renommage des fichiers d'illustrations statiques du blog ===");

// 1. Rename physical files in public/blog
for (const [oldName, newName] of Object.entries(mapping)) {
  const oldPath = path.join(blogDir, oldName);
  const newPath = path.join(blogDir, newName);

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Fichier renommé : ${oldName} -> ${newName}`);
  }
}

// 2. Update references in src/lib/b2b-articles-data.ts
if (fs.existsSync(b2bDataFile)) {
  let content = fs.readFileSync(b2bDataFile, 'utf8');

  for (const [oldName, newName] of Object.entries(mapping)) {
    const oldRef = `/blog/${oldName}`;
    const newRef = `/blog/${newName}`;
    content = content.replaceAll(oldRef, newRef);
  }

  fs.writeFileSync(b2bDataFile, content, 'utf8');
  console.log("Références mises à jour dans src/lib/b2b-articles-data.ts !");
}
