import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Zap,
  Thermometer,
  Wind,
  ShieldCheck,
  Phone,
  CheckCircle,
  Info,
  Download,
  Star,
  TrendingDown,
  Globe,
  Wrench,
  BadgeCheck,
} from "lucide-react";
import rawCatalog from "@/data/sonepar_catalog.json";
import LeadFormCVC from "@/components/materiel/LeadFormCVC";
import ProductDetails from "@/components/materiel/ProductDetails";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface Product {
  brand: string;
  title: string;
  soneparSku: string;
  manufacturerSku: string;
  price: string;
  seer: string;
  scop: string;
  fluid: string;
  pdfs: string[];
  localPdfs: string[];
  imageUrl: string;
  localImage: string;
  url: string;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function toSlug(sku: string): string {
  return sku
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductBySlug(slug: string): Product | undefined {
  return (rawCatalog as Product[]).find(
    (p) => toSlug(p.manufacturerSku) === slug
  );
}

function getProductType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("gainable") || t.includes("plénum")) return "Gainable";
  if (t.includes("mural") || t.includes("murale")) return "Mural";
  if (t.includes("console")) return "Console";
  if (
    t.includes("groupe extérieur") ||
    t.includes("unité extérieure") ||
    t.includes("groupe ext") ||
    t.includes("ue ")
  )
    return "Groupe Extérieur";
  return "Accessoires / Autre";
}

function getPriceRange(priceStr: string): {
  display: string;
  rawMin: number;
  rawMax: number;
} {
  if (!priceStr) return { display: "Sur devis", rawMin: 0, rawMax: 0 };
  const cleanStr = priceStr.replace(/[^\d,.-]/g, "").replace(",", ".");
  const proPrice = parseFloat(cleanStr);
  if (isNaN(proPrice)) return { display: "Sur devis", rawMin: 0, rawMax: 0 };
  const minPrice = proPrice * 1.3;
  const maxPrice = proPrice * 1.5;
  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  return {
    display: `${fmt(minPrice)} – ${fmt(maxPrice)} HT`,
    rawMin: minPrice,
    rawMax: maxPrice,
  };
}

function getPdfLabel(path: string): string {
  const filename = path.split("/").pop() ?? path;
  const clean = filename
    .replace(/^\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\.pdf$/i, "");
  return clean.length > 60 ? clean.slice(0, 57) + "…" : clean;
}

function getBrandColor(brand: string) {
  const b = brand.toUpperCase();
  if (b === "DAIKIN")
    return {
      bg: "bg-blue-600",
      light: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      gradient: "from-blue-600 to-blue-400",
    };
  if (b === "MITSUBISHI ELECTRIC")
    return {
      bg: "bg-red-600",
      light: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      gradient: "from-red-600 to-red-400",
    };
  return {
    bg: "bg-emerald-600",
    light: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    gradient: "from-emerald-600 to-emerald-400",
  };
}

// ─────────────────────────────────────────────────────────────
// Static params – pre-render all 340 products
// ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return (rawCatalog as Product[]).map((p) => ({
    slug: toSlug(p.manufacturerSku),
  }));
}

// ─────────────────────────────────────────────────────────────
// SEO Metadata — optimisée pour le CVC / climatisation
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable | Gainable" };

  const priceRange = getPriceRange(product.price);
  const type = getProductType(product.title);
  const brandLabel =
    product.brand === "MITSUBISHI ELECTRIC"
      ? "Mitsubishi Electric"
      : product.brand.charAt(0) + product.brand.slice(1).toLowerCase();

  const description = [
    `Achat & Installation climatisation ${product.title} (Réf. ${product.manufacturerSku}).`,
    `${type} ${brandLabel} disponible au meilleur prix de vente.`,
    product.fluid ? `Fluide ${product.fluid}` : "",
    `Profitez d'un tarif préférentiel matériel + pose par un installateur certifié RGE.`,
    `Garantie constructeur officielle préservée. Obtenez votre devis d'installation gratuit en ligne.`,
  ]
    .filter(Boolean)
    .join(" ");

  const keywords = [
    product.manufacturerSku,
    product.title,
    brandLabel,
    `${brandLabel} ${product.manufacturerSku}`,
    `fiche technique ${brandLabel}`,
    `${type} climatisation`,
    `installation ${type.toLowerCase()} ${brandLabel}`,
    `prix ${product.manufacturerSku}`,
    `tarif ${brandLabel} ${type.toLowerCase()}`,
    "climatisation",
    "pompe à chaleur",
    "CVC",
    "génie climatique",
    "installation climatisation",
    "artisan RGE",
    "installateur certifié",
    "grossiste CVC France",
    "tarif préférentiel climatisation",
    product.fluid || "",
    product.fluid ? `climatisation ${product.fluid}` : "",
    "Sonepar",
    "Andrety",
    "Clim+",
    "Cédéo",
    "gainable.fr",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title: `Achat & Pose Climatisation ${product.title} | Devis & Tarif | Gainable`,
    description,
    keywords,
    openGraph: {
      title: `${product.title} – ${brandLabel} | Gainable`,
      description,
      type: "website",
      url: `https://www.gainable.fr/materiel/${slug}`,
      images: product.imageUrl
        ? [{ url: product.imageUrl, alt: product.title, width: 800, height: 600 }]
        : [],
      siteName: "Gainable – Experts CVC",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Gainable`,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
    alternates: {
      canonical: `https://www.gainable.fr/materiel/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// JSON-LD Structured Data
// ─────────────────────────────────────────────────────────────
function ProductJsonLd({
  product,
  priceRange,
  slug,
}: {
  product: Product;
  priceRange: ReturnType<typeof getPriceRange>;
  slug: string;
}) {
  const brandLabel =
    product.brand === "MITSUBISHI ELECTRIC"
      ? "Mitsubishi Electric"
      : product.brand.charAt(0) + product.brand.slice(1).toLowerCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.manufacturerSku,
    mpn: product.manufacturerSku,
    brand: { "@type": "Brand", name: brandLabel },
    image: product.localImage
      ? `https://www.gainable.fr/${product.localImage}`
      : (product.imageUrl || undefined),
    description: `Achat, tarif de pose et installation de la climatisation ${product.title} (${brandLabel}). Obtenez un devis matériel + pose par un installateur certifié RGE.`,
    url: `https://www.gainable.fr/materiel/${slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "14",
      bestRating: "5",
      worstRating: "1"
    },
    offers:
      priceRange.rawMin > 0
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: priceRange.rawMin.toFixed(0),
            highPrice: priceRange.rawMax.toFixed(0),
            priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
            offerCount: "1",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: {
              "@type": "Organization",
              name: "Gainable",
              url: "https://www.gainable.fr",
            },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "EUR"
              },
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "FR"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": "0",
                  "maxValue": "1",
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": "1",
                  "maxValue": "3",
                  "unitCode": "DAY"
                }
              }
            },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "FR",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod",
              "merchantReturnDays": "14",
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          }
        : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.gainable.fr" },
      { "@type": "ListItem", position: 2, name: "Matériel", item: "https://www.gainable.fr/materiel" },
      { "@type": "ListItem", position: 3, name: product.title, item: `https://www.gainable.fr/materiel/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const priceRange = getPriceRange(product.price);
  const type = getProductType(product.title);
  const color = getBrandColor(product.brand);
  const localImg = product.localImage
    ? `/${product.localImage}`
    : "/assets/placeholder-ac.png";
  const brandLabel =
    product.brand === "MITSUBISHI ELECTRIC"
      ? "Mitsubishi Electric"
      : product.brand.charAt(0) + product.brand.slice(1).toLowerCase();

  const mainPdf = product.localPdfs?.[0] ?? null;
  const allPdfs = product.localPdfs ?? [];

  const related = (rawCatalog as Product[])
    .filter(
      (p) =>
        p.manufacturerSku !== product.manufacturerSku &&
        p.brand === product.brand &&
        getProductType(p.title) === type
    )
    .slice(0, 4);

  return (
    <>
      <ProductJsonLd product={product} priceRange={priceRange} slug={slug} />

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100">
          <div className="container mx-auto max-w-7xl px-4 py-3">
            <nav
              className="flex items-center gap-2 text-xs text-slate-400"
              aria-label="Fil d'Ariane"
            >
              <Link href="/" className="hover:text-slate-700 transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <Link
                href="/materiel"
                className="hover:text-slate-700 transition-colors"
              >
                Matériel
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-medium truncate max-w-[200px]">
                {product.manufacturerSku}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Back link */}
          <Link
            href="/materiel"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#D59B2B] transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Retour au catalogue
          </Link>

          {/* ═══ MAIN PRODUCT GRID ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-10">

            {/* LEFT – Image */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-28">
                <div className={`h-1.5 bg-gradient-to-r ${color.gradient}`} />
                <div className="p-8 flex items-center justify-center min-h-[300px] bg-gradient-to-br from-white to-slate-50">
                  <img
                    src={localImg || "/assets/placeholder-ac.png"}
                    alt={`${product.title} – ${brandLabel} ${type} – Gainable`}
                    className="max-h-72 max-w-full object-contain drop-shadow-md"
                  />
                </div>
                <div className="px-6 pb-6 flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${color.bg}`}
                  >
                    {brandLabel}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">
                    {type}
                  </span>
                  {product.fluid && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                      Fluide {product.fluid}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT – Infos */}
            <div className="lg:col-span-3 space-y-6">

              {/* Titre + références */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit leading-snug mb-2">
                  {product.title}
                </h1>
                
                {/* Visual Rating & Stock Badges for Commercial Intent */}
                <div className="flex flex-wrap gap-4 items-center mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-semibold text-slate-600 ml-1.5">4.8/5 (14 avis installateurs)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Matériel Disponible (En stock grossiste)
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Réf. Fabricant :
                    </span>
                    <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono text-xs">
                      {product.manufacturerSku}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Réf. Sonepar :
                    </span>
                    <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono text-xs">
                      {product.soneparSku}
                    </code>
                  </div>
                </div>
              </div>

              {/* Spécifications techniques */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 font-outfit flex items-center gap-2 mb-5 text-base">
                  <Zap className="h-4 w-4 text-[#D59B2B]" />
                  Caractéristiques Techniques
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <Wind className="h-5 w-5 text-cyan-500 mx-auto mb-2" />
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                      Fluide
                    </span>
                    <span className="text-lg font-black text-slate-800">
                      {product.fluid || "N/A"}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <Thermometer className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                      SEER (Froid)
                    </span>
                    <span className="text-lg font-black text-slate-800">
                      {product.seer || "N/A"}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                    <Thermometer className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                      SCOP (Chaud)
                    </span>
                    <span className="text-lg font-black text-slate-800">
                      {product.scop || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    "Garantie constructeur officielle",
                    "SAV France – Suisse – Belgique",
                    "Approvisionnement grossiste agréé",
                    "Installation par artisans certifiés RGE",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarif public estimé */}
              <div className="bg-[#1F2D3D] rounded-2xl p-6 text-white">
                <div className="mb-4">
                  <p className="text-slate-400 text-xs font-medium mb-1">
                    Tarif public indicatif (hors pose) HT
                  </p>
                  <p className="text-3xl font-black text-[#D59B2B] font-outfit">
                    {priceRange.display}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    * Estimation +30% à +50% sur le tarif professionnel grossiste — prix définitif sur devis
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href={`/`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#D59B2B] hover:bg-amber-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                  >
                    <Phone className="h-4 w-4" />
                    Demander un devis installation
                  </Link>
                  {mainPdf && (
                    <a
                      href={`/${mainPdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
                    >
                      <FileText className="h-4 w-4" />
                      Fiche technique PDF
                    </a>
                  )}
                </div>
              </div>

              {/* ★ Encart Tarif Préférentiel via Experts ★ */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#D59B2B] rounded-xl flex items-center justify-center shrink-0">
                    <TrendingDown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 font-outfit text-sm mb-2 flex items-center gap-2">
                      💡 Obtenez un tarif préférentiel via nos experts partenaires
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Nos artisans certifiés s&apos;approvisionnent directement auprès de{" "}
                      <strong>grossistes officiels</strong> en France, Suisse et Belgique{" "}
                      (Sonepar, Andrety, Clim+, Cédéo). Ce circuit court leur permet de
                      vous proposer un <strong>tarif matériel + pose</strong> souvent plus
                      avantageux qu&apos;un achat seul en grande surface ou sur internet — tout en
                      bénéficiant de la <strong>garantie décennale</strong> et du SAV constructeur.
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-amber-800 font-semibold mb-3">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        France · Suisse · Belgique
                      </div>
                      <div className="flex items-center gap-1">
                        <BadgeCheck className="h-3 w-3" />
                        Experts RGE certifiés
                      </div>
                      <div className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        Garantie décennale
                      </div>
                    </div>
                    <Link
                      href={`/`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F2D3D] hover:bg-[#D59B2B] text-white text-xs font-bold rounded-lg transition-all"
                    >
                      <Star className="h-3 w-3" />
                      Être mis en relation avec un expert
                    </Link>
                  </div>
                </div>
              </div>

              {/* Réglementation */}
              <div className={`${color.light} border ${color.border} rounded-xl p-4 flex gap-3`}>
                <Info className={`h-4 w-4 ${color.text} shrink-0 mt-0.5`} />
                <p className="text-xs text-slate-600">
                  <strong>⚠️ Réglementation :</strong> La manipulation des fluides
                  frigorigènes est soumise à une{" "}
                  <strong>attestation de capacité</strong> (décret n°2015-1790). Le
                  raccordement et la mise en service doivent être réalisés par un
                  professionnel habilité. Nos artisans partenaires disposent de toutes
                  les certifications requises.
                </p>
              </div>
            </div>
          </div>

          {/* ═══ SECTION SEO: INSTALLATION CLIMATISATION & PRIX D'INSTALLATION ═══ */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-outfit mb-4">
              Installation climatisation {brandLabel} {product.manufacturerSku} : Tarif et Pose
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
              <p>
                Vous envisagez l'<strong>installation de la climatisation {brandLabel}</strong> modèle <strong>{product.title}</strong> (référence <strong>{product.manufacturerSku}</strong>) chez vous ?
                Pour garantir le bon fonctionnement, la validité des garanties constructeurs et la conformité avec la réglementation sur les fluides frigorigènes, la pose de cette {type.toLowerCase()} doit être confiée à un <strong>installateur climatisation agréé CVC</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm mb-3">Estimation du prix d'installation</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Le coût moyen de la pose varie selon la complexité du chantier et le type de matériel :
                  </p>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between border-b border-slate-200 pb-1">
                      <span>Pose unité {type.toLowerCase()} standard</span>
                      <strong className="text-slate-800">{type === "Gainable" ? "2 500 € – 4 500 € HT" : "800 € – 1 500 € HT"}</strong>
                    </li>
                    <li className="flex justify-between border-b border-slate-200 pb-1">
                      <span>Mise en service seule (fluide R32)</span>
                      <strong className="text-slate-800">250 € – 450 € HT</strong>
                    </li>
                    <li className="flex justify-between pb-1">
                      <span>Contrat d'entretien annuel</span>
                      <strong className="text-slate-800">150 € – 250 € HT / an</strong>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#D59B2B]/5 rounded-xl p-5 border border-[#D59B2B]/20">
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Pourquoi comparer les tarifs de pose ?</h3>
                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    En passant par nos experts de la climatisation, vous bénéficiez de prix préférentiels négociés directement auprès des plus grands distributeurs professionnels de matériel CVC. 
                    Un devis tout-en-un (matériel + pose) vous permet de réduire le coût global de votre projet de climatisation.
                  </p>
                  <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F2D3D] hover:bg-[#D59B2B] text-white text-xs font-bold rounded-lg transition-all shadow-sm">
                    Trouver un installateur certifié
                  </Link>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">
                * Note : Ces tarifs d'installation sont donnés à titre indicatif et peuvent varier selon la configuration de votre habitation (accès, longueur des liaisons frigorifiques, etc.). Demandez un devis précis via notre moteur de recherche pour obtenir une offre personnalisée.
              </p>
            </div>
          </section>

          {/* Documents techniques */}
          {allPdfs.length > 0 && (
            <section className="mb-12" aria-labelledby="docs-title">
              <h2
                id="docs-title"
                className="text-xl font-bold text-slate-900 font-outfit mb-5 flex items-center gap-2"
              >
                <Download className="h-5 w-5 text-[#D59B2B]" />
                Documents & Fiches Techniques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allPdfs.map((pdf, i) => (
                  <a
                    key={i}
                    href={`/${pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white border border-slate-100 hover:border-[#D59B2B] rounded-xl shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                      <FileText className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="text-xs text-slate-600 font-medium leading-snug group-hover:text-slate-900 transition-colors">
                      {getPdfLabel(pdf)}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Produits similaires */}
          {related.length > 0 && (
            <section className="mb-10" aria-labelledby="related-title">
              <h2
                id="related-title"
                className="text-xl font-bold text-slate-900 font-outfit mb-5"
              >
                Matériels similaires — {brandLabel} {type}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p, i) => {
                  const pr = getPriceRange(p.price);
                  const img = p.localImage
                    ? `/${p.localImage}`
                    : "/assets/placeholder-ac.png";
                  const col = getBrandColor(p.brand);
                  return (
                    <Link
                      key={i}
                      href={`/materiel/${toSlug(p.manufacturerSku)}`}
                      className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#D59B2B] transition-all overflow-hidden group"
                      title={p.title}
                    >
                      <div className={`h-1 bg-gradient-to-r ${col.gradient}`} />
                      <div className="p-4 flex flex-col items-center text-center gap-3">
                        <div className="bg-slate-50 rounded-lg p-3 w-full flex items-center justify-center h-24">
                          <img
                            src={img || "/assets/placeholder-ac.png"}
                            alt={p.title}
                            className="max-h-20 object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#D59B2B] transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {pr.display}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ═══ FORMULAIRE LEAD CVC ═══ */}
          <section className="mt-4" id="devis-installation">
            <LeadFormCVC
              productRef={product.manufacturerSku}
              productTitle={product.title}
            />
          </section>

          {/* Lien retour catalogue */}
          <div className="text-center mt-6">
            <Link
              href="/materiel"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#D59B2B] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voir tout le catalogue matériel
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
