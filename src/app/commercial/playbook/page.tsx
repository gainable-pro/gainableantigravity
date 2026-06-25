"use client";

import { useState } from "react";
import {
  Phone,
  MessageSquare,
  Target,
  Zap,
  Heart,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Shield,
  Brain,
  Flame,
  Star,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  RefreshCw,
  ThumbsUp,
  Volume2,
  Globe,
  Network,
  MapPin,
  Layers,
  Timer,
  Link2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const FUNNEL_STEPS = [
  {
    id: 1,
    color: "blue",
    icon: Target,
    label: "CIBLAGE",
    title: "Identifier les 50 prospects de la semaine",
    time: "Lundi matin — 1h",
    actions: [
      "Cherchez sur Google Maps : 'climatisation gainable + ville'",
      "Filtrez : code APE 4322A / 4322B / 4339Z, dirigeant identifiable",
      "Tapez site:son-domaine.com → moins de 10 pages = cible prioritaire",
      "Vérifiez sa note GMB et ses marques (Daikin, Mitsubishi, Fujitsu)",
      "LinkedIn / Societe.com pour valider : solo, PME 5-20 sal., bureau d'études",
    ],
    tip: "Qualité > Quantité. 50 prospects bien ciblés > 200 au hasard.",
    kpi: "50 prospects qualifiés / semaine",
  },
  {
    id: 2,
    color: "purple",
    icon: MessageSquare,
    label: "PREMIER CONTACT",
    title: "J1 Mardi — Social Selling + Email",
    time: "Mardi — 1h30",
    actions: [
      "Instagram : likez/commentez une photo de pose récente",
      "DM story-réaction : « Propre la pose ! C'est du bi-split Daikin ? »",
      "LinkedIn : demande de connexion SANS note (taux acceptation +30%)",
      "Email de prospection si disponible (séquence J1 — Audit offert)",
      "WhatsApp si numéro trouvé : message court, 1 question technique",
    ],
    tip: "Ne parlez jamais de vente au premier contact. Parlez technique. L'artisan adore ça.",
    kpi: "Taux de réponse cible : 15-20%",
  },
  {
    id: 3,
    color: "green",
    icon: Phone,
    label: "PHONING",
    title: "J2 Mercredi — Premier appel téléphonique",
    time: "Mercredi 8h30-9h30 ou 12h-13h30",
    actions: [
      "Barrage secrétariat : « C'est au sujet d'un gainable » (jamais 'partenariat')",
      "Accroche gérant : préparer le nom de sa ville + sa marque posée",
      "Script 45 sec : direct, jargon technique, mention de l'exclusivité zone",
      "Si messagerie : prénom + gainable.fr + rappel demandé, max 20 sec",
      "Rebond DM si déjà contacté la veille sur les réseaux",
    ],
    tip: "Appelez entre 8h30-9h30. L'artisan est encore au dépôt avant le chantier.",
    kpi: "Taux de décrochage cible : 30-40%",
  },
  {
    id: 4,
    color: "orange",
    icon: RefreshCw,
    label: "RELANCE",
    title: "J3 Jeudi — Relance écrite courte",
    time: "Jeudi — 30 min",
    actions: [
      "Message court LinkedIn / Instagram / WhatsApp",
      "« Bonjour [Prénom], je vous ai laissé un message hier. »",
      "« Je voulais valider votre intérêt pour l'exclusivité de [Ville] »",
      "« avant de libérer la zone à vos confrères. »",
      "NE PAS RE-EXPLIQUER le produit. Juste la relance + urgence douce.",
    ],
    tip: "Court = fort. 3 lignes max. L'urgence de la zone libérée est réelle et puissante.",
    kpi: "Taux de réponse relance : 8-12% supplémentaires",
  },
  {
    id: 5,
    color: "yellow",
    icon: Zap,
    label: "DÉMO 5 MIN",
    title: "J4 Vendredi — Démo live + Closing Stripe",
    time: "Vendredi — 5 min par prospect chaud",
    actions: [
      "0-2 min : Effet WoW IA — Tapez son dernier chantier, l'IA rédige sous ses yeux",
      "2-3 min : Preuve d'exclusivité — Montrez la carte de sa zone",
      "3-4 min : Google live — Tapez 'gainable [Ville]', montrez notre position",
      "4-5 min : Envoyez le lien Stripe. Restez en ligne pendant la saisie",
      "Si hésitation : code EXCLU10 (-10%) = 765 € au lieu de 850 € HT",
    ],
    tip: "Ne raccrochez JAMAIS pendant la saisie Stripe. Chaque silence, il faut meubler.",
    kpi: "Taux de conversion démo → vente : 40-60%",
  },
  {
    id: 6,
    color: "red",
    icon: AlertTriangle,
    label: "URGENCE FINALE",
    title: "J5 Lundi suivant — Retrait stratégique",
    time: "Lundi — 10 min",
    actions: [
      "Message de désengagement = déclencheur FOMO puissant",
      "« Bonjour [Nom], sans retour de votre part, »",
      "« je libère la zone de [Ville] pour vos confrères. »",
      "« Excellente continuation. »",
      "Si rappel spontané → rebondir immédiatement et relancer la démo",
    ],
    tip: "Ce message génère souvent plus de rappels que tous les autres réunis. La peur de perdre > désir de gagner.",
    kpi: "15-25% des rappels viennent suite à ce message",
  },
];

const OBJECTIONS = [
  {
    category: "Prix & Rentabilité",
    color: "red",
    items: [
      {
        obj: "C'est trop cher — 850 € c'est beaucoup",
        response:
          "« Combien vous rapporte une pose gainable en moyenne ? Entre 8 000 € et 15 000 €. Avec Gainable.fr, il vous suffit de signer UN seul chantier par an pour rentabiliser votre adhésion pour les 10 prochaines années. Et ça représente 2,33 € par jour — moins qu'un café. »",
        tip: "Divisez toujours le tarif annuel par 365 jours. L'effet psychologique est immédiat.",
      },
      {
        obj: "Je n'ai pas le budget en ce moment",
        response:
          "« Je comprends les contraintes de trésorerie. Le retour sur investissement d'une seule pose gainable couvre l'abonnement pour 10 ans. Ce n'est pas une dépense, c'est un investissement avec retour garanti dès le premier contact. »",
        tip: "Reformulez en 'investissement ROI'. Ne défendez jamais le prix — justifiez la valeur.",
      },
      {
        obj: "Vos concurrents sont moins chers",
        response:
          "« Moins cher et ils revendent vos leads à 4 concurrents. Chez nous, le client ne voit que VOUS. Pas de guerre des prix, pas de course au devis le plus bas. Votre marge reste intacte. »",
        tip: "Ne jamais attaquer un concurrent. Pointer la différence de modèle business.",
      },
    ],
  },
  {
    category: "Scepticisme & Méfiance",
    color: "orange",
    items: [
      {
        obj: "J'ai déjà testé des plateformes, ça ne marche pas",
        response:
          "« Vous avez 100% raison de vous méfier. Ces plateformes vendent vos leads à 4 concurrents. Gainable.fr n'est pas une plateforme de leads — c'est un annuaire de visibilité directe. Le client voit votre fiche, votre numéro, et il vous appelle directement. Aucun intermédiaire. »",
        tip: "Empathie radicale d'abord. Ne contra-argumentez pas avant d'avoir validé sa frustration.",
      },
      {
        obj: "Je n'ai jamais entendu parler de vous",
        response:
          "« Normal, on grandit vite. Tapez maintenant 'climatisation gainable [Ville]' sur Google. Vous nous voyez ? Vos futurs clients, eux, nous voient déjà. Et votre concurrent qui est référencé profite de ça. »",
        tip: "Faites la preuve en direct. Rien de plus convaincant que ce qu'il voit de ses propres yeux.",
      },
      {
        obj: "Comment je sais que vous allez rester dans la durée ?",
        response:
          "« Question légitime. On a déjà +58 000 pages indexées sur Google, des experts partenaires en France, Belgique et Suisse, et une roadmap produit en cours. Notre modèle d'abonnement fixe (pas de commission) nous aligne sur votre réussite. »",
        tip: "Montrez des preuves concrètes : pages indexées, experts déjà référencés, présence internationale.",
      },
      {
        obj: "C'est quoi l'arnaque ?",
        response:
          "« Aucune. Pas de commission sur vos chantiers, pas d'engagement long terme abusif, pas de revente de vos données. On publie vos contenus sur notre plateforme, vous gardez 100% de vos revenus. Notre modèle tient parce qu'on grandit ensemble. »",
        tip: "Ne vous braquez pas. Cette question révèle un prospect qui a été brûlé avant. Soyez ultra-transparent.",
      },
    ],
  },
  {
    category: "Excuses & Report",
    color: "yellow",
    items: [
      {
        obj: "Je vais y réfléchir",
        response:
          "« Je comprends. Mais je dois être honnête : la zone de [Ville] est disponible maintenant. Si vous ne la prenez pas aujourd'hui, je la propose à vos confrères demain matin. Qu'est-ce qui vous retient vraiment ? » (Creuser l'objection cachée)",
        tip: "'J'y réfléchis' = objection masquée. Posez la question directe : 'Qu'est-ce qui vous retient vraiment ?' Creusez.",
      },
      {
        obj: "Rappelez-moi dans 3 mois",
        response:
          "« Je peux faire ça. Mais la zone de [Ville] ne sera plus libre dans 3 mois. Est-ce que c'est vraiment le moment idéal pour agir sur votre visibilité quand vos concurrents ne vous attendent pas ? »",
        tip: "Replacez l'urgence dans son propre business. Il perd des chantiers chaque jour où il est invisible.",
      },
      {
        obj: "Je suis complet pour les 6 prochains mois",
        response:
          "« Excellent signe ! Mais le SEO prend 3 à 6 mois pour produire ses effets. Commencer maintenant, c'est blinder votre carnet pour la prochaine saison. Et avoir plus de demandes vous permet de choisir les chantiers les plus rentables et les plus proches. »",
        tip: "Un artisan complet est une cible PARFAITE. Il peut se permettre de choisir. Jouez sur la sélectivité.",
      },
      {
        obj: "Mon associé / femme doit valider",
        response:
          "« Bien sûr, c'est une décision d'entreprise. Est-ce que vous pouvez l'avoir en ligne maintenant ? Je peux lui expliquer en 5 minutes. Ou si vous préférez, je vous envoie un email récapitulatif que vous lui transmettez ce soir. »",
        tip: "Proposez de parler directement au décideur ou envoyez un document clé-en-main pour le soir même.",
      },
    ],
  },
  {
    category: "Bouche-à-Oreille & Autosatisfaction",
    color: "blue",
    items: [
      {
        obj: "Je fonctionne au bouche-à-oreille, ça marche très bien",
        response:
          "« C'est génial, c'est la preuve de votre sérieux ! Mais 9 clients sur 10 recommandés par un ami tapent votre nom sur Google pour se rassurer avant d'appeler. S'ils ne voient rien de récent, de sérieux, ils doutent. On digitalise votre bouche-à-oreille. »",
        tip: "Ne minimisez pas son succès. Amplifiez-le. Le web est le prolongement naturel de sa réputation.",
      },
      {
        obj: "J'ai assez de travail avec mon réseau",
        response:
          "« C'est une excellente position. Avoir plus de demandes, ça vous permet d'augmenter vos prix, de refuser les clients difficiles, et de choisir uniquement les chantiers gainable premium à 12 000-15 000 €. La croissance, c'est aussi se donner le choix. »",
        tip: "Parlez de qualité des chantiers, pas de quantité. Un artisan 'complet' rêve de mieux choisir ses clients.",
      },
    ],
  },
  {
    category: "Technique & Manque de Temps",
    color: "green",
    items: [
      {
        obj: "Je n'ai pas le temps pour les articles ou le SEO",
        response:
          "« Justement. Vous n'avez rien à faire. Notre IA génère un article de 800 mots en 2 minutes. Vous tapez le nom de la ville + 3 mots sur votre dernier chantier. L'IA fait le reste. Optimisé SEO. Prêt à publier en 1 clic. »",
        tip: "Faites la démo en direct. Tapez un chantier fictif pendant l'appel. Le WoW est immédiat.",
      },
      {
        obj: "Je ne suis pas à l'aise avec Internet / la technologie",
        response:
          "« C'est précisément pourquoi on existe. Notre espace pro est fait pour les artisans, pas pour des geeks. Et si vous avez la moindre question, notre support est là. Votre seul travail : poser de beaux gainables. On s'occupe du reste. »",
        tip: "Rassurez. Valorisez son expertise terrain. La techno est votre domaine, le gainable est le sien.",
      },
      {
        obj: "J'ai déjà mon propre site web",
        response:
          "« Super. Tapez 'site:votresite.com' dans Google. On voit combien de pages ? 5 ? 10 ? Face aux géants nationaux (Maclem, IZI EDF), un site individuel est invisible. En publiant chez nous, vous profitez des 58 000 pages de Gainable.fr. »",
        tip: "Faites le test en direct pendant l'appel. L'effet choc du 'site:' est redoutable.",
      },
    ],
  },
  {
    category: "Concurrence & Comparaison",
    color: "purple",
    items: [
      {
        obj: "Je suis déjà sur PagesJaunes / Houzz / Travaux.com",
        response:
          "« Ces plateformes généralistes touchent tout le monde. Gainable.fr est 100% spécialisé CVC. Nos utilisateurs cherchent exactement ce que vous faites. La qualité des contacts est incomparable. »",
        tip: "Spécialisation = valeur. Un annuaire généraliste dilue. Gainable.fr amplifie la spécialité CVC.",
      },
      {
        obj: "Un confrère m'a dit que ça ne marchait pas pour lui",
        response:
          "« Je comprends. Est-ce qu'il a bien complété sa fiche, mis des photos de chantiers, et publié des articles locaux ? La plateforme donne à ceux qui participent. Un profil vide ne génère rien. Un profil actif génère des contacts. »",
        tip: "Évaluez si le confrère a vraiment activé la plateforme. Un profil incomplet ne convertit pas.",
      },
    ],
  },
];

const CONVERSION_TIPS = [
  {
    icon: Clock,
    color: "blue",
    title: "Timing d'Appel Optimal",
    tips: [
      "8h30-9h30 : L'artisan est au dépôt, pas encore sur le chantier",
      "12h00-13h30 : Pause déjeuner, il répond plus facilement",
      "Évitez les vendredis après-midi et lundi matin",
      "Mardi et jeudi sont les meilleurs jours de la semaine",
      "Jamais en juillet-août (pics de chantier = indisponibilité)",
    ],
  },
  {
    icon: Volume2,
    color: "green",
    title: "Posture Vocale & Ton",
    tips: [
      "Souriez en parlant — ça s'entend au téléphone, vraiment",
      "Parlez avec l'assurance de quelqu'un qui rend service, pas qui quémande",
      "Ralentissez votre débit à 80% de votre vitesse normale",
      "Faites des pauses après vos questions — laissez le silence respirer",
      "Répétez les derniers mots de son dernier argument : ça le pousse à développer",
    ],
  },
  {
    icon: Brain,
    color: "purple",
    title: "Techniques de Persuasion",
    tips: [
      "La réciprocité : offrez quelque chose d'abord (audit SEO gratuit)",
      "La preuve sociale : citez un artisan partenaire dans sa région",
      "L'exclusivité : la zone libérée est un vrai levier, utilisez-le",
      "Le foot-in-the-door : commencez par une petite question à laquelle il dit 'oui'",
      "Ancrez haut : 'certains installateurs génèrent 3-4 chantiers par mois via nous'",
    ],
  },
  {
    icon: DollarSign,
    color: "yellow",
    title: "Tactiques de Closing",
    tips: [
      "Envoyez le lien Stripe pendant qu'il est en ligne — 70% des bails meurent 'je le fais ce soir'",
      "Le code EXCLU10 n'est utilisé QU'après une vraie résistance, jamais en premier",
      "Proposez toujours 2 options : 850 € ou 750 € — jamais une seule",
      "Reformulez l'objection avant de répondre — il se sent entendu",
      "Silence de 3-5 sec après votre close = puissant. Ne le rompez pas le premier",
    ],
  },
  {
    icon: Users,
    color: "red",
    title: "Gestion des Barrages",
    tips: [
      "Sujet secrétaire : 'au sujet d'un gainable' ou 'dossier d'installation gainable sur [Ville]'",
      "Ne JAMAIS mentir sur votre identité — dites que vous êtes de Gainable.fr",
      "Si vous êtes bloqué, demandez le prénom du gérant pour personnaliser le prochain appel",
      "Tentez une autre heure : certains artisans décrochent uniquement le matin très tôt",
      "WhatsApp peut contourner le barrage : message pro direct sur le portable personnel",
    ],
  },
  {
    icon: ThumbsUp,
    color: "orange",
    title: "Optimiser le Taux de Réponse DM",
    tips: [
      "Instagram : commentez une vraie photo de pose avec une question technique précise",
      "LinkedIn : connexion sans note = +30% d'acceptation. Le message vient après",
      "WhatsApp : message de 2-3 lignes max, une seule question, ton décontracté",
      "Personnalisez TOUJOURS : mention de la ville, de la marque posée, du type de chantier",
      "Ne relancez pas plus de 2 fois par canal sur 30 jours — risque de blocage",
    ],
  },
];

const MINDSET_SECTIONS = [
  {
    icon: Flame,
    color: "red",
    title: "Le Refus n'est Pas un Échec",
    quote: "« Ce qui ne te tue pas te rend plus fort. »",
    author: "Friedrich Nietzsche",
    content:
      "Un 'non' aujourd'hui est un 'pas encore'. Sur 50 prospects appelés, 10 décrocheront, 3 seront intéressés, 1-2 signeront. Ce ratio est NORMAL. Les meilleurs commerciaux au monde n'ont pas un taux de 100% — ils ont une résilience de 100%. Chaque refus rapproche la prochaine signature.",
    actions: [
      "Après chaque refus, notez 1 chose que vous auriez pu mieux dire",
      "Fixez-vous un quota de refus quotidien : 15 'non' = vous avez bien travaillé",
      "Célébrez les relances réussies autant que les ventes",
    ],
  },
  {
    icon: Shield,
    color: "blue",
    title: "Croire en son Produit — La Conviction Absolue",
    quote: "« On ne vend pas ce qu'on ne croit pas. »",
    author: "Principe fondamental de la vente",
    content:
      "Gainable.fr est un produit RÉEL qui crée de la valeur RÉELLE. Des artisans signent des chantiers grâce à la plateforme. L'IA rédige vraiment. Les pages sont indexées sur Google. Quand vous présentez Gainable.fr, vous ne demandez pas de l'argent — vous offrez une opportunité. Cette conviction doit transpirer dans chaque syllabe.",
    actions: [
      "Relisez les témoignages de partenaires chaque matin avant de commencer",
      "Faites vous-même la recherche Google 'gainable [Ville]' tous les matins",
      "Visualisez le résultat de l'artisan dans 6 mois — son téléphone qui sonne",
    ],
  },
  {
    icon: TrendingUp,
    color: "green",
    title: "La Règle des 50 Touches",
    quote: "« Le succès commercial est une question de volume et de consistance. »",
    author: "Principe de la prospection B2B",
    content:
      "Statistiquement, un prospect signe après en moyenne 5 à 7 touches (appel, DM, email, relance…). La plupart des commerciaux abandonnent après 1-2 tentatives. En suivant la cadence de 5 jours rigoureusement, vous allez là où les autres ne vont pas. C'est votre avantage concurrentiel personnel.",
    actions: [
      "Tracez CHAQUE action dans votre CRM : date, canal, résultat",
      "Ne classez jamais un prospect 'refus définitif' avant J5",
      "Revisitez les prospects 'froids' à 3 mois avec un nouveau déclencheur",
    ],
  },
  {
    icon: Heart,
    color: "pink",
    title: "L'État Mental Avant l'Appel — Le Rituel du Guerrier",
    quote: "« On n'entre pas dans une arène sans s'y être préparé. »",
    author: "Philosophie des performeurs",
    content:
      "Votre état d'esprit se détecte en moins de 3 secondes à la voix. Un commercial fatigué, défaitiste ou dans le doute transmet cette énergie. La préparation mentale n'est pas de la psychologie positive — c'est un avantage compétitif concret.",
    actions: [
      "2 minutes de respiration profonde avant vos appels (4 secondes inspirez, 6 expirez)",
      "Relisez votre meilleure vente de la semaine avant chaque session phoning",
      "Tenez-vous debout pendant les appels : la posture physique impacte le ton vocal",
      "Après un refus difficile : 1 minute de pause, 3 respirations, appel suivant",
    ],
  },
  {
    icon: Star,
    color: "yellow",
    title: "Ne Jamais Abandonner — La Philosophie du Long Terme",
    quote: "« Rome ne s'est pas faite en un jour. Votre pipeline non plus. »",
    author: "Gainable.fr Playbook",
    content:
      "Le SEO prend 3 à 6 mois. La prospection aussi construit dans le temps. Un artisan qui dit 'non' en janvier peut signer en mars quand il voit son concurrent apparaître sur Google. Votre travail d'aujourd'hui génère des résultats dans 90 jours. Plantez les graines chaque semaine.",
    actions: [
      "Remontez dans vos 'refus de 3 mois' — c'est votre meilleure base de rappel",
      "Envoyez un email d'actualité à vos 'tièdes' chaque mois (nouveau partenaire dans leur région, nouveau résultat SEO)",
      "Construisez votre réseau : un partenaire satisfait vous donne 2-3 recommandations",
    ],
  },
  {
    icon: Award,
    color: "gold",
    title: "Célébrer chaque Victoire — Alimenter la Machine",
    quote: "« Ce qu'on célèbre, on le reproduit. »",
    author: "Psychologie de la performance",
    content:
      "Une vente à 850 € HT, c'est entre 85 € et 127 € de commission selon votre grille. C'est concret. Mais une vente, c'est aussi une zone sécurisée, un artisan qui va générer des chantiers, et une prochaine vente plus facile avec la preuve de l'existence d'un partenaire local.",
    actions: [
      "Notez chaque vente dans un carnet visible — la liste grandit, ça motive",
      "Partagez vos succès avec vos collègues — la compétition saine élève tout le monde",
      "Revisitez votre objectif mensuel chaque vendredi soir — êtes-vous sur la bonne trajectoire ?",
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-600" },
  green: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-600" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", badge: "bg-yellow-500" },
  red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", badge: "bg-red-600" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", badge: "bg-pink-600" },
  gold: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", badge: "bg-amber-500" },
};

/* ─────────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────────── */

function ObjectionAccordion({ obj, response, tip, color }: {
  obj: string; response: string; tip: string; color: string;
}) {
  const [open, setOpen] = useState(false);
  const c = colorMap[color] ?? colorMap.blue;
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${c.border}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-start justify-between gap-4 p-4 text-left transition-colors ${open ? c.bg : "bg-white hover:bg-slate-50"}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">💬</span>
          <span className="font-semibold text-slate-800 text-sm leading-relaxed">{obj}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" /> : <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className={`px-5 pb-5 pt-1 ${c.bg} space-y-3`}>
          <div className={`p-4 rounded-xl bg-white border ${c.border}`}>
            <p className="text-sm font-bold text-slate-700 mb-1">↳ Réponse :</p>
            <p className="text-sm text-slate-800 leading-relaxed italic">{response}</p>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <Star className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">{tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-blue-600 inline-block" />
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */

export default function PlaybookPage() {
  const [activeTab, setActiveTab] = useState<"funnel" | "objections" | "tips" | "mindset" | "ecosystem">("funnel");

  const tabs = [
    { key: "funnel", label: "🎯 Process de Vente", icon: Target },
    { key: "objections", label: "💬 Objections", icon: MessageSquare },
    { key: "tips", label: "⚡ Tips Conversion", icon: Zap },
    { key: "mindset", label: "🔥 Mindset", icon: Flame },
    { key: "ecosystem", label: "🌐 Écosystème & Maillage", icon: Globe },
  ] as const;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-bold text-amber-300 mb-4">
              <Award className="h-3.5 w-3.5" />
              PLAYBOOK COMMERCIAL — GAINABLE.FR
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Guide Complet de Vente</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Process de vente fil directeur, scripts mot-pour-mot, toutes les objections avec réponses,
              tips de conversion et coaching mindset pour performer chaque semaine.
            </p>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-amber-300">850 €</div>
              <div className="text-xs text-slate-400">Offre Expert CVC</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-emerald-400">EXCLU10</div>
              <div className="text-xs text-slate-400">Code closing (-10%)</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-blue-300">50</div>
              <div className="text-xs text-slate-400">Prospects / semaine</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-pink-300">5 jours</div>
              <div className="text-xs text-slate-400">Séquence complète</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 border border-slate-200 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t.key
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── FUNNEL TAB ── */}
      {activeTab === "funnel" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Target className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-800 text-sm">Le Process de Vente en Fil Directeur</p>
              <p className="text-blue-700 text-xs mt-1">
                Suivez la séquence de 5 jours rigoureusement pour chacun de vos 50 prospects hebdomadaires.
                Ne sautez pas d'étape. La consistance fait la différence entre 1 vente et 5 ventes par semaine.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {FUNNEL_STEPS.map((step, idx) => {
              const c = colorMap[step.color] ?? colorMap.blue;
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative">
                  {idx < FUNNEL_STEPS.length - 1 && (
                    <div className="absolute left-6 top-full h-4 w-0.5 bg-slate-200 z-10" />
                  )}
                  <div className={`bg-white border ${c.border} rounded-2xl overflow-hidden shadow-sm`}>
                    <div className={`${c.bg} px-6 py-4 flex items-start gap-4`}>
                      <div className={`${c.badge} text-white rounded-xl p-2.5 shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-black ${c.text} tracking-widest`}>{step.label}</span>
                          <span className="text-xs text-slate-500 bg-white/60 rounded-full px-2 py-0.5">{step.time}</span>
                          <span className="text-xs font-bold text-slate-600 bg-white/80 rounded-full px-2 py-0.5 ml-auto">🎯 {step.kpi}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mt-1">{step.title}</h3>
                      </div>
                    </div>
                    <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        {step.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className={`h-4 w-4 ${c.text} shrink-0 mt-0.5`} />
                            <span className="text-sm text-slate-700 leading-relaxed">{action}</span>
                          </div>
                        ))}
                      </div>
                      <div className={`${c.bg} border ${c.border} rounded-xl p-4 flex items-start gap-3`}>
                        <Star className={`h-4 w-4 ${c.text} shrink-0 mt-0.5`} />
                        <div>
                          <p className={`text-xs font-black ${c.text} mb-1`}>TIP CONVERSION</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{step.tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick script cards */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
            <h3 className="font-black text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-amber-400" />
              Scripts Téléphoniques — Mot pour Mot
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  label: "🚧 Barrage Secrétariat",
                  color: "border-red-500",
                  lines: [
                    "❌ JAMAIS : « Je vous appelle pour un partenariat »",
                    "✅ « C'est au sujet d'un gainable »",
                    "✅ « Dossier d'installation gainable sur [Ville] »",
                    "✅ Si demande société : « Je suis de Gainable.fr, réseau d'installateurs »",
                  ],
                },
                {
                  label: "📞 Accroche Gérant (45 sec)",
                  color: "border-blue-500",
                  lines: [
                    "« Bonjour [Prénom], c'est [Vous] de Gainable.fr. »",
                    "« Rapide : vous n'apparaissez pas sur 'gainable [Ville]' »",
                    "« alors que des chantiers à 15k€ se signent sur ces recherches. »",
                    "« On a une place dispo. Je vous montre en 5 min ? »",
                  ],
                },
                {
                  label: "💬 Relance J3 (WhatsApp / DM)",
                  color: "border-green-500",
                  lines: [
                    "« Bonjour [Prénom], »",
                    "« je vous ai laissé un message mercredi. »",
                    "« Je voulais valider votre intérêt pour la zone [Ville] »",
                    "« avant de la libérer à vos confrères. »",
                  ],
                },
                {
                  label: "🔴 Message de Retrait J5",
                  color: "border-amber-500",
                  lines: [
                    "« Bonjour [Nom], »",
                    "« sans retour de votre part, »",
                    "« je libère la zone de [Ville] »",
                    "« pour vos confrères. Excellente continuation. »",
                  ],
                },
              ].map(({ label, color, lines }) => (
                <div key={label} className={`bg-slate-800 border-l-4 ${color} rounded-xl p-4 space-y-2`}>
                  <p className="font-bold text-amber-300 text-sm">{label}</p>
                  {lines.map((l, i) => (
                    <p key={i} className={`text-sm ${l.startsWith("❌") ? "text-red-400" : l.startsWith("✅") ? "text-emerald-400" : l.startsWith("«") ? "text-white font-medium" : "text-slate-400"}`}>
                      {l}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── OBJECTIONS TAB ── */}
      {activeTab === "objections" && (
        <div className="space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800 text-sm">Toutes les Objections — Réponses Mot pour Mot</p>
              <p className="text-amber-700 text-xs mt-1">
                Cliquez sur chaque objection pour voir la réponse complète et le tip associé.
                Lisez ces réponses à voix haute jusqu'à ce qu'elles soient naturelles.
              </p>
            </div>
          </div>

          {OBJECTIONS.map((cat) => {
            const c = colorMap[cat.color] ?? colorMap.blue;
            return (
              <div key={cat.category} className="space-y-3">
                <div className={`inline-flex items-center gap-2 ${c.badge} text-white text-xs font-black px-3 py-1.5 rounded-full`}>
                  {cat.category}
                </div>
                <div className="space-y-2">
                  {cat.items.map((item, i) => (
                    <ObjectionAccordion key={i} {...item} color={cat.color} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Meta-tips objections */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h3 className="font-black text-base mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Méta-Règles pour Traiter N&apos;importe Quelle Objection
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { step: "01", title: "Valider", desc: "Ne jamais contre-argumenter avant d'avoir validé l'objection : « Vous avez tout à fait raison de vous interroger là-dessus. »" },
                { step: "02", title: "Clarifier", desc: "Précisez si c'est la vraie objection : « C'est vraiment ça qui vous retient, ou il y a autre chose ? »" },
                { step: "03", title: "Répondre", desc: "Donnez la réponse factuellement, avec un exemple concret ou un chiffre. Jamais de vague." },
                { step: "04", title: "Confirmer", desc: "Vérifiez que l'objection est traitée : « Est-ce que ça répond à votre question ? Vous voyez comment ça fonctionne ? »" },
                { step: "05", title: "Avancer", desc: "Relancez vers l'action : « Donc si ça vous convient, on peut avancer sur la démo / le lien de paiement maintenant. »" },
                { step: "06", title: "Silence", desc: "Après votre close, taisez-vous. Comptez jusqu'à 7 dans votre tête. Le premier qui parle perd." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <span className="text-2xl font-black text-slate-600 w-8 shrink-0">{step}</span>
                  <div>
                    <p className="font-bold text-amber-300 text-sm">{title}</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TIPS TAB ── */}
      {activeTab === "tips" && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <Zap className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-800 text-sm">Tips Actionnables pour Booster votre Taux de Conversion</p>
              <p className="text-emerald-700 text-xs mt-1">
                Ces techniques sont testées et validées. Implémentez-en 2-3 par semaine, mesurez l'impact,
                puis ajoutez les suivantes. L&apos;amélioration continue est votre avantage compétitif.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CONVERSION_TIPS.map((section) => {
              const c = colorMap[section.color] ?? colorMap.blue;
              const Icon = section.icon;
              return (
                <div key={section.title} className={`bg-white border ${c.border} rounded-2xl overflow-hidden shadow-sm`}>
                  <div className={`${c.bg} px-5 py-4 flex items-center gap-3`}>
                    <div className={`${c.badge} text-white rounded-xl p-2`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className={`font-bold text-sm ${c.text}`}>{section.title}</h3>
                  </div>
                  <div className="p-5 space-y-2.5">
                    {section.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <ArrowRight className={`h-3.5 w-3.5 ${c.text} shrink-0 mt-0.5`} />
                        <span className="text-sm text-slate-700 leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* KPI Dashboard */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Indicateurs de Performance à Suivre Chaque Semaine
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Prospects ciblés", target: "50 / semaine", color: "blue" },
                { label: "Taux de décrochage", target: "30-40%", color: "green" },
                { label: "Démos réalisées", target: "5-8 / semaine", color: "purple" },
                { label: "Taux closing démo", target: "40-60%", color: "yellow" },
                { label: "Ventes semaine", target: "2-4 cible", color: "red" },
                { label: "CA généré", target: "1 700-3 400 €", color: "gold" },
                { label: "Taux de relance J5", target: "15-25% rappels", color: "orange" },
                { label: "Taux réponse DM", target: "15-20%", color: "pink" },
              ].map(({ label, target, color }) => {
                const c = colorMap[color] ?? colorMap.blue;
                return (
                  <div key={label} className={`${c.bg} border ${c.border} rounded-xl p-3 text-center`}>
                    <div className={`text-lg font-black ${c.text}`}>{target}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MINDSET TAB ── */}
      {activeTab === "mindset" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Flame className="h-6 w-6 text-red-400" />
              <h2 className="text-xl font-black">L&apos;État d&apos;Esprit du Vendeur Performant</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              La technique, les scripts et les argumentaires ne représentent que 30% de votre succès.
              Les 70% restants viennent de votre état mental, de votre résilience et de votre conviction.
              Cette section est aussi importante — sinon plus — que toutes les autres.
            </p>
          </div>

          <div className="space-y-4">
            {MINDSET_SECTIONS.map((section) => {
              const c = colorMap[section.color] ?? colorMap.blue;
              const Icon = section.icon;
              return (
                <div key={section.title} className={`bg-white border-l-4 ${c.border.replace("border-", "border-l-")} rounded-2xl shadow-sm overflow-hidden`}>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`${c.badge} text-white rounded-xl p-3 shrink-0`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base">{section.title}</h3>
                        <blockquote className={`${c.text} font-bold text-sm italic mt-1`}>
                          {section.quote}
                        </blockquote>
                        <p className="text-xs text-slate-500">— {section.author}</p>
                      </div>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed">{section.content}</p>

                    <div className={`${c.bg} border ${c.border} rounded-xl p-4 space-y-2`}>
                      <p className={`text-xs font-black ${c.text} mb-2`}>ACTIONS CONCRÈTES</p>
                      {section.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className={`h-4 w-4 ${c.text} shrink-0 mt-0.5`} />
                          <span className="text-sm text-slate-700 leading-relaxed">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily ritual card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-black text-amber-900 text-base mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Le Rituel Quotidien du Vendeur Top Performer
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  time: "☀️ MATIN (avant les appels)",
                  steps: [
                    "Relire 1 témoignage partenaire satisfait",
                    "Faire la recherche Google 'gainable [ville]' pour voir la plateforme",
                    "Définir son objectif du jour en nombre de contacts",
                    "2 min de respiration pour préparer la voix et l'énergie",
                  ],
                },
                {
                  time: "🏃 PENDANT les appels",
                  steps: [
                    "Se lever pendant les appels (meilleure énergie vocale)",
                    "Sourire — ça s'entend vraiment au téléphone",
                    "Après chaque refus : 3 respirations, appel suivant",
                    "Noter chaque retour — positif ou négatif — dans le CRM",
                  ],
                },
                {
                  time: "🌙 SOIR (bilan)",
                  steps: [
                    "Compter le nombre de contacts du jour (pas les ventes)",
                    "Identifier 1 chose à améliorer demain",
                    "Célébrer si objectif de contacts atteint",
                    "Préparer la liste du lendemain : 10 prospects prioritaires",
                  ],
                },
              ].map(({ time, steps }) => (
                <div key={time} className="bg-white rounded-xl p-4 border border-amber-200 space-y-2">
                  <p className="font-bold text-amber-900 text-sm">{time}</p>
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                      <span className="text-xs text-slate-700 leading-relaxed">{s}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Motivational footer */}
          <div className="bg-slate-900 rounded-2xl p-8 text-center text-white space-y-4">
            <div className="text-4xl">🔥</div>
            <h3 className="text-xl font-black">Rappel Fondamental</h3>
            <div className="max-w-2xl mx-auto space-y-3 text-slate-300 text-sm leading-relaxed">
              <p>
                Vous ne vendez pas un abonnement. Vous donnez à un artisan passionné, sérieux,
                qui travaille dur sur ses chantiers, les moyens d&apos;être enfin visible.
              </p>
              <p>
                Chaque appel est une opportunité de transformer l&apos;avenir de quelqu&apos;un.
                Un artisan qui adhère à Gainable.fr génère des chantiers en plus,
                peut choisir ses clients, augmenter ses prix, prendre des vacances.
              </p>
              <p className="text-white font-bold">
                Ce n&apos;est pas de la vente. C&apos;est de la croissance partagée. Croyez-y.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {["Ne jamais abandonner", "Croire en son produit", "Chaque refus = une leçon", "Consistance > Talent"].map((badge) => (
                <span key={badge} className="bg-white/10 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full">
                  ✦ {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* ── ECOSYSTEM TAB ── */}
      {activeTab === "ecosystem" && (
        <div className="space-y-8">

          {/* Intro banner */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-7 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="h-7 w-7 text-blue-300" />
              <h2 className="text-2xl font-black">C&apos;est un Marathon, Pas un Sprint</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              La visibilité sur Google ne se construit pas en une nuit. Gainable.fr est un système de maillage complet
              qui amplifie chaque action dans le temps. Plus l&apos;artisan est actif sur la plateforme,
              plus son autorité grandit, plus il domine sa zone. C&apos;est l&apos;effet boule de neige du SEO sémantique.
            </p>
            <div className="flex flex-wrap gap-4 mt-5">
              {[
                { label: "Mois 1-3", val: "Indexation & fondations", color: "text-blue-300" },
                { label: "Mois 3-6", val: "Montée en autorité", color: "text-emerald-300" },
                { label: "Mois 6-12", val: "Leads réguliers", color: "text-amber-300" },
                { label: "12 mois+", val: "Dominance locale", color: "text-pink-300" },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[120px]">
                  <div className={`font-black text-sm ${color}`}>{label}</div>
                  <div className="text-xs text-slate-400 mt-1">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility Ecosystem Diagram */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-600" />
              L&apos;Écosystème de Visibilité Gainable.fr — Vue Globale
            </h3>

            {/* Center node + spokes */}
            <div className="relative flex flex-col items-center">
              {/* Center */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl px-8 py-5 text-white text-center shadow-xl z-10">
                <div className="text-2xl font-black text-amber-300">Gainable.fr</div>
                <div className="text-xs text-slate-300 mt-1">Hub Central de Visibilité</div>
                <div className="flex gap-2 mt-3 justify-center flex-wrap">
                  <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-emerald-300">+58 000 pages</span>
                  <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-blue-300">3 pays</span>
                  <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-amber-300">100% CVC</span>
                </div>
              </div>

              {/* Spokes grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 w-full">
                {[
                  {
                    icon: "🔍",
                    title: "SEO Google",
                    color: "border-blue-400 bg-blue-50",
                    textColor: "text-blue-800",
                    items: [
                      "Articles géolocalisés (Ville + Technologie)",
                      "Mots-clés longue traîne CVC",
                      "Rich Snippets JSON-LD",
                      "Autorité de domaine collective",
                      "Indexation dans les 48h",
                    ],
                  },
                  {
                    icon: "🌐",
                    title: "Site Officiel",
                    color: "border-emerald-400 bg-emerald-50",
                    textColor: "text-emerald-800",
                    items: [
                      "Fiche Pro optimisée (titre, description)",
                      "Portfolio photos de chantiers",
                      "Certifications RGE visibles",
                      "Coordonnées directes (0% intermédiaire)",
                      "Fiches d'intervention détaillées",
                    ],
                  },
                  {
                    icon: "📱",
                    title: "Réseaux Sociaux",
                    color: "border-purple-400 bg-purple-50",
                    textColor: "text-purple-800",
                    items: [
                      "Instagram : photos de pose → leads DM",
                      "LinkedIn : PME CVC → chantiers B2B",
                      "Partage d'articles Gainable = signaux sociaux",
                      "Augmente le trust signal Google",
                      "Bouche-à-oreille digitalisé",
                    ],
                  },
                  {
                    icon: "📍",
                    title: "Google Maps & GMB",
                    color: "border-red-400 bg-red-50",
                    textColor: "text-red-800",
                    items: [
                      "Backlink depuis Gainable.fr vers GMB",
                      "Avis croisés = plus de confiance",
                      "Apparition dans le Pack Local Google",
                      "Requêtes 'près de moi' boostées",
                      "Photos de réalisations = + de clics",
                    ],
                  },
                  {
                    icon: "✍️",
                    title: "Contenu IA",
                    color: "border-amber-400 bg-amber-50",
                    textColor: "text-amber-800",
                    items: [
                      "10 articles/mois → 120/an par expert",
                      "Chaque article = 1 requête capturée",
                      "FAQ JSON-LD → Featured Snippets",
                      "Vidéos intégrées → temps de page +",
                      "Cocon sémantique local automatique",
                    ],
                  },
                  {
                    icon: "🤖",
                    title: "IA & AEO",
                    color: "border-pink-400 bg-pink-50",
                    textColor: "text-pink-800",
                    items: [
                      "Optimisé pour ChatGPT, Gemini, Perplexity",
                      "Réponses directes dans l'IA (AEO)",
                      "Structure Schema.org complète",
                      "Prêt pour la recherche vocale",
                      "Futur : Position 0 sur les IA génératives",
                    ],
                  },
                ].map(({ icon, title, color, textColor, items }) => (
                  <div key={title} className={`border-2 ${color} rounded-xl p-4 space-y-2`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{icon}</span>
                      <span className={`font-black text-xs ${textColor}`}>{title}</span>
                    </div>
                    {items.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0 mt-2" />
                        <span className="text-xs text-slate-600 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Effect arrow */}
              <div className="mt-6 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4 w-full">
                <TrendingUp className="h-8 w-8 text-blue-600 shrink-0" />
                <div>
                  <p className="font-black text-slate-900 text-sm">L&apos;Effet de Maillage = Amplification Exponentielle</p>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    Chaque levier amplifie les autres. Un article publié → indexé sur Google → partagé sur Instagram → cité par l&apos;IA → visible sur Maps.
                    Le maillage crée un cercle vertueux : plus l&apos;artisan publie, plus il est vu, plus il reçoit de demandes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Comparison */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-900 px-6 py-4">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-400" />
                Comparatif — Gainable.fr vs Les Autres Modèles
              </h3>
              <p className="text-slate-400 text-xs mt-1">Sachez positionner Gainable.fr face à chaque modèle concurrent. Connaître l&apos;ennemi, c&apos;est mieux le battre.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 font-black text-slate-700 text-xs">Critère</th>
                    <th className="text-center px-4 py-3 font-black text-xs text-blue-700 bg-blue-50">Gainable.fr ✦</th>
                    <th className="text-center px-4 py-3 font-bold text-xs text-slate-600">Bilik</th>
                    <th className="text-center px-4 py-3 font-bold text-xs text-slate-600">Travaux.com</th>
                    <th className="text-center px-4 py-3 font-bold text-xs text-slate-600">Selocal</th>
                    <th className="text-center px-4 py-3 font-bold text-xs text-slate-600">BNI</th>
                    <th className="text-center px-4 py-3 font-bold text-xs text-slate-600">PagesJaunes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      criteria: "Spécialisation CVC / Gainable",
                      gainable: { val: "✅ 100% CVC", good: true },
                      bilik: { val: "⚠️ BTP généraliste", good: false },
                      travaux: { val: "⚠️ Tous travaux", good: false },
                      selocal: { val: "⚠️ Tous métiers", good: false },
                      bni: { val: "❌ Hors sujet", good: false },
                      pages: { val: "❌ Annuaire généraliste", good: false },
                    },
                    {
                      criteria: "Modèle de lead",
                      gainable: { val: "✅ Visibilité directe — 0 revente", good: true },
                      bilik: { val: "✅ Mis en relation directe", good: true },
                      travaux: { val: "❌ Lead revendu à 3-5 concurrents", good: false },
                      selocal: { val: "⚠️ Abonnement + leads", good: false },
                      bni: { val: "✅ Réseau recommandation", good: true },
                      pages: { val: "❌ Lead revendu", good: false },
                    },
                    {
                      criteria: "Prix / Coût annuel",
                      gainable: { val: "✅ 850 € HT fixe/an", good: true },
                      bilik: { val: "⚠️ % commission par vente", good: false },
                      travaux: { val: "⚠️ 40-80 €/lead + abonnement", good: false },
                      selocal: { val: "⚠️ Variable selon région", good: false },
                      bni: { val: "❌ ~1 500-2 000 €/an + cotisations", good: false },
                      pages: { val: "⚠️ Abonnement variable", good: false },
                    },
                    {
                      criteria: "Commission sur chantier",
                      gainable: { val: "✅ 0% commission", good: true },
                      bilik: { val: "❌ 5-15% par mission", good: false },
                      travaux: { val: "✅ 0% (payé au lead)", good: true },
                      selocal: { val: "✅ 0% si abonnement", good: true },
                      bni: { val: "✅ 0%", good: true },
                      pages: { val: "✅ 0%", good: true },
                    },
                    {
                      criteria: "SEO & Visibilité Google",
                      gainable: { val: "✅ +58k pages indexées", good: true },
                      bilik: { val: "⚠️ Quelques pages", good: false },
                      travaux: { val: "✅ Forte autorité généraliste", good: true },
                      selocal: { val: "⚠️ Faible autorité SEO", good: false },
                      bni: { val: "❌ 0 SEO", good: false },
                      pages: { val: "⚠️ Annuaire vieillissant", good: false },
                    },
                    {
                      criteria: "Exclusivité géographique",
                      gainable: { val: "✅ 1 seul par zone", good: true },
                      bilik: { val: "❌ Multi-artisans", good: false },
                      travaux: { val: "❌ Multi-artisans", good: false },
                      selocal: { val: "❌ Multi-artisans", good: false },
                      bni: { val: "✅ 1 par métier / groupe", good: true },
                      pages: { val: "❌ Multi-artisans", good: false },
                    },
                    {
                      criteria: "Assistant IA SEO intégré",
                      gainable: { val: "✅ IA native (rédaction 2 min)", good: true },
                      bilik: { val: "❌ Non", good: false },
                      travaux: { val: "❌ Non", good: false },
                      selocal: { val: "❌ Non", good: false },
                      bni: { val: "❌ Non", good: false },
                      pages: { val: "❌ Non", good: false },
                    },
                    {
                      criteria: "Réseau / Maillage humain",
                      gainable: { val: "⚠️ En construction", good: false },
                      bilik: { val: "⚠️ Local uniquement", good: false },
                      travaux: { val: "❌ Pas de réseau", good: false },
                      selocal: { val: "⚠️ Faible", good: false },
                      bni: { val: "✅ Fort réseau business", good: true },
                      pages: { val: "❌ Annuaire", good: false },
                    },
                    {
                      criteria: "Complémentaire à Gainable.fr ?",
                      gainable: { val: "—", good: true },
                      bilik: { val: "✅ Oui, profils différents", good: true },
                      travaux: { val: "⚠️ Éviter (guerre des prix)", good: false },
                      selocal: { val: "⚠️ Possible localement", good: false },
                      bni: { val: "✅ Très complémentaire !", good: true },
                      pages: { val: "⚠️ Faible valeur ajoutée", good: false },
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-700 text-xs">{row.criteria}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          row.gainable.good ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"
                        }`}>{row.gainable.val}</span>
                      </td>
                      {([row.bilik, row.travaux, row.selocal, row.bni, row.pages] as {val:string;good:boolean}[]).map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            cell.good ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"
                          }`}>{cell.val}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BNI Special section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🤝</span>
                <div>
                  <h3 className="font-black text-blue-900">BNI — Le Complément Parfait</h3>
                  <p className="text-xs text-blue-600">Réseau business d&apos;affaires local</p>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                Le BNI (Business Network International) est une chambre de recommandation business.
                Un artisan CVC dans un groupe BNI reçoit des recommandations chaleureuses de comptables,
                agents immo, électriciens, etc. C&apos;est du maillage humain.<br /><br />
                <strong>Angle d&apos;attaque :</strong> « Vous êtes dans un groupe BNI ? Excellent.
                Gainable.fr, c&apos;est votre BNI digital — mais 24h/24, 7j/7, visible sur Google. »
              </p>
              <div className="space-y-2">
                {[
                  "BNI = réseau chaud (recommandations humaines)",
                  "Gainable.fr = réseau digital (Google + SEO)",
                  "Ensemble : l'artisan domine sur 2 canaux",
                  "L'un renforce l'autre (crédibilité x2)",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h3 className="font-black text-red-900">Travaux.com / Effy — L&apos;Anti-Modèle</h3>
                  <p className="text-xs text-red-600">Plateformes de revente de leads</p>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                Ces plateformes vendent le même lead à 3 à 5 artisans simultanément.
                L&apos;artisan doit appeler en moins de 3 minutes pour ne pas perdre le contact.
                Il se retrouve en concurrence directe sur le prix, détruisant sa marge.
              </p>
              <div className="space-y-2">
                {[
                  "Lead revendu à 3-5 concurrents en même temps",
                  "Course à l&apos;appel : 3 minutes pour décrocher",
                  "Guerre des prix → destruction des marges",
                  "Pas de fidélisation : chaque lead = nouvelle lutte",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-red-100 rounded-xl p-3">
                <p className="text-xs text-red-800 font-bold">
                  Script : « Vous connaissez le stress de devoir appeler en 3 min avant 4 concurrents pour brader vos marges ?
                  Chez nous, le client vous appelle vous et vous seul. »
                </p>
              </div>
            </div>
          </div>

          {/* Maillage Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Link2 className="h-5 w-5 text-emerald-600" />
              Le Maillage — La Stratégie qui Fait Tout
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Le maillage, c&apos;est l&apos;art de créer une toile d&apos;araignée numérique autour d&apos;un artisan.
              Chaque fil (article, lien, fiche, avis) renforce les autres. Plus la toile est dense,
              plus l&apos;artisan est difficile à déloger de sa position Google.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  phase: "Phase 1 — Ancrage (M1-M3)",
                  color: "bg-blue-600",
                  bg: "bg-blue-50 border-blue-200",
                  text: "text-blue-800",
                  icon: "📍",
                  actions: [
                    "Fiche Pro complète : description, certifications, marques",
                    "3 photos de chantiers récents minimum",
                    "Coordonnées directes vérifiées",
                    "Zone géographique définie",
                    "Premier article SEO : ville principale",
                  ],
                  result: "Google commence à crawler et indexer la fiche",
                },
                {
                  phase: "Phase 2 — Maillage (M3-M6)",
                  color: "bg-emerald-600",
                  bg: "bg-emerald-50 border-emerald-200",
                  text: "text-emerald-800",
                  icon: "🕸️",
                  actions: [
                    "8-10 articles/mois sur villes + technologies",
                    "FAQ structurées JSON-LD intégrées",
                    "Photos avec balises Alt optimisées",
                    "Liens depuis GMB → Gainable.fr",
                    "Partages Instagram/LinkedIn des articles",
                  ],
                  result: "Premiers positions sur requêtes longue traîne locales",
                },
                {
                  phase: "Phase 3 — Dominance (M6+)",
                  color: "bg-amber-500",
                  bg: "bg-amber-50 border-amber-200",
                  text: "text-amber-800",
                  icon: "🏆",
                  actions: [
                    "Cocon sémantique complet (50+ articles)",
                    "Backlinks naturels depuis partenaires",
                    "Avis Google croisés avec la fiche",
                    "Featured Snippets capturés via FAQ",
                    "Réponses IA (ChatGPT, Gemini) qui citent l'artisan",
                  ],
                  result: "Leads entrants réguliers. L'artisan reçoit des appels sans rien faire",
                },
              ].map(({ phase, color, bg, text, icon, actions, result }) => (
                <div key={phase} className={`border-2 ${bg} rounded-2xl overflow-hidden`}>
                  <div className={`${color} text-white px-5 py-3`}>
                    <div className="text-lg">{icon}</div>
                    <div className="font-black text-sm mt-1">{phase}</div>
                  </div>
                  <div className="p-4 space-y-2">
                    {actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className={`h-3.5 w-3.5 ${text} shrink-0 mt-0.5`} />
                        <span className="text-xs text-slate-700 leading-relaxed">{action}</span>
                      </div>
                    ))}
                    <div className={`${bg.split(" ")[0]} border ${bg.split(" ")[1]} rounded-lg p-3 mt-3`}>
                      <p className={`text-xs font-black ${text}`}>🎯 Résultat visé :</p>
                      <p className="text-xs text-slate-600 mt-1">{result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marathon Timeline */}
          <div className="bg-slate-900 rounded-2xl p-7 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Timer className="h-6 w-6 text-amber-400" />
              <h3 className="font-black text-xl">La Ligne du Temps — Vision Marathon</h3>
            </div>
            <div className="relative">
              {/* Timeline bar */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-slate-700 rounded-full" />
              <div className="absolute top-6 left-0 w-1/4 h-1 bg-blue-500 rounded-full" />
              <div className="absolute top-6 left-0 w-1/2 h-1 bg-emerald-500 rounded-full opacity-60" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                {[
                  {
                    month: "Mois 1-3",
                    color: "border-blue-500",
                    badge: "bg-blue-600",
                    title: "Fondations",
                    desc: "Fiche indexée. Premiers articles publiés. Google commence à voir l'artisan.",
                    emoji: "🌱",
                  },
                  {
                    month: "Mois 3-6",
                    color: "border-emerald-500",
                    badge: "bg-emerald-600",
                    title: "Montée en puissance",
                    desc: "Page 2-3 sur requêtes locales. Premiers contacts entrants. Confiance Google augmente.",
                    emoji: "📈",
                  },
                  {
                    month: "Mois 6-12",
                    color: "border-amber-500",
                    badge: "bg-amber-500",
                    title: "Leads Réguliers",
                    desc: "Page 1 sur plusieurs requêtes. 2-5 contacts qualifiés par mois. ROI atteint.",
                    emoji: "📞",
                  },
                  {
                    month: "12 mois+",
                    color: "border-pink-500",
                    badge: "bg-pink-600",
                    title: "Dominance Locale",
                    desc: "Référent SEO sur sa zone. Concurrent ne peut plus le déloger facilement. Chantiers premium.",
                    emoji: "🏆",
                  },
                ].map(({ month, color, badge, title, desc, emoji }) => (
                  <div key={month} className={`border-t-4 ${color} bg-slate-800 rounded-xl p-4 pt-8 mt-3`}>
                    <div className={`absolute -top-3 ${badge} text-white text-xs font-black px-2 py-1 rounded-full`}>
                      {month}
                    </div>
                    <div className="text-2xl mb-2">{emoji}</div>
                    <div className="font-bold text-amber-300 text-sm">{title}</div>
                    <div className="text-slate-400 text-xs mt-2 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-white/5 rounded-xl p-5 border border-white/10">
              <p className="font-bold text-amber-300 text-sm mb-2">💡 Argument Commercial Clé :</p>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                « Le SEO est comme planter un arbre. Le meilleur moment pour planter était il y a 1 an.
                Le deuxième meilleur moment, c&apos;est aujourd&apos;hui. Vos concurrents qui ont rejoint Gainable.fr
                il y a 6 mois récoltent déjà. Chaque mois que vous attendez, c&apos;est 1 mois de retard sur eux.
                C&apos;est un marathon — et eux sont déjà partis. »
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
