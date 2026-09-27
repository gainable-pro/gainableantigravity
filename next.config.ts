import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },


  generateBuildId: async () => {
    // Force a unique build ID to prevent Vercel from serving stale cache
    return `build-${Date.now()}`;
  },

  async redirects() {
    return [
{
        source: '/mot-de-passe-oublie',
        destination: '/auth/reset-password',
        permanent: true,
      },
      {
        source: '/reset-password',
        destination: '/auth/reset-password',
        permanent: true,
      },
      {
        source: '/entreprise/climatisation-pompe-a-chaleur-oison-plomberie-services-91-2366/articles/comprendre-le-prix-de-la-climatisation-gainable-a-la-ferte-saint-aubin-la-ferte-saint-aubin',
        destination: '/entreprise/climatisation-pompe-a-chaleur-oison-plomberie-services-91-2366/articles/comprendre-le-prix-de-la-climatisation-gainable-a-la-ferte-saint-aubin',
        permanent: true,
      },
      {
        source: '/entreprise/gainable-fr/articles/boostez-votre-chiffre-daffaires-avec-la-climatisation-gainable-a-lyon-lyon',
        destination: '/entreprise/gainable-fr/articles/boostez-votre-chiffre-daffaires-avec-la-climatisation-gainable-a-lyon',
        permanent: true,
      },
      { source: '/installation-climatisation-montpellier', destination: '/climatisation/montpellier', permanent: true },
      { source: '/trouver-installateur/saint-barthelemy', destination: '/climatisation/saint-barthelemy', permanent: true },
      { source: '/climatisation-brest', destination: '/climatisation/brest', permanent: true },
      { source: '/hotellerie-restauration', destination: '/climatisation', permanent: true },
      { source: '/climatisation-bordeaux', destination: '/climatisation/bordeaux', permanent: true },
      { source: '/post/gainable-trouvez-solution-climatisation-maison-villa', destination: '/articles', permanent: true },
      { source: '/blog/tags/https---fr-wikipedia-org-wiki-mitsubishi', destination: '/articles', permanent: true },
      { source: '/climatisation-aix-provence', destination: '/climatisation/aix-provence', permanent: true },
      { source: '/installation-climatisation-limoge', destination: '/climatisation/limoge', permanent: true },
      { source: '/blog/tags/couts-climatisation', destination: '/articles', permanent: true },
      { source: '/post/gainable-plateforme-confiance-diagnostic-immobilier-solutions', destination: '/articles', permanent: true },
      { source: '/entreprise/climatisation-pompe-a-chaleur-miramas-air-g-energie-8907/articles/linstallation-dun-systeme-de-climatisation-gainable-daikin-a-septemes-les-vallons', destination: '/repertoire', permanent: true },
      { source: '/post/installation-climatisation-gainable-vrv-conseils-bonnes-pratiques', destination: '/articles', permanent: true },
      { source: '/post/meilleures-pratiques-installation-climatisation-gainable-entrepot', destination: '/articles', permanent: true },
      { source: '/installation-climatisation-cannes', destination: '/climatisation/cannes', permanent: true },
      { source: '/blog/tags/regulation', destination: '/articles', permanent: true },
      { source: '/blog/tags/daikin-vrv', destination: '/articles', permanent: true },
      { source: '/post/guide-entretien-conduits-systeme-climatisation-gainable-avantage', destination: '/articles', permanent: true },
      { source: '/post/benefices-climatisation-gainable-batiments-haute-performance-energetique', destination: '/articles', permanent: true },
      { source: '/climatisation-arcachon', destination: '/climatisation/arcachon', permanent: true },
      { source: '/post/climatisation-gainable-vrv-cta-systeme-mieux-votre-projet', destination: '/articles', permanent: true },
      { source: '/pro/air-g-energie-miramas', destination: '/repertoire', permanent: true },
      { source: '/post/avantages-inattendus-climatisation-gainable-silencieuse-espaces-vie', destination: '/articles', permanent: true },
      { source: '/pro/climatisation-pompe-a-chaleur-miramas-air-g-energie-9955', destination: '/repertoire', permanent: true },
      { source: '/pro/climatisation-pompe-a-chaleur-caen-fc-services-1506', destination: '/repertoire', permanent: true },
      { source: '/post/comment-climatisation-gainable-transformer-espaces-vie', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-accessibilite-solutions-personnes-mobilite-reduite', destination: '/articles', permanent: true },
      { source: '/post/rafraichissement-dessus-tete-climatisation-plafonnier-confort-sans-effort', destination: '/articles', permanent: true },
      { source: '/post/changer-climat-climatisation-actions-essentielles-dereglement', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-domotique-pour-maison-intelligente', destination: '/articles', permanent: true },
      { source: '/post/avantages-zonage-systemes-climatisation-gainable-comment-airzone', destination: '/articles', permanent: true },
      { source: '/blog', destination: '/climatisation', permanent: true },
      { source: '/post/comment-choisir-sa-climatisation', destination: '/articles', permanent: true },
      { source: '/post/regulation-temperature-meilleures-pratiques-climatisation-gainable-performante', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-vs-traditionnelle-differences', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-conception-batiments-durables-maximiser-efficacite-energetique', destination: '/articles', permanent: true },
      { source: '/post/allier-confort-responsabilite-impact-climatisation-dereglement-climatique', destination: '/articles', permanent: true },
      { source: '/post/maximiser-durabilite-systeme-de-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/installation-climatisation-grenoble', destination: '/climatisation/grenoble', permanent: true },
      { source: '/climatisation-toulouse', destination: '/climatisation/toulouse', permanent: true },
      { source: '/post/climatisation-gainable-qualit%C3%A9-air-interieur-savoir', destination: '/articles', permanent: true },
      { source: '/blog/tags/performance-cta', destination: '/articles', permanent: true },
      { source: '/post/dernieres-tendances-matiere-climatisation-gainable-residences-luxe', destination: '/articles', permanent: true },
      { source: '/post/guide-installation-climatisation-gainable-vrv-batiment-residentiel', destination: '/articles', permanent: true },
      { source: '/post/benefices-integration-solutions-airzone-webserveur-systemes-gainables', destination: '/articles', permanent: true },
      { source: '/installation-climatisation-monaco', destination: '/climatisation/monaco', permanent: true },
      { source: '/post/optimiser-circulation-air-avec-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/lyon', destination: '/climatisation', permanent: true },
      { source: '/post/guide-optimiser-efficacite-systeme-climatisation-gainable-ete', destination: '/articles', permanent: true },
      { source: '/post/choisir-bonne-capacite-pour-systeme-climatisation-gainable-vrv', destination: '/articles', permanent: true },
      { source: '/post/5-risques-meconnus-lies-entretien-climatisations-gainables-comment-eviter', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-reglementation-assurer-conformite-projets', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-controle-humidite-comment-maintenir-niveau-confortable', destination: '/articles', permanent: true },
      { source: '/post/controle-programmation-climatisation-gainable-devez-savoir', destination: '/articles', permanent: true },
      { source: '/post/avantages-systemes-climatisation-tertiaire-vrv-daikin-grands-complexes-commercia', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-bien-etre-residents-ameliorer-qualite-vie', destination: '/articles', permanent: true },
      { source: '/blog/tags/utilisateur', destination: '/articles', permanent: true },
      { source: '/post/economies-realisables-climatisation-gainable-immeubles-bureaux', destination: '/articles', permanent: true },
      { source: '/ciotat', destination: '/climatisation', permanent: true },
      { source: '/post/reduire-couts-chauffage-et-climatisation-avec-systeme-gainable', destination: '/articles', permanent: true },
      { source: '/blog/tags/insonorisation', destination: '/articles', permanent: true },
      { source: '/post/installation-climatisation-gainable-industrie-conseils-pratiques', destination: '/articles', permanent: true },
      { source: '/post/marques-climatisation-gainable-recommandees-experts', destination: '/articles', permanent: true },
      { source: '/blog/tags/performance-vrv', destination: '/articles', permanent: true },
      { source: '/blog/tags/%C3%A9conomies-%C3%A9nergie', destination: '/articles', permanent: true },
      { source: '/blog/tags/faux-plafond', destination: '/articles', permanent: true },
      { source: '/post/conseils-maximiser-efficacite-votre-systeme-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/installation-climatisation-nice', destination: '/climatisation/nice', permanent: true },
      { source: '/blog/tags/comparaison-climatisation', destination: '/articles', permanent: true },
      { source: '/installation-climatisation-lavandou', destination: '/climatisation/lavandou', permanent: true },
      { source: '/installation-climatisation-paris', destination: '/climatisation/paris', permanent: true },
      { source: '/post/dernieres-avancees-matiere-controle-qualite-air-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/post/serenite-montagne-gainables-hyper-heating-la-solution-climatisation', destination: '/articles', permanent: true },
      { source: '/sante', destination: '/climatisation', permanent: true },
      { source: '/post/economies-energie-realisables-grace-gainable-vrv-efficace', destination: '/articles', permanent: true },
      { source: '/post/meilleures-pratiques-reduire-couts-exploitation-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/post/tendances-matiere-climatisation-gainable-villas-maisons', destination: '/articles', permanent: true },
      { source: '/installation-climatisation-rennes', destination: '/climatisation/rennes', permanent: true },
      { source: '/installation-climatisation-ajaccio', destination: '/climatisation/ajaccio', permanent: true },
      { source: '/installation-climatisation-lyon', destination: '/climatisation/lyon', permanent: true },
      { source: '/post/comment-integration-de-solutions-airzone-et-de-webserveur-ameliore', destination: '/articles', permanent: true },
      { source: '/blog/tags/avantages-cta', destination: '/articles', permanent: true },
      { source: '/blog/tags/espace-n%C3%A9cessaire', destination: '/articles', permanent: true },
      { source: '/post/pourquoi-integration-solutions-airzone-webserveur-installations', destination: '/articles', permanent: true },
      { source: '/post/climatisation-tertiaire-mitsubishi-electric-optimisation-gestion-energie', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-isolation-conseils-optimiser-efficacite-energetique', destination: '/articles', permanent: true },
      { source: '/post/guide-l-installation-climatisation-gainable-bureaux-d-entreprise', destination: '/articles', permanent: true },
      { source: '/post/tendances-matiere-technologie-systemes-climatisation-gainable-vrv', destination: '/articles', permanent: true },
      { source: '/post/avantages-climatisation-gainable-zonee-grands-espaces', destination: '/articles', permanent: true },
      { source: '/post/optimiser-efficacite-climatisation-gainable-strategies-adopter', destination: '/articles', permanent: true },
      { source: '/blog/tags/pannes', destination: '/articles', permanent: true },
      { source: '/installation-climatisation-salon-de-provence', destination: '/climatisation/salon-de-provence', permanent: true },
      { source: '/post/guide-installation-climatisation-gainable-immeuble-de-bureaux', destination: '/articles', permanent: true },
      { source: '/post/eviter-pieges-installation-climatisation-gainable-espace-restreint', destination: '/articles', permanent: true },
      { source: '/installation-climatisation-nimes', destination: '/climatisation/nimes', permanent: true },
      { source: '/installation-climatisation-carry-le-rouet', destination: '/climatisation/carry-le-rouet', permanent: true },
      { source: '/blog/tags/systeme-cvc', destination: '/articles', permanent: true },
      { source: '/post/lsolutions-climatisation-gainable-adaptees-batiments-historiques', destination: '/articles', permanent: true },
      { source: '/post/facteurs-considerer-planification-installation-climatisation-commerce-detail', destination: '/articles', permanent: true },
      { source: '/climatisation-marseille', destination: '/climatisation/marseille', permanent: true },
      { source: '/post/diagnostic-immobilier-climatisation-expertise-gainable-recommandation', destination: '/articles', permanent: true },
      { source: '/post/guide-programmation-gestion-intelligente-systeme-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/bureau-etudes', destination: '/climatisation', permanent: true },
      { source: '/post/planifier-entretien-regulier-systeme-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/post/importance-isolation-gaines-systemes-climatisation-gainable-reversible', destination: '/articles', permanent: true },
      { source: '/climatisation-laciotat', destination: '/climatisation/laciotat', permanent: true },
      { source: '/post/guide-installation-climatisation-gainable-ecole', destination: '/articles', permanent: true },
      { source: '/climatisation-larochelle', destination: '/climatisation/larochelle', permanent: true },
      { source: '/post/guide-entretien-regulier-climatisation-gainables', destination: '/articles', permanent: true },
      { source: '/post/erreurs-eviter-installation-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/blog/tags/inspections', destination: '/articles', permanent: true },
      { source: '/blog/tags/risques-entretien-climatisation', destination: '/articles', permanent: true },
      { source: '/post/vrv-daikin-comment-idee-audacieuse-transforme-industrie-climatisation', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-securite-incendie-vous-devez-savoir', destination: '/articles', permanent: true },
      { source: '/blog/tags/diffusion', destination: '/articles', permanent: true },
      { source: '/post/meilleurs-systemes-climatisation-gainable-espaces-divertissement', destination: '/articles', permanent: true },
      { source: '/post/guide-entretien-regulier-systemes-climatisation-gainable-vrv', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-pourquoi-option-ideale-batiments-historiques', destination: '/articles', permanent: true },
      { source: '/post/guide-installation-climatisation-gainable-centre-sante', destination: '/articles', permanent: true },
      { source: '/post/comment-choisir-bonne-capacite-systeme-climatisation-gainable', destination: '/articles', permanent: true },
      { source: '/post/climatisation-gainable-vrv-cta-syst%C3%A8me-mieux-votre-projet', destination: '/articles', permanent: true },
      { source: '/blog/tags/intelligent', destination: '/articles', permanent: true },
    ];
  },

  async rewrites() {
    return [
      // Sitemap index: /sitemap.xml → served by the sitemap-index API route
      {
        source: '/sitemap.xml',
        destination: '/sitemap-index',
      },
      // Sitemap parts: /sitemap/1.xml → served by the /sitemap/[id]/route.ts API route
      {
        source: '/sitemap/:id.xml',
        destination: '/sitemap/:id',
      },
      {
        source: '/trouver-installateur',
        destination: '/',
      },
      {
        source: '/trouver-diagnostiqueur',
        destination: '/?filter=diagnostiqueur',
      },
      {
        source: '/trouver-bureau-etude',
        destination: '/?filter=bureau_etude',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval' blob:; img-src 'self' data: https: blob:; media-src 'self' https: data: blob:;",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
} as any;

export default nextConfig;
