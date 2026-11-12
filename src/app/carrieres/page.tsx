import { 
  Users, 
  Target, 
  Zap, 
  MapPin, 
  Rocket, 
  Code, 
  Search, 
  ArrowRight,
  CheckCircle2,
  Globe,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Star,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Carrières & Recrutement | Gainable.fr",
    description: "Rejoignez l'équipe Gainable.fr. Découvrez nos opportunités de carrière et participez au futur de la climatisation gainable.",
    alternates: {
        canonical: "https://www.gainable.fr/carrieres",
    },
};

export default function CareersPage() {
  const positions = [
    {
      title: "Consultant / Commercial B2B Indépendant — SaaS & Digital BTP (H/F)",
      location: "Télétravail (France entière)",
      type: "Indépendant / Freelance",
      description: "Prospection ciblée (Cold Call) et démonstration de valeur auprès des gérants d'entreprises CVC, diagnostiqueurs et bureaux d'études.",
      icon: <Users className="w-6 h-6 text-[#D59B2B]" />,
      perks: ["10% à 17% HT de commission", "Formules 750€ & 1 200€ HT", "Réévaluation après 1 mois"],
      detailsUrl: "/carrieres/commercial-independant"
    },
    {
      title: "Expert SEO / Data Strategist",
      location: "Remote / Lille",
      type: "Temps plein",
      description: "Vous pilotez la stratégie de visibilité de nos 800+ articles et assurez la croissance organique du groupe.",
      icon: <Search className="w-6 h-6 text-emerald-500" />,
      perks: ["Gros volume de données", "Outils IA avancés", "Flexibilité totale"]
    },
    {
      title: "Web Designer UI/UX",
      location: "Lille / Hybride",
      type: "Temps plein",
      description: "Vous concevez des interfaces épurées et sexy pour nos applications métiers et nos portails clients.",
      icon: <Code className="w-6 h-6 text-purple-500" />,
      perks: ["Projets variés", "Liberté créative", "Stack moderne"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-[#1F2D3D]">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(213,155,43,0.3),transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white border-none py-2 px-6 rounded-full text-sm font-bold tracking-widest uppercase">
              Opportunité Indépendante
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
              Développement Commercial <br />
              <span className="text-[#D59B2B]">Gainable.fr</span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed font-medium">
              Rejoignez une plateforme déjà structurée avec plus de 5000 pages indexées et un potentiel de 72 000 entreprises sur 3 pays.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/carrieres/commercial-independant">
                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-black py-8 px-10 rounded-2xl text-xl w-full sm:w-auto shadow-[0_20px_50px_rgba(213,155,43,0.3)] transition-all hover:scale-105 active:scale-95">
                  DEVENIR CONSULTANT
                </Button>
              </Link>
              <div className="flex flex-col items-start gap-1 text-left">
                <span className="text-white font-bold flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#D59B2B] fill-[#D59B2B]" /> 1 an de phase de test réussie
                </span>
                <span className="text-slate-400 text-sm">Refonte complète effectuée en Janvier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Potential Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { country: "France", potential: "44 000", companies: "Entreprises CVC & Diag", flag: "🇫🇷" },
            { country: "Suisse", potential: "18 000", companies: "Entreprises CVC & Diag", flag: "🇨🇭" },
            { country: "Belgique", potential: "10 000", companies: "Entreprises CVC & Diag", flag: "🇧🇪" },
          ].map((stat, i) => (
            <div key={i} className="bg-white border-2 border-slate-50 rounded-3xl p-8 shadow-2xl transition-transform hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{stat.flag}</span>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.country}</span>
              </div>
              <p className="text-4xl font-black text-[#1F2D3D] mb-1">{stat.potential}</p>
              <p className="text-sm font-medium text-slate-500">{stat.companies}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why the Project? */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <Badge variant="outline" className="mb-6 border-[#D59B2B] text-[#D59B2B] font-bold px-4 py-1">LE CONSTAT TERRAIN</Badge>
            <h2 className="text-4xl font-black text-[#1F2D3D] mb-8 leading-tight">
              Gainable.fr n'est pas né dans un bureau, mais sur le terrain.
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Target className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Le problème identifié</h4>
                  <p className="text-slate-500 leading-relaxed">
                    Des clients perdus face à des devis incomparables, des normes non respectées et des plateformes qui privilégient le volume au détriment de la qualité.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Notre solution</h4>
                  <p className="text-slate-500 leading-relaxed">
                    Une plateforme qui valorise les PME et experts qualifiés, correctement assurés, investissant dans leurs compétences et respectant les règles du métier.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#D59B2B] rounded-[3rem] rotate-3 translate-x-4 translate-y-4 opacity-10" />
            <img 
              src="/images/gainable-team-business.jpg" 
              alt="Réunion équipe commerciale" 
              className="relative z-10 rounded-[3rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 object-cover w-full h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Commission Structure (THE GRID) */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6">Un système de commission par palier évolutif</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Votre taux de commission (10%, 13% ou 17% HT) est attribué selon votre profil et votre expérience, avec une réévaluation systématique au bout de 1 mois d'activité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            {[
              { level: "Palier Débutant", count: "Profil junior / apprentissage", rate: "10% HT", color: "bg-slate-800 border border-emerald-500/30", comm1200: "120 € HT / vente" },
              { level: "Palier Confirmé", count: "Expérience commerciale B2B", rate: "13% HT", color: "bg-slate-800 border border-blue-500/40", comm1200: "156 € HT / vente" },
              { level: "Palier Expert", count: "Top closer autonome", rate: "17% HT", color: "bg-gradient-to-br from-[#D59B2B]/20 to-slate-800 border-2 border-[#D59B2B]", text: "text-white", comm1200: "204 € HT / vente" },
            ].map((lvl, i) => (
              <div key={i} className={`${lvl.color} rounded-2xl p-6 text-center shadow-lg transform transition-transform hover:scale-105 space-y-2`}>
                <p className="text-xs font-bold uppercase tracking-widest text-[#D59B2B]">{lvl.level}</p>
                <p className={`text-3xl font-black ${lvl.text || 'text-white'}`}>{lvl.rate}</p>
                <p className="text-xs text-slate-300 font-medium">{lvl.count}</p>
                <p className="text-xs font-bold text-emerald-400">{lvl.comm1200}</p>
                <Badge variant="outline" className="border-white/20 text-slate-300 text-[10px] font-bold mt-2">
                  Réévaluation à 1 mois
                </Badge>
              </div>
            ))}
          </div>

          {/* Revenue Projection Table */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="px-8 py-6 font-bold uppercase tracking-wider">Ventes / jour</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-wider">CA HT / jour</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-wider text-[#D59B2B]">Commission / jour</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-wider">Commission mensuelle</th>
                  </tr>
                </thead>
                <tbody className="text-white divide-y divide-white/5 font-medium">
                  {[
                    { count: "1", ca: "1 200 €", comm: "120 €", monthly: "2 400 €" },
                    { count: "2", ca: "2 400 €", comm: "288 €", monthly: "5 760 €" },
                    { count: "3", ca: "3 600 €", comm: "468 €", monthly: "9 360 €" },
                    { count: "4", ca: "4 800 €", comm: "720 €", monthly: "14 400 €" },
                    { count: "5", ca: "6 000 €", comm: "1 020 €", monthly: "20 400 €" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6 font-black text-xl">{row.count}</td>
                      <td className="px-8 py-6 text-slate-400">{row.ca}</td>
                      <td className="px-8 py-6 text-2xl font-black text-[#D59B2B]">{row.comm}</td>
                      <td className="px-8 py-6 bg-white/5 font-black text-emerald-400">{row.monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center text-slate-500 text-xs mt-8">* Basé sur 20 jours de prospection / mois. Tarif de référence Expert CVC de 1 200€ HT.</p>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Postes actuellement ouverts</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Nous recherchons des talents passionnés pour nous aider à structurer le réseau national Gainable.fr.
          </p>
        </div>

        <div className="grid gap-8">
          {positions.map((pos, i) => (
            <Card key={i} className="group hover:border-[#D59B2B] transition-all duration-300 border-slate-100 shadow-sm hover:shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-[#D59B2B]/10 transition-colors">
                        {pos.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{pos.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {pos.location}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {pos.type}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {pos.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pos.perks.map((perk, j) => (
                        <Badge key={j} variant="secondary" className="bg-slate-50 text-slate-600 border-none font-medium">
                          {perk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {pos.detailsUrl ? (
                      <>
                        <Link href={pos.detailsUrl} className="w-full sm:w-auto">
                          <Button className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white px-8 py-6 rounded-xl font-bold transition-all w-full">
                            Découvrir l'offre
                          </Button>
                        </Link>
                        <Link href={`/contact?subject=Candidature ${pos.title}`} className="w-full sm:w-auto">
                          <Button variant="outline" className="border-slate-200 hover:border-[#D59B2B] hover:bg-[#D59B2B]/10 hover:text-[#D59B2B] px-8 py-6 rounded-xl font-bold transition-all w-full">
                            Postuler
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href={`/contact?subject=Candidature ${pos.title}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="border-slate-200 hover:border-[#D59B2B] hover:bg-[#D59B2B] hover:text-white px-8 py-6 rounded-xl font-bold transition-all w-full">
                          Postuler à l'offre
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Points Forts de l'offre Artisan (Selling Points) */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-20">Pourquoi vos clients vont adorer Gainable.fr ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "0 Commission", desc: "Zéro commission prélevée sur les chantiers des artisans.", icon: <DollarSign /> },
              { title: "Agent IA SEO", desc: "Génération automatique de contenu optimisé pour leur ville.", icon: <Search /> },
              { title: "Visibilité Exclusive", desc: "Une présence forte et locale garantie par département.", icon: <Globe /> },
              { title: "Leads Qualifiés", desc: "Aucune revente de leads à la concurrence acharnée.", icon: <Users /> },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-slate-900 text-[#D59B2B] rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-5xl font-black text-[#1F2D3D] mb-10 tracking-tight">
          Prêt à rejoindre le réseau national Gainable ?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact?subject=Candidature Spontanée">
            <Button size="lg" className="bg-[#1F2D3D] hover:bg-slate-800 text-white font-black py-8 px-12 rounded-2xl text-xl shadow-2xl transition-all hover:scale-105">
              POSTULER MAINTENANT
            </Button>
          </Link>
          <Link href="/commercial/login">
            <Button variant="outline" size="lg" className="border-2 border-slate-200 py-8 px-12 rounded-2xl text-xl font-bold hover:bg-slate-50">
              ACCÈS COMMERCIAL
            </Button>
          </Link>
        </div>
        <p className="mt-10 text-slate-400 font-medium">Réponse garantie sous 48h par notre équipe recrutement.</p>
      </section>

      <footer className="py-10 border-t border-slate-100 text-center bg-white">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Gainable.fr Group – Opportunité de développement national.
        </p>
      </footer>
    </div>
  );
}
