"use client";
// FORCE UPDATE TIMESTAMP: 2025-12-18 T 16:00



import { Button } from "@/components/ui/button";
import { Search, MapPin, ShieldCheck, Zap, Users, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const heroImages = [
  "/hero-villa.png",
  "/hero-office.png",
  "/hero-office-people.png",
  "/hero-mall.png",
  "/hero-hotel.png",
  "/hero-industry.png",
  "/hero-hospital.png"
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); // 3 seconds interval

    return () => clearInterval(interval);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gainable.fr",
    "url": "https://gainable.fr",
    "description": "La plateforme de référence pour la climatisation gainable, VRV et l'efficacité énergétique.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gainable.fr/trouver-installateur?q={search_term_string}",
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
        {/* Background Images with Crossfade */}
        {heroImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            style={{ backgroundImage: `url('${img}')` }}
          >
            <div className="absolute inset-0 bg-white/60"></div>
          </div>
        ))}

        <div className="container relative z-10 mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal text-[#1F2D3D] mb-6 tracking-wide leading-tight uppercase font-montserrat">
            LES EXPERTS DE LA<br />CLIMATISATION GAINABLE
          </h1>
          <p className="text-lg md:text-xl text-[#1F2D3D] mb-10 max-w-4xl mx-auto font-light font-montserrat leading-relaxed">
            <span className="text-[#D59B2B] font-bold">La première plateforme de mise en relation d'experts</span> en climatisation gainable & VRV, pour les professionnels et les particuliers.
          </p>

          {/* Simpler Search Box as requested: Just one big 'Trouvez votre expert' experience */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link href="/trouver-installateur">
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
                <img src="/icon-maison.png" alt="Maison" className="object-contain w-full h-full scale-[1.3]" />
              </div>
            </Link>

            {/* TERTIAIRE */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/icon-tertiaire.jpg" alt="Tertiaire" className="object-contain w-full h-full" />
              </div>
            </Link>

            {/* COMMERCE */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/icon-commerce.jpg" alt="Commerce" className="object-contain w-full h-full" />
              </div>
            </Link>

            {/* HÔTELLERIE */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/icon-hotellerie.jpg" alt="Hôtellerie" className="object-contain w-full h-full" />
              </div>
            </Link>

            {/* INDUSTRIE */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/icon-industrie.png" alt="Industrie" className="object-contain w-full h-full" />
              </div>
            </Link>

            {/* SANTÉ */}
            <Link href="/trouver-installateur" className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 mb-4 relative transition-transform transform group-hover:scale-110">
                <img src="/icon-sante.jpg" alt="Santé" className="object-contain w-full h-full" />
              </div>
            </Link>
          </div>
        </div>
      </section>



      {/* NEW BLOCKS REQUESTED BY USER */}

      {/* BLOC 5 (MOVED TO TOP) — Villas et maisons haut de gamme */}
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
                <Link href="/trouver-installateur">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/block-villa-interior-v2.png" alt="Intérieur villa moderne climatisation" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC 1 — Climatisation et chauffage pour bâtiments pro */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Column */}
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
                <Link href="/trouver-installateur">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            {/* Image Column */}
            <div className="order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/block-hotel-lobby-v2.png" alt="Hall d’hôtel moderne avec climatisation discrète" className="w-full h-full object-cover" />
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
                <Link href="/trouver-installateur">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/block-hvac-engineer-v2.png" alt="Ingénieur CVC avec plans" className="w-full h-full object-cover" />
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
                <Link href="/trouver-installateur">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/block-vrv-rooftop-v2.png" alt="Systèmes VRV sur toiture" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC 4 — CTA & qualité de l’air */}
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
                <Link href="/trouver-installateur">
                  <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg">
                    Trouver un expert
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
                <img src="/block-cta-tech-v2.png" alt="Local technique CTA" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 2: PREMIUM CONTENT - EXPLANATION & MARKET (MOVED TO BOTTOM) */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">

          {/* 1. Main Title Area */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-normal text-[#1F2D3D] mb-6 font-montserrat uppercase tracking-wide leading-tight">
              Les meilleurs professionnels vérifiés <br className="hidden md:block" />
              pour l'installation de votre climatisation gainable, VRV/DRV ou PAC.
            </h2>
          </div>

          {/* 2. Split Section: Explanation Left / Image Right */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
            {/* Left Text */}
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-normal text-[#1F2D3D] font-montserrat">
                  Vous dirigez une entreprise, un commerce, un hôtel ou un établissement ?
                </h3>
                <h3 className="text-2xl font-normal text-[#1F2D3D] font-montserrat text-opacity-80">
                  Vous êtes particulier et souhaitez un système discret et performant ?
                </h3>
              </div>

              <div className="w-20 h-1 bg-[#D59B2B]"></div>

              <p className="text-lg text-slate-700 leading-relaxed font-light">
                <span className="text-[#D59B2B] font-normal">La climatisation gainable est la solution idéale</span> pour allier confort, esthétique et performance énergétique.
              </p>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>Le système est installé dans les plafonds ou les combles.</p>
                <p>L’air est diffusé via des grilles discrètes, permettant une température homogène dans toutes les pièces, sans unité apparente.</p>
                <p>C’est la solution la plus élégante et silencieuse, assurant un confort thermique optimal.</p>
              </div>

              <p className="text-lg font-normal text-[#1F2D3D] pt-4">
                Chez Gainable.fr, notre mission est simple :
                <span className="block font-light text-slate-600 text-base mt-2">
                  vous aider à trouver l’installateur le plus qualifié pour votre projet, en France et en Suisse.
                </span>
              </p>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-[#D59B2B]/10 rounded-2xl transform rotate-2"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src="/interior-ac.png" alt="Intérieur Gainable Invisible" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>

          {/* 3. Market Block (Orange/Gold Context) */}
          <div className="mb-24 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4">
                <span className="h-12 w-12 rounded-full bg-[#D59B2B]/10 flex items-center justify-center ring-8 ring-white">
                  <span className="text-[#D59B2B] font-bold text-xl">?</span>
                </span>
              </span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-50 p-10 md:p-14 rounded-3xl border-l-8 border-[#D59B2B] shadow-sm mb-24">
            <h3 className="text-2xl font-bold text-[#1F2D3D] mb-6 font-montserrat">
              Le saviez-vous ?
            </h3>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                En France et en Suisse, il existe des milliers d’entreprises spécialisées en climatisation et en équipements thermiques.
                <span className="font-bold text-[#1F2D3D]">Le vrai défi, c’est de trouver celle qui fera un travail sérieux, durable et adapté à vos besoins.</span>
              </p>
              <ul className="space-y-3 font-medium text-[#1F2D3D]">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D59B2B]"></div>
                  Qui sera présent avant, pendant et après l’installation ?
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D59B2B]"></div>
                  Qui dimensionnera correctement votre installation pour éviter la surconsommation ?
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D59B2B]"></div>
                  Qui s’engagera réellement à garantir votre satisfaction ?
                </li>
              </ul>
              <p className="pt-4 font-bold text-xl text-[#D59B2B]">
                C’est précisément là que Gainable.fr intervient.
              </p>
            </div>
          </div>

          {/* 4. Value Added (Blue Block) */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-24">

            {/* Column 1: Selection Criteria */}
            <div>
              <h3 className="text-3xl font-extrabold text-[#1F2D3D] mb-8 font-montserrat uppercase">
                <span className="text-[#D59B2B]">La valeur ajoutée</span><br />Gainable.fr
              </h3>
              <p className="text-lg text-slate-600 mb-8 font-medium">Nous sélectionnons uniquement des entreprises :</p>

              <ul className="space-y-4">
                {[
                  "Vérifiées (SIRET / IDE, assurances, certifications)",
                  "Spécialisées en gainable, VRV/DRV, PAC, CTA, tertiaire et résidentiel",
                  "Qui ne sous-traitent pas",
                  "Qui garantissent la performance et la longévité du matériel",
                  "Qui accompagnent le client à chaque étape"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="mt-1 min-w-[20px] h-5 rounded-full bg-[#1F2D3D] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-slate-800 font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Technical Mastery */}
            <div className="bg-[#1F2D3D] p-10 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-[#D59B2B]/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#D59B2B]/20"></div>

              <h4 className="text-xl font-bold text-[#D59B2B] mb-6 uppercase tracking-wider relative z-10">Expertise Technique</h4>
              <p className="text-lg text-slate-300 mb-8 relative z-10">Nous mettons en avant les installateurs qui maîtrisent :</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 relative z-10">
                {[
                  "Le dimensionnement", "L’équilibrage réseaux", "La sélection machine", "L’optimisation énergétique", "La mise en service", "Le suivi après installation"
                ].map((skill, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>
                    <span className="font-medium">{skill}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                <p className="font-bold text-lg">
                  Notre priorité : <span className="text-[#D59B2B]">assurer un résultat fiable, durable et performant pour chaque projet.</span>
                </p>
              </div>
            </div>
          </div>


        </div>
      </section >

      {/* 5. Conclusion Strong & CTA (Moved here) */}
      < section className="py-16 bg-white" >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto bg-white border-2 border-[#1F2D3D] rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1F2D3D] mb-6 font-montserrat">
              Choisir un installateur ne devrait pas être un risque.
            </h3>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Gainable.fr vous met en relation avec des professionnels rigoureusement sélectionnés, capables d’assurer un travail de qualité et une performance durable.
            </p>
            <div className="flex flex-col items-center gap-4 justify-center">
              <Link href="/trouver-installateur">
                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white text-lg font-bold px-12 py-8 rounded-full shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto">
                  Trouver un installateur
                </Button>
              </Link>
              <Link href="/inscription">
                <Button size="lg" className="bg-[#1F2D3D] hover:bg-[#2c3e50] text-white text-lg font-bold px-12 py-8 rounded-full shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto">
                  Devenir membre Expert Gainable.fr
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* BLOCK 3: Fonctionnement */}
      < section className="py-20 bg-slate-900 text-white relative overflow-hidden" >
        {/* Subtle background pattern */}
        < div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" ></div >

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-slate-400">Simple, rapide et efficace en 3 étapes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-slate-700/50 -z-10"></div>

            <div className="relative group">
              <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-amber-500 mb-6 group-hover:border-amber-500 transition-colors shadow-lg">1</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Je décris mon projet</h3>
              <p className="text-slate-400 text-sm px-4 leading-relaxed">Sélectionnez le type de travaux et votre localisation en quelques clics.</p>
            </div>
            <div className="relative group">
              <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-amber-500 mb-6 group-hover:border-amber-500 transition-colors shadow-lg">2</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Je compare les pros</h3>
              <p className="text-slate-400 text-sm px-4 leading-relaxed">Accédez aux profils détaillés : labels, avis, et photos de réalisations.</p>
            </div>
            <div className="relative group">
              <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-amber-500 mb-6 group-hover:border-amber-500 transition-colors shadow-lg">3</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Je reçois mes devis</h3>
              <p className="text-slate-400 text-sm px-4 leading-relaxed">Discutez directement avec les artisans sélectionnés et choisissez le meilleur.</p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-6 text-lg rounded-full shadow-lg shadow-amber-900/20">
              Lancer ma recherche
            </Button>
          </div>
        </div>
      </section >

      {/* Footer is now global */}
    </div >
  );
}
