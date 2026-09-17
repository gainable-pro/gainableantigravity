import { 
  CheckCircle2, 
  Zap, 
  Briefcase, 
  Users, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  MapPin, 
  Smartphone, 
  ArrowRight,
  ChevronRight,
  MousePointerClick,
  RefreshCw,
  Award,
  Sparkles,
  PhoneCall,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import EarningCalculator from "./EarningCalculator";

export const metadata = {
  title: "Consultant / Commercial B2B Indépendant — SaaS & Digital BTP (H/F) | Gainable.fr",
  description: "Offre d'emploi Consultant Commercial B2B Indépendant. EXCEED DIGITAL SAS (Gainable.fr). Commission Fixe 17% HT + 12% récurrent annuel au renouvellement sur abonnements 750€ & 850€ HT.",
  alternates: {
    canonical: "https://www.gainable.fr/carrieres/commercial-independant",
  },
};

export default function CommercialJobPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link 
          href="/carrieres" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#D59B2B] transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Retour aux opportunités de carrières
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/gainable-fr-climatisation-espace-commercial-hero.png" 
            alt="Commercial B2B SaaS Banner" 
            fill
            priority
            className="object-cover object-center opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F2D3D]/95 via-[#1F2D3D]/90 to-slate-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-white">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Main Presentation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[#D59B2B] text-white border-none py-1.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-md">
                  🔥 Offre Indépendant / Freelance
                </Badge>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/50 py-1.5 px-4 rounded-full font-bold text-xs">
                  Taux Fixe 17% HT
                </Badge>
                <Badge variant="outline" className="text-blue-300 border-blue-400/40 py-1.5 px-4 rounded-full font-bold text-xs">
                  EXCEED DIGITAL SAS
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Consultant / Commercial B2B Indépendant <br />
                <span className="text-[#D59B2B]">SaaS & Digital BTP (H/F)</span>
              </h1>

              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Proposez la 1ère plateforme nationale de visibilité et référencement Google dédiée aux spécialistes CVC, pompes à chaleur, climatisation gainable, bureaux d'études et diagnostiqueurs immobiliers.
              </p>

              {/* Fast Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { label: "Commission Directe", value: "17% HT Fixe" },
                  { label: "Récurrent Annuel", value: "12% / an" },
                  { label: "Formules HT", value: "750€ & 850€" },
                  { label: "Mode de Travail", value: "Télétravail 100%" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-center">
                    <p className="text-xl font-black text-[#D59B2B]">{stat.value}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-4">
                <Link href="/contact?subject=Candidature Consultant Commercial B2B" className="w-full sm:w-auto">
                  <Button className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-black py-7 px-8 rounded-2xl text-lg w-full shadow-[0_15px_30px_rgba(213,155,43,0.3)] hover:scale-105 active:scale-95 transition-all">
                    Postuler à cette offre <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <span className="text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4 text-[#D59B2B]" /> Candidature gratuite — Aucun frais candidat
                </span>
              </div>
            </div>

            {/* Calculator Card */}
            <div className="lg:col-span-5">
              <EarningCalculator />
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Detailed Job Description */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* À Propos d'EXCEED DIGITAL & Gainable.fr */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF8ED] text-[#D59B2B] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1F2D3D]">À propos d'EXCEED DIGITAL & Gainable.fr</h2>
                  <p className="text-xs text-slate-400 font-medium">Éditeur logiciel SaaS & Plateforme nationale B2B</p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                <strong>EXCEED DIGITAL SAS</strong> est une société spécialisée dans la digitalisation et la visibilité numérique des entreprises du bâtiment et de l'énergie.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Nous éditons <strong>Gainable.fr</strong>, la 1ère plateforme nationale de mise en relation et de référencement dédiée aux spécialistes de la climatisation réversible, des pompes à chaleur, des systèmes gainables, des bureaux d'études thermiques et des diagnostiqueurs immobiliers.
              </p>
              <div className="bg-[#FFF8ED] border border-[#D59B2B]/20 rounded-2xl p-4 text-xs md:text-sm text-slate-700 space-y-1">
                <p className="font-bold text-[#D59B2B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Notre Mission :
                </p>
                <p className="text-slate-600 font-medium">
                  Apporter la preuve irréfutable de visibilité sur Google aux professionnels du secteur et leur générer des opportunités d'affaires qualifiées sur leur zone d'intervention.
                </p>
              </div>
            </div>

            {/* Le Poste & Les Missions */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1F2D3D]">Le Poste & Les Missions</h2>
                  <p className="text-xs text-slate-400 font-medium">Ambassadeur de la plateforme Gainable.fr auprès des gérants B2B</p>
                </div>
              </div>

              <p className="text-slate-600 text-sm md:text-base">
                En tant que <strong>Consultant / Commercial B2B Indépendant</strong>, vous êtes l'interlocuteur clé auprès des dirigeants et professionnels du secteur. Vous intervenez sur un cycle de vente court auprès d'une cible professionnelle identifiée (B2B) :
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  {
                    title: "Prospection ciblée (Cold Call / Téléprospection)",
                    desc: "Prise de contact directe avec les gérants d'entreprises CVC, diagnostiqueurs immobiliers et bureaux d'études thermiques.",
                    icon: <PhoneCall className="w-5 h-5 text-blue-500" />
                  },
                  {
                    title: "Démonstration de valeur (Démo Express 3 min)",
                    desc: "Montrer en direct au prospect sa présence exacte sur Google et lui apporter la preuve immédiate de l'impact de notre plateforme sur sa visibilité locale.",
                    icon: <Zap className="w-5 h-5 text-[#D59B2B]" />
                  },
                  {
                    title: "Commercialisation de la solution SaaS",
                    desc: "Vente des formules d'abonnements annuels de visibilité et référencement (750 € HT & 850 € HT).",
                    icon: <Award className="w-5 h-5 text-emerald-500" />
                  },
                  {
                    title: "Fidélisation & Suivi client",
                    desc: "Maintien d'une relation de confiance avec votre portefeuille pour assurer le renouvellement annuel et percevoir vos 12% récurrents.",
                    icon: <RefreshCw className="w-5 h-5 text-purple-500" />
                  }
                ].map((mission, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2 hover:border-[#D59B2B]/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      {mission.icon}
                      <h4 className="font-bold text-slate-900 text-sm">{mission.title}</h4>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed pl-7">{mission.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rémunération & Avantages */}
            <div className="bg-gradient-to-br from-[#1F2D3D] via-[#1F2D3D] to-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D59B2B]/20 text-[#D59B2B] flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Rémunération & Avantages Attractifs</h2>
                  <p className="text-xs text-slate-400 font-medium">Taux Fixe 17% HT + 12% Récurrent Annuel au Renouvellement</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#D59B2B]">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="font-black text-lg">17% HT Commission Directe Fixe</h4>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Sur chaque abonnement commercialisé (750 € HT ou 850 € HT), vous percevez un taux fixe immédiat de <strong>17% HT</strong> dès la première vente.
                  </p>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <RefreshCw className="w-5 h-5" />
                    <h4 className="font-black text-lg">12% HT Récurrent Annuel</h4>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong>Revenu Récurrent Rentrable :</strong> Vos commissions sont renouvelées à <strong>12% HT</strong> chaque année lors du réabonnement de vos clients sur la 2ème année et les suivantes ! Vous vous constituez un revenu récurrent automatique.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {[
                  { title: "Plafond de gains libre", desc: "Possibilité de générer de 3 000 € à 8 000 €+ / mois selon vos performances." },
                  { title: "Outils & Formation fournis", desc: "Fichiers qualifiés, scripts de vente, argumentaires de démo et accompagnement continu." },
                  { title: "Flexibilité totale", desc: "Travaillez d'où vous voulez (100% télétravail), quand vous voulez en toute liberté." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                    <p className="font-bold text-[#D59B2B] text-xs">{item.title}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tableau des Formules & Commissions (750€ & 850€ HT) */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/70 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-[#1F2D3D]">Tableau des Commissions & Formules HT</h2>
                  <p className="text-xs text-slate-400 font-medium">Formules d'abonnements 750 € HT et 850 € HT à 17% HT de commission fixe</p>
                </div>
                <Badge className="bg-[#D59B2B] text-white font-bold text-xs">Taux Fixe 17% HT</Badge>
              </div>

              {/* Formules presentation cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2 text-center">
                  <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 border-none font-bold text-[10px] uppercase">
                    Formule Standard
                  </Badge>
                  <p className="text-3xl font-black text-[#1F2D3D]">750 € HT</p>
                  <div className="pt-2 text-xs text-slate-600 font-medium space-y-1 border-t border-slate-200/60">
                    <p className="text-[#D59B2B] font-bold text-sm">Commission Directe (17%) : 127,50 € HT / vente</p>
                    <p className="text-emerald-600 font-semibold">Récurrent Année 2+ (12%) : 90,00 € HT / an</p>
                  </div>
                </div>

                <div className="bg-[#1F2D3D] text-white border border-[#D59B2B] rounded-2xl p-5 space-y-2 text-center shadow-lg">
                  <Badge className="bg-[#D59B2B] text-white border-none font-bold text-[10px] uppercase">
                    Formule Premium
                  </Badge>
                  <p className="text-3xl font-black text-[#D59B2B]">850 € HT</p>
                  <div className="pt-2 text-xs text-slate-300 font-medium space-y-1 border-t border-slate-700">
                    <p className="text-[#D59B2B] font-bold text-sm">Commission Directe (17%) : 144,50 € HT / vente</p>
                    <p className="text-emerald-400 font-semibold">Récurrent Année 2+ (12%) : 102,00 € HT / an</p>
                  </div>
                </div>
              </div>

              {/* Simulation Details Table */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/70 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                        <th className="px-6 py-4 font-bold">Ventes / jour (20j/m)</th>
                        <th className="px-6 py-4 font-bold">CA Formule 750 € HT</th>
                        <th className="px-6 py-4 font-bold text-[#D59B2B]">Com. Mensuelle (750€)</th>
                        <th className="px-6 py-4 font-bold">CA Formule 850 € HT</th>
                        <th className="px-6 py-4 font-bold text-emerald-600">Com. Mensuelle (850€)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                      {[
                        { count: "1 vente / j", ca750: "15 000 €", comm750: "2 550 € HT", ca850: "17 000 €", comm850: "2 890 € HT" },
                        { count: "2 ventes / j", ca750: "30 000 €", comm750: "5 100 € HT", ca850: "34 000 €", comm850: "5 780 € HT" },
                        { count: "3 ventes / j", ca750: "45 000 €", comm750: "7 650 € HT", ca850: "51 000 €", comm850: "8 670 € HT" },
                        { count: "4 ventes / j", ca750: "60 000 €", comm750: "10 200 € HT", ca850: "68 000 €", comm850: "11 560 € HT" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-100/60 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{row.count}</td>
                          <td className="px-6 py-4 text-slate-500">{row.ca750}</td>
                          <td className="px-6 py-4 font-black text-[#D59B2B]">{row.comm750}</td>
                          <td className="px-6 py-4 text-slate-500">{row.ca850}</td>
                          <td className="px-6 py-4 font-black text-emerald-600 bg-emerald-50/50">{row.comm850}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-center text-slate-400 text-xs">
                * Taux fixe de 17% HT calculé sur 20 jours de prospection par mois + 12% HT récurrent annuel lors du renouvellement des abonnements.
              </p>
            </div>

          </div>

          {/* Sidebar / Profil & Candidate Info */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Profil Recherché */}
            <Card className="rounded-3xl border-slate-200/70 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-black text-[#1F2D3D] border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#D59B2B]" /> Profil Recherché
                </h3>
                
                <div className="space-y-4 text-xs md:text-sm text-slate-700">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Fibre commerciale développée
                    </p>
                    <p className="text-slate-500 text-xs pl-5">
                      Aisance téléphonique, pugnacité, capacité à capter l'attention en cold call et à fermer des ventes rapidement (closing).
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Autonomie & Organisation
                    </p>
                    <p className="text-slate-500 text-xs pl-5">
                      Maître de votre temps et de votre planning. Vous savez structurer votre journée de prospection en toute indépendance.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Sens du conseil B2B
                    </p>
                    <p className="text-slate-500 text-xs pl-5">
                      Capacité à échanger d'égal à égal avec des gérants du BTP, des ingénieurs d'études ou des diagnostiqueurs.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 space-y-1.5">
                    <p className="font-bold text-[#D59B2B] text-xs uppercase tracking-wider">Les + appréciés :</p>
                    <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                      <li>Connaissance du BTP, de la climatisation / PAC ou de l'immobilier.</li>
                      <li>Sensibilité aux enjeux du Digital, du SEO et du GEO (Google Maps local).</li>
                      <li>Prospection téléphonique : 2 ans d'expérience recommandée.</li>
                    </ul>
                  </div>

                  <Badge className="bg-[#D59B2B]/10 text-[#D59B2B] border-none font-bold w-full justify-center py-2 text-xs">
                    🏆 Candidature ouverte à tous les indépendants motivés
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Summary Card */}
            <Card className="rounded-3xl border-slate-200/70 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-black text-[#1F2D3D] border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Synthèse du Poste
                </h3>
                
                <div className="space-y-3 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Société</span>
                    <span className="font-bold text-slate-900">EXCEED DIGITAL SAS</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Plateforme</span>
                    <span className="font-bold text-[#D59B2B]">Gainable.fr</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Formules</span>
                    <span className="font-bold text-slate-900">750 € & 850 € HT</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Commission Fixe</span>
                    <span className="font-bold text-[#D59B2B]">17 % HT / vente</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Récurrent Annuel</span>
                    <span className="font-bold text-emerald-600">12 % HT au renouvellement</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Frais candidat</span>
                    <span className="font-bold text-blue-600">0 € (Outils fournis)</span>
                  </div>
                </div>

                <Link href="/contact?subject=Candidature Consultant Commercial B2B" className="block pt-2">
                  <Button className="w-full bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-bold py-3 rounded-xl text-sm">
                    Postuler directement
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Disclaimer & Mentalité */}
            <Card className="rounded-3xl border-red-100 shadow-sm overflow-hidden bg-red-50/40">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-black text-red-800 border-b border-red-100 pb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" /> Informations Candidats
                </h3>
                
                <div className="space-y-3 text-xs leading-relaxed text-red-900 font-medium">
                  <p>
                    Ce poste s'adresse exclusivement aux professionnels indépendants autonomes souhaitant bâtir leur propre chiffre d'affaires.
                  </p>
                  <p className="text-[11px] text-red-700 italic">
                    Aucun droit d'entrée ni frais de matériel. Fichiers de prospection, argumentaires, démos et accès CRM pris en charge par EXCEED DIGITAL SAS.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </section>

      {/* Call to action section */}
      <section className="py-16 md:py-20 bg-[#1F2D3D] text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(213,155,43,0.4),transparent_60%)]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <Badge className="bg-[#D59B2B] text-white border-none py-1.5 px-4 rounded-full font-bold text-xs uppercase">
            Recrutement Ouvert
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Prêt à Développer Votre Activité Commerciale B2B ?
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Rejoignez EXCEED DIGITAL SAS et développez le réseau Gainable.fr auprès des gérants du bâtiment et de l'énergie.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact?subject=Candidature Consultant Commercial B2B">
              <Button size="lg" className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-black py-7 px-10 rounded-2xl text-lg shadow-2xl transition-all hover:scale-105">
                POSTULER COMME CONSULTANT COMMERCIAL (H/F)
              </Button>
            </Link>
          </div>
          <p className="text-slate-400 text-xs font-semibold pt-2">
            100% Indépendant | 17% HT Fixe + 12% Récurrent Annuel | Formules 750€ & 850€ HT
          </p>
        </div>
      </section>
    </div>
  );
}
