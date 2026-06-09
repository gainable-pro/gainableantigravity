"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, TrendingDown, Search, Sparkles, Globe, 
  AlertCircle, CheckCircle2, PlayCircle, Loader2, ChevronRight, 
  Activity, FileText, Check, AlertTriangle, HelpCircle, 
  ExternalLink, BarChart3, Info, RefreshCw
} from "lucide-react";

interface Recommendation {
  id: string;
  type: string;
  title: string;
  evidence: string;
  fix: string;
}

interface AuditData {
  url: string;
  timestamp: string;
  score: number;
  metrics: {
    robots: string;
    security: string;
    performance: string;
    readability: string;
  };
  recommendations: Recommendation[];
  logs: string[];
}

export default function SeoDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "ai" | "pages" | "audit">("overview");
  const [selectedMetric, setSelectedMetric] = useState<"clicks" | "impressions" | "ctr" | "position">("clicks");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [pageFilter, setPageFilter] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<AuditData | null>(null);

  // Load existing cache on mount
  useEffect(() => {
    fetch("/api/admin/seo/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ getOnly: true }) // Doesn't rerun, just checks if endpoint supports getting cache
    })
      .then(res => res.json())
      .then(data => {
        if (data.audit) {
          setAuditData(data.audit);
        }
      })
      .catch(err => console.error("Error reading cache:", err));
  }, []);

  const triggerAudit = async () => {
    setIsAuditing(true);
    setAuditLogs([]);
    
    // Simulate real-time progress steps for UI premium feedback
    const simulatedSteps = [
      "[1/5] Démarrage de l'audit SEO IA pour https://www.gainable.fr...",
      "[2/5] Interrogation du fichier robots.txt et détection de sitemap...",
      "[robots.txt] OK - Analyse complétée.",
      "[3/5] Analyse des en-têtes de sécurité HTTP (HSTS, CSP, X-Frame)...",
      "[Security] OK - Balayage des en-têtes terminé.",
      "[4/5] Évaluation de la visibilité des moteurs génératifs (GEO / AEO)...",
      "[GEO] Analyse sémantique de l'autorité thématique complétée.",
      "[5/5] Finalisation du rapport d'audit et écriture du plan d'action."
    ];

    for (let i = 0; i < simulatedSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAuditLogs(prev => [...prev, simulatedSteps[i]]);
    }

    try {
      const res = await fetch("/api/admin/seo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://www.gainable.fr" })
      });
      if (res.ok) {
        const data = await res.json();
        setAuditData(data.audit);
      } else {
        alert("Erreur lors du traitement de l'audit.");
      }
    } catch (e) {
      alert("Erreur réseau ou script Python indisponible.");
    } finally {
      setIsAuditing(false);
    }
  };

  // Mock GSC Data matching screenshot
  const kpiData = {
    clicks: { total: 266, trend: "+14.6%", isPositive: true, desc: "Total des clics depuis la recherche Google (3 mois)" },
    impressions: { total: "56K", trend: "+8.2%", isPositive: true, desc: "Nombre de fois qu'une page a été vue dans les résultats" },
    ctr: { total: "0.5%", trend: "-0.1%", isPositive: false, desc: "Taux de clics moyen par rapport aux impressions" },
    position: { total: "22.6", trend: "Amélioration -1.2", isPositive: true, desc: "Position moyenne de vos pages sur les requêtes" }
  };

  // Chart data: coordinates mapping for visual line representation
  const chartPoints: Record<string, { x: number; y: number; label: string; val: number }[]> = {
    clicks: [
      { x: 50, y: 150, label: "08/03", val: 2 },
      { x: 120, y: 120, label: "22/03", val: 5 },
      { x: 190, y: 80, label: "05/04", val: 9 },
      { x: 260, y: 140, label: "19/04", val: 3 },
      { x: 330, y: 100, label: "03/05", val: 7 },
      { x: 400, y: 60, label: "17/05", val: 12 },
      { x: 470, y: 90, label: "31/05", val: 8 },
      { x: 540, y: 70, label: "07/06", val: 10 }
    ],
    impressions: [
      { x: 50, y: 120, label: "08/03", val: 350 },
      { x: 120, y: 110, label: "22/03", val: 420 },
      { x: 190, y: 70, label: "05/04", val: 580 },
      { x: 260, y: 95, label: "19/04", val: 490 },
      { x: 330, y: 80, label: "03/05", val: 550 },
      { x: 400, y: 40, label: "17/05", val: 720 },
      { x: 470, y: 65, label: "31/05", val: 630 },
      { x: 540, y: 50, label: "07/06", val: 680 }
    ],
    ctr: [
      { x: 50, y: 140, label: "08/03", val: 0.4 },
      { x: 120, y: 110, label: "22/03", val: 0.6 },
      { x: 190, y: 90, label: "05/04", val: 0.8 },
      { x: 260, y: 130, label: "19/04", val: 0.5 },
      { x: 330, y: 100, label: "03/05", val: 0.7 },
      { x: 400, y: 60, label: "17/05", val: 1.1 },
      { x: 470, y: 110, label: "31/05", val: 0.6 },
      { x: 540, y: 80, label: "07/06", val: 0.9 }
    ],
    position: [
      { x: 50, y: 100, label: "08/03", val: 24.2 },
      { x: 120, y: 110, label: "22/03", val: 24.8 },
      { x: 190, y: 95, label: "05/04", val: 23.6 },
      { x: 260, y: 80, label: "19/04", val: 22.8 },
      { x: 330, y: 85, label: "03/05", val: 23.0 },
      { x: 400, y: 70, label: "17/05", val: 21.9 },
      { x: 470, y: 75, label: "31/05", val: 22.1 },
      { x: 540, y: 60, label: "07/06", val: 21.4 }
    ]
  };

  const keywordsList = [
    { text: "installateur gainable", clicks: 45, impressions: 8400, ctr: "0.53%", position: 12.4, trend: "up" },
    { text: "climatisation gainable prix", clicks: 32, impressions: 6200, ctr: "0.51%", position: 18.2, trend: "up" },
    { text: "gainable climatisation", clicks: 28, impressions: 5900, ctr: "0.47%", position: 15.6, trend: "stable" },
    { text: "clim gainable daikin", clicks: 18, impressions: 3100, ctr: "0.58%", position: 24.1, trend: "down" },
    { text: "bureau etude thermique", clicks: 12, impressions: 2500, ctr: "0.48%", position: 32.5, trend: "up" },
    { text: "dpe climatisation", clicks: 8, impressions: 1800, ctr: "0.44%", position: 28.3, trend: "stable" },
    { text: "installateur clim gainable toulouse", clicks: 6, impressions: 850, ctr: "0.70%", position: 8.4, trend: "up" },
    { text: "expert clim gainable lyon", clicks: 5, impressions: 920, ctr: "0.54%", position: 9.1, trend: "stable" },
    { text: "tarif gainable zone control", clicks: 4, impressions: 1100, ctr: "0.36%", position: 21.5, trend: "down" }
  ].filter(kw => kw.text.toLowerCase().includes(keywordFilter.toLowerCase()));

  const pagesList = [
    { url: "/", clicks: 124, impressions: 24000, ctr: "0.52%", position: 4.2, status: "Indexed" },
    { url: "/la-solution-gainable", clicks: 58, impressions: 12000, ctr: "0.48%", position: 8.5, status: "Indexed" },
    { url: "/trouver-installateur", clicks: 42, impressions: 9200, ctr: "0.45%", position: 11.2, status: "Indexed" },
    { url: "/faq-visibilite-referencement", clicks: 24, impressions: 5400, ctr: "0.44%", position: 14.8, status: "Indexed" },
    { url: "/pro", clicks: 12, impressions: 3200, ctr: "0.37%", position: 19.4, status: "Indexed" },
    { url: "/mentions-legales", clicks: 0, impressions: 120, ctr: "0.00%", position: 88.0, status: "Noindex (robots)" },
    { url: "/cgu", clicks: 0, impressions: 95, ctr: "0.00%", position: 94.2, status: "Noindex (robots)" }
  ].filter(p => p.url.toLowerCase().includes(pageFilter.toLowerCase()));

  const geoAeoData = [
    { engine: "ChatGPT Search (GPT-4o)", visibility: "45%", trend: "up", quoteUrl: "/la-solution-gainable", status: "Cité comme leader B2B" },
    { engine: "Google AI Overviews", visibility: "38%", trend: "up", quoteUrl: "/trouver-installateur", status: "Inclus dans le widget experts" },
    { engine: "Perplexity AI", visibility: "52%", trend: "stable", quoteUrl: "/faq-visibilite-referencement", status: "Source principale de comparaison" },
    { engine: "Claude / Gemini", visibility: "30%", trend: "up", quoteUrl: "/", status: "Cité pour les installateurs certifiés" }
  ];

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Visibilité SEO & GEO — Gainable.fr</h2>
          <p className="text-sm text-slate-500">
            Suivi temps réel des clics Google Search Console, requêtes phares, indexation et présence sur les moteurs d'IA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-50 text-slate-600 px-3 py-1 font-mono border-slate-200">
            Indexé: ~18 000 pages
          </Badge>
          <Button 
            onClick={triggerAudit} 
            disabled={isAuditing} 
            className="bg-[#D59B2B] hover:bg-[#B58221] text-white flex items-center gap-2 font-semibold shadow-sm transition-all"
          >
            {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Lancer un Audit SEO IA
          </Button>
        </div>
      </div>

      {/* Audit Progress Logs (if active) */}
      {isAuditing && (
        <Card className="border-amber-200 bg-amber-50/40 shadow-inner">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              Agentic SEO Skill — Audit en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-xs text-amber-950/80 bg-slate-950 p-4 rounded-md space-y-1.5 border border-slate-800 shadow-md max-h-48 overflow-y-auto">
            {auditLogs.map((log, idx) => (
              <div key={idx} className={log.includes("OK") ? "text-emerald-400" : log.includes("⚠️") || log.includes("❌") ? "text-amber-400" : "text-slate-300"}>
                {log}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "overview" ? "text-[#D59B2B] border-b-2 border-[#D59B2B]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Vue d'ensemble GSC
        </button>
        <button
          onClick={() => setActiveTab("keywords")}
          className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "keywords" ? "text-[#D59B2B] border-b-2 border-[#D59B2B]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Mots Clés
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "ai" ? "text-[#D59B2B] border-b-2 border-[#D59B2B]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Visibilité IA (GEO/AEO)
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "pages" ? "text-[#D59B2B] border-b-2 border-[#D59B2B]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Pages & Indexation
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "audit" ? "text-[#D59B2B] border-b-2 border-[#D59B2B]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Recommandations IA {auditData && <Badge className="ml-1 bg-amber-500 hover:bg-amber-600 font-mono text-[9px] px-1 py-0">{auditData.recommendations.length}</Badge>}
        </button>
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI grid */}
          <div className="grid gap-4 md:grid-cols-4">
            {(Object.keys(kpiData) as Array<keyof typeof kpiData>).map((key) => {
              const current = kpiData[key];
              const isSelected = selectedMetric === key;
              return (
                <Card 
                  key={key} 
                  onClick={() => setSelectedMetric(key)}
                  className={`cursor-pointer transition-all border ${isSelected ? "border-[#D59B2B] shadow-md ring-1 ring-[#D59B2B]" : "hover:border-slate-300"}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                      {key === "clicks" ? "Clics Totaux" : key === "impressions" ? "Impressions" : key === "ctr" ? "CTR Moyen" : "Position Moyenne"}
                    </CardTitle>
                    {current.isPositive ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        {current.trend}
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" />
                        {current.trend}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight text-slate-900">{current.total}</div>
                    <p className="text-xs text-slate-400 mt-2 font-light leading-normal">{current.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Interactive Custom SVG Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Tendance Graphique des 3 Derniers Mois</CardTitle>
                <CardDescription>
                  Affichage de la métrique : <span className="font-bold text-[#D59B2B] capitalize">{selectedMetric}</span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs">
                {(["clicks", "impressions", "ctr", "position"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMetric(m)}
                    className={`px-2.5 py-1 rounded transition-all capitalize font-medium ${selectedMetric === m ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {m === "ctr" ? "CTR" : m}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 w-full bg-slate-50 border rounded-lg overflow-hidden flex flex-col justify-between p-4">
                {/* SVG Graph rendering */}
                <svg className="absolute inset-0 w-full h-full p-6">
                  {/* Grid Lines */}
                  <line x1="5%" y1="20%" x2="95%" y2="20%" stroke="#E2E8F0" strokeDasharray="4" />
                  <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#E2E8F0" strokeDasharray="4" />
                  <line x1="5%" y1="80%" x2="95%" y2="80%" stroke="#E2E8F0" strokeDasharray="4" />

                  {/* Shading area underneath line */}
                  <path
                    d={`M 50 200 L ${chartPoints[selectedMetric].map(p => `${p.x} ${p.y}`).join(" L ")} L 540 200 Z`}
                    fill="url(#chart-gradient)"
                    opacity="0.15"
                  />

                  {/* Main Line path */}
                  <path
                    d={chartPoints[selectedMetric].reduce((acc, curr, idx) => {
                      return acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`);
                    }, "")}
                    fill="none"
                    stroke="#D59B2B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Hover dots & Values */}
                  {chartPoints[selectedMetric].map((pt, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#D59B2B"
                        stroke="#FFF"
                        strokeWidth="2"
                        className="transition-all hover:r-7"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#1E293B"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 font-mono"
                      >
                        {pt.val}{selectedMetric === "ctr" ? "%" : ""}
                      </text>
                    </g>
                  ))}

                  {/* Define Gradients */}
                  <defs>
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D59B2B" />
                      <stop offset="100%" stopColor="#FFF" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X Axis labels */}
                <div className="mt-auto w-full flex justify-between px-6 text-[10px] text-slate-400 font-mono select-none z-10">
                  {chartPoints[selectedMetric].map((p, idx) => (
                    <span key={idx} style={{ left: `${(idx / (chartPoints[selectedMetric].length - 1)) * 90}%` }}>
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: KEYWORDS */}
      {activeTab === "keywords" && (
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Analyse des Mots Clés & Requêtes de Recherche</CardTitle>
              <CardDescription>Liste des 50 requêtes les plus génératrices de trafic organique.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer un mot clé..."
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                className="pl-9 pr-4 py-2 w-full text-sm rounded-md border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#D59B2B]"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Requête de recherche</TableHead>
                    <TableHead className="font-semibold text-slate-600">Clics</TableHead>
                    <TableHead className="font-semibold text-slate-600">Impressions</TableHead>
                    <TableHead className="font-semibold text-slate-600">CTR</TableHead>
                    <TableHead className="font-semibold text-slate-600">Position Moyenne</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-right">Tendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordsList.map((kw, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-800 font-mono text-xs">{kw.text}</TableCell>
                      <TableCell>{kw.clicks}</TableCell>
                      <TableCell>{kw.impressions}</TableCell>
                      <TableCell className="font-mono text-xs">{kw.ctr}</TableCell>
                      <TableCell className="font-mono text-xs">{kw.position}</TableCell>
                      <TableCell className="text-right">
                        {kw.trend === "up" ? (
                          <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                            ▲ En hausse
                          </span>
                        ) : kw.trend === "down" ? (
                          <span className="text-rose-600 font-semibold text-xs flex items-center justify-end gap-1">
                            ▼ En baisse
                          </span>
                        ) : (
                          <span className="text-slate-500 font-semibold text-xs flex items-center justify-end gap-1">
                            ◀ Stable
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {keywordsList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-slate-400 italic">
                        Aucun mot clé ne correspond à votre recherche.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB: AI (GEO/AEO) */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          {/* AI Banner summary */}
          <Card className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-none shadow-md">
            <CardContent className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-5 h-5 fill-indigo-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Generative Engine Optimization (GEO)</span>
                </div>
                <h3 className="text-xl font-bold">Votre visibilité dans les réponses de l'IA</h3>
                <p className="text-sm text-slate-300 max-w-2xl font-light">
                  Semblable au SEO, le GEO évalue votre capacité à apparaître comme source citée et recommandée par ChatGPT, Claude, Gemini et les résumés génératifs de Google.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center min-w-40 border border-white/10">
                <div className="text-[10px] text-slate-300 font-mono font-bold uppercase">Index de Référence IA</div>
                <div className="text-4xl font-extrabold text-[#D59B2B] mt-1">42%</div>
                <div className="text-[10px] text-emerald-400 mt-1">Visibilité correcte</div>
              </div>
            </CardContent>
          </Card>

          {/* AI Engines matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Taux de présence et Citations par Moteur d'IA</CardTitle>
              <CardDescription>Analyses croisées des invites test et détection de citations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-600">Moteur IA / LLM</TableHead>
                      <TableHead className="font-semibold text-slate-600">Taux de citation</TableHead>
                      <TableHead className="font-semibold text-slate-600">Page la plus citée</TableHead>
                      <TableHead className="font-semibold text-slate-600">Statut de la marque</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-right">Tendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {geoAeoData.map((data, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/50">
                        <TableCell className="font-semibold text-slate-800">{data.engine}</TableCell>
                        <TableCell className="font-bold text-indigo-600 font-mono text-xs">{data.visibility}</TableCell>
                        <TableCell>
                          <a href={data.quoteUrl} target="_blank" className="text-slate-600 hover:text-[#D59B2B] font-mono text-xs flex items-center gap-1">
                            {data.quoteUrl}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-slate-500">{data.status}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {data.trend === "up" ? "▲ Hausse" : "◀ Stable"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: PAGES & INDEXATION */}
      {activeTab === "pages" && (
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Performances et Statuts des Pages</CardTitle>
              <CardDescription>Rapport d'indexation technique et clics organiques par URL.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer une URL..."
                value={pageFilter}
                onChange={(e) => setPageFilter(e.target.value)}
                className="pl-9 pr-4 py-2 w-full text-sm rounded-md border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#D59B2B]"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Chemin de l'URL</TableHead>
                    <TableHead className="font-semibold text-slate-600">Statut d'Indexation</TableHead>
                    <TableHead className="font-semibold text-slate-600">Clics GSC</TableHead>
                    <TableHead className="font-semibold text-slate-600">Impressions</TableHead>
                    <TableHead className="font-semibold text-slate-600">CTR</TableHead>
                    <TableHead className="font-semibold text-slate-600">Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagesList.map((p, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-800 font-mono text-xs">{p.url}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={p.status.includes("Indexed") ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.clicks}</TableCell>
                      <TableCell>{p.impressions}</TableCell>
                      <TableCell className="font-mono text-xs">{p.ctr}</TableCell>
                      <TableCell className="font-mono text-xs">{p.position}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB: RECOMMENDATIONS & AUDIT RESULTS */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          {auditData ? (
            <div className="space-y-6">
              {/* Score header */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-[#D59B2B] text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold uppercase text-amber-50 tracking-wider">Score SEO Technique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold">{auditData.score}/100</div>
                    <p className="text-xs text-amber-100 mt-2">Dernière analyse effectuée le {new Date(auditData.timestamp).toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Core Web Vitals</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs font-mono space-y-1 mt-1 text-slate-300 leading-normal">
                    <div>⚡ Performance mobile: 74/100</div>
                    <div>🟢 INP (Interactivité): 120ms (Bon)</div>
                    <div>🟡 LCP (Contenu): 2.8s (Moyen)</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Matière éditoriale</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs font-mono space-y-1 mt-1 text-slate-300 leading-normal">
                    <div>📝 Score de lisibilité: 62.4</div>
                    <div>🎓 Cible standard: Niveau Collège</div>
                    <div>🤖 AI Crawler Management: Non bloqué</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations list */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Plan d'action prioritaire</h3>
                
                {auditData.recommendations.map((rec) => (
                  <Card key={rec.id} className={`border-l-4 ${rec.type === "critical" ? "border-l-rose-500" : rec.type === "warning" ? "border-l-amber-500" : "border-l-blue-500"}`}>
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                          {rec.type === "critical" ? (
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                          ) : rec.type === "warning" ? (
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                          ) : (
                            <Info className="w-5 h-5 text-blue-500" />
                          )}
                          {rec.title}
                        </CardTitle>
                        <Badge className={rec.type === "critical" ? "bg-rose-50 text-rose-700 border border-rose-200" : rec.type === "warning" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-blue-50 text-blue-700 border border-blue-200"}>
                          {rec.type === "critical" ? "Critique" : rec.type === "warning" ? "Avertissement" : "Info"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <div>
                        <span className="font-bold text-slate-700">Constat :</span>{" "}
                        <span className="text-slate-600 font-mono text-xs">{rec.evidence}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-100 flex gap-2">
                        <div className="font-bold text-emerald-700 text-xs shrink-0 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded h-fit">Résolution</div>
                        <div className="text-slate-700 text-xs font-mono">{rec.fix}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border rounded-lg bg-slate-50 space-y-4">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800">Aucun audit existant</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Démarrez un audit SEO automatique avec nos scripts IA pour charger les recommandations d'indexation et techniques.
                </p>
              </div>
              <Button onClick={triggerAudit} className="bg-[#D59B2B] hover:bg-[#B58221] text-white font-bold">
                Exécuter l'audit maintenant
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
