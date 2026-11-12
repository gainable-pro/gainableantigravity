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

---

## 📈 3. COMPARATIF DE PERFORMANCE RECHERCHE (GSC DIRECT)

Données certifiées extraites de l'API Google Search Console :

| Indicateur | Avant correctif (25–30 Octobre) | Après correctif (04–09 Novembre) | Évolution constatée |
| :--- | :---: | :---: | :---: |
| **Impressions totales (6 jours)** | 4 977 | **7 398** | **+48,6 %** 🚀 |
| **Moyenne quotidienne** | ~830 / jour | **~1 233 / jour** | **+403 impressions / jour** |
| **Pages actives générant du trafic** | 640 pages | **710 pages** | **+70 pages réactivées** |
| **État des 14 Sitemaps Googlebot** | Erreurs 404 sporadiques | **0 warning, 0 error** (Validés le 10/11 à 04h41) | **100 % sain** |
| **Pages indexées (rapport couverture)** | ~38 000 (avant le 19 oct.) | **7 444** (au 6 nov.) | En phase de stabilisation post-purge |

---

## 🛡️ 4. DOSSIER CONCURRENTIEL : `gainables.fr`
* **Identité du registrant** : Société **EKIHOME** (RCS Nîmes 820 034 346), dirigée par M. Samir ZBAIRI (10 Rue de l'Amandier, 30470 Aimargues).
* **Date de dépôt** : 11 octobre 2026 (typosquatting parasitaire au pluriel).
* **Levier de défense** : Marque INPI antérieure `Gainable.fr` protégée. Procédure disponible : mise en demeure LRAR puis plainte SYRELI auprès de l'AFNIC pour transfert forcé du domaine sous 2 mois.

---

## 🚀 5. PLAN D'ACTION POUR LE MAXIMUM DE PAGES ET LA TÊTE DE LISTING

1. **Surveillance hebdomadaire du rapport de couverture GSC** :
   * Surveiller la bascule progressive des pages de *"Explorée, actuellement non indexée"* vers *"Indexée"*.
2. **Priorisation E-E-A-T & Contenu Frais** :
   * Chaque nouvel artisan ou chantier réel publié injecte un signal de fraîcheur immédiat via l'API Indexing.
3. **Optimisation du Taux de Clic (CTR)** :
   * Maintenir des métadonnées avec incitation forte au devis direct sans intermédiaire et les étoiles Google bien visibles.

