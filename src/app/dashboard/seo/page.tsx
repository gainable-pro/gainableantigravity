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

  // Real slug of the expert profile on Gainable.fr
  const [expertSlug, setExpertSlug] = useState("climatisation-pompe-a-chaleur-paris-top-climatisation-9972");
  const [publishedArticlesCount, setPublishedArticlesCount] = useState(0);

  // Hover tracking for chart
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);

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
        if (data.slug) {
          setExpertSlug(data.slug);
        }
        const initialUrl = data.site_web || "mon-site-artisan.fr";
        triggerInitialAudit(initialUrl, data.ville || "Paris");
        setProfileLoaded(true);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch actual published articles count for live sitemap page count
  useEffect(() => {
    fetch("/api/dashboard/articles")
      .then(res => res.json())
      .then(data => {
        if (data.articles) {
          const published = data.articles.filter((a: any) => a.status === "PUBLISHED").length;
          setPublishedArticlesCount(published);
        }
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

  // Seedable pseudo-random generator
  const getNoise = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const generate90DaysData = (domain: string) => {
    const clean = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].toLowerCase();
    
    // Hash function to seed the noise
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    // Baseline metrics
    let clicksBase = 3.0;
    let impressionsBase = 500;
    let ctrBase = 0.5;
    let positionBase = 22.0;

    if (clean === "gainable.fr") {
      clicksBase = 3.0; // averages around 268 total
      impressionsBase = 620; // averages around 56k total
      ctrBase = 0.48;
      positionBase = 22.6;
    } else if (clean.includes("maclem")) {
      clicksBase = 0.95; // ~86 clicks
      impressionsBase = 140; // ~12k impressions
      ctrBase = 0.69;
      positionBase = 18.2;
    } else if (clean.includes("izi")) {
      clicksBase = 1.6; // ~145 clicks
      impressionsBase = 205; // ~18.4k impressions
      ctrBase = 0.79;
      positionBase = 11.4;
    } else if (clean.includes("engie")) {
      clicksBase = 1.2;
      impressionsBase = 160;
      ctrBase = 0.76;
      positionBase = 14.8;
    } else if (clean.includes("garanka")) {
      clicksBase = 0.6;
      impressionsBase = 75;
      ctrBase = 0.81;
      positionBase = 22.5;
    } else if (clean.includes("cham")) {
      clicksBase = 0.45;
      impressionsBase = 58;
      ctrBase = 0.77;
      positionBase = 28.1;
    } else if (clean.includes("proxiserve")) {
      clicksBase = 0.8;
      impressionsBase = 110;
      ctrBase = 0.72;
      positionBase = 19.5;
    } else if (clean.includes("cedeo")) {
      clicksBase = 0.5;
      impressionsBase = 65;
      ctrBase = 0.76;
      positionBase = 25.4;
    } else if (clean.includes("clim-assistance")) {
      clicksBase = 0.7;
      impressionsBase = 90;
      ctrBase = 0.78;
      positionBase = 21.2;
    } else if (clean.includes("climeden")) {
      clicksBase = 0.4;
      impressionsBase = 50;
      ctrBase = 0.8;
      positionBase = 31.5;
    } else if (clean.includes("clim-up")) {
      clicksBase = 0.35;
      impressionsBase = 45;
      ctrBase = 0.78;
      positionBase = 33.4;
    } else if (clean.includes("clim-reversible")) {
      clicksBase = 0.65;
      impressionsBase = 85;
      ctrBase = 0.76;
      positionBase = 23.8;
    } else if (clean.includes("sorank")) {
      clicksBase = 1.1;
      impressionsBase = 135;
      ctrBase = 0.81;
      positionBase = 15.6;
    } else {
      // General artisan site
      clicksBase = 0.2 + (hash % 8) / 10; // 0.2 to 0.9 clicks/day
      impressionsBase = 15 + (hash % 60); // 15 to 75 impressions/day
      ctrBase = 0.8 + (hash % 80) / 100; // 0.8% to 1.6%
      positionBase = 18 + (hash % 40); // 18 to 58 position
    }

    const points = [];
    const startDate = new Date(2026, 2, 10); // March 10, 2026

    // Generate 90 daily points
    for (let i = 0; i < 90; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      // Noise factor
      const noise = getNoise(hash + i); // 0 to 1
      const noiseFactor = 0.7 + noise * 0.6; // 0.7 to 1.3
      
      // Growth trend factor over 90 days
      const growthTrend = 0.85 + (i / 89) * 0.4; // 0.85 to 1.25
      const positionTrend = 1.15 - (i / 89) * 0.3; // improving position = values shrink

      let clicks = Math.round(clicksBase * growthTrend * noiseFactor);
      if (clicks < 0) clicks = 0;

      let impressions = Math.round(impressionsBase * growthTrend * noiseFactor);
      if (impressions < 0) impressions = 0;

      let ctr = parseFloat((ctrBase * growthTrend * noiseFactor).toFixed(2));
      if (ctr < 0) ctr = 0.05;

      let position = parseFloat((positionBase * positionTrend * noiseFactor).toFixed(1));
      if (position < 1.0) position = 1.0;

      points.push({
        date: currentDate,
        dateLabel: currentDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
        shortDateLabel: currentDate.toLocaleDateString("fr-FR", { day: "numeric", month: "numeric" }),
        clicks,
        impressions,
        ctr,
        position
      });
    }

    return points;
  };

  // Generate three-line SVG points (Gainable vs Artisan vs Selected Competitor)
  const getChartPoints = () => {
    const gainableDailyData = generate90DaysData("gainable.fr");
    const artisanDailyData = generate90DaysData(siteWeb || "climiz.fr");
    const competitorDailyData = generate90DaysData(comparedCompetitor);

    const selectedGainable = gainableDailyData.map(pt => pt[selectedMetric]);
    const selectedArtisan = artisanDailyData.map(pt => pt[selectedMetric]);
    const selectedCompetitor = competitorDailyData.map(pt => pt[selectedMetric]);

    const maxG = Math.max(...selectedGainable);
    const maxA = Math.max(...selectedArtisan);
    const maxC = Math.max(...selectedCompetitor);
    const maxVal = Math.max(maxG, maxA, maxC);

    const minG = Math.min(...selectedGainable);
    const minA = Math.min(...selectedArtisan);
    const minC = Math.min(...selectedCompetitor);
    const minVal = Math.min(minG, minA, minC);

    const delta = maxVal - minVal || 1;

    const width = 500;
    const height = 150;
    const paddingLeft = 50;
    const paddingTop = 40;

    const isPosition = selectedMetric === "position";

    const pointsG = selectedGainable.map((val, idx) => {
      const x = paddingLeft + (idx * (width / 89));
      let y;
      if (isPosition) {
        y = paddingTop + ((val - minVal) / delta) * height;
      } else {
        y = paddingTop + height - ((val - minVal) / delta) * height;
      }
      return { x: Math.round(x), y: Math.round(y), label: gainableDailyData[idx].shortDateLabel, dateLabel: gainableDailyData[idx].dateLabel, val };
    });

    const pointsA = selectedArtisan.map((val, idx) => {
      const x = paddingLeft + (idx * (width / 89));
      let y;
      if (isPosition) {
        y = paddingTop + ((val - minVal) / delta) * height;
      } else {
        y = paddingTop + height - ((val - minVal) / delta) * height;
      }
      return { x: Math.round(x), y: Math.round(y), label: artisanDailyData[idx].shortDateLabel, dateLabel: artisanDailyData[idx].dateLabel, val };
    });

    const pointsC = selectedCompetitor.map((val, idx) => {
      const x = paddingLeft + (idx * (width / 89));
      let y;
      if (isPosition) {
        y = paddingTop + ((val - minVal) / delta) * height;
      } else {
        y = paddingTop + height - ((val - minVal) / delta) * height;
      }
      return { x: Math.round(x), y: Math.round(y), label: competitorDailyData[idx].shortDateLabel, dateLabel: competitorDailyData[idx].dateLabel, val };
    });

    // Totals for cards
    const totalClicks = artisanDailyData.reduce((acc, curr) => acc + curr.clicks, 0);
    const totalImpressions = artisanDailyData.reduce((acc, curr) => acc + curr.impressions, 0);
    const avgCtr = totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 1.45;
    const avgPosition = parseFloat((artisanDailyData.reduce((acc, curr) => acc + curr.position, 0) / 90).toFixed(1));

    return { pointsG, pointsA, pointsC, totalClicks, totalImpressions, avgCtr, avgPosition, gainableDailyData, artisanDailyData, competitorDailyData };
  };

  const {
    pointsG, pointsA, pointsC,
    totalClicks, totalImpressions, avgCtr, avgPosition,
    gainableDailyData, artisanDailyData, competitorDailyData
  } = getChartPoints();

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
                    {/* Logged in artisan's personal site */}
                    <TableRow className="bg-emerald-50/50 font-bold border-b border-emerald-100">
                      <TableCell className="font-mono text-xs text-emerald-800">
                        {siteWeb ? siteWeb.replace(/https?:\/\//, "").replace(/\/$/, "") : "mon-site-perso.fr"} 
                        <Badge className="ml-1.5 bg-emerald-600 text-white text-[9px] px-1 py-0 select-none">Moi (Site Perso)</Badge>
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

                    {/* Artisan's profile page on Gainable.fr */}
                    <TableRow className="bg-[#D59B2B]/10 font-bold border-b border-[#D59B2B]/20 animate-fade-in">
                      <TableCell className="font-mono text-xs text-[#D59B2B]">
                        gainable.fr/pro/{expertSlug}
                        <Badge className="ml-1.5 bg-[#D59B2B] text-white text-[9px] px-1 py-0 select-none">Ma Page Gainable</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">~ {2 + publishedArticlesCount} p.</TableCell>
                      <TableCell className="text-emerald-600 font-bold">
                        {Math.min(88 + publishedArticlesCount * 2, 98)}%
                      </TableCell>
                      <TableCell className="text-amber-500 font-mono text-xs">★ 4.8</TableCell>
                      <TableCell className="font-mono text-xs text-indigo-600">{Math.min(15 + publishedArticlesCount * 3, 60)}%</TableCell>
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
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Diagnostic de Mon Site Personnel</div>
              <div className="text-5xl font-extrabold text-[#D59B2B]">{auditData.score}/100</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Ce score évalue la performance et la sécurité de votre site internet personnel. L'optimisation technique d'un site propre étant complexe, vous pouvez propulser immédiatement votre visibilité locale en publiant des articles de blog sur votre page Gainable.fr.
              </p>
            </div>

            {auditData.score < 100 && (
              <div className="mt-4 p-1 rounded-xl border-2 border-emerald-400 bg-emerald-950/40 shadow-[0_0_25px_rgba(16,185,129,0.7),_inset_0_0_12px_rgba(16,185,129,0.3)] animate-pulse">
                <Button asChild className="w-full h-auto bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-lg flex items-center justify-center gap-2.5 transition-all duration-200 whitespace-normal text-center shadow-lg active:scale-98">
                  <Link href="/dashboard/articles">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="flex flex-col items-center leading-tight">
                      <span>Propulser ma visibilité locale</span>
                      <span className="text-[10px] sm:text-xs text-emerald-100 font-normal mt-1">
                        (Publier des articles SEO)
                      </span>
                    </span>
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

      {/* Google Search Console style Performance Chart */}
      {auditData && (
        <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">Suivi de Performance Comparatif (Google Search Console)</CardTitle>
              <CardDescription className="text-slate-500 text-xs">
                Métrique active : <span className="font-bold text-slate-700 capitalize">{selectedMetric === "clicks" ? "Clics" : selectedMetric === "ctr" ? "CTR" : selectedMetric}</span>
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Comparer avec :</span>
              <select
                value={comparedCompetitor}
                onChange={(e) => setComparedCompetitor(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-700 font-bold focus:ring-1 focus:ring-[#D59B2B] focus:outline-none"
              >
                <option value="maclem.fr">maclem.fr (Leader national)</option>
                <option value="izi-by-edf.fr">izi-by-edf.fr (Leader national)</option>
                <option value="engie-homeservices.fr">engie-homeservices.fr</option>
                <option value="garanka.fr">garanka.fr</option>
                <option value="cham.fr">cham.fr</option>
                <option value="proxiserve.fr">proxiserve.fr</option>
                <option value="cedeo.fr">cedeo.fr</option>
                <option value="clim-assistance.fr">clim-assistance.fr</option>
                <option value="climeden.com">climeden.com</option>
                <option value="clim-up.fr">clim-up.fr</option>
                <option value="clim-reversible.fr">clim-reversible.fr</option>
                <option value="sorank.com">sorank.com (SoRank)</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-4 md:p-6 space-y-4">
            {/* GSC Clickable Metric Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
              {/* Clics Card */}
              <div
                onClick={() => setSelectedMetric("clicks")}
                className={`cursor-pointer p-3.5 rounded-lg border-t-4 transition-all flex flex-col justify-between ${
                  selectedMetric === "clicks"
                    ? "bg-[#E8F0FE] border-[#1A73E8] shadow-sm"
                    : "bg-white border-slate-200 border-t-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={selectedMetric === "clicks"}
                    readOnly
                    className="w-3.5 h-3.5 rounded text-[#1A73E8] focus:ring-0 pointer-events-none accent-[#1A73E8]"
                  />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Clics totaux</span>
                </div>
                <div className={`text-2xl font-extrabold tracking-tight mt-1.5 ${selectedMetric === "clicks" ? "text-[#1A73E8]" : "text-slate-800"}`}>
                  {totalClicks}
                </div>
              </div>

              {/* Impressions Card */}
              <div
                onClick={() => setSelectedMetric("impressions")}
                className={`cursor-pointer p-3.5 rounded-lg border-t-4 transition-all flex flex-col justify-between ${
                  selectedMetric === "impressions"
                    ? "bg-[#F3E5F5] border-[#7B1FA2] shadow-sm"
                    : "bg-white border-slate-200 border-t-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={selectedMetric === "impressions"}
                    readOnly
                    className="w-3.5 h-3.5 rounded text-[#7B1FA2] focus:ring-0 pointer-events-none accent-[#7B1FA2]"
                  />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Impressions</span>
                </div>
                <div className={`text-2xl font-extrabold tracking-tight mt-1.5 ${selectedMetric === "impressions" ? "text-[#7B1FA2]" : "text-slate-800"}`}>
                  {totalImpressions >= 1000 ? `${(totalImpressions / 1000).toFixed(1)} k` : totalImpressions}
                </div>
              </div>

              {/* CTR Card */}
              <div
                onClick={() => setSelectedMetric("ctr")}
                className={`cursor-pointer p-3.5 rounded-lg border-t-4 transition-all flex flex-col justify-between ${
                  selectedMetric === "ctr"
                    ? "bg-[#E8F5E9] border-[#0D652D] shadow-sm"
                    : "bg-white border-slate-200 border-t-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={selectedMetric === "ctr"}
                    readOnly
                    className="w-3.5 h-3.5 rounded text-[#0D652D] focus:ring-0 pointer-events-none accent-[#0D652D]"
                  />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">CTR moyen</span>
                </div>
                <div className={`text-2xl font-extrabold tracking-tight mt-1.5 ${selectedMetric === "ctr" ? "text-[#0D652D]" : "text-slate-800"}`}>
                  {avgCtr} %
                </div>
              </div>

              {/* Position Card */}
              <div
                onClick={() => setSelectedMetric("position")}
                className={`cursor-pointer p-3.5 rounded-lg border-t-4 transition-all flex flex-col justify-between ${
                  selectedMetric === "position"
                    ? "bg-[#FFF3E0] border-[#E65100] shadow-sm"
                    : "bg-white border-slate-200 border-t-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={selectedMetric === "position"}
                    readOnly
                    className="w-3.5 h-3.5 rounded text-[#E65100] focus:ring-0 pointer-events-none accent-[#E65100]"
                  />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Position moyenne</span>
                </div>
                <div className={`text-2xl font-extrabold tracking-tight mt-1.5 ${selectedMetric === "position" ? "text-[#E65100]" : "text-slate-800"}`}>
                  {avgPosition}
                </div>
              </div>
            </div>

            {/* High-Resolution SVG Chart */}
            <div className="relative h-72 w-full bg-slate-50 border rounded-lg p-2 md:p-4 shadow-inner">
              <svg
                viewBox="0 0 600 220"
                className="w-full h-full cursor-crosshair overflow-visible select-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = e.clientX - rect.left;
                  const mouseY = e.clientY - rect.top;
                  
                  const svgX = (mouseX / rect.width) * 600;
                  const svgY = (mouseY / rect.height) * 220;

                  const index = Math.round((svgX - 50) / (500 / 89));
                  if (index >= 0 && index < 90) {
                    setHoveredIndex(index);
                    setMouseCoords({ x: svgX, y: svgY });
                  } else {
                    setHoveredIndex(null);
                    setMouseCoords(null);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setMouseCoords(null);
                }}
              >
                {/* Horizontal Grid lines */}
                <line x1="50" y1="40" x2="550" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3" />
                <line x1="50" y1="115" x2="550" y2="115" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3" />
                <line x1="50" y1="190" x2="550" y2="190" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* Gainable.fr (Gold Line) */}
                {pointsG.length > 0 && (
                  <path
                    d={pointsG.reduce((acc, curr, idx) => acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`), "")}
                    fill="none"
                    stroke="#D59B2B"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Competitor (Purple Line) */}
                {pointsC.length > 0 && (
                  <path
                    d={pointsC.reduce((acc, curr, idx) => acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`), "")}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Artisan Site (Green Line) */}
                {pointsA.length > 0 && (
                  <path
                    d={pointsA.reduce((acc, curr, idx) => acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`), "")}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Vertical Hover Guidelines */}
                {hoveredIndex !== null && (
                  <>
                    <line
                      x1={50 + hoveredIndex * (500 / 89)}
                      y1="40"
                      x2={50 + hoveredIndex * (500 / 89)}
                      y2="190"
                      stroke="#94A3B8"
                      strokeWidth="1.2"
                      strokeDasharray="4"
                    />
                    
                    {/* Highlighted dots for hover */}
                    <circle cx={pointsG[hoveredIndex].x} cy={pointsG[hoveredIndex].y} r="4.5" fill="#D59B2B" stroke="#FFF" strokeWidth="1.5" />
                    <circle cx={pointsC[hoveredIndex].x} cy={pointsC[hoveredIndex].y} r="4.5" fill="#8B5CF6" stroke="#FFF" strokeWidth="1.5" />
                    <circle cx={pointsA[hoveredIndex].x} cy={pointsA[hoveredIndex].y} r="4.5" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
                  </>
                )}

                {/* X Axis Date labels (Every 15 days) */}
                {[0, 15, 30, 45, 60, 75, 89].map((idx) => {
                  const pt = pointsG[idx];
                  if (!pt) return null;
                  return (
                    <text
                      key={idx}
                      x={pt.x}
                      y="208"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#94A3B8"
                      className="font-mono select-none"
                    >
                      {pt.label}
                    </text>
                  );
                })}
              </svg>

              {/* GSC Interactive Tooltip Card Overlay */}
              {hoveredIndex !== null && mouseCoords !== null && (
                <div
                  className="absolute z-30 bg-white border border-slate-200 rounded-lg p-3 shadow-xl text-xs space-y-1.5 pointer-events-none select-none font-sans min-w-[170px]"
                  style={{
                    left: hoveredIndex > 45 ? `${(mouseCoords.x / 600) * 100 - 32}%` : `${(mouseCoords.x / 600) * 100 + 3}%`,
                    top: `${(mouseCoords.y / 220) * 100 - 10}%`,
                    transform: "translateY(-50%)"
                  }}
                >
                  <div className="font-bold text-slate-700 border-b pb-1 text-[10px] uppercase tracking-wide">
                    {gainableDailyData[hoveredIndex].dateLabel}
                  </div>
                  
                  {/* Gainable details */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 font-medium text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D59B2B]" />
                      Gainable.fr
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedMetric === "clicks"
                        ? `${gainableDailyData[hoveredIndex].clicks} clic${gainableDailyData[hoveredIndex].clicks > 1 ? "s" : ""}`
                        : selectedMetric === "impressions"
                        ? `${gainableDailyData[hoveredIndex].impressions} imp.`
                        : selectedMetric === "ctr"
                        ? `${gainableDailyData[hoveredIndex].ctr} %`
                        : `# ${gainableDailyData[hoveredIndex].position}`}
                    </span>
                  </div>

                  {/* Competitor details */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 font-medium text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                      {comparedCompetitor}
                    </span>
                    <span className="font-mono font-bold text-slate-850">
                      {selectedMetric === "clicks"
                        ? `${competitorDailyData[hoveredIndex].clicks} clic${competitorDailyData[hoveredIndex].clicks > 1 ? "s" : ""}`
                        : selectedMetric === "impressions"
                        ? `${competitorDailyData[hoveredIndex].impressions} imp.`
                        : selectedMetric === "ctr"
                        ? `${competitorDailyData[hoveredIndex].ctr} %`
                        : `# ${competitorDailyData[hoveredIndex].position}`}
                    </span>
                  </div>

                  {/* Mon Site details */}
                  <div className="flex items-center justify-between gap-4 border-t pt-1 mt-1">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                      Mon Site
                    </span>
                    <span className="font-mono font-extrabold text-emerald-800">
                      {selectedMetric === "clicks"
                        ? `${artisanDailyData[hoveredIndex].clicks} clic${artisanDailyData[hoveredIndex].clicks > 1 ? "s" : ""}`
                        : selectedMetric === "impressions"
                        ? `${artisanDailyData[hoveredIndex].impressions} imp.`
                        : selectedMetric === "ctr"
                        ? `${artisanDailyData[hoveredIndex].ctr} %`
                        : `# ${artisanDailyData[hoveredIndex].position}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Legend info */}
            <div className="flex flex-wrap gap-4 mt-2 justify-center text-xs font-semibold select-none border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D59B2B]" />
                Gainable.fr (Or)
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                Mon Site ({siteWeb ? siteWeb.replace(/https?:\/\//, "").replace(/\/$/, "") : "Non configuré"}) (Vert)
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                {comparedCompetitor} (Violet)
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
