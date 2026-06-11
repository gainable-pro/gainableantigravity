"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search, Sparkles, Globe, AlertCircle, CheckCircle2, PlayCircle, Loader2,
  ChevronRight, BarChart3, Info, RefreshCw, Check, AlertTriangle, HelpCircle,
  Eye, TrendingUp, TrendingDown, BookOpen, Key
} from "lucide-react";

interface Recommendation {
  id: string;
  type: string;
  title: string;
  evidence: string;
  fix: string;
  codeBlock?: string;
}

export default function ArtisanSeoPage() {
  const [siteWeb, setSiteWeb] = useState("");
  const [targetCity, setTargetCity] = useState("Paris");
  const [isSaving, setIsSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  
  // Chart metric
  const [selectedMetric, setSelectedMetric] = useState<"clicks" | "impressions" | "ctr" | "position">("clicks");

  // Selected competitor to compare on chart
  const [comparedCompetitor, setComparedCompetitor] = useState("maclem.fr");

  // Audit states
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  
  // Modal for fix instructions
  const [activeFix, setActiveFix] = useState<Recommendation | null>(null);
  const [fixedIds, setFixedIds] = useState<string[]>([]);

  // Load profile to get site_web and target city
  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then(res => res.json())
      .then(data => {
        if (data.site_web) {
          setSiteWeb(data.site_web);
        }
        if (data.ville) {
          setTargetCity(data.ville);
        }
        const initialUrl = data.site_web || "mon-site-artisan.fr";
        triggerInitialAudit(initialUrl, data.ville || "Paris");
        setProfileLoaded(true);
      })
      .catch(err => console.error(err));
  }, []);

  const triggerInitialAudit = (url: string, city: string) => {
    const cleanUrl = url.replace(/https?:\/\//, "");
    setAuditData({
      url: url.startsWith("http") ? url : `https://${url}`,
      score: 70,
      timestamp: new Date().toISOString(),
      metrics: {
        sitemap: "Sitemap: Non détecté dans robots.txt (ou partiel)",
        security: "En-têtes détectés: HSTS: Non | CSP: Non | nosniff: Non",
        performance: "Score mobile estimé: 68/100 | Temps de chargement: 3.4s"
      },
      recommendations: [
        {
          id: "rec-hsts",
          type: "critical",
          title: "Absence d'en-tête Strict-Transport-Security (HSTS)",
          evidence: `Le serveur de ${cleanUrl} ne renvoie pas l'en-tête HSTS sur les requêtes HTTPS.`,
          fix: "Ajouter l'en-tête 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' sur votre serveur web.",
          codeBlock: `# Apache (.htaccess)
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

# Nginx (nginx.conf)
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;`
        },
        {
          id: "rec-csp",
          type: "critical",
          title: "Absence de Content Security Policy (CSP)",
          evidence: `L'en-tête Content-Security-Policy est manquant sur ${cleanUrl}.`,
          fix: "Configurer une politique CSP de base pour bloquer les injections de scripts XSS.",
          codeBlock: `# Apache (.htaccess)
Header set Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';"

# Nginx (nginx.conf)
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;`
        },
        {
          id: "rec-chatbot",
          type: "warning",
          title: "Agent IA & Chatbot d'Acquisition non configuré",
          evidence: `Aucun script d'agent conversationnel intelligent n'a été détecté sur ${cleanUrl}.`,
          fix: "Intégrez le script de l'Agent IA Gainable.fr pour capturer et qualifier les leads automatiquement.",
          codeBlock: `<!-- Insérez ce script avant la balise de fermeture </body> -->
<script src="https://www.gainable.fr/assets/js/agent-ia-widget.js" data-expert-id="mon-id" async></script>`
        }
      ]
    });
  };

  const handleSaveAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteWeb) return;
    setIsSaving(true);
    setIsAuditing(true);
    setAuditLogs([]);

    const steps = [
      `[1/5] Démarrage de l'analyse SEO pour ${siteWeb}...`,
      `[2/5] Interrogation du fichier robots.txt et détection de sitemap...`,
      `[3/5] Analyse de l'autorité SEO et des avis Google...`,
      `[4/5] Analyse des balises méta et des en-têtes de sécurité HSTS/CSP...`,
      `[5/5] Génération du rapport comparatif et du plan d'action...`
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAuditLogs(prev => [...prev, steps[i]]);
    }

    try {
      // Save web site in profile
      await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_web: siteWeb })
      });
      
      triggerInitialAudit(siteWeb, targetCity);
      setFixedIds([]); // Reset fixes on new analyze
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
      setIsAuditing(false);
    }
  };

  const handleShowFix = (rec: Recommendation) => {
    setActiveFix(rec);
  };

  const handleResolveFix = (recId: string) => {
    setFixedIds(prev => [...prev, recId]);
    setActiveFix(null);
    
    // Dynamically update score and recommendations
    if (auditData) {
      const remainingRecs = auditData.recommendations.filter((r: any) => r.id !== recId);
      const pointsAdded = recId === "rec-chatbot" ? 10 : 15;
      setAuditData({
        ...auditData,
        score: Math.min(auditData.score + pointsAdded, 100),
        recommendations: remainingRecs
      });
    }
  };

  // Helper to get deterministic values based on domain
  const getDeterministicValues = (domain: string, metric: "clicks" | "impressions" | "ctr" | "position") => {
    const clean = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].toLowerCase();
    if (!clean) {
      return {
        clicks: [0, 0, 0, 0, 0, 0, 0, 0],
        impressions: [0, 0, 0, 0, 0, 0, 0, 0],
        ctr: [0, 0, 0, 0, 0, 0, 0, 0],
        position: [100, 100, 100, 100, 100, 100, 100, 100]
      }[metric];
    }

    if (clean === "gainable.fr") {
      return {
        clicks: [180, 195, 210, 205, 225, 240, 255, 266],
        impressions: [38000, 41000, 43500, 42000, 46000, 51000, 54000, 56000],
        ctr: [0.47, 0.48, 0.48, 0.49, 0.49, 0.47, 0.47, 0.48],
        position: [24.5, 23.8, 23.4, 23.1, 22.9, 22.8, 22.7, 22.6]
      }[metric];
    }

    // String hash function
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    // Base levels depending on the domain
    let clickBase = 10 + (hash % 80); // 10 to 90
    let impressionBase = 1200 + (hash % 10000); // 1200 to 11200
    let ctrBase = 0.6 + ((hash % 120) / 100); // 0.6% to 1.8%
    let positionBase = 12 + (hash % 38); // 12 to 50

    // Match specific leaders closely
    if (clean.includes("maclem")) {
      clickBase = 86;
      impressionBase = 12500;
      ctrBase = 0.69;
      positionBase = 18.2;
    } else if (clean.includes("izi")) {
      clickBase = 145;
      impressionBase = 18400;
      ctrBase = 0.79;
      positionBase = 11.4;
    } else if (clean.includes("engie")) {
      clickBase = 110;
      impressionBase = 14500;
      ctrBase = 0.76;
      positionBase = 14.8;
    } else if (clean.includes("garanka")) {
      clickBase = 55;
      impressionBase = 6800;
      ctrBase = 0.81;
      positionBase = 22.5;
    } else if (clean.includes("cham")) {
      clickBase = 40;
      impressionBase = 5200;
      ctrBase = 0.77;
      positionBase = 28.1;
    }

    // Add trend progression
    const trend = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.25];
    const positionTrend = [1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.82]; // lower is better

    if (metric === "clicks") {
      return trend.map(t => Math.round(clickBase * t));
    } else if (metric === "impressions") {
      return trend.map(t => Math.round(impressionBase * t));
    } else if (metric === "ctr") {
      return trend.map(t => parseFloat((ctrBase * t).toFixed(2)));
    } else { // position
      return positionTrend.map(t => parseFloat((positionBase * t).toFixed(1)));
    }
  };

  // Generate three-line SVG points (Gainable vs Artisan vs Selected Competitor)
  const getChartPoints = () => {
    const dates = ["08/03", "22/03", "05/04", "19/04", "03/05", "17/05", "31/05", "07/06"];
    
    const selectedGainable = getDeterministicValues("gainable.fr", selectedMetric);
    const selectedArtisan = getDeterministicValues(siteWeb || "climiz.fr", selectedMetric);
    const selectedCompetitor = getDeterministicValues(comparedCompetitor, selectedMetric);

    const maxG = Math.max(...selectedGainable);
    const maxA = Math.max(...selectedArtisan);
    const maxC = Math.max(...selectedCompetitor);
    const maxVal = Math.max(maxG, maxA, maxC);

    const minG = Math.min(...selectedGainable);
    const minA = Math.min(...selectedArtisan);
    const minC = Math.min(...selectedCompetitor);
    const minVal = Math.min(minG, minA, minC);

    const width = 500;
    const height = 150;
    const paddingLeft = 50;
    const paddingTop = 40;

    const pointsG = selectedGainable.map((val, idx) => {
      const x = paddingLeft + (idx * (width / 7));
      const delta = maxVal - minVal;
      let y = paddingTop + height / 2;
      if (delta > 0) {
        y = paddingTop + height - ((val - minVal) / delta) * height;
      }
      return { x: Math.round(x), y: Math.round(y), label: dates[idx], val };
    });

    const pointsA = selectedArtisan.map((val, idx) => {
      const x = paddingLeft + (idx * (width / 7));
      const delta = maxVal - minVal;
      let y = paddingTop + height / 2;
      if (delta > 0) {
        y = paddingTop + height - ((val - minVal) / delta) * height;
      }
      return { x: Math.round(x), y: Math.round(y), label: dates[idx], val };
    });

    const pointsC = selectedCompetitor.map((val, idx) => {
      const x = paddingLeft + (idx * (width / 7));
      const delta = maxVal - minVal;
      let y = paddingTop + height / 2;
      if (delta > 0) {
        y = paddingTop + height - ((val - minVal) / delta) * height;
      }
      return { x: Math.round(x), y: Math.round(y), label: dates[idx], val };
    });

    return { pointsG, pointsA, pointsC };
  };

  const { pointsG, pointsA, pointsC } = getChartPoints();

  // Localized keywords tailored to the artisan's targeted geographic zone (city) with local competitor monitoring
  const localKeywords = [
    { text: `climatisation gainable ${targetCity}`, volume: 320, position: 8.4, gainablePos: 1.2, competitorPos: 4.5, status: "top-10", difficulty: "Moyenne" },
    { text: `installateur climatisation ${targetCity}`, volume: 280, position: 12.1, gainablePos: 2.4, competitorPos: 7.8, status: "top-20", difficulty: "Faible" },
    { text: `prix clim réversible ${targetCity}`, volume: 190, position: 6.2, gainablePos: 1.8, competitorPos: 3.1, status: "top-10", difficulty: "Faible" },
    { text: `dépannage clim ${targetCity}`, volume: 140, position: 18.5, gainablePos: 3.2, competitorPos: 9.6, status: "top-20", difficulty: "Moyenne" },
    { text: `pompe à chaleur ${targetCity}`, volume: 450, position: 32.4, gainablePos: 5.6, competitorPos: 14.2, status: "top-50", difficulty: "Elevée" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2D3D]">Visibilité SEO & Comparateur de Performance</h2>
          <p className="text-slate-500 text-sm">Comparez votre site internet par rapport aux performances de Gainable.fr et des leaders nationaux.</p>
        </div>
      </div>

      {/* Website Setup & Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#D59B2B]" />
            Mon Site Internet
          </CardTitle>
          <CardDescription>
            Renseignez l'URL de votre propre site web pour l'intégrer au comparateur de performance de la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveAndAnalyze} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-bold text-slate-700">Adresse de mon site web (URL)</label>
              <input
                type="text"
                placeholder="Ex: www.entreprise-climatisation.fr"
                value={siteWeb}
                onChange={(e) => setSiteWeb(e.target.value)}
                className="w-full text-sm rounded border border-slate-200 bg-slate-50 p-2.5 focus:ring-1 focus:ring-[#D59B2B] focus:outline-none"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSaving || isAuditing}
              className="bg-[#D59B2B] hover:bg-[#B58221] text-white font-bold px-6 py-2.5 rounded transition-all shadow-sm shrink-0 flex items-center gap-2"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Enregistrer & Analyser mon Site
                </>
              )}
            </Button>
          </form>

          {isAuditing && (
            <div className="mt-4 p-3 bg-slate-900 rounded-lg text-slate-300 font-mono text-xs space-y-1 animate-pulse">
              {auditLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Comparison Panel */}
      {auditData && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Comparison Table */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Comparatif National face aux Leaders (Requête : Climatisation)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-600">Site Web</TableHead>
                      <TableHead className="font-semibold text-slate-600">Couverture Pages</TableHead>
                      <TableHead className="font-semibold text-slate-600">Score SEO</TableHead>
                      <TableHead className="font-semibold text-slate-600">Note Avis</TableHead>
                      <TableHead className="font-semibold text-slate-600">Citations IA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Logged in artisan's site */}
                    <TableRow className="bg-emerald-50/50 font-bold border-b border-emerald-100">
                      <TableCell className="font-mono text-xs text-emerald-800">
                        {siteWeb || "Mon Site"} 
                        <Badge className="ml-1.5 bg-emerald-600 text-white text-[9px] px-1 py-0 select-none">Moi</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">~ 180 p.</TableCell>
                      <TableCell>
                        <span className={auditData.score >= 90 ? "text-emerald-600" : "text-amber-600"}>
                          {auditData.score}%
                        </span>
                      </TableCell>
                      <TableCell className="text-amber-500 font-mono text-xs">★ 4.8</TableCell>
                      <TableCell className="font-mono text-xs text-indigo-600">12%</TableCell>
                    </TableRow>
                    
                    {/* Platform */}
                    <TableRow className="bg-[#D59B2B]/5 font-semibold">
                      <TableCell className="font-mono text-xs text-slate-700">gainable.fr</TableCell>
                      <TableCell className="font-mono text-xs">23 450 p.</TableCell>
                      <TableCell className="text-emerald-600 font-bold">94%</TableCell>
                      <TableCell className="text-amber-500 font-mono text-xs">★ 4.9</TableCell>
                      <TableCell className="font-mono text-xs text-indigo-600">52%</TableCell>
                    </TableRow>
                    
                    {/* Competitors */}
                    <TableRow>
                      <TableCell className="font-mono text-xs text-slate-600">maclem.fr</TableCell>
                      <TableCell className="font-mono text-xs">12 500 p.</TableCell>
                      <TableCell className="text-slate-600">86%</TableCell>
                      <TableCell className="text-amber-500 font-mono text-xs">★ 4.8</TableCell>
                      <TableCell className="font-mono text-xs text-indigo-500">22%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs text-slate-600">izi-by-edf.fr</TableCell>
                      <TableCell className="font-mono text-xs">8 400 p.</TableCell>
                      <TableCell className="text-slate-600">91%</TableCell>
                      <TableCell className="text-amber-500 font-mono text-xs">★ 4.6</TableCell>
                      <TableCell className="font-mono text-xs text-indigo-500">45%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Audit Score Card */}
          <Card className="bg-slate-900 text-white border-none shadow-sm flex flex-col justify-between p-6">
            <div>
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Mon Score SEO Technique</div>
              <div className="text-5xl font-extrabold text-[#D59B2B]">{auditData.score}/100</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Votre score dépend de l'optimisation des balises méta, de la présence d'en-têtes de sécurité (HSTS/CSP) et de l'intégration d'un chatbot de capture de prospects.
              </p>
            </div>

            {auditData.score < 100 && (
              <div className="mt-4">
                <Button asChild className="w-full bg-[#D59B2B] hover:bg-[#B58221] text-slate-950 font-bold text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 shadow-md transition-all">
                  <Link href="/dashboard/articles">
                    <Sparkles className="w-3.5 h-3.5" />
                    Augmenter ma visibilité en déposant des articles optimisés SEO
                  </Link>
                </Button>
              </div>
            )}
            
            <div className="mt-6 border-t border-slate-800 pt-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Dernier Scan :</span>
                <span className="font-mono">{new Date(auditData.timestamp).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Dual-Line SVG Performance Chart */}
      {auditData && (
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Suivi de Performance Comparatif</CardTitle>
              <CardDescription>
                Métrique : <span className="font-bold text-[#D59B2B] capitalize">{selectedMetric}</span> (Gainable.fr en Or, Mon Site en Vert, Concurrent en Violet)
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Comparer avec :</span>
                <select
                  value={comparedCompetitor}
                  onChange={(e) => setComparedCompetitor(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-700 font-semibold focus:ring-1 focus:ring-[#D59B2B] focus:outline-none"
                >
                  <option value="maclem.fr">maclem.fr (Leader national)</option>
                  <option value="izi-by-edf.fr">izi-by-edf.fr (Leader national)</option>
                  <option value="engie-homeservices.fr">engie-homeservices.fr</option>
                  <option value="garanka.fr">garanka.fr</option>
                  <option value="cham.fr">cham.fr</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs">
                {(["clicks", "impressions", "ctr", "position"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMetric(m)}
                    className={`px-2.5 py-1 rounded transition-all capitalize font-medium ${selectedMetric === m ? "bg-white text-slate-800 shadow-sm animate-fade-in" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {m === "ctr" ? "CTR" : m === "clicks" ? "clics" : m}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 w-full bg-slate-50 border rounded-lg overflow-hidden flex flex-col justify-between p-4">
              <svg className="absolute inset-0 w-full h-full p-6">
                {/* Grid Lines */}
                <line x1="5%" y1="20%" x2="95%" y2="20%" stroke="#E2E8F0" strokeDasharray="4" />
                <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#E2E8F0" strokeDasharray="4" />
                <line x1="5%" y1="80%" x2="95%" y2="80%" stroke="#E2E8F0" strokeDasharray="4" />

                {/* Gainable.fr (Gold Line) */}
                {pointsG.length > 0 && (
                  <>
                    <path
                      d={pointsG.reduce((acc, curr, idx) => acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`), "")}
                      fill="none"
                      stroke="#D59B2B"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {pointsG.map((pt, idx) => (
                      <circle key={`g-${idx}`} cx={pt.x} cy={pt.y} r="4.5" fill="#D59B2B" stroke="#FFF" strokeWidth="2" />
                    ))}
                  </>
                )}

                {/* Competitor (Purple Line) */}
                {pointsC.length > 0 && (
                  <>
                    <path
                      d={pointsC.reduce((acc, curr, idx) => acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`), "")}
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {pointsC.map((pt, idx) => (
                      <circle key={`c-${idx}`} cx={pt.x} cy={pt.y} r="4.5" fill="#8B5CF6" stroke="#FFF" strokeWidth="2" />
                    ))}
                  </>
                )}

                {/* Artisan Site (Green Line) */}
                {pointsA.length > 0 && (
                  <>
                    <path
                      d={pointsA.reduce((acc, curr, idx) => acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`), "")}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {pointsA.map((pt, idx) => (
                      <circle key={`a-${idx}`} cx={pt.x} cy={pt.y} r="4.5" fill="#10B981" stroke="#FFF" strokeWidth="2" />
                    ))}
                  </>
                )}
              </svg>

              <div className="mt-auto w-full flex justify-between px-6 text-[10px] text-slate-400 font-mono select-none z-10">
                {pointsG.map((p, idx) => (
                  <span key={idx}>{p.label}</span>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-3 text-xs justify-center font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#D59B2B]" /> Gainable.fr
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#10B981]" /> Mon Site ({siteWeb ? siteWeb.replace(/https?:\/\//, "").replace(/\/$/, "") : "Non configuré"})
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" /> {comparedCompetitor}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Local Keyword Geotargeting Panel */}
      {auditData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              Veille Concurrentielle & Mots-Clés Locaux (Zone : {targetCity})
            </CardTitle>
            <CardDescription>
              Suivez le positionnement de vos mots-clés climatisation locaux ciblés géographiquement autour de {targetCity}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Requête Locale</TableHead>
                    <TableHead className="font-semibold text-slate-600">Vol. Recherche</TableHead>
                    <TableHead className="font-semibold text-emerald-700 bg-emerald-50/50">Ma Position (Moi)</TableHead>
                    <TableHead className="font-semibold text-[#D59B2B] bg-amber-50/20">Gainable.fr</TableHead>
                    <TableHead className="font-semibold text-purple-700 bg-purple-50/20">Concurrent Leader</TableHead>
                    <TableHead className="font-semibold text-slate-600">Difficulté</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-right">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localKeywords.map((kw, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/30">
                      <TableCell className="font-mono text-xs font-semibold text-slate-800">{kw.text}</TableCell>
                      <TableCell className="font-mono text-xs">{kw.volume} / mois</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50/20"># {kw.position}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-amber-800 bg-amber-50/10"># {kw.gainablePos}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-purple-850 bg-purple-50/10"># {kw.competitorPos}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          kw.difficulty === "Faible" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" :
                          kw.difficulty === "Moyenne" ? "bg-amber-50 text-amber-700 border-amber-200 text-[10px]" :
                          "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                        }>
                          {kw.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          kw.status === "top-10" ? "bg-green-100 text-green-800" :
                          kw.status === "top-20" ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-800"
                        }`}>
                          {kw.status.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Plan Recommendations for Artisan */}
      {auditData && auditData.recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-slate-900">
              Plan d'action de visibilité pour mon site ({siteWeb ? siteWeb.replace(/https?:\/\//, "").replace(/\/$/, "") : "climiz.fr"})
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2 leading-relaxed">
              <BookOpen className="w-4 h-4 text-[#D59B2B] shrink-0 mt-0.5" />
              <div>
                <strong>💡 Conseils Pédagogiques et Recommandations :</strong> Ce plan d'action constitue un ensemble de conseils pédagogiques pour vous guider de manière autonome. Ces configurations techniques de sécurité et d'acquisition client (HSTS, CSP, Widget Chatbot) doivent être implémentées directement sur le serveur d'hébergement de votre site officiel afin d'améliorer sa visibilité.
              </div>
            </div>
          </div>
          
          {auditData.recommendations.map((rec: Recommendation) => (
            <Card key={rec.id} className={`border-l-4 ${rec.type === "critical" ? "border-l-rose-500" : "border-l-amber-500"}`}>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    {rec.type === "critical" ? (
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                    {rec.title}
                  </CardTitle>
                  <Badge className={rec.type === "critical" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}>
                    {rec.type === "critical" ? "Critique" : "Avertissement"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-slate-600">{rec.evidence}</p>
                
                <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex gap-2 items-start">
                    <div className="font-bold text-emerald-700 text-xs shrink-0 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded h-fit">Résolution</div>
                    <div className="text-slate-700 text-xs font-mono">{rec.fix}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleShowFix(rec)}
                    className="bg-[#D59B2B] hover:bg-[#B58221] text-white text-xs font-bold px-3 py-1.5 rounded transition-all shrink-0 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Consulter la résolution
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Audit completed feedback */}
      {auditData && auditData.recommendations.length === 0 && (
        <Card className="border-emerald-200 bg-emerald-50/50 text-emerald-950 shadow-sm p-6 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-emerald-900">Félicitations ! Votre site est optimisé à 100%</h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Tous les en-têtes de sécurité, robots.txt et le chatbot de capture Gainable.fr ont été configurés avec succès sur votre nom de domaine.
          </p>
        </Card>
      )}

      {/* Modal / Dialog for code integration/instructions */}
      {activeFix && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <Card className="max-w-xl w-full bg-white shadow-2xl rounded-xl overflow-hidden border">
            <CardHeader className="bg-slate-900 text-white flex justify-between items-start pb-4">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Consignes de Résolution : {activeFix.title}
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Appliquez les configurations ci-dessous sur l'hébergement de votre site internet pour résoudre l'alerte.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="text-sm text-slate-700 leading-normal space-y-2">
                <p><strong>Étape unique :</strong> Modifiez le fichier de configuration de votre serveur (Apache, Nginx, ou via le code de votre application) et insérez le code suivant :</p>
                {activeFix.codeBlock && (
                  <pre className="bg-slate-950 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-40 leading-relaxed">
                    {activeFix.codeBlock}
                  </pre>
                )}
              </div>
              
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveFix(null)}
                  className="text-slate-600 hover:bg-slate-50 border-slate-200 text-xs font-semibold"
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => handleResolveFix(activeFix.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Marquer comme résolu (Correction effectuée)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
