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
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CareersPage() {
  const positions = [
    {
      title: "Commercial Indépendant / Consultant",
      location: "National (France)",
      type: "Temps plein / Indépendant",
      description: "Vous prospectez et accompagnez les professionnels de la climatisation (CVC) dans leur transformation digitale.",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      perks: ["Commissions élevées", "Outils de CRM offerts", "Formation continue"]
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
      <section className="relative pt-24 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(213,155,43,0.2),transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-4 bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white border-none py-1.5 px-4 rounded-full">
            NOUS RECRUTONS
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Rejoignez l'aventure <span className="text-[#D59B2B]">Gainable.fr</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Nous construisons le futur de la climatisation connectée en France. Rejoignez un groupe ambitieux en pleine expansion nationale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-bold py-7 px-8 rounded-2xl text-lg w-full sm:w-auto transition-all hover:scale-105">
              Voir les postes ouverts
            </Button>
            <Link href="/pourquoi-gainable" className="text-white hover:text-[#D59B2B] font-medium flex items-center gap-2 transition-colors">
              Découvrir notre mission <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Group Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Commerciaux", value: "25+", icon: <Users className="w-5 h-5" /> },
            { label: "Couverture Nationale", value: "100%", icon: <MapPin className="w-5 h-5" /> },
            { label: "Experts Référencés", value: "1,200+", icon: <CheckCircle2 className="w-5 h-5" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#D59B2B]">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section className="py-24 max-w-7xl mx-auto px-4">
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
                  <div className="shrink-0">
                    <Button variant="outline" className="border-slate-200 hover:border-[#D59B2B] hover:bg-[#D59B2B] hover:text-white px-8 py-6 rounded-xl font-bold transition-all">
                      Postuler à l'offre
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Group Vision */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D59B2B]/10 rounded-full blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Équipe Gainable" 
                className="rounded-3xl shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                Bien plus qu'une plateforme, <br />un réseau national uni.
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Indépendance & Liberté", text: "Gérez votre temps et vos prospects avec une totale liberté d'action." },
                  { title: "Rémunération Attractive", text: "Un système de commissions transparent et sans plafond de revenus." },
                  { title: "Technologie Propriétaire", text: "Utilisez nos outils IA exclusifs pour booster votre efficacité." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-black text-slate-900 mb-6">
          Prêt à disrupter le marché avec nous ?
        </h2>
        <p className="text-lg text-slate-500 mb-10">
          Nous sommes toujours à la recherche de profils passionnés, même si vous ne voyez pas d'offre correspondante.
        </p>
        <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-7 px-12 rounded-2xl text-lg shadow-2xl transition-all hover:scale-105">
          Candidature Spontanée
        </Button>
      </section>

      {/* Footer minimal pour la page */}
      <footer className="py-10 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Gainable.fr Group. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
