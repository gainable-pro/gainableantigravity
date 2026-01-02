
import 'dotenv/config';
import { Client } from 'pg';
import { randomUUID } from 'crypto';

const EXPERTS_TO_SEED = [
    {
        nom_entreprise: "DIAGNOSTIC ET EXPERTISE",
        siret: "90338912000010",
        adresse: "62-64 cours Albert Thomas",
        ville: "Lyon",
        code_postal: "69008",
        telephone: "06 14 96 72 54",
        description: "Cabinet de diagnostic immobilier situé à Lyon 8ème. Réalisation de tous diagnostics réglementaires : DPE, amiante, plomb, gaz, électricité et termites.",
        logo_url: "https://ui-avatars.com/api/?name=D+E&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Plomb", "Electricité", "Gaz"]
    },
    {
        nom_entreprise: "JURIS DIAGNOSTICS IMMOBILIERS",
        siret: "79287535300016",
        adresse: "70 RUE SAINT JEAN DE DIEU",
        ville: "Lyon",
        code_postal: "69007",
        telephone: "04 72 73 34 52",
        description: "Expert en diagnostics immobiliers à Lyon 7. JURIS réalise vos repérages amiante, plomb, DPE et contrôles d'installations.",
        logo_url: "https://ui-avatars.com/api/?name=Juris&background=0000FF&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Plomb"]
    },
    {
        nom_entreprise: "DIAGNOSTICS IMMOBILIERS LYONNAIS",
        siret: "50287159300013",
        adresse: "9 PLACE SAINT JEAN",
        ville: "Lyon",
        code_postal: "69005",
        telephone: "06 62 32 56 46",
        description: "Votre expert en diagnostic immobilier sur Lyon 5 et sa région. Intervention rapide pour DPE, Amiante, Carrez.",
        logo_url: "https://ui-avatars.com/api/?name=D+I+L&background=FF0000&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Loi Carrez", "Amiante"]
    },
    {
        nom_entreprise: "LES DIAGNOSTICS IMMOBILIERS",
        siret: "84440996100010",
        adresse: "13 BIS Avenue de la Motte Picquet",
        ville: "Paris",
        code_postal: "75007",
        telephone: "01 45 80 15 29",
        description: "Expertise en diagnostics immobiliers sur Paris 7. Spécialiste DPE, Amiante, Electricité et Gaz pour vente et location.",
        logo_url: "https://ui-avatars.com/api/?name=L+D+I&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Electricité", "Gaz"]
    },
    {
        nom_entreprise: "DIAGNOSTIQUEURS CONSEILS",
        siret: "79028620700010",
        adresse: "18 place Raoul Follereau",
        ville: "Paris",
        code_postal: "75010",
        telephone: "01 45 72 21 08",
        description: "Cabinet de diagnostic immobilier complet à Paris 10. Interventions rapides et rapports certifiés.",
        logo_url: "https://ui-avatars.com/api/?name=D+C&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Plomb", "Termites"]
    },
    {
        nom_entreprise: "DIAGSHOP",
        siret: "85101584200012",
        adresse: "39 Rue Frémicourt",
        ville: "Paris",
        code_postal: "75015",
        telephone: "01 45 78 90 90",
        description: "L'Alliance du Diagnostic Immobilier. Service professionnel pour tous vos diagnostics obligatoires.",
        logo_url: "https://ui-avatars.com/api/?name=Diagshop&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Plomb"]
    },
    {
        nom_entreprise: "ARLIANE DIAGNOSTIC IMMOBILIER PARIS",
        siret: "84230742300033",
        adresse: "104 RUE DE LA CONVENTION",
        ville: "Paris",
        code_postal: "75015",
        telephone: "01 83 62 31 65",
        description: "Réseau national Arliane - Agence Paris 15. Diagnostics vente et location, DPE, Amiante, Plomb.",
        logo_url: "https://ui-avatars.com/api/?name=Arliane&background=00AEEF&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Plomb", "Termites"]
    },
    {
        nom_entreprise: "EXTRADIAG",
        siret: "51226555400039",
        adresse: "16B rue d'Odessa",
        ville: "Paris",
        code_postal: "75014",
        telephone: "01 48 51 74 59",
        description: "Votre diagnostiqueur de confiance à Montparnasse. Intervention rapide sur tout Paris.",
        logo_url: "https://ui-avatars.com/api/?name=Extra&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Gaz", "Electricité"]
    },
    {
        nom_entreprise: "ACTIVE DIAG13",
        siret: "48439366600024",
        adresse: "Marseille",
        ville: "Marseille",
        code_postal: "13012",
        telephone: "04 91 49 74 80",
        description: "Active Diag13 réalise tous vos diagnostics immobiliers à Marseille et ses alentours.",
        logo_url: "https://ui-avatars.com/api/?name=AD13&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Plomb"]
    },
    {
        nom_entreprise: "DIAGAMTER MARSEILLE PRADO",
        siret: "53982468000019",
        adresse: "95 Avenue du Prado",
        ville: "Marseille",
        code_postal: "13008",
        telephone: "04 91 27 25 74",
        description: "Cabinet Diagamter Marseille Prado. Diagnostics immobiliers irréprochables pour la vente ou la location.",
        logo_url: "https://ui-avatars.com/api/?name=Diagamter&background=FFD700&color=000&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Superficie Carrez"]
    },
    {
        nom_entreprise: "DR DIAG IMMO 13",
        siret: "83261267500021",
        adresse: "68 Boulevard Aguillon",
        ville: "Marseille",
        code_postal: "13009",
        telephone: "06 20 62 10 45",
        description: "Expert indépendant à Marseille 9ème. DPE, Gaz, Electricité, Plomb.",
        logo_url: "https://ui-avatars.com/api/?name=DR+Diag&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Electricité", "Gaz"]
    },
    {
        nom_entreprise: "ECODIAG",
        siret: "52458807600010",
        adresse: "77 Boulevard des Libérateurs",
        ville: "Marseille",
        code_postal: "13011",
        telephone: "06 63 79 19 86",
        description: "EcoDiag Marseille, spécialiste des diagnostics techniques et de la performance énergétique.",
        logo_url: "https://ui-avatars.com/api/?name=Eco&background=008000&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Audit Energétique"]
    },
    {
        nom_entreprise: "DIRECT DIAGNOSTIC",
        siret: "83241349600011",
        adresse: "Toulouse",
        ville: "Toulouse",
        code_postal: "31000",
        telephone: "06 24 21 35 46",
        description: "Direct Diagnostic Toulouse. Intervention rapide 7j/7 pour tous vos diagnostics immobiliers.",
        logo_url: "https://ui-avatars.com/api/?name=Direct&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Termites"]
    },
    {
        nom_entreprise: "DEFIM TOULOUSE",
        siret: "85363680100014",
        adresse: "Toulouse",
        ville: "Toulouse",
        code_postal: "31000",
        telephone: "05 34 65 69 51",
        description: "Agence DEFIM Toulouse - Votre partenaire pour les diagnostics immobiliers vente et location.",
        logo_url: "https://ui-avatars.com/api/?name=Defim&background=ED1C24&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Gaz", "Electricité", "Termites"]
    },
    {
        nom_entreprise: "DIAGNOSTIC IMMOBILIER MCP",
        siret: "50841252500026",
        adresse: "Toulouse",
        ville: "Toulouse",
        code_postal: "31000",
        telephone: "05 34 31 63 60",
        description: "MCP Diagnostic & Ingénierie. Expertise technique et diagnostics immobiliers complets.",
        logo_url: "https://ui-avatars.com/api/?name=MCP&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante"]
    },
    {
        nom_entreprise: "CAME DIAGNOSTIC",
        siret: "85402322300011",
        adresse: "Nice",
        ville: "Nice",
        code_postal: "06000",
        telephone: "07 60 96 26 09",
        description: "CAME Diagnostics Nice. Expertise, réactivité et conseils pour vos diagnostics immobiliers.",
        logo_url: "https://ui-avatars.com/api/?name=Came&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Termites"]
    },
    {
        nom_entreprise: "DIAGNOSTIC 06",
        siret: "50903529100023",
        adresse: "270 bis chemin de Crémat",
        ville: "Nice",
        code_postal: "06200",
        telephone: "04 89 74 57 80",
        description: "Diagnostic 06 - SARL Sur Mesure. Tous diagnostics sur Nice et Alpes-Maritimes.",
        logo_url: "https://ui-avatars.com/api/?name=D06&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Carrez"]
    },
    {
        nom_entreprise: "7MDIAG",
        siret: "53742872400034",
        adresse: "36 corniche Notre Dame",
        ville: "Villeneuve Loubet",
        code_postal: "06270",
        telephone: "06 26 90 96 50",
        description: "7Mdiag intervient sur Nice et sa région pour tous vos diagnostics obligatoires.",
        logo_url: "https://ui-avatars.com/api/?name=7M&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Plomb", "Electricité"]
    },
    {
        nom_entreprise: "ATLANTIC DIAGNOSTIC",
        siret: "85366927300015",
        adresse: "56 Boulevard Saint-Aignan",
        ville: "Nantes",
        code_postal: "44100",
        telephone: "02 85 52 32 32",
        description: "Atlantic Diagnostic, votre expert nantais pour DPE, amiante, plomb et termites.",
        logo_url: "https://ui-avatars.com/api/?name=Atlantic&background=000080&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Termites", "Amiante"]
    },
    {
        nom_entreprise: "M2 DIAGNOSTICS",
        siret: "80054325800025",
        adresse: "1 Rue du Guesclin",
        ville: "Nantes",
        code_postal: "44019",
        telephone: "02 53 35 37 40",
        description: "M2 Diagnostics, cabinet situé en plein cœur de Nantes. Réactivité et professionnalisme.",
        logo_url: "https://ui-avatars.com/api/?name=M2&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Loi Carrez"]
    },
    {
        nom_entreprise: "DIAG PRECISION NANTES",
        siret: "83023577600019",
        adresse: "Nantes",
        ville: "Nantes",
        code_postal: "44000",
        telephone: "02 40 15 24 98",
        description: "Diag Précision 44. Diagnostics immobiliers certifiés sur Nantes et Loire-Atlantique.",
        logo_url: "https://ui-avatars.com/api/?name=DP&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Gaz"]
    },
    {
        nom_entreprise: "DIAGAMTER STRASBOURG",
        siret: "44854624200034",
        adresse: "Strasbourg",
        ville: "Strasbourg",
        code_postal: "67000",
        telephone: "03 90 41 18 02",
        description: "Diagamter Strasbourg. Leader en diagnostics immobiliers, DPE, amiante pour professionnels et particuliers.",
        logo_url: "https://ui-avatars.com/api/?name=Diagamter&background=FFD700&color=000&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Electricité"]
    },
    {
        nom_entreprise: "ALIZE DIAGNOSTIC",
        siret: "45175106900012",
        adresse: "Strasbourg",
        ville: "Strasbourg",
        code_postal: "67000",
        telephone: "03 88 69 37 53",
        description: "Alizé Contrôles et Diagnostics. Réactivité et tarifs compétitifs sur Strasbourg.",
        logo_url: "https://ui-avatars.com/api/?name=Alize&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Plomb", "Gaz"]
    },
    {
        nom_entreprise: "DIAGNOSTIC IMMOBILIER ST",
        siret: "81032163800019",
        adresse: "Strasbourg",
        ville: "Strasbourg",
        code_postal: "67100",
        telephone: "06 98 40 49 03",
        description: "Expert certifié ST Diagnostics. Intervention rapide DPE, Gaz, Electricité.",
        logo_url: "https://ui-avatars.com/api/?name=ST&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Electricité", "Gaz"]
    },
    {
        nom_entreprise: "EX'IM HERAULT",
        siret: "84307137400014",
        adresse: "Montpellier",
        ville: "Montpellier",
        code_postal: "34000",
        telephone: "06 43 38 48 93",
        description: "EX'IM Hérault. Réseau national de diagnostics immobiliers. Qualité et professionnalisme.",
        logo_url: "https://ui-avatars.com/api/?name=Exim&background=ED1C24&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Termites"]
    },
    {
        nom_entreprise: "CEB-DIAG MONTPELLIER",
        siret: "97758410100017",
        adresse: "48 rue Claude Balbastre",
        ville: "Montpellier",
        code_postal: "34070",
        telephone: "06 64 71 13 92",
        description: "CEB-DIAG, votre diagnostiqueur à Montpellier. DPE, amiante, plomb.",
        logo_url: "https://ui-avatars.com/api/?name=CEB&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Plomb", "Amiante"]
    },
    {
        nom_entreprise: "DIMO DIAGNOSTIC MONTPELLIER",
        siret: "82964237000025",
        adresse: "321 rue de l'industrie",
        ville: "Montpellier",
        code_postal: "34000",
        telephone: "07 56 79 94 11",
        description: "DIMO Diagnostic. Expertise immobilière certifiée Hérault. DPE, Electricité.",
        logo_url: "https://ui-avatars.com/api/?name=Dimo&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Electricité", "Gaz"]
    },
    {
        nom_entreprise: "DIAG33",
        siret: "31556260300054",
        adresse: "Bordeaux",
        ville: "Bordeaux",
        code_postal: "33000",
        telephone: "05 57 83 20 87",
        description: "Diag33, spécialiste girondin du diagnostic immobilier depuis plus de 20 ans.",
        logo_url: "https://ui-avatars.com/api/?name=D33&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Termites"]
    },
    {
        nom_entreprise: "AQUITAINE DIAGNOSTIC IMMOBILIER",
        siret: "50197627800025",
        adresse: "266 RUE DE BÈGLES",
        ville: "Bordeaux",
        code_postal: "33800",
        telephone: "06 98 18 41 21",
        description: "ADI 33. Réactivité et sérieux pour vos diagnostics vente et location sur Bordeaux Métropole.",
        logo_url: "https://ui-avatars.com/api/?name=ADI&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Gaz", "Plomb"]
    },
    {
        nom_entreprise: "ANALYS' IMMO BORDEAUX",
        siret: "50294249300029",
        adresse: "Bordeaux",
        ville: "Bordeaux",
        code_postal: "33000",
        telephone: "06 79 86 39 76",
        description: "Analys' Immo. Diagnostics techniques obligatoires et conseils travaux.",
        logo_url: "https://ui-avatars.com/api/?name=Analys&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Electricité"]
    },
    {
        nom_entreprise: "DIAGPERFORMANCE",
        siret: "95244740700026",
        adresse: "Lille",
        ville: "Lille",
        code_postal: "59000",
        telephone: "07 69 64 95 24",
        description: "DiagPerformance Lille. Diagnostics DPE et Audit énergétique pour la rénovation.",
        logo_url: "https://ui-avatars.com/api/?name=DiagPer&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Audit Energétique"]
    },
    {
        nom_entreprise: "DEFIM LILLE",
        siret: "81408333300025",
        adresse: "Lille",
        ville: "Lille",
        code_postal: "59000",
        telephone: "03 20 48 52 09",
        description: "DEFIM Lille. Réseau national, expertise locale. DPE, Amiante, Plomb.",
        logo_url: "https://ui-avatars.com/api/?name=Defim&background=ED1C24&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Plomb"]
    },
    {
        nom_entreprise: "LEBDIAG (DIAGAMTER LILLE)",
        siret: "79536680600029",
        adresse: "Lille",
        ville: "Lille",
        code_postal: "59000",
        telephone: "03 20 02 00 68",
        description: "Agence Diagamter Lille. Diagnostics immobiliers certifiés et rapports clairs.",
        logo_url: "https://ui-avatars.com/api/?name=Diagamter&background=FFD700&color=000&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Gaz"]
    },
    {
        nom_entreprise: "LD2I RENNES",
        siret: "97803487400013",
        adresse: "7C rue Papu",
        ville: "Rennes",
        code_postal: "35000",
        telephone: "06 34 14 00 67",
        description: "LD2i Expertises - Julien Le Coniat. Diagnostics immobiliers sur Rennes Métropole.",
        logo_url: "https://ui-avatars.com/api/?name=LD2i&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Carrez"]
    },
    {
        nom_entreprise: "ARLIANE RENNES",
        siret: "51411217600045",
        adresse: "6 Square René Cassin",
        ville: "Rennes",
        code_postal: "35700",
        telephone: "06 60 35 03 71",
        description: "Arliane Rennes. Diagnostics vente et location, DPE, Termites, Mérules.",
        logo_url: "https://ui-avatars.com/api/?name=Arliane&background=00AEEF&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Termites", "Amiante"]
    },
    {
        nom_entreprise: "DIAG PRECISION 35",
        siret: "88395632800014",
        adresse: "Rennes",
        ville: "Rennes",
        code_postal: "35000",
        telephone: "02 23 08 76 20",
        description: "Diag Précision 35. Expertise immobilière certifiée sur l'Ille-et-Vilaine.",
        logo_url: "https://ui-avatars.com/api/?name=DP35&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Gaz"]
    },
    {
        nom_entreprise: "DIAGAUDIT EXPERT",
        siret: "53961190500057",
        adresse: "2 boulevard Louis Roederer",
        ville: "Reims",
        code_postal: "51100",
        telephone: "06 58 36 36 80",
        description: "Diagaudit Expert Reims. Diagnostics, DPE, Audit. Intervention rapide.",
        logo_url: "https://ui-avatars.com/api/?name=DAE&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Audit Energétique"]
    },
    {
        nom_entreprise: "EXIM MARNE REIMS",
        siret: "88936667000012",
        adresse: "21 rue Joliot Curie",
        ville: "Reims",
        code_postal: "51100",
        telephone: "03 26 89 50 10",
        description: "EX'IM Marne. Votre agence de diagnostic immobilier à Reims.",
        logo_url: "https://ui-avatars.com/api/?name=Exim&background=ED1C24&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Plomb"]
    },
    {
        nom_entreprise: "SR DIAG",
        siret: "92903212600013",
        adresse: "3 RUE DU GENERAL MICHELER",
        ville: "Reims",
        code_postal: "51100",
        telephone: "06 09 79 15 09",
        description: "SR Diag Reims. Expert indépendant pour vos diagnostics obligatoires.",
        logo_url: "https://ui-avatars.com/api/?name=SR&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Gaz", "Electricité"]
    },
    {
        nom_entreprise: "EX'IM SEINE ESTUAIRE",
        siret: "93997626200013",
        adresse: "Le Havre",
        ville: "Le Havre",
        code_postal: "76600",
        telephone: "02 44 51 38 10",
        description: "EX'IM Seine Estuaire. Diagnostics immobiliers complets sur Le Havre.",
        logo_url: "https://ui-avatars.com/api/?name=Exim&background=ED1C24&color=FFF&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante"]
    },
    {
        nom_entreprise: "AOM DIAG",
        siret: "84490562000036",
        adresse: "Le Havre",
        ville: "Le Havre",
        code_postal: "76600",
        telephone: "09 83 80 16 76",
        description: "AOM Diag. Cabinet de diagnostics immobiliers certifiés au Havre.",
        logo_url: "https://ui-avatars.com/api/?name=AOM&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Plomb", "Termites"]
    },
    {
        nom_entreprise: "DIAG&CAUX",
        siret: "98375197500019",
        adresse: "Le Havre",
        ville: "Le Havre",
        code_postal: "76600",
        telephone: "06 19 02 15 76",
        description: "Diag & Caux. Intervention sur Le Havre et pointe de Caux. DPE, Amiante.",
        logo_url: "https://ui-avatars.com/api/?name=D&C&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Carrez"]
    },
    {
        nom_entreprise: "HOM EXPERT",
        siret: "84098998200011",
        adresse: "8 rue des 3 Glorieuses",
        ville: "Saint-Etienne",
        code_postal: "42000",
        telephone: "04 77 93 10 41",
        description: "Hom Expert Saint-Etienne. Diagnostics immobiliers de qualité. Réactivité assurée.",
        logo_url: "https://ui-avatars.com/api/?name=Hom&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Gaz", "Electricité"]
    },
    {
        nom_entreprise: "AVE DIAGNOSTIC IMMOBILIER",
        siret: "91326135000015",
        adresse: "50 RUE DE LA JOMAYERE",
        ville: "Saint-Etienne",
        code_postal: "42100",
        telephone: "06 12 34 56 78",
        description: "AVE Diagnostic. Cabinet indépendant à Saint-Etienne.",
        logo_url: "https://ui-avatars.com/api/?name=AVE&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante"]
    },
    {
        nom_entreprise: "DIADEX",
        siret: "79740077700034",
        adresse: "Toulon",
        ville: "Toulon",
        code_postal: "83000",
        telephone: "06 17 13 35 86",
        description: "Diadex Toulon. Expertises immobilières pour vente et location dans le Var.",
        logo_url: "https://ui-avatars.com/api/?name=Diadex&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Termites", "Amiante"]
    },
    {
        nom_entreprise: "AFLDIAG83",
        siret: "89392404300019",
        adresse: "Toulon",
        ville: "Toulon",
        code_postal: "83000",
        telephone: "06 26 64 57 62",
        description: "AFL Diag 83. Votre diagnostiqueur conseil à Toulon.",
        logo_url: "https://ui-avatars.com/api/?name=AFL&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Electricité", "Gaz"]
    },
    {
        nom_entreprise: "DIAG2VILLE",
        siret: "92191628400018",
        adresse: "1 rue des Pins",
        ville: "Grenoble",
        code_postal: "38100",
        telephone: "04 58 00 83 48",
        description: "Diag2Ville Grenoble. Diagnostics techniques immobiliers: DPE, Amiante, Plomb.",
        logo_url: "https://ui-avatars.com/api/?name=D2V&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Plomb"]
    },
    {
        nom_entreprise: "ODITE",
        siret: "81741757900025",
        adresse: "12 Square des Fusillés",
        ville: "Grenoble",
        code_postal: "38000",
        telephone: "06 75 25 47 83",
        description: "Odite Diagnostic. Cabinet d'expertise technique du bâtiment à Grenoble.",
        logo_url: "https://ui-avatars.com/api/?name=Odite&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Audit Energétique"]
    },
    {
        nom_entreprise: "DTI DIJON",
        siret: "48365544500029",
        adresse: "Dijon",
        ville: "Dijon",
        code_postal: "21000",
        telephone: "06 66 49 06 48",
        description: "SASU DTI Dijon. Diagnostics Immobiliers sur la Côte-d'Or.",
        logo_url: "https://ui-avatars.com/api/?name=DTI&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Plomb", "Amiante"]
    },
    {
        nom_entreprise: "DIAG PRECISION 21",
        siret: "94058349500018",
        adresse: "Dijon",
        ville: "Dijon",
        code_postal: "21000",
        telephone: "06 95 40 65 50",
        description: "Diag Précision 21. Intervention rapide et rapports soignés sur Dijon.",
        logo_url: "https://ui-avatars.com/api/?name=DP21&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Gaz", "Electricité"]
    },
    {
        nom_entreprise: "ACLEO DIAGNOSTIC",
        siret: "49417791800037",
        adresse: "200 RUE LEON BLUM",
        ville: "Villeurbanne",
        code_postal: "69100",
        telephone: "04 26 64 86 42",
        description: "Acleo Agenda Diagnostics Villeurbanne. Tous diagnostics vente et location.",
        logo_url: "https://ui-avatars.com/api/?name=Acleo&background=random&size=256",
        expert_type: "diagnostics_dpe",
        interventions_diag: ["DPE", "Amiante", "Carrez"]
    }
];

async function main() {
    // 1. Connection
    // Using POOLER URL as Direct URL is not resolving on user network.
    // 1. Connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("❌ DATABASE_URL is not defined in .env");
        process.exit(1);
    }
    console.log("Connecting to database...");

    // Disable prepared statements for PgBouncer compatibility (query_mode: 'simple' is not directly supported by pg client in all versions, but simple queries usually work)
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log(`Connected to database. Seeding ${EXPERTS_TO_SEED.length} experts...`);

        for (const expertData of EXPERTS_TO_SEED) {
            const email = `import.${expertData.siret}@gainable.fr`;

            // 2. Check User
            const userRes = await client.query('SELECT id FROM "User" WHERE email = $1', [email]);
            let userId = userRes.rows[0]?.id;

            if (!userId) {
                console.log(`Creating user for ${expertData.nom_entreprise}...`);
                const newUserRes = await client.query(
                    `INSERT INTO "User" (id, email, password_hash, role, created_at)
                     VALUES ($1, $2, 'import_generated', 'expert', NOW())
                     RETURNING id`,
                    [randomUUID(), email]
                );
                userId = newUserRes.rows[0].id;
            }

            // 3. Check Expert
            const expertRes = await client.query('SELECT id FROM "Expert" WHERE user_id = $1', [userId]);
            let expertId = expertRes.rows[0]?.id;

            if (!expertId) {
                const slug = expertData.nom_entreprise.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + expertData.code_postal;

                console.log(`Creating expert ${expertData.nom_entreprise}...`);
                const newExpertRes = await client.query(
                    `INSERT INTO "Expert" (
                        id, user_id, nom_entreprise, description, siret, adresse, ville, code_postal, pays, telephone, logo_url, expert_type, slug, status, is_labeled, representant_nom, representant_prenom, created_at
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, 'FR', $9, $10, $11, $12, 'pending', false, 'Import', 'Automatique', NOW()
                    ) RETURNING id`,
                    [
                        randomUUID(), // id
                        userId, // user_id
                        expertData.nom_entreprise,
                        expertData.description,
                        expertData.siret,
                        expertData.adresse,
                        expertData.ville,
                        expertData.code_postal,
                        expertData.telephone,
                        expertData.logo_url,
                        expertData.expert_type,
                        slug
                    ]
                );
                expertId = newExpertRes.rows[0].id;

                // 4. Interventions Diagram
                if (expertData.interventions_diag && expertData.interventions_diag.length > 0) {
                    for (const val of expertData.interventions_diag) {
                        await client.query(
                            `INSERT INTO "ExpertInterventionDiag" (id, expert_id, value) VALUES ($1, $2, $3)`,
                            [randomUUID(), expertId, val]
                        );
                    }
                }
            } else {
                console.log(`Expert ${expertData.nom_entreprise} already exists.`);
            }
        }
    } catch (e: any) {
        console.error("FATAL ERROR:", e);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
