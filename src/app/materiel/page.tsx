"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  ShieldAlert,
  Wrench, 
  FileText, 
  Info,
  ChevronDown,
  RefreshCw,
  HelpCircle
} from "lucide-react";

// Importer les données du catalogue
import rawCatalog from "@/data/sonepar_catalog.json";

// Types des données
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

// Génère un slug SEO à partir de la référence fabricant
function toSlug(sku: string): string {
  return sku
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Catégorisation dynamique par rapport au titre
function getProductType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("pack") && (t.includes("plenum") || t.includes("plénum") || t.includes("zoning") || t.includes("webserver"))) return "Pack Plénum Zoning";
  if (t.includes("gainable") || (t.includes("plénum") && !t.includes("pack"))) return "Gainable";
  if (t.includes("plafonnier") || t.includes("plafonni")) return "Plafonnier";
  if (t.includes("cassette")) return "Cassette";
  if (t.includes("mural") || t.includes("murale")) return "Mural";
  if (t.includes("console")) return "Console";
  if (t.includes("groupe extérieur") || t.includes("unité extérieure") || t.includes("groupe ext") || t.includes("ue ")) return "Groupe Extérieur";
  return "Accessoires / Autre";
}

// Formatage de la fourchette de prix publique HT (+30% à +50%)
function getPriceRange(priceStr: string): { display: string; rawMin: number } {
  if (!priceStr) return { display: "Sur devis", rawMin: 0 };
  
  // Nettoyer la chaîne de caractères (ex: "1 091,20 €" -> 1091.2)
  const cleanStr = priceStr.replace(/[^\d,\.-]/g, "").replace(",", ".");
  const proPrice = parseFloat(cleanStr);
  
  if (isNaN(proPrice)) {
    return { display: "Sur devis", rawMin: 0 };
  }
  
  // Tarification publique avec marge (fourchette +30% à +50% HT)
  const minPrice = proPrice * 1.30;
  const maxPrice = proPrice * 1.50;
  
  const format = (num: number) => 
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
    
  return {
    display: `${format(minPrice)} - ${format(maxPrice)} HT`,
    rawMin: minPrice
  };
}

export default function MaterielPage() {
  const products = rawCatalog as Product[];

  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFluid, setSelectedFluid] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<string>("default");
  
  // Pagination / Load More
  const [visibleCount, setVisibleCount] = useState(12);

  // Listes d'options de filtres uniques
  const brands = useMemo(() => ["DAIKIN", "MITSUBISHI ELECTRIC", "HEIWA", "AIRZONE"], []);
  const types = useMemo(() => ["Pack Plénum Zoning", "Gainable", "Plafonnier", "Cassette", "Mural", "Console", "Groupe Extérieur", "Accessoires / Autre"], []);
  const fluids = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.fluid) set.add(p.fluid.trim().toUpperCase());
    });
    return Array.from(set).filter(Boolean);
  }, [products]);

  // Filtrage et tri des produits
  const filteredProducts = useMemo(() => {
    let result = products.map(p => ({
      ...p,
      derivedType: getProductType(p.title),
      priceRange: getPriceRange(p.price)
    }));

    // Recherche textuelle (Designation, SKU, Ref Fabricant)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => 
          p.title.toLowerCase().includes(q) ||
          p.soneparSku.toLowerCase().includes(q) ||
          p.manufacturerSku.toLowerCase().includes(q)
      );
    }

    // Filtre Marque
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand.toUpperCase()));
    }

    // Filtre Type
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.derivedType));
    }

    // Filtre Fluide
    if (selectedFluid !== "all") {
      result = result.filter(p => p.fluid && p.fluid.toUpperCase() === selectedFluid);
    }

    // Tri par prix
    if (priceSort === "asc") {
      result.sort((a, b) => a.priceRange.rawMin - b.priceRange.rawMin);
    } else if (priceSort === "desc") {
      result.sort((a, b) => b.priceRange.rawMin - a.priceRange.rawMin);
    }

    return result;
  }, [products, searchQuery, selectedBrands, selectedTypes, selectedFluid, priceSort]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedFluid("all");
    setPriceSort("default");
    setVisibleCount(12);
  };

  // Gestionnaires de clic pour filtres
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setVisibleCount(12);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setVisibleCount(12);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#1F2D3D] text-white py-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#2c3e50,transparent)] opacity-40"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-[#D59B2B]/20 text-[#D59B2B] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Catalogue Matériel
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-outfit !text-white">
              Tarifs et Fiches Techniques CVC
            </h1>
            <p className="text-lg text-slate-300 mb-0 leading-relaxed">
              385 références : fiches techniques (SEER, SCOP, fluides), tarifs publics estimés et documentation PDF — Daikin, Mitsubishi Electric, Heiwa et packs Airzone.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        
        {/* Warning / Expert Advising Cards Banner */}
        <section className="bg-white border-l-4 border-[#D59B2B] rounded-r-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="p-3 bg-[#D59B2B]/10 rounded-lg text-[#D59B2B] shrink-0">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-outfit">
                ⚠️ Réglementation Importante & Garanties Constructeurs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-slate-600 mt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D59B2B] rounded-full"></span>
                    Attestation de Capacité
                  </h4>
                  <p>
                    L'achat de matériel contenant des fluides frigorigènes impose la détention d'une <strong>attestation de capacité</strong>. Le raccordement et la mise en service doivent être effectués par un professionnel agréé.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D59B2B] rounded-full"></span>
                    Alerte sur les sites étrangers
                  </h4>
                  <p>
                    Attention aux sites étrangers dits "exotiques". Si vous y achetez votre matériel, vous ferez face à d'immenses difficultés pour le SAV en France et les garanties constructeurs seront souvent annulées.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D59B2B] rounded-full"></span>
                    L'achat clé en main via nos experts
                  </h4>
                  <p>
                    Nos installateurs partenaires se fournissent en direct chez des distributeurs officiels français (CD Sud / Sonepar / Clim+ / Andrety / Cédéo). Ils vous proposent des packs matériel + pose avec garantie décennale complète.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 items-center border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400 italic">
                  * Les tarifs indiqués ci-dessous sont des estimations de prix publics conseillés HT (hors remises professionnelles d'installation).
                </span>
                <Link href="/" className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-[#1F2D3D] hover:bg-[#D59B2B] text-white text-xs font-semibold rounded-lg transition-all shadow-sm">
                  Faire installer mon matériel
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 sticky top-28">
              
              {/* Header filtres */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 font-outfit">
                  <Filter className="h-4 w-4 text-[#D59B2B]" />
                  Filtres de recherche
                </h3>
                {(selectedBrands.length > 0 || selectedTypes.length > 0 || selectedFluid !== "all" || searchQuery !== "" || priceSort !== "default") && (
                  <button 
                    onClick={resetFilters} 
                    className="text-xs text-[#D59B2B] hover:underline flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Effacer
                  </button>
                )}
              </div>

              {/* Barre de Recherche */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Rechercher
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ref, designation..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setVisibleCount(12);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#D59B2B] transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Filtre Marques */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
                  Marque
                </label>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-slate-300 text-[#D59B2B] focus:ring-[#D59B2B]"
                      />
                      {brand === "MITSUBISHI ELECTRIC" ? "Mitsubishi" : brand.charAt(0) + brand.slice(1).toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtre Catégorie / Type */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
                  Catégorie
                </label>
                <div className="space-y-2">
                  {types.map(type => (
                    <label key={type} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="rounded border-slate-300 text-[#D59B2B] focus:ring-[#D59B2B]"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtre Fluide */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Fluide Réfrigérant
                </label>
                <select
                  value={selectedFluid}
                  onChange={(e) => {
                    setSelectedFluid(e.target.value);
                    setVisibleCount(12);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#D59B2B] transition-all"
                >
                  <option value="all">Tous les fluides</option>
                  {fluids.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Tri par Prix */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Trier par tarif public
                </label>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#D59B2B] transition-all"
                >
                  <option value="default">Par défaut</option>
                  <option value="asc">Tarif : croissant</option>
                  <option value="desc">Tarif : décroissant</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Infos rapides résultats */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500 font-medium">
                <strong>{filteredProducts.length}</strong> matériels correspondent à vos critères
              </p>
            </div>

            {/* Grille */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 font-outfit">Aucun matériel trouvé</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Essayez de modifier vos filtres ou réinitialisez la recherche pour voir tous les produits.
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F2D3D] hover:bg-[#D59B2B] text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.slice(0, visibleCount).map((product, idx) => {
                    const localImg = product.localImage ? `/${product.localImage}` : "/assets/placeholder-ac.png";
                    const isPremium = product.brand.toUpperCase() === "DAIKIN" || product.brand.toUpperCase() === "MITSUBISHI ELECTRIC";
                    
                    return (
                      <Link
                        key={`${product.soneparSku}-${idx}`}
                        href={`/materiel/${toSlug(product.manufacturerSku)}`}
                        className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#D59B2B] transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
                      >
                        {/* Image produit */}
                        <div className="relative aspect-video bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100 p-4">
                          <img
                            src={localImg}
                            alt={product.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/placeholder-ac.png";
                            }}
                            className="max-h-36 object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-white ${
                              product.brand.toUpperCase() === "DAIKIN" ? "bg-blue-600" :
                              product.brand.toUpperCase() === "MITSUBISHI ELECTRIC" ? "bg-red-600" :
                              product.brand.toUpperCase() === "AIRZONE" ? "bg-purple-600" : "bg-emerald-600"
                            }`}>
                              {product.brand === "MITSUBISHI ELECTRIC" ? "Mitsubishi" : product.brand}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase tracking-wide">
                              {product.derivedType}
                            </span>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h3 className="font-bold text-slate-800 text-sm leading-snug font-outfit line-clamp-2 min-h-[40px] group-hover:text-[#D59B2B] transition-colors">
                              {product.title}
                            </h3>
                            <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-medium">
                              <span>Réf. Sonepar : {product.soneparSku}</span>
                              <span>Réf. Fabricant : {product.manufacturerSku}</span>
                            </div>
                          </div>

                          {/* Spécifications techniques */}
                          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 my-4 text-center">
                            <div className="bg-slate-50 rounded p-1">
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Fluide</span>
                              <span className="text-xs font-bold text-slate-700">{product.fluid || "N/A"}</span>
                            </div>
                            <div className="bg-slate-50 rounded p-1">
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold">SEER</span>
                              <span className="text-xs font-bold text-slate-700">{product.seer || "N/A"}</span>
                            </div>
                            <div className="bg-slate-50 rounded p-1">
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold">SCOP</span>
                              <span className="text-xs font-bold text-slate-700">{product.scop || "N/A"}</span>
                            </div>
                          </div>

                          {/* Tarification & Actions */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-medium text-slate-400">Tarif public est. :</span>
                              <span className="text-sm font-bold text-slate-800 font-outfit">
                                {product.priceRange.display}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                              {/* Fiche Technique PDF */}
                              {product.localPdfs && product.localPdfs.length > 0 ? (
                                <a
                                  href={`/${product.localPdfs[0]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-all"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  Fiche PDF
                                </a>
                              ) : (
                                <button
                                  disabled
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-100 bg-slate-50 text-slate-400 rounded-lg text-xs font-semibold cursor-not-allowed"
                                >
                                  Fiche PDF
                                </button>
                              )}

                              {/* CTA Devis */}
                              <Link
                                href={`/`}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1F2D3D] hover:bg-[#D59B2B] hover:text-white text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                              >
                                Devis Pose
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Bouton Charger Plus */}
                {visibleCount < filteredProducts.length && (
                  <div className="text-center pt-8">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F2D3D] hover:bg-[#D59B2B] text-white text-sm font-semibold rounded-lg transition-all shadow-md"
                    >
                      <ChevronDown className="h-4 w-4 animate-bounce" />
                      Afficher plus de matériels
                    </button>
                  </div>
                )}
              </>
            )}

          </main>

        </div>

        {/* Section Fournisseurs Partenaires */}
        <section className="mt-16 mb-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-[#D59B2B]/10 text-[#D59B2B] text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
              Réseau d&apos;approvisionnement
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit mb-3">
              Nos Fournisseurs Officiels Partenaires
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              Nos experts s&apos;approvisionnent exclusivement chez des distributeurs professionnels français agréés, garants de l&apos;authenticité des produits et de la validité des garanties constructeurs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sonepar / CD Sud */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg font-outfit">
                    S
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Principal
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-outfit mb-1">Sonepar / CD Sud</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Distributeur n°1 mondial de matériel électrique et climatisation. Plateforme e-commerce pro avec catalogue de +340 références Daikin, Mitsubishi, Heiwa.
                </p>
                <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 mb-5">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>Réseau national, livraison agence</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>Tarifs professionnels négociés</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>SAV France garanti</span>
                </div>
                <a
                  href="https://climate.sonepar.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all"
                >
                  climate.sonepar.fr
                </a>
              </div>
            </div>

            {/* Andrety */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-400" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-black text-lg font-outfit">
                    A
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                    PACA
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-outfit mb-1">Andrety</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Grossiste régional spécialisé en Provence-Alpes-Côte d&apos;Azur. Réseau de 10 agences de Gap à Marseille. E-commerce pro via la plateforme MyBleuRouge.
                </p>
                <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 mb-5">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>10 agences en région PACA</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>Catalogue 20 000+ références</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>Conseil technique en agence</span>
                </div>
                <a
                  href="https://www.andrety.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-orange-200 text-orange-700 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-semibold transition-all"
                >
                  andrety.fr
                </a>
              </div>
            </div>

            {/* Clim+ */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-lg font-outfit">
                    C+
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    National
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-outfit mb-1">Clim+</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Réseau national de distribution spécialisé dans le génie climatique (climatisation, ventilation, chauffage). Application mobile dédiée aux professionnels.
                </p>
                <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 mb-5">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Réseau national multi-agences</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>App mobile Clim+ pro</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Pièces détachées (Easy SAV)</span>
                </div>
                <a
                  href="https://www.climplus.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-emerald-200 text-emerald-700 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-semibold transition-all"
                >
                  climplus.com
                </a>
              </div>
            </div>

            {/* Cédéo */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-violet-400" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-lg font-outfit">
                    Cd
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    PAC & Clim
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-outfit mb-1">Cédéo</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Distributeur spécialisé en sanitaire, chauffage et climatisation. Fort réseau d&apos;agences avec outil de chiffrage SOLU+ pour les professionnels (Daikin, Atlantic, Panasonic...).
                </p>
                <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 mb-5">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>Outil chiffrage SOLU+</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>Accompagnement QualiPAC RGE</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>Opérations pro régulières</span>
                </div>
                <a
                  href="https://www.cedeo.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white rounded-lg text-xs font-semibold transition-all"
                >
                  cedeo.fr
                </a>
              </div>
            </div>

          </div>

          {/* Note de bas de page */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-xs text-slate-500">
              <strong className="text-slate-700">🔒 Approvisionnement sécurisé :</strong> Nos experts achètent uniquement chez ces distributeurs officiels agréés. 
              Les prix indiqués dans notre catalogue sont des estimations publiques — les pros bénéficient de tarifs négociés non communiqués.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
