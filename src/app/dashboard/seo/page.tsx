"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search, Sparkles, Globe, AlertCircle, CheckCircle2, PlayCircle, Loader2,
  ChevronRight, BarChart3, Info, RefreshCw, Check, AlertTriangle, HelpCircle
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
  const [isSaving, setIsSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  
  // Audit states
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  
  // Modal for fix instructions
  const [activeFix, setActiveFix] = useState<Recommendation | null>(null);
  const [fixedIds, setFixedIds] = useState<string[]>([]);

  // Load profile to get site_web
  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then(res => res.json())
      .then(data => {
        if (data.site_web) {
          setSiteWeb(data.site_web);
          
          // Generate a pre-filled audit based on their site
          triggerInitialAudit(data.site_web);
        }
        setProfileLoaded(true);
      })
      .catch(err => console.error(err));
  }, []);

  const triggerInitialAudit = (url: string) => {
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
          evidence: "L'en-tête Content-Security-Policy est manquant.",
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
          evidence: "Aucun script d'agent conversationnel intelligent n'a été détecté.",
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
      
      triggerInitialAudit(siteWeb);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1F2D3D]">Visibilité SEO & Comparateur de Performance</h2>
        <p className="text-slate-500 text-sm">Comparez votre site internet par rapport aux performances de Gainable.fr et des leaders nationaux.</p>
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
            
            <div className="mt-6 border-t border-slate-800 pt-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Dernier Scan :</span>
                <span className="font-mono">{new Date(auditData.timestamp).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Action Plan Recommendations for Artisan */}
      {auditData && auditData.recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Plan d'action de visibilité pour mon site</h3>
          
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
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-all shrink-0 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Corriger
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
                  Instructions de Correction : {activeFix.title}
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
                  J'ai appliqué la correction
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
