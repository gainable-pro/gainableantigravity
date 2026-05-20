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
  MousePointerClick
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import EarningCalculator from "./EarningCalculator";

export const metadata = {
  title: "Commercial Indépendant B2B (SEO & Leads) | Gainable.fr",
  description: "Développez votre propre territoire commercial sur un secteur porteur (France, Suisse, Belgique). Rémunération attractive à la commission de 10% à 17%.",
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
          <ChevronRight className="w-4 h-4 rotate-180" /> Retour aux carrières
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/commercial-hero.png" 
            alt="Business Banner Background" 
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
                <Badge className="bg-[#D59B2B] text-white border-none py-1.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider">
                  🔥 Opportunité Unique
                </Badge>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/50 py-1.5 px-4 rounded-full font-bold text-xs">
                  5 Secteurs Disponibles
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Devenez <span className="text-[#D59B2B]">Commercial B2B</span> Indépendant
              </h1>

              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                Ne prenez pas un simple poste. Développez et rentabilisez votre propre territoire commercial avec une offre digitale (SEO + Leads) incontournable pour les experts CVC et diagnostiqueurs.
              </p>

              {/* Fast Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {[
                  { label: "Commission", value: "10% à 17%" },
                  { label: "Panier Moyen", value: "~650€ HT" },
                  { label: "Cycle de vente", value: "One Shot" },
                  { label: "Type d'emploi", value: "Freelance" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-[#D59B2B]">{stat.value}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Link href="/contact?subject=Candidature Commercial Indépendant" className="w-full sm:w-auto">
                  <Button className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-black py-7 px-8 rounded-2xl text-lg w-full shadow-[0_15px_30px_rgba(213,155,43,0.3)] hover:scale-105 active:scale-95 transition-all">
                    Postuler à cette offre <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                  <MousePointerClick className="w-4 h-4 text-[#D59B2B]" /> Télétravail | Horaires flexibles
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
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Detailed Job Description */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* À Propos */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm space-y-4">
              <h2 className="text-2xl font-black text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-4">
                <Users className="w-6 h-6 text-[#D59B2B]" /> À Propos de Gainable.fr
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Gainable.fr est une plateforme digitale en forte croissance spécialisée dans la mise en relation et la visibilité des professionnels du CVC (climatisation, chauffage, ventilation) et du diagnostic immobilier.
              </p>
              <p className="text-slate-600 leading-relaxed font-medium">
                Déjà présente en France, Suisse et Belgique, la plateforme s'adresse à un marché potentiel de plus de 55 000 entreprises. Notre proposition est claire : apporter une visibilité SEO locale massive et exclusive à nos abonnés, loin des solutions d'achat de leads revendues à outrance.
              </p>
            </div>

            {/* Responsabilités & Mission */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-4">
                <Briefcase className="w-6 h-6 text-[#D59B2B]" /> Vos Responsabilités
              </h2>
              <p className="text-slate-600">
                En tant que Commercial Indépendant, vous gérez votre zone commerciale comme un véritable entrepreneur :
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Prospecter activement par téléphone, LinkedIn et réseau de prescripteurs.",
                  "Identifier les opportunités sur votre zone géographique dédiée.",
                  "Présenter l’offre Gainable.fr de manière claire et percutante.",
                  "Conclure les ventes (closing en cycle court).",
                  "Gérer et fidéliser votre portefeuille d’artisans et diagnostiqueurs.",
                  "Piloter votre activité commerciale de façon moderne via le CRM fourni."
                ].map((resp, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm leading-relaxed">{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cycle de vente */}
            <div className="bg-gradient-to-br from-[#1F2D3D] to-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-2 border-b border-slate-700 pb-4">
                <Zap className="w-6 h-6 text-[#D59B2B]" /> Un Cycle de Vente Ultra-Rapide
              </h2>
              <p className="text-slate-300 text-sm">
                Pas de réunions interminables ou de comités d'achat. Le processus commercial a été épuré pour maximiser votre taux de closing dès le premier contact :
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "One Shot", desc: "La majorité des abonnements sont signés directement lors du premier entretien." },
                  { title: "Pas de Négociation", desc: "Le positionnement prix est extrêmement compétitif avec des options intégrées." },
                  { title: "Décision Directe", desc: "Vous traitez avec les gérants, décisionnaires directs de l'entreprise." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                    <h4 className="font-bold text-[#D59B2B] text-lg">{item.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ce que nous proposons */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-4">
                <ShieldCheck className="w-6 h-6 text-[#D59B2B]" /> Ce Que Nous Vous Offrons
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Activité 100% Indépendante", desc: "Vous restez maître absolu de votre emploi du temps et de votre organisation." },
                  { title: "Secteur d'Exclusivité Client", desc: "Les places sont limitées pour éviter toute concurrence directe entre nos commerciaux." },
                  { title: "CRM & Outils Offerts", desc: "Accès à notre base de données qualifiée et aux outils modernes de suivi commercial." },
                  { title: "Marché Porteur Tri-National", desc: "Opportunité de prospection continue en France, Belgique et Suisse." }
                ].map((offer, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D59B2B]" /> {offer.title}
                    </h4>
                    <p className="text-slate-500 text-xs pl-4 leading-relaxed">{offer.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar / Qualifications / Disclaimers */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Profil Recherché */}
            <Card className="rounded-3xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-black text-[#1F2D3D] border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#D59B2B]" /> Profil Recherché
                </h3>
                
                <div className="space-y-4 text-sm text-slate-700">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">Statut</p>
                    <p className="text-slate-500 text-xs">Commercial indépendant, auto-entrepreneur ou freelance.</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">Compétences clés</p>
                    <p className="text-slate-500 text-xs">Aisance avec la prospection téléphonique directe, sens du closing rapide et autonomie.</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">État d'esprit</p>
                    <p className="text-slate-500 text-xs">Mentalité d'entrepreneur, rigoureux dans l'organisation, motivé par la performance et le dépassement d'objectifs.</p>
                  </div>

                  <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-600 border-none font-semibold w-full justify-center py-2 text-xs">
                    💼 Débutants acceptés si hyper-motivés
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer & Punchline */}
            <Card className="rounded-3xl border-red-100 shadow-sm overflow-hidden bg-red-50/50">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-black text-red-800 border-b border-red-100 pb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" /> Warning Recrutement
                </h3>
                
                <div className="space-y-4 text-xs leading-relaxed text-red-900">
                  <p>
                    <strong>Cette opportunité n'est pas pour vous si :</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Vous recherchez le confort et la sécurité d'un salaire fixe ou d'un CDI de bureau.</li>
                    <li>Vous avez du mal à vous auto-discipliner sans manager sur le dos.</li>
                    <li>Vous n'aimez pas prospecter à froid (téléphone, cold emailing).</li>
                  </ul>

                  <div className="bg-white/60 p-3 rounded-xl border border-red-100/80 mt-4 text-[11px] font-medium">
                    ⚠️ <em>« Si vous recherchez un cadre rassurant et figé, passez votre chemin. Notre équipe ne retient que des profils ambitieux qui veulent bâtir un vrai business. »</em>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rémunération Potentielle Quick-look */}
            <Card className="rounded-3xl border-emerald-100 shadow-sm overflow-hidden bg-emerald-50/30">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-black text-emerald-800 border-b border-emerald-100 pb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" /> Niveaux de Gains Constatés
                </h3>
                
                <div className="space-y-4 text-xs text-emerald-900 font-medium">
                  <div className="flex justify-between items-center border-b border-emerald-100/50 pb-2">
                    <span>Phase de démarrage</span>
                    <span className="font-bold text-sm text-emerald-700">~2 000 € / mois</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-emerald-100/50 pb-2">
                    <span>Bon rythme de croisière</span>
                    <span className="font-bold text-sm text-emerald-700">~4 000 € / mois</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span>Profil performant & expert</span>
                    <span className="font-bold text-sm text-[#D59B2B] text-lg">8 000 € et + / mois</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 bg-[#1F2D3D] text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(213,155,43,0.4),transparent_60%)]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Prêt à Récupérer Votre Secteur Exclusif ?
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Les candidatures sont examinées sous 48h. Définissez votre plan de développement sur votre territoire et lancez votre business avec Gainable.fr.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact?subject=Candidature Commercial Indépendant">
              <Button size="lg" className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-black py-8 px-12 rounded-2xl text-xl shadow-2xl transition-all hover:scale-105">
                DEVENIR COMMERCIAL INDÉPENDANT
              </Button>
            </Link>
          </div>
          <p className="text-slate-400 text-xs font-semibold">
            Activité 100% Freelance | 0 Fixe - 100% Commissions Elevées
          </p>
        </div>
      </section>
    </div>
  );
}
