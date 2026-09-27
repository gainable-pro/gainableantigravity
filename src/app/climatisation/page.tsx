import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ShieldCheck, Zap, Users, Check } from "lucide-react";
import Link from "next/link";
import { HeroSlider } from "@/components/climatisation/HeroSlider";

export const metadata: Metadata = {
  title: "Installateur Climatisation Réversible & PAC | Devis & Artisans RGE",
  description: "Trouvez un installateur qualifié en climatisation réversible, pompe à chaleur air-air & gainable invisible. Comparez les devis des meilleurs frigoristes et artisans CVC certifiés.",
  alternates: {
    canonical: "https://www.gainable.fr/climatisation",
  },
  openGraph: {
    title: "Installateur Climatisation Réversible & PAC | Gainable.fr",
    description: "Le réseau national des installateurs et experts de la climatisation réversible, pompe à chaleur & gainable.",
    url: "https://www.gainable.fr/climatisation",
    type: "website",
    images: ["/gainable-fr-climatisation-pompe-a-chaleur-hero.png"],
  }
};

export default function ClimatisationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gainable.fr - Climatisation",
    "url": "https://www.gainable.fr/climatisation",
    "description": "La plateforme de référence pour la climatisation réversible, gainable, VRV et l'efficacité énergétique.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.gainable.fr/trouver-installateur?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BLOCK 1: Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center py-20 px-4 transition-all duration-1000 ease-in-out">
        {/* Background Images with Crossfade (Client Component) */}
        <HeroSlider />

        <div className="container relative z-10 mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal text-[#1F2D3D] mb-6 tracking-wide leading-tight uppercase font-montserrat">
            TROUVEZ VOTRE INSTALLATEUR DE<br />CLIMATISATION REVERSIBLE & GAINABLE
          </h1>
          <h2 className="text-lg md:text-xl text-[#1F2D3D] mb-10 max-w-4xl mx-auto font-light font-montserrat leading-relaxed">
            <span className="text-[#D59B2B] font-bold">La plateforme de référence</span> qui sélectionne les meilleurs artisans et experts certifiés RGE pour vos devis.
          </h2>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Link href="/">
              <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-12 py-8 rounded-full text-xl shadow-2xl uppercase tracking-wide transform hover:scale-105 transition-transform w-full sm:w-auto">
                Trouver un expert
              </Button>
            </Link>
            <Link href="/inscription">
              <Button size="lg" className="bg-[#1F2D3D] hover:bg-[#2c3e50] text-white font-bold px-12 py-8 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-transform w-full sm:w-auto">
                Devenir membre Expert Gainable.fr
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-400 font-medium">
            Devis gratuits et sans engagement
          </p>
        </div>
      </section>

      {/* SECTEUR D'ACTIVITÉ - ICONS ROW */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {/* VILLAS MAISONS */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/gainable-fr-climatisation-secteur-maison.png" alt="Maison" className="object-contain w-full h-full scale-[1.3]" />
              </div>
            </Link>

            {/* TERTIAIRE */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/gainable-fr-climatisation-secteur-tertiaire.jpg" alt="Tertiaire" className="object-contain w-full h-full" />
              </div>
            </Link>

            {/* COMMERCE */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/gainable-fr-climatisation-secteur-commerce.jpg" alt="Commerce" className="object-contain w-full h-full" />
              </div>
            </Link>

            {/* HÔTELLERIE */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/gainable-fr-climatisation-secteur-hotellerie.jpg" alt="Hôtellerie" className="object-contain w-full h-full" />
              </div>
            </Link>

            {/* INDUSTRIE */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/gainable-fr-climatisation-secteur-industrie.png" alt="Industrie" className="object-contain w-full h-full" />
              </div>
            </Link>

            {/* SANTÉ */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/gainable-fr-climatisation-secteur-sante.jpg" alt="Santé" className="object-contain w-full h-full" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOC 5 — Villas et maisons haut de gamme */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-6">
                La climatisation gainable : <span className="text-[#D59B2B]">le confort invisible</span> pour les maisons haut de gamme
              </h2>
              <div className="space-y-6 text-[#4A4A4A] text-lg font-montserrat font-medium leading-relaxed">
                <p>
                  Dans les villas modernes et les maisons haut de gamme, on recherche une climatisation silencieuse, discrète et efficace. La climatisation gainable est la solution idéale : les unités sont cachées, et l’air est diffusé par de petites grilles élégantes.
                </p>
                <p>
                  Elle permet d’avoir une température agréable dans toute la maison, sans appareils visibles sur les murs. Pour les grandes surfaces, il est important de bien calculer la puissance et les débits d’air afin d’éviter les écarts de température entre les pièces.
                </p>
                <p>
                  Gainable.fr aide à trouver des installateurs spécialisés en résidentiel premium.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/gainable-fr-climatisation-villa-interieur.png" alt="Intérieur villa moderne climatisation" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC 1 — Climatisation et chauffage pour bâtiments pro */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-6">
                Climatisation et chauffage pour <span className="text-[#D59B2B]">hôtels, magasins et grands bâtiments</span>
              </h2>
              <div className="space-y-6 text-[#4A4A4A] text-lg font-montserrat font-medium leading-relaxed">
                <p>
                  Dans un hôtel, un magasin, des bureaux ou une grande surface, la climatisation et le chauffage sont essentiels au confort des clients et des équipes. La température doit rester agréable toute la journée, même quand le bâtiment est très fréquenté.
                </p>
                <p>
                  Pour ces projets, on utilise souvent des systèmes plus avancés (VRV/DRV, gainable, CTA…). Ils doivent être bien étudiés dès le départ pour éviter les problèmes : surconsommation, zones trop chaudes ou trop froides, bruit, pannes répétées.
                </p>
                <p>
                  C’est pour cela qu’il est important de faire appel à un expert en climatisation professionnelle, et parfois à un bureau d’étude pour calculer précisément la puissance, les débits d’air et la bonne configuration du réseau.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/gainable-fr-climatisation-hotel-lobby.png" alt="Hall d’hôtel moderne avec climatisation discrète" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC 2 — Bureau d’étude CVC */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-6">
                Pourquoi faire appel à un <span className="text-[#D59B2B]">bureau d’étude CVC</span> ?
              </h2>
              <div className="space-y-6 text-[#4A4A4A] text-lg font-montserrat font-medium leading-relaxed">
                <p>
                  Un bureau d’étude CVC analyse votre bâtiment avant l’installation de la climatisation ou du chauffage. Son rôle est de vérifier que l’installation sera adaptée au bâtiment, économe en énergie et conforme aux normes.
                </p>
                <p>
                  Il réalise les calculs de puissance, les plans, la répartition de l’air, l’équilibrage entre les pièces et les recommandations techniques. Dans les grands bâtiments, les commerces ou les projets complexes, faire appel à un bureau d’étude est souvent indispensable pour garantir un résultat fiable et durable.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/gainable-fr-climatisation-ingenieur-cvc.png" alt="Ingénieur CVC avec plans" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC 3 — Systèmes VRV / DRV */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-6">
                Les systèmes <span className="text-[#D59B2B]">VRV / DRV</span> : une solution idéale pour les grands bâtiments
              </h2>
              <div className="space-y-6 text-[#4A4A4A] text-lg font-montserrat font-medium leading-relaxed">
                <p>
                  Les systèmes VRV/DRV sont conçus pour les hôtels, immeubles de bureaux ou surfaces commerciales. Ils permettent de régler la température zone par zone, par exemple une chambre d’hôtel, un open space ou une salle de réunion.
                </p>
                <p>
                  Ils offrent un très bon confort, une consommation maîtrisée et une longue durée de vie. Mais pour fonctionner correctement, ils doivent être dimensionnés avec précision : longueurs de réseaux, puissances, équilibrage…
                </p>
                <p>
                  C’est pourquoi il est important de confier ce type d’installation à un spécialiste VRV/DRV ayant l’habitude de ce genre de projet.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/gainable-fr-climatisation-vrv-toiture.png" alt="Systèmes VRV sur toiture" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC 4 — CTA et qualité de l’air */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-6">
                <span className="text-[#D59B2B]">CTA et qualité de l’air</span> dans les écoles, commerces et hôpitaux
              </h2>
              <div className="space-y-6 text-[#4A4A4A] text-lg font-montserrat font-medium leading-relaxed">
                <p>
                  Dans les établissements recevant du public (écoles, commerces, hôpitaux, restaurants…), la qualité de l’air est un enjeu majeur. La CTA (Centrale de Traitement d’Air) renouvelle l’air, filtre les particules, contrôle l’humidité et participe au confort et à la santé des occupants.
                </p>
                <p>
                  Une CTA mal réglée peut provoquer des mauvaises odeurs, de la condensation, de l’inconfort et une consommation excessive. C’est pourquoi l’installation et les réglages doivent être réalisés par un professionnel expérimenté.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/gainable-fr-climatisation-technologie-cta.png" alt="Local technique CTA" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC: NOS ZONES D'INTERVENTION */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#1F2D3D] mb-8">
            Installation Climatisation Gainable : Nos zones d'intervention
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mb-8">
            <Link href="/climatisation/paris" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Paris</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/marseille" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Marseille</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/lyon" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Lyon</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/toulouse" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Toulouse</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/nice" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Nice</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/nantes" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Nantes</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/strasbourg" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Strasbourg</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/bordeaux" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Bordeaux</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/lausanne" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors border-b border-dashed border-slate-300">Lausanne (CH)</Link>
            <span className="text-slate-300">•</span>
            <Link href="/climatisation/bruxelles" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors border-b border-dashed border-slate-300">Bruxelles (BE)</Link>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/climatisation/villes">
              <Button variant="outline" className="border-2 border-[#1F2D3D] text-[#1F2D3D] hover:bg-[#1F2D3D] hover:text-white font-bold py-6 px-8 rounded-full shadow-md hover:shadow-xl transition-all h-auto text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Voir nos 550+ Villes Couvertes (France, Suisse, Belgique)
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
