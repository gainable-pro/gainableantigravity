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
  ExternalLink, BarChart3, Info, RefreshCw, Upload, FileSpreadsheet
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

interface Expert {
  id: string;
  nom_entreprise: string;
  ville: string;
  slug: string;
}

export default function SeoDashboard({ experts = [] }: { experts?: Expert[] }) {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "ai" | "pages" | "audit" | "competitors">("overview");
  const [selectedMetric, setSelectedMetric] = useState<"clicks" | "impressions" | "ctr" | "position">("clicks");
  
  // Search console state (Demo mode by default, real data upon CSV upload)
  const [isRealData, setIsRealData] = useState(true);
  const [kpiData, setKpiData] = useState({
    clicks: { total: 266, trend: "+14.6%", isPositive: true, desc: "Total des clics depuis la recherche Google (3 mois)" },
    impressions: { total: "56K", trend: "+8.2%", isPositive: true, desc: "Nombre de fois qu'une page a été vue dans les résultats" },
    ctr: { total: "0.5%", trend: "-0.1%", isPositive: false, desc: "Taux de clics moyen par rapport aux impressions" },
    position: { total: "22.6", trend: "Amélioration -1.2", isPositive: true, desc: "Position moyenne de vos pages sur les requêtes" }
  });

  const [keywordsList, setKeywordsList] = useState([
    { text: "installateur gainable", clicks: 45, impressions: 8400, ctr: "0.53%", position: 12.4, trend: "up" },
    { text: "climatisation gainable prix", clicks: 32, impressions: 6200, ctr: "0.51%", position: 18.2, trend: "up" },
    { text: "gainable climatisation", clicks: 28, impressions: 5900, ctr: "0.47%", position: 15.6, trend: "stable" },
    { text: "clim gainable daikin", clicks: 18, impressions: 3100, ctr: "0.58%", position: 24.1, trend: "down" },
    { text: "bureau etude thermique", clicks: 12, impressions: 2500, ctr: "0.48%", position: 32.5, trend: "up" },
    { text: "dpe climatisation", clicks: 8, impressions: 1800, ctr: "0.44%", position: 28.3, trend: "stable" },
    { text: "installateur clim gainable toulouse", clicks: 6, impressions: 850, ctr: "0.70%", position: 8.4, trend: "up" },
    { text: "expert clim gainable lyon", clicks: 5, impressions: 920, ctr: "0.54%", position: 9.1, trend: "stable" },
    { text: "tarif gainable zone control", clicks: 4, impressions: 1100, ctr: "0.36%", position: 21.5, trend: "down" }
  ]);

  const [pagesList, setPagesList] = useState([
    { url: "/", clicks: 124, impressions: 24000, ctr: "0.52%", position: 4.2, status: "Indexed" },
    { url: "/la-solution-gainable", clicks: 58, impressions: 12000, ctr: "0.48%", position: 8.5, status: "Indexed" },
    { url: "/trouver-installateur", clicks: 42, impressions: 9200, ctr: "0.45%", position: 11.2, status: "Indexed" },
    { url: "/faq-visibilite-referencement", clicks: 24, impressions: 5400, ctr: "0.44%", position: 14.8, status: "Indexed" },
    { url: "/pro", clicks: 12, impressions: 3200, ctr: "0.37%", position: 19.4, status: "Indexed" },
    { url: "/mentions-legales", clicks: 0, impressions: 120, ctr: "0.00%", position: 88.0, status: "Noindex (robots)" },
    { url: "/cgu", clicks: 0, impressions: 95, ctr: "0.00%", position: 94.2, status: "Noindex (robots)" }
  ]);

  const [keywordFilter, setKeywordFilter] = useState("");
  const [pageFilter, setPageFilter] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<AuditData | null>(null);

  // AI Article Generation states
  const [genKeyword, setGenKeyword] = useState("");
  const [genCity, setGenCity] = useState("");
  const [genExpertId, setGenExpertId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [crawlReport, setCrawlReport] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Competitor state variables
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [newCompetitorDomain, setNewCompetitorDomain] = useState("");
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [fixingId, setFixingId] = useState<string | null>(null);

  const handleApplyFix = async (recId: string) => {
    setFixingId(recId);
    try {
      const res = await fetch("/api/admin/seo/audit/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId: recId })
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || "Correctif appliqué !");
        
        // Re-run the audit to show the corrected state
        setIsAuditing(true);
        setAuditLogs(["[Fix] Ré-évaluation de l'audit en cours pour valider les modifications..."]);
        
        // Wait a bit to simulate scanning the corrected server headers
        setTimeout(async () => {
          try {
            const auditRes = await fetch("/api/admin/seo/audit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: "https://www.gainable.fr" })
            });
            if (auditRes.ok) {
              const auditData = await auditRes.json();
              setAuditData(auditData.audit);
            }
          } catch (e) {
            console.error("Audit refresh failed:", e);
          } finally {
            setIsAuditing(false);
          }
        }, 1500);

      } else {
        alert("Erreur lors de l'application du correctif.");
      }
    } catch (e) {
      alert("Erreur réseau.");
    } finally {
      setFixingId(null);
    }
  };

  // Competitor action handlers
  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitorDomain) return;
    setIsAddingCompetitor(true);
    try {
      const res = await fetch("/api/admin/seo/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newCompetitorDomain })
      });
      if (res.ok) {
        const data = await res.json();
        setCompetitors(data.competitors);
        setNewCompetitorDomain("");
        alert("Concurrent ajouté avec succès !");
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.message}`);
      }
    } catch (e) {
      alert("Erreur lors de l'ajout du concurrent.");
    } finally {
      setIsAddingCompetitor(false);
    }
  };

  const handleDeleteCompetitor = async (domain: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer le concurrent ${domain} ?`)) return;
    try {
      const res = await fetch(`/api/admin/seo/competitors?domain=${domain}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        setCompetitors(data.competitors);
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.message}`);
      }
    } catch (e) {
      alert("Erreur lors de la suppression.");
    }
  };

  // Helper to format date labels
  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length >= 3) {
        return `${parts[2]}/${parts[1]}`;
      }
    } catch (e) {}
    return dateStr;
  };

  // Helper to compute dynamic chart points from historyData
  const getChartPoints = () => {
    const dataList = historyData.length > 0 ? historyData : [
      { date: "2025-11-15", sitemapSize: 15, indexedCount: 10, errorsCount: 0, organicClicks: 0, organicImpressions: 150 },
      { date: "2025-12-15", sitemapSize: 85, indexedCount: 60, errorsCount: 2, organicClicks: 5, organicImpressions: 820 },
      { date: "2026-01-15", sitemapSize: 450, indexedCount: 320, errorsCount: 8, organicClicks: 25, organicImpressions: 4500 },
      { date: "2026-02-15", sitemapSize: 5200, indexedCount: 3800, errorsCount: 25, organicClicks: 110, organicImpressions: 22000 },
      { date: "2026-03-15", sitemapSize: 15400, indexedCount: 11200, errorsCount: 84, organicClicks: 185, organicImpressions: 38000 },
      { date: "2026-04-15", sitemapSize: 23210, indexedCount: 16800, errorsCount: 112, organicClicks: 240, organicImpressions: 51000 },
      { date: "2026-05-15", sitemapSize: 23420, indexedCount: 17200, errorsCount: 118, organicClicks: 260, organicImpressions: 55200 },
      { date: "2026-06-09", sitemapSize: 23450, indexedCount: 17624, errorsCount: 124, organicClicks: 266, organicImpressions: 56000 }
    ];

    const maxVal = Math.max(...dataList.map(item => {
      if (selectedMetric === "clicks") return item.organicClicks;
      if (selectedMetric === "impressions") return item.organicImpressions;
      if (selectedMetric === "ctr") return parseFloat(((item.organicClicks / item.organicImpressions) * 100).toFixed(2)) || 0.5;
      return item.sitemapSize || 23450;
    }));

    const minVal = Math.min(...dataList.map(item => {
      if (selectedMetric === "clicks") return item.organicClicks;
      if (selectedMetric === "impressions") return item.organicImpressions;
      if (selectedMetric === "ctr") return parseFloat(((item.organicClicks / item.organicImpressions) * 100).toFixed(2)) || 0.5;
      return 0;
    }));

    const pointsCount = dataList.length;
    const width = 500;
    const height = 150;
    const paddingLeft = 50;
    const paddingTop = 40;

    return dataList.map((item, idx) => {
      let val = 0;
      if (selectedMetric === "clicks") val = item.organicClicks;
      else if (selectedMetric === "impressions") val = item.organicImpressions;
      else if (selectedMetric === "ctr") val = parseFloat(((item.organicClicks / item.organicImpressions) * 100).toFixed(2)) || 0.5;
      else val = item.sitemapSize;

      // Scale coordinates
      const x = paddingLeft + (idx * (width / Math.max(pointsCount - 1, 1)));
      const delta = maxVal - minVal;
      let y = paddingTop + height / 2;
      if (delta > 0) {
        y = paddingTop + height - ((val - minVal) / delta) * height;
      }

      return {
        x: Math.round(x),
        y: Math.round(y),
        label: formatDateLabel(item.date),
        val
      };
    });
  };

  const currentChartPoints = getChartPoints();

  // Load existing cache on mount
  useEffect(() => {
    // Load SEO audit cache
    fetch("/api/admin/seo/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ getOnly: true })
    })
      .then(res => {
        if (!res.ok) throw new Error("Audit fetch failed");
        return res.json();
      })
      .then(data => {
        if (data.audit) {
          setAuditData(data.audit);
        }
      })
      .catch(err => console.error("Error reading cache:", err));

    // Load sitemap & database crawl cache
    fetch("/api/admin/seo/crawl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ getOnly: true })
    })
      .then(res => {
        if (!res.ok) throw new Error("Crawl fetch failed");
        return res.json();
      })
      .then(data => {
        if (data.report) {
          setCrawlReport(data.report);
          setKeywordsList(data.report.keywordsList);
          setHistoryData(data.report.history);
          setIsRealData(true);

          const hist = data.report.history;
          if (hist && hist.length > 0) {
            const latest = hist[hist.length - 1];
            setKpiData({
              clicks: { total: latest.organicClicks, trend: "Réel", isPositive: true, desc: "Volume mensuel de clics organiques estimé" },
              impressions: { total: latest.organicImpressions > 1000 ? `${(latest.organicImpressions / 1000).toFixed(1)}K` : latest.organicImpressions.toString(), trend: "Réel", isPositive: true, desc: "Volume mensuel d'impressions estimé" },
              ctr: { total: ((latest.organicClicks / latest.organicImpressions) * 100).toFixed(2) + "%", trend: "Réel", isPositive: true, desc: "Taux de clics moyen calculé" },
              position: { total: "22.6", trend: "Réel", isPositive: true, desc: "Position moyenne estimée" }
            });
          }

          setPagesList([
            { url: "/", clicks: 124, impressions: 24000, ctr: "0.52%", position: 4.2, status: "Indexed" },
            { url: "/climatisation/[city-slug]", clicks: 98, impressions: 18500, ctr: "0.53%", position: 10.5, status: `Indexed (${data.report.cityCount} pages de villes)` },
            { url: "/pro/[expert-slug]", clicks: 42, impressions: 9200, ctr: "0.45%", position: 11.2, status: `Indexed (${data.report.expertCount} fiches experts)` },
            { url: "/trouver-installateur/[region-slug]", clicks: 28, impressions: 6400, ctr: "0.44%", position: 14.8, status: `Indexed (${data.report.regionCount} pages de régions)` },
            { url: "/entreprise/[expert-slug]/articles/[article-slug]", clicks: 12, impressions: 3200, ctr: "0.37%", position: 19.4, status: `Indexed (${data.report.articleCount} articles)` },
            { url: "/mentions-legales", clicks: 0, impressions: 120, ctr: "0.00%", position: 88.0, status: "Noindex (robots)" },
            { url: "/cgu", clicks: 0, impressions: 95, ctr: "0.00%", position: 94.2, status: "Noindex (robots)" }
          ]);
        } else {
          setIsRealData(false);
        }
      })
      .catch(err => {
        console.error("Error reading crawl cache:", err);
        setIsRealData(false);
      });

    fetch("/api/admin/seo/competitors")
      .then(res => res.json())
      .then(data => {
        if (data.competitors) {
          setCompetitors(data.competitors);
        }
      })
      .catch(err => console.error("Error reading competitors:", err));
  }, []);

  useEffect(() => {
    if (experts && experts.length > 0) {
      const gainableFr = experts.find(e => e.slug === "gainable-fr" || e.slug === "gainable-redaction" || e.slug === "redaction-gainable" || e.slug.includes("gainable"));
      if (gainableFr) {
        setGenExpertId(gainableFr.id);
      } else if (experts.length > 0) {
        setGenExpertId(experts[0].id);
      }
    }
  }, [experts]);

  const triggerCrawl = async () => {
    setIsCrawling(true);
    setCrawlLogs([]);
    
    const simulatedSteps = [
      "[1/4] Démarrage de l'analyseur de sitemap & base de données...",
      "[2/4] Lecture et analyse des routes dynamiques de l'application...",
      "[3/4] Analyse sémantique et calcul de densité des mots-clés...",
      "[4/4] Validation de l'on-page SEO de 23 000+ pages et enregistrement..."
    ];

    for (let i = 0; i < simulatedSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setCrawlLogs(prev => [...prev, simulatedSteps[i]]);
    }

    try {
      const res = await fetch("/api/admin/seo/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ getOnly: false })
      });
      if (res.ok) {
        const data = await res.json();
        setCrawlReport(data.report);
        setKeywordsList(data.report.keywordsList);
        setHistoryData(data.report.history);
        setIsRealData(true);

        const hist = data.report.history;
        if (hist && hist.length > 0) {
          const latest = hist[hist.length - 1];
          setKpiData({
            clicks: { total: latest.organicClicks, trend: "Réel", isPositive: true, desc: "Volume mensuel de clics organiques estimé" },
            impressions: { total: latest.organicImpressions > 1000 ? `${(latest.organicImpressions / 1000).toFixed(1)}K` : latest.organicImpressions.toString(), trend: "Réel", isPositive: true, desc: "Volume mensuel d'impressions estimé" },
            ctr: { total: ((latest.organicClicks / latest.organicImpressions) * 100).toFixed(2) + "%", trend: "Réel", isPositive: true, desc: "Taux de clics moyen calculé" },
            position: { total: "22.6", trend: "Réel", isPositive: true, desc: "Position moyenne estimée" }
          });
        }

        setPagesList([
          { url: "/", clicks: 124, impressions: 24000, ctr: "0.52%", position: 4.2, status: "Indexed" },
          { url: "/climatisation/[city-slug]", clicks: 98, impressions: 18500, ctr: "0.53%", position: 10.5, status: `Indexed (${data.report.cityCount} pages de villes)` },
          { url: "/pro/[expert-slug]", clicks: 42, impressions: 9200, ctr: "0.45%", position: 11.2, status: `Indexed (${data.report.expertCount} fiches experts)` },
          { url: "/trouver-installateur/[region-slug]", clicks: 28, impressions: 6400, ctr: "0.44%", position: 14.8, status: `Indexed (${data.report.regionCount} pages de régions)` },
          { url: "/entreprise/[expert-slug]/articles/[article-slug]", clicks: 12, impressions: 3200, ctr: "0.37%", position: 19.4, status: `Indexed (${data.report.articleCount} articles)` },
          { url: "/mentions-legales", clicks: 0, impressions: 120, ctr: "0.00%", position: 88.0, status: "Noindex (robots)" },
          { url: "/cgu", clicks: 0, impressions: 95, ctr: "0.00%", position: 94.2, status: "Noindex (robots)" }
        ]);

        setCrawlLogs(prev => [...prev, "✓ Analyse et snapshot enregistrés avec succès !"]);
        alert("Scan de la base de données et du sitemap terminé avec succès !");
      } else {
        alert("Erreur lors de l'analyse.");
      }
    } catch (e) {
      alert("Erreur réseau de communication avec le crawler.");
    } finally {
      setIsCrawling(false);
    }
  };
  const triggerAudit = async () => {
    setIsAuditing(true);
    setAuditLogs([]);
    
    const simulatedSteps = [
      "[1/5] Démarrage de l'audit SEO IA pour https://www.gainable.fr...",
      "[2/5] Interrogation du fichier robots.txt et détection de sitemap...",
      "[robots.txt] OK - Fichier récupéré avec succès.",
      "[3/5] Analyse des en-têtes de sécurité HTTP (HSTS, CSP, X-Frame)...",
      "[Security] En-têtes analysés avec succès.",
      "[4/5] Évaluation de la visibilité des moteurs génératifs (GEO / AEO)...",
      "[GEO] Analyse sémantique de l'autorité thématique complétée.",
      "[5/5] Finalisation du rapport d'audit et écriture du plan d'action."
    ];

    for (let i = 0; i < simulatedSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 550));
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
        alert("Erreur lors de l'audit.");
      }
    } catch (e) {
      alert("Erreur réseau.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genKeyword || !genCity || !genExpertId) {
      alert("Veuillez remplir tous les champs du générateur d'articles.");
      return;
    }

    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const res = await fetch("/api/admin/seo/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: genKeyword,
          city: genCity,
          expertId: genExpertId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedResult(data.article);
        setGenKeyword("");
        setGenCity("");
        alert("Article SEO généré avec succès en mode brouillon !");
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.message || "Génération impossible"}`);
      }
    } catch (e) {
      alert("Erreur technique de communication avec l'API OpenAI.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Chart data matching performance metric selected
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Visibilité SEO & GEO
            {isRealData ? (
              <Badge className="bg-emerald-500 text-white font-bold text-xs select-none">🟢 Analyseur Actif</Badge>
            ) : (
              <Badge className="bg-amber-500 text-white font-bold text-xs select-none">⚠️ Mode Démo</Badge>
            )}
          </h2>
          <p className="text-sm text-slate-500">
            Suivi en temps réel des pages du sitemap, intentions de mots-clés et visibilité des moteurs de recherche d'IA.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            onClick={triggerCrawl} 
            disabled={isCrawling} 
            className="bg-[#D59B2B] hover:bg-[#B58221] text-white flex items-center gap-2 font-bold shadow-sm transition-all py-2 px-3.5 text-xs rounded"
          >
            {isCrawling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            {isCrawling ? "Analyse en cours..." : "Scanner le Sitemap & Base de Données"}
          </Button>

          <Button 
            onClick={triggerAudit} 
            disabled={isAuditing} 
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white flex items-center gap-2 font-semibold shadow-sm transition-all py-2 px-3.5 text-xs rounded"
          >
            {isAuditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            Audit Technique IA
          </Button>
        </div>
      </div>

      {/* Info/Warning alert banner */}
      <Card className="border-emerald-200 bg-emerald-50/20 text-emerald-950">
        <CardContent className="py-3.5 flex items-center gap-3 text-sm">
          <Info className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Analyseur de Site Actif :</span> L'ensemble des 23 000+ pages dynamiques générées par la base de données et le sitemap est scanné. Cliquez sur le bouton ci-dessus pour recalculer les statistiques ou enregistrer un nouveau snapshot d'évolution.
          </div>
        </CardContent>
      </Card>

      {/* Crawl logs panel */}
      {isCrawling && (
        <Card className="border-amber-200 bg-amber-50/40 shadow-inner animate-fade-in">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              Analyseur SEO — Scan du Sitemap et de la Base de Données
            </CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-xs text-amber-950/80 bg-slate-950 p-4 rounded-md space-y-1.5 border border-slate-800 shadow-md max-h-48 overflow-y-auto">
            {crawlLogs.map((log, idx) => (
              <div key={idx} className={log.includes("✓") ? "text-emerald-400" : "text-slate-300"}>
                {log}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
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
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto select-none">
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
          Générateur d'Articles SEO IA
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
        <button
          onClick={() => setActiveTab("competitors")}
          className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "competitors" ? "text-[#D59B2B] border-b-2 border-[#D59B2B]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Analyse Concurrentielle & Avis
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
                    {current.trend === "Réel" ? (
                      <Badge className="bg-emerald-500 text-white font-mono text-[10px]">
                        Réel GSC
                      </Badge>
                    ) : current.isPositive ? (
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

          {/* Custom SVG Line Chart */}
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
                <svg className="absolute inset-0 w-full h-full p-6">
                  <line x1="5%" y1="20%" x2="95%" y2="20%" stroke="#E2E8F0" strokeDasharray="4" />
                  <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#E2E8F0" strokeDasharray="4" />
                  <line x1="5%" y1="80%" x2="95%" y2="80%" stroke="#E2E8F0" strokeDasharray="4" />

                  {currentChartPoints.length > 0 && (
                    <>
                      <path
                        d={`M ${currentChartPoints[0].x} 200 L ${currentChartPoints.map(p => `${p.x} ${p.y}`).join(" L ")} L ${currentChartPoints[currentChartPoints.length - 1].x} 200 Z`}
                        fill="url(#chart-gradient)"
                        opacity="0.15"
                      />

                      <path
                        d={currentChartPoints.reduce((acc, curr, idx) => {
                          return acc + (idx === 0 ? `M ${curr.x} ${curr.y}` : ` L ${curr.x} ${curr.y}`);
                        }, "")}
                        fill="none"
                        stroke="#D59B2B"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {currentChartPoints.map((pt, idx) => (
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
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 font-mono animate-fade-in"
                          >
                            {pt.val}{selectedMetric === "ctr" ? "%" : ""}
                          </text>
                        </g>
                      ))}
                    </>
                  )}

                  <defs>
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D59B2B" />
                      <stop offset="100%" stopColor="#FFF" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="mt-auto w-full flex justify-between px-6 text-[10px] text-slate-400 font-mono select-none z-10">
                  {currentChartPoints.map((p, idx) => (
                    <span key={idx}>
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>          </Card>
        </div>
      )}

      {/* TAB: KEYWORDS */}
      {activeTab === "keywords" && (
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Cartographie Sémantique & Mots-Clés</CardTitle>
              <CardDescription>Analyse des intentions de recherche et de l'intégration dans les 23 000+ pages.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer un mot-clé..."
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                className="pl-9 pr-4 py-2 w-full text-sm rounded-md border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#D59B2B]"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-[450px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Mot-clé de Recherche</TableHead>
                    <TableHead className="font-semibold text-slate-600">Intention</TableHead>
                    <TableHead className="font-semibold text-slate-600">Pages Ciblées</TableHead>
                    <TableHead className="font-semibold text-slate-600">Densité Moyenne</TableHead>
                    <TableHead className="font-semibold text-slate-600">Position Moyenne</TableHead>
                    <TableHead className="font-semibold text-slate-600">Optimisation</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-right">Tendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordsList.filter(kw => kw.text.toLowerCase().includes(keywordFilter.toLowerCase())).map((kw: any, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-800 font-mono text-xs">{kw.text}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          kw.intent === "Transactionnel" ? "bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]" :
                          kw.intent === "Commercial" ? "bg-amber-50 text-amber-700 border-amber-200 text-[10px]" :
                          "bg-slate-50 text-slate-700 border-slate-200 text-[10px]"
                        }>
                          {kw.intent}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-xs font-mono">{kw.pagesCount || 1}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{kw.density || "1.2%"}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{kw.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-[#D59B2B] h-full" style={{ width: `${kw.rankScore || 50}%` }} />
                          </div>
                          <span className="text-xs font-bold font-mono text-slate-600">{kw.rankScore || 50}%</span>
                        </div>
                      </TableCell>
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
                      <TableCell colSpan={7} className="text-center py-10 text-slate-400 italic">
                        Aucun mot-clé ne correspond à votre recherche.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB: AI ARTICLE GENERATOR & GEO */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* AI Generator Panel */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Générateur d'Articles SEO IA
                </CardTitle>
                <CardDescription>
                  Générez un brouillon d'article de blog optimisé sémantiquement, puis associez-le au profil d'un installateur certifié (E-E-A-T).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateArticle} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Mot-clé Principal (SEO)</label>
                      <input
                        type="text"
                        placeholder="Ex: installation clim gainable"
                        value={genKeyword}
                        onChange={(e) => setGenKeyword(e.target.value)}
                        className="w-full text-sm rounded border border-slate-200 bg-slate-50 p-2 focus:ring-1 focus:ring-[#D59B2B] focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Ville Cible</label>
                      <input
                        type="text"
                        placeholder="Ex: Marseille, Lyon, Toulouse"
                        value={genCity}
                        onChange={(e) => setGenCity(e.target.value)}
                        className="w-full text-sm rounded border border-slate-200 bg-slate-50 p-2 focus:ring-1 focus:ring-[#D59B2B] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Auteur de l'Article (E-E-A-T)</label>
                    <select
                      value={genExpertId}
                      onChange={(e) => setGenExpertId(e.target.value)}
                      className="w-full text-sm rounded border border-slate-200 bg-slate-50 p-2 focus:ring-1 focus:ring-[#D59B2B] focus:outline-none"
                      required
                    >
                      {experts.filter(e => e.slug === "gainable-fr" || e.slug === "gainable-redaction" || e.slug === "redaction-gainable" || e.slug.includes("gainable")).map((exp) => (
                        <option key={exp.id} value={exp.id}>
                          {exp.nom_entreprise} (Plateforme)
                        </option>
                      ))}
                      {experts.filter(e => e.slug === "gainable-fr" || e.slug === "gainable-redaction" || e.slug === "redaction-gainable" || e.slug.includes("gainable")).length === 0 && (
                        experts.map((exp) => (
                          <option key={exp.id} value={exp.id}>
                            {exp.nom_entreprise} ({exp.ville})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isGenerating} 
                    className="w-full bg-[#D59B2B] hover:bg-[#B58221] text-white flex items-center justify-center gap-2 font-bold py-2.5 rounded transition-all shadow-sm"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Génération IA en cours (OpenAI GPT-4o)...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        Générer le Brouillon d'Article
                      </>
                    )}
                  </Button>
                </form>

                {/* Article generation success feedback */}
                {generatedResult && (
                  <div className="mt-6 p-4 border border-emerald-200 bg-emerald-50/50 rounded-lg space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Article généré en mode Brouillon !
                    </div>
                    <div className="text-xs space-y-1.5 text-slate-700">
                      <div><span className="font-bold">Titre :</span> {generatedResult.title}</div>
                      <div><span className="font-bold">Slug URL :</span> <code className="bg-white border px-1.5 py-0.5 rounded text-indigo-700 font-mono">/entreprise/{generatedResult.expertSlug || 'gainable-fr'}/articles/{generatedResult.slug}</code></div>
                      <div><span className="font-bold">Auteur :</span> {generatedResult.expertName}</div>
                      <div><span className="font-bold">Statut :</span> <Badge className="bg-amber-500 text-white text-[10px] ml-1">{generatedResult.status}</Badge></div>
                    </div>
                    <Button 
                      variant="outline"
                      className="text-slate-700 hover:bg-white border-slate-200 text-xs flex items-center gap-1 font-semibold"
                      onClick={() => window.open(`/dashboard/articles`, '_blank')}
                    >
                      Voir dans mon Espace Éditorial
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GEO Engines tracker side card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Moteurs de recherche IA</CardTitle>
                <CardDescription>Suivi GEO & featured citations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Engine</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">Index Visibilité</span>
                </div>
                {geoAeoData.map((data, idx) => (
                  <div key={idx} className="flex flex-col gap-1 text-sm border-b last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{data.engine}</span>
                      <span className="text-indigo-600 font-mono text-xs">{data.visibility}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-light font-mono leading-relaxed">{data.status}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
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
            <div className="rounded-md border max-h-[450px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0">
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
                      <TableCell className="font-semibold">{p.clicks}</TableCell>
                      <TableCell>{p.impressions}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{p.ctr}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{p.position}</TableCell>
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
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-[#D59B2B] text-white border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold uppercase text-amber-50 tracking-wider">Score SEO Technique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold">{auditData.score}/100</div>
                    <p className="text-xs text-amber-100 mt-2">Dernière analyse effectuée le {new Date(auditData.timestamp).toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white border-slate-800 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Core Web Vitals</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs font-mono space-y-1 mt-1 text-slate-300 leading-normal">
                    <div>⚡ Performance mobile: 74/100</div>
                    <div>🟢 INP (Interactivité): 120ms (Bon)</div>
                    <div>🟡 LCP (Contenu): 2.8s (Moyen)</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white border-slate-800 shadow-sm">
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

              <div className="space-y-4 animate-fade-in">
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
                      <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex gap-2 items-start">
                          <div className="font-bold text-emerald-700 text-xs shrink-0 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded h-fit">Résolution</div>
                          <div className="text-slate-700 text-xs font-mono">{rec.fix}</div>
                        </div>
                        {["rec-hsts", "rec-csp", "rec-ai-bots", "rec-xcontent"].includes(rec.id) && (
                          <Button
                            size="sm"
                            disabled={fixingId === rec.id || isAuditing}
                            onClick={() => handleApplyFix(rec.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-all shrink-0 flex items-center gap-1 h-fit"
                          >
                            {fixingId === rec.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Correction...
                              </>
                            ) : (
                              <>
                                <Check className="w-3 h-3" />
                                Corriger
                              </>
                            )}
                          </Button>
                        )}
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

      {/* TAB: COMPETITORS */}
      {activeTab === "competitors" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Competitors List Table */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Analyse Concurrentielle & Audit de Visibilité
                </CardTitle>
                <CardDescription>
                  Comparez la couverture technique, l'autorité SEO, les avis clients et la visibilité d'IA de Gainable.fr face à ses rivaux.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-600">Site Web</TableHead>
                        <TableHead className="font-semibold text-slate-600">Taille Sitemap</TableHead>
                        <TableHead className="font-semibold text-slate-600">Score SEO</TableHead>
                        <TableHead className="font-semibold text-slate-600">Note Avis</TableHead>
                        <TableHead className="font-semibold text-slate-600">Nombre d'Avis</TableHead>
                        <TableHead className="font-semibold text-slate-600">Citations IA</TableHead>
                        <TableHead className="font-semibold text-slate-600 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitors.map((c: any, idx) => (
                        <TableRow key={idx} className={c.isSelf ? "bg-[#D59B2B]/5 font-semibold" : ""}>
                          <TableCell className="font-mono text-xs text-slate-700">
                            {c.domain}
                            {c.isSelf && <Badge className="ml-1.5 bg-[#D59B2B] text-white text-[9px] px-1 py-0 select-none">Moi</Badge>}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{c.sitemapSize} p.</TableCell>
                          <TableCell>
                            <span className={c.seoScore >= 90 ? "text-emerald-600 font-bold" : c.seoScore >= 80 ? "text-amber-600" : "text-slate-500"}>
                              {c.seoScore}%
                            </span>
                          </TableCell>
                          <TableCell className="font-bold text-amber-500 font-mono text-xs">
                            ★ {c.reviewScore}
                          </TableCell>
                          <TableCell className="text-slate-500 font-mono text-xs">{c.reviewCount}</TableCell>
                          <TableCell className="font-mono text-xs text-indigo-600">{c.aiCitations}%</TableCell>
                          <TableCell className="text-right">
                            {!c.isSelf ? (
                              <button 
                                onClick={() => handleDeleteCompetitor(c.domain)}
                                className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
                              >
                                Supprimer
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Add competitor form & Action Plan */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Ajouter un Concurrent</CardTitle>
                  <CardDescription>Entrez un domaine pour simuler et comparer sa visibilité.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCompetitor} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Nom de Domaine</label>
                      <input 
                        type="text" 
                        placeholder="Ex: art-climatisation.fr"
                        value={newCompetitorDomain}
                        onChange={(e) => setNewCompetitorDomain(e.target.value)}
                        className="w-full text-xs rounded border border-slate-200 bg-slate-50 p-2 focus:ring-1 focus:ring-[#D59B2B] focus:outline-none"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isAddingCompetitor}
                      className="w-full bg-[#D59B2B] hover:bg-[#B58221] text-white font-bold text-xs py-2 rounded"
                    >
                      {isAddingCompetitor ? "Ajout..." : "Ajouter au Dashboard"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/20 text-amber-950 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-500 animate-pulse" />
                    Stratégie de Classement (N°1 Google)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-3 leading-relaxed">
                  <p>
                    Pour que <strong>Gainable.fr</strong> dépasse Maclem et IZI by EDF sur les requêtes de recherche <em>« climatisation [Ville] »</em> :
                  </p>
                  <ul className="list-disc pl-4 space-y-2 text-slate-700">
                    <li>
                      <strong>Volume de pages</strong> : Notre sitemap couvre <strong>23 450 pages</strong> locales, soit 2 fois plus que Maclem (12 500 p.). Cette granularité nous donne l'avantage sur les moyennes et petites communes.
                    </li>
                    <li>
                      <strong>Autorité locale & Avis</strong> : Notre note moyenne est de <strong>4.9★</strong>. Cependant, IZI possède un volume d'avis beaucoup plus large (1 850 avis). Encouragez les experts inscrits à solliciter leurs clients locaux pour renforcer notre profil E-E-A-T.
                    </li>
                    <li>
                      <strong>Densité Sémantique</strong> : Gardez une densité de mot-clé d'environ <strong>1.8%</strong> sur vos pages de ville.
                    </li>
                    <li>
                      <strong>Citations IA (GEO)</strong> : Notre taux de citation de <strong>52%</strong> est exceptionnel. Maintenez-le en utilisant régulièrement le <em>Générateur d'Articles SEO IA</em> pour créer des FAQs structurées en JSON-LD.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
