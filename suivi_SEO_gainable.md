# Suivi SEO Gainable.fr — Tableau de Bord & Historique Permanent

> **Déclencheur d'activation :** Dès que la commande ou la phrase **« Suivi SEO gainable »** est mentionnée dans une conversation, ce document sert de référentiel absolu et immuable. Il consigne l'historique exact des faits, les commits Git déployés, les causes techniques et les métriques réelles pour ne rien inventer et piloter méthodiquement la remontée vers la **première place nationale**.

---

## 🎯 OBJECTIFS STRATÉGIQUES
1. **Tête de listing Google (Top 1 à 3)** sur les requêtes stratégiques : *climatisation gainable*, *pompe à chaleur gainable*, *devis gainable*, *installateur gainable [ville]*.
2. **Réindexation maximale** : Faire remonter le volume de pages indexées vers la totalité des **59 350 pages** sans jamais déclencher de filtre qualité.
3. **Explosion des impressions & du taux de clic (CTR)** : Capter le trafic de transition automne/hiver (PAC réversible & chauffage) et maximiser le clic grâce aux étoiles d'avis clients (**Rich Snippets `AggregateRating`**).
4. **Devenir la référence incontournable du secteur CVC & Gainable en France.**

---

## 📊 1. ÉTAT DES LIEUX & VOLUMÉTRIE DU SITE (AU 11 NOVEMBRE 2026)

### Répartition réelle des pages du site
| Type de contenu | Nombre de pages | État Sitemap GSC | Rôle SEO |
| :--- | :---: | :---: | :--- |
| **Articles & Guides métiers** | **56 277** | Sitemaps `0.xml` à `12.xml` | Longue traîne locale, RE2020, DPE, installations |
| **Pages Villes locales** | **2 554** | Sitemap `0.xml` (Priorité 0.90) | Cibles transactionnelles par commune (`/climatisation/[ville]`) |
| **Fiches matériel catalogue** | **389** | Sitemap `0.xml` (Priorité 0.85) | Références fabricants (Daikin, Mitsubishi, Airzone...) |
| **Profils Experts & Artisans certifiés** | **32** | Sitemap `0.xml` (Priorité 0.95) | Fiches d'autorité E-E-A-T avec étoiles d'avis (`/pro/[slug]`) |
| **Pages piliers institutionnelles** | **~20** | Sitemap `0.xml` (Priorité 1.0) | Accueil, trouver installateur, devis, labels, CGU, CGV |
| **TOTAL DES PAGES DU SITE** | **59 350** | **14 sitemaps soumis** | **100 % opérationnelles et indexables** |

---

## 🔍 2. CHRONOLOGIE DES FAITS & HISTORIQUE DES COMMITS

### Détail des pushs et correctifs déployés :

#### 1. Commit `b3f5d4a` (04/11/2026) — Moteur SEO & Éradication des fausses 404
* **Suppression des faux codes 404** : Intégration de `withDbRetry()` dans `src/lib/prisma.ts` pour retenter automatiquement les requêtes en cas de surcharge de connexion, éliminant les 404 cachées en ISR.
* **Sécurisation des Sitemaps** : Dans `src/app/sitemap/[id]/route.ts`, suppression du fallback 200 OK vide. En cas de latence serveur, renvoi d'un code `503 Service Unavailable` avec `Cache-Control: no-store`, empêchant Googlebot de désindexer le site sur un incident passager.
* **Correction du maillage Air G Énergie** : Remplacement du lien erroné vers Bordeaux par le slug officiel `/pro/climatisation-pompe-a-chaleur-miramas-air-g-energie-8907` avec redirections 301.

#### 2. Commit `5502ff6` (04/11/2026) — Préservation intégrale des 56 277 articles
* Maintien de **100 % des articles en statut indexable** dans les sitemaps `0.xml` à `12.xml`, en accordant la priorité maximale (`0.90` à `0.95`) aux vrais artisans certifiés pour canaliser le jus de crawl Googlebot.

#### 3. Commit `708c8f8` (04/11/2026) — Étoiles d'avis Google (Rich Snippets)
* Injection du schéma JSON-LD `AggregateRating` sur les profils `/pro/[slug]` (ex : note de 4.9 avec 19 avis pour AIR G ENERGIE) pour afficher les étoiles dorées dans les SERP et doubler le taux de clic (CTR).

#### 4. Commits `92517da` & `0819fb7` (04/11/2026) — Automatisation Google Indexing API
* Connexion du compte de service propriétaire Google Cloud (`src/lib/google-indexing.ts` via `googleapis`) : envoi d'un ping direct à Googlebot à chaque publication d'article ou validation d'artisan en admin.

#### 5. Commit `df229fb` (10/11/2026) — Correction Canonical Dynamique
* Dans `src/app/layout.tsx`, passage du canonical fixe `https://www.gainable.fr` à `./` pour éliminer les avertissements d'URL canonique en doublon sur les pages internes et sur les domaines internationaux (`gainable.ch`, `gainable.ca`...).

#### 6. Commit `541a8a8` (12/11/2026) — Système des 3 Paliers Commerciaux (10%, 13%, 17%)
* **Base de données & CRM** : Ajout de `commissionRate` (10, 13, 17) et `commissionTier` (Débutant, Confirmé, Expert) sur `CommercialProfile`. Tous les commerciaux déjà inscrits restent maintenus à **17% (Expert)**.
* **Dashboard Admin Commerciaux** : Ajout d'un sélecteur dynamique de palier (Débutant 10%, Confirmé 13%, Expert 17%) à côté de chaque commercial avec mise à jour en temps réel via l'API `PATCH /api/admin/commercial-activity`.
* **Simulateur de Rémunération Réadapté** : Intégration des 3 paliers interactifs avec explication du taux selon le profil/expérience et réévaluation systématique au bout de 1 mois d'activité. Suppression définitive de la récurrence de 10%.

#### 7. Commit `8680ef1` (12/11/2026) — Règle Anti-Réservation & Chrono 40 Jours avec Remise en Base
* **Règle anti-réservation par appel téléphonique** : Obligation d'avoir réellement contacté l'entreprise par téléphone (message vocal, échange, RDV ou refus) avant de pouvoir s'attribuer une fiche CRM. Fin de la réservation passive en 'Non contacté'.
* **Date d'attribution & Chrono 40 jours** : Ajout de `assignedAt` en base et calcul dynamique d'un compte à rebours de 40 jours affiché sur la liste des prospects et sur chaque fiche individuelle avec barre de progression temporelle.
* **Remise automatique en base commune** : Passé le délai de 40 jours sans vente validée, la fiche est automatiquement libérée et réintègre le vivier public (Base CVC 37k & Google Local) pour être prospectée par d'autres commerciaux.

#### 8. Audit Complet & Vague de 7 Correctifs SEO/GEO (16/11/2026) — Score initial 78/100 (`gainable.fr-audit/audit-data.json`)
Enregistrement de 4 baselines `seo-drift` pré-déploiement, puis déploiement de 7 commits correctifs en production :
* **`4001929`** — Redirection permanente `/devis` → `/trouver-installateur` (HTTP 308), exclusion des routes `noindex` de `sitemap/0.xml`, sécurisation des métadonnées `canonical` sur `/pro/[slug]`.
* **`84db210`** — Autorisation explicite `OAI-SearchBot` et `Claude-SearchBot` dans `src/app/robots.ts`, unification `https://www.gainable.fr` + avis dans le JSON-LD `HVACBusiness`/`LocalBusiness` de `/pro/[slug]`, ajout du schéma `FAQPage` sur les pages Villes.
* **`2a30d63`** — Déblocage explicite de `/_next/static/` et `/_next/image` dans `src/app/robots.ts` pour le rendu CSS/JS/images de Googlebot ; correction du logo Hitachi en 404 dans `src/components/ui/brand-logo.tsx`.
* **`621a945`** — Suppression de `userScalable: false` et `maximumScale: 1` dans `src/app/layout.tsx` (accessibilité mobile WCAG) ; remplacement du faux `<h1>Chargement du profil expert...</h1>` par un `<div>` neutre dans `src/app/pro/[slug]/loading.tsx`.
* **`38824c8`** — Suppression de l'héritage global `alternates.languages` (`hreflang`) de `src/app/layout.tsx` (déplacé sur `src/app/page.tsx`) ; passage de `title.template` à `"%s"` (suppression des doublons `| Gainable.fr | Gainable.fr`) ; correction du bug spintax `{city.name}` → `${city.name}` sur ~851 pages Villes + ajout de `withDbRetry()` dans `src/app/climatisation/[city]/page.tsx` ; normalisation de `public/llms.txt` (spec `llmstxt.org`).
* **`2ded165`** — Devise dynamique `priceCurrency` (`EUR` / `CHF` / `MAD`) dans `AggregateOffer` et la FAQ des pages Villes.
* **`daa6d92`** — Correctif syntaxique `FAQPage` et référence `city.slug` pour rétablir un déploiement Vercel vert.

#### 9. Phase 4 — Maillage `/trouver-installateur` & Déblocage Cache ISR Vercel Edge (18/11/2026)
* **Maillage interne Footer** (`src/components/layout/footer.tsx`) : Ajout des liens directs **`/trouver-installateur`** (*Annuaire Installateurs RGE*) et **`/materiel`** (*Catalogue Matériel*) sur l'ensemble des 59 350 pages pour lever leur statut GSC *« URL inconnue de Google »* et accélérer le recrawl des pages Régions/Villes.
* **Fiabilisation `/trouver-installateur`** (`src/app/trouver-installateur/page.tsx`) : Enveloppement de la requête Prisma dans `withDbRetry()`.
* **Déblocage du cache ISR Vercel Edge** (`src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/middleware.ts`) : Suppression de `await headers()` dans `RootLayout` (qui forçait `Cache-Control: private, no-cache` sur tout le site). Détection du logo pays (`FR`/`CH`/`MA`/`BE`) déportée côté client (`window.location.hostname` + cookie léger `gainable_country` posé uniquement pour les visiteurs `CH`/`MA`/`BE`, sans jamais casser le cache CDN pour la France et les robots). Résultat vérifié au build Next.js (`973` pages statiques/ISR générées, `0` erreur TypeScript) et certifié en production (`X-Vercel-Cache: PRERENDER` / `HIT`, TTFB `/pro/...` = **248 ms**).

#### 10. Phase 4 bis — Cache ISR Edge sur les 56 277 Articles & En-têtes Sécurité 100/100 (18/11/2026)
* **Cache ISR à la demande sur les 56 277 articles** (`src/app/entreprise/[slug]/articles/[articleSlug]/page.tsx`) : Ajout de `dynamicParams = true` et `generateStaticParams() { return []; }` afin que Next.js 16 bascule la route de `ƒ (Dynamic)` (~2 550 ms TTFB, `X-Vercel-Cache: MISS`) vers **`● (On-Demand ISR 1h)`** — divisant jusqu'à 10× le TTFB et soulageant PostgreSQL face au crawl Googlebot.
* **Sécurité HTTP 100/100 & propreté `next.config.ts`** : Ajout des 3 en-têtes manquants (`X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`) et suppression de l'ancien rewrite mort `/trouver-installateur → /`.

---

## 📈 3. COMPARATIF DE PERFORMANCE RECHERCHE & INDEXATION (GSC DIRECT)

### 3.1 Évolution Search Console (données certifiées API GSC)

| Période | Clics | Impressions | Moy. / jour | CTR | Position moy. | Pages actives | Sitemaps GSC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Avant correctif (25–30 Oct.)** *(6 j)* | 55 | 4 977 | ~830 / j | 1,11 % | 25,3 | 640 | 404 sporadiques |
| **Post-vague 1 (02–08 Nov.)** *(7 j)* | 48 | **7 604** | **~1 086 / j** | 0,63 % | 26,5 | **729** | 0 err / 0 warn |
| **Avant vague 2 (09–15 Nov.)** *(7 j)* | 46 | 5 991 | ~856 / j | **0,77 %** *(+21,6 %)* | 29,0 | 634 | **0 err / 0 warn** *(recrawlés 16–17/11)* |

> *Note de latence GSC : au **18/11/2026**, la dernière journée consolidée est le **15/11/2026**. L'effet mesurable de la vague du **16/11** (`4001929` → `daa6d92`) sera visible entre le **19 et le 24 novembre**.*
> *Répartition des 46 clics (09–15 nov.) : **Fiches Matériel `/materiel/` = 29 clics (63 %)**, Profils Pro `/pro/` = 6 clics, Articles = 5 clics, Accueil/Autres = 5 clics, Pages Villes = 1 clic (mais 1 885 impressions).*

### 3.2 Certification Technique & État d'Indexation en Direct (Point du 18/11/2026)

* **Vérification Drift (`drift_compare.py`) & Scripts SEO (`robots_path_tester`, `llms_txt_checker`, `agentic_check`, `redirect_checker`, `hreflang_checker`)** :
  * ✅ `robots.txt` : `/_next/static/` et `/_next/image?...` autorisés (`allowed: true`) pour Googlebot et tous les bots IA majeurs.
  * ✅ `hreflang` : 0 balise parasite sur `/climatisation/paris` (conflit résolu).
  * ✅ `/devis` → `308 Permanent` → `/trouver-installateur` (200 OK, 1 seul saut).
  * ✅ Titre `/trouver-installateur` nettoyé (`| Gainable.fr` unique) ; faux H1 `/pro/[slug]` éradiqué en production.
  * ✅ `llms.txt` : **90/100, 0 erreur**, `agentic_check.py` **P0 3/3 PASS** (`1 777` mots hors-JS, vraie 404, 0 lien malformé).
  * ✅ Pages Villes `/climatisation/paris` (TTFB 295 ms) et `/climatisation/geneve` (TTFB 670 ms) : HTTP 200, 3 blocs JSON-LD valides (`Service`/`AggregateOffer` + `FAQPage` + devise dynamique).

* **Échantillon d'Inspection d'URL GSC (15 URLs stratégiques au 18/11/2026 — 12/15 indexées)** :

| Catégorie | URL | Statut GSC | Dernier crawl | Rich Snippets validés |
| :--- | :--- | :---: | :---: | :--- |
| Pilier | `/` | ✅ Indexée | 14/11/2026 | — |
| Pilier | `/bureau-etude` | ✅ Indexée | 07/11/2026 | — |
| Pilier | `/trouver-installateur` | ⚠️ **Inconnue de Google** | Jamais | — *(non liée en Header/Footer)* |
| Pilier | `/materiel` | ⚠️ **Inconnue de Google** | Jamais | — |
| Redirect | `/devis` | ℹ️ Inconnue (308 → `/trouver-installateur`) | Jamais | — |
| Pro | `/pro/...miramas-air-g-energie-8907` | ✅ Indexée | **17/11/2026** *(post-fix)* | **Breadcrumbs, Review snippets ⭐** |
| Pro | `/pro/...le-mans-aero-solutions-6179` | ✅ Indexée | 11/09/2026 | — |
| Pro | `/pro/...biarrotte-casenergies-1636` | ✅ Indexée | 27/08/2026 | — |
| Ville | `/climatisation/paris` | ✅ Indexée | 06/10/2026 | Breadcrumbs |
| Ville | `/climatisation/lyon` | ✅ Indexée | 15/09/2026 | Breadcrumbs |
| Ville | `/climatisation/marseille` | ✅ Indexée | 21/08/2026 | Breadcrumbs |
| Ville | `/climatisation/bordeaux` | ✅ Indexée | 27/10/2026 | Breadcrumbs |
| Article | `/entreprise/.../climatisation-gainable-troyes` | ✅ Indexée | 28/10/2026 | Breadcrumbs |
| Matériel | `/materiel/hp2es-100-v1` | ✅ Indexée | 31/10/2026 | **Product, Breadcrumbs, Review ⭐** |
| Matériel | `/materiel/mxz-3f68vf5-e1` | ✅ Indexée | 24/09/2026 | **Product, Breadcrumbs, Review ⭐** |

---

## 🛡️ 4. DOSSIER CONCURRENTIEL : `gainables.fr`
* **Identité du registrant** : Société **EKIHOME** (RCS Nîmes 820 034 346), dirigée par M. Samir ZBAIRI (10 Rue de l'Amandier, 30470 Aimargues).
* **Date de dépôt** : 11 octobre 2026 (typosquatting parasitaire au pluriel).
* **Levier de défense** : Marque INPI antérieure `Gainable.fr` protégée. Procédure disponible : mise en demeure LRAR puis plainte SYRELI auprès de l'AFNIC pour transfert forcé du domaine sous 2 mois.

---

## 🚀 5. PLAN D'ACTION POUR LE MAXIMUM DE PAGES ET LA TÊTE DE LISTING

1. **Demander l'indexation GSC de `/trouver-installateur` et `/materiel`** :
   * Maillage interne Footer déployé le 18/11 — reste à déclencher *« Demander une indexation »* dans l'interface Search Console (ou laisser Googlebot les découvrir au prochain passage).
2. **Suivi du recrawl post-16/11 & post-18/11 (Échéance 22–25 novembre)** :
   * Contrôler la courbe GSC (impressions, clics, CTR), le passage de Googlebot sur les grandes pages Villes (`paris`, `lyon`, `marseille`, `bordeaux`) et les autres fiches Pro pour généraliser les Rich Snippets `Review` + `FAQPage`, ainsi que la baisse du TTFB grâce au cache ISR Edge.
3. **Priorisation E-E-A-T, Contenu Frais & Quick Wins Top 10** :
   * Pousser les requêtes aux portes du Top 10 (`installateur de climatisation marseille` pos. 10,5 ; `climatisation courbevoie` pos. 14,0 ; `installateur pac rge cote bleue` pos. 14,8 ; `devis climatisation lyon` pos. 15,4) et maintenir l'injection Google Indexing API à chaque publication artisan.

