const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Users\\gmaro\\.gemini\\antigravity-ide\\scratch\\gainable-fr';

// 1. Update layout.tsx
const layoutPath = path.join(basePath, 'src', 'app', 'layout.tsx');
let layout = fs.readFileSync(layoutPath, 'utf8');

// Replace template: "%s | Gainable.fr" with template: "%s"
layout = layout.replace(/template:\s*["']%s\s*\|\s*Gainable\.fr["']/, 'template: "%s"');

// Replace alternates in layout.tsx: keep canonical: './', remove languages
layout = layout.replace(
  /alternates:\s*\{[\s\S]*?canonical:\s*'\.\/',[\s\S]*?languages:\s*\{[\s\S]*?\},?\s*\}/,
  "alternates: {\n    canonical: './',\n  }"
);

fs.writeFileSync(layoutPath, layout, 'utf8');
console.log('layout.tsx successfully updated');

// 2. Update page.tsx
const pagePath = path.join(basePath, 'src', 'app', 'page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

if (!page.includes("'fr-FR': 'https://www.gainable.fr'")) {
  page = page.replace(
    /alternates:\s*\{\s*canonical:\s*canonicalUrl,?\s*\}/,
    `alternates: {
            canonical: canonicalUrl,
            languages: {
                'fr-FR': 'https://www.gainable.fr',
                'fr-CH': 'https://www.gainable.ch',
                'fr-BE': 'https://www.gainable.be',
                'fr-MA': 'https://www.gainable.ma',
                'fr-CA': 'https://www.gainable.ca',
            },
        }`
  );
  fs.writeFileSync(pagePath, page, 'utf8');
  console.log('page.tsx successfully updated with hreflang languages');
} else {
  console.log('page.tsx already had languages');
}

// 3. Update src/app/climatisation/[city]/page.tsx
const cityPagePath = path.join(basePath, 'src', 'app', 'climatisation', '[city]', 'page.tsx');
let cityPage = fs.readFileSync(cityPagePath, 'utf8');

// Fix spintax {city.name} without $
if (cityPage.includes('à {city.name} ?')) {
  cityPage = cityPage.replace('à {city.name} ?', 'à ${city.name} ?');
  console.log('Fixed spintax {city.name} in city page');
}

// Ensure withDbRetry is imported
if (!cityPage.includes('withDbRetry')) {
  cityPage = cityPage.replace(
    'import { prisma } from "@/lib/prisma";',
    'import { prisma, withDbRetry } from "@/lib/prisma";'
  );
  console.log('Imported withDbRetry in city page');
}

// Wrap prisma queries in withDbRetry if not already wrapped
if (cityPage.includes('const [experts, deptCount, globalCount] = await Promise.all([')) {
  cityPage = cityPage.replace(
    'const [experts, deptCount, globalCount] = await Promise.all([',
    'const [experts, deptCount, globalCount] = await withDbRetry(() => Promise.all(['
  );
  // Find closing bracket of Promise.all
  cityPage = cityPage.replace(
    'prisma.expert.count({\n                where: { status: \'active\', slug: { notIn: SYSTEM_SLUGS } }\n            })\n        ]);',
    'prisma.expert.count({\n                where: { status: \'active\', slug: { notIn: SYSTEM_SLUGS } }\n            })\n        ]));'
  );
  console.log('Wrapped expert queries in withDbRetry');
}

fs.writeFileSync(cityPagePath, cityPage, 'utf8');

// 4. Update public/llms.txt with standard formatting
const llmsPath = path.join(basePath, 'public', 'llms.txt');
const cleanLlms = `# Gainable.fr - Plateforme des Experts du Génie Climatique & de la Rénovation

> Gainable.fr est le réseau national n°1 de mise en relation d'experts en climatisation réversible, systèmes gainables, pompes à chaleur, diagnostics de performance énergétique (DPE) et études thermiques en France, Belgique, Suisse et Maroc.

## Informations & Liens Principaux

- [Accueil & Recherche d'Experts](https://www.gainable.fr/): Moteur de recherche géolocalisé pour trouver un professionnel certifié RGE à proximité.
- [Installateurs Climatisation & PAC](https://www.gainable.fr/climatisation): Trouver un installateur de climatisation réversible ou pompe à chaleur air-air / air-eau.
- [Bureaux d'Étude Thermique](https://www.gainable.fr/bureau-etude): Trouver un bureau d'étude pour les calculs thermiques réglementaires RE2020 et dimensionnements CVC.
- [Diagnostiqueurs Immobiliers DPE](https://www.gainable.fr/diagnostic-immobilier): Trouver un diagnostiqueur certifié pour le DPE réglementaire et l'audit énergétique.
- [Espace Pro & Inscription Artisans](https://www.gainable.fr/pourquoi-gainable): Adhésion au réseau d'Experts Vérifiés, abonnements sans commission et acquisition de leads.

## Structure & Ressources

- [Plan du Site](https://www.gainable.fr/plan-du-site): Hub des zones géographiques couvertes par les experts partenaires (départements et communes).
- [Guides Techniques & Conseils](https://www.gainable.fr/articles): Plus de 56 000 articles de conseils rédigés par des ingénieurs thermiciens et installateurs.
- [Demande de Devis](https://www.gainable.fr/contact): Formulaire de mise en relation directe pour particuliers et professionnels.
`;

fs.writeFileSync(llmsPath, cleanLlms, 'utf8');
console.log('llms.txt cleaned and standardized');
