import { Zap, Wind, Thermometer, FileText, Download } from "lucide-react";
import { getPdfLabel } from "@/utils/pdfUtils"; // assume helper exists

interface ProductDetailsProps {
  product: any; // type can be refined later
  priceRange: { display: string };
  mainPdf?: string;
  allPdfs: string[];
}

export default function ProductDetails({ product, priceRange, mainPdf, allPdfs }: ProductDetailsProps) {
  return (
    <section className="space-y-6">
      {/* Title & References */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit leading-snug mb-3">
          {product.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-semibold text-slate-700">Réf. Fabricant :</span>
            <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono text-xs">
              {product.manufacturerSku}
            </code>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-semibold text-slate-700">Réf. Sonepar :</span>
            <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono text-xs">
              {product.soneparSku}
            </code>
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 font-outfit flex items-center gap-2 mb-5 text-base">
          <Zap className="h-4 w-4 text-[#D59B2B]" /> Caractéristiques Techniques
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
            <Wind className="h-5 w-5 text-cyan-500 mx-auto mb-2" />
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
              Fluide
            </span>
            <span className="text-lg font-black text-slate-800">{product.fluid || "N/A"}</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
            <Thermometer className="h-5 w-5 text-amber-500 mx-auto mb-2" />
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
              SEER (Froid)
            </span>
            <span className="text-lg font-black text-slate-800">{product.seer || "N/A"}</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
            <Thermometer className="h-5 w-5 text-blue-500 mx-auto mb-2" />
            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
              SCOP (Chaud)
            </span>
            <span className="text-lg font-black text-slate-800">{product.scop || "N/A"}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {["Garantie constructeur officielle", "SAV France – Suisse – Belgique", "Approvisionnement grossiste agréé", "Installation par artisans certifiés RGE"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-slate-600">
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#1F2D3D] rounded-2xl p-6 text-white">
        <div className="mb-4">
          <p className="text-slate-400 text-xs font-medium mb-1">Tarif public indicatif (hors pose) HT</p>
          <p className="text-3xl font-black text-[#D59B2B] font-outfit">{priceRange.display}</p>
          <p className="text-[11px] text-slate-500 mt-1">* Estimation +30% à +50% sur le tarif professionnel grossiste — prix définitif sur devis</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href={`/contact?ref=${encodeURIComponent(product.manufacturerSku)}&title=${encodeURIComponent(product.title)}`} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#D59B2B] hover:bg-amber-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg">
            <Phone className="h-4 w-4" /> Demander un devis installation
          </a>
          {mainPdf && (
            <a href={`/${mainPdf}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
              <FileText className="h-4 w-4" /> Fiche technique PDF
            </a>
          )}
        </div>
      </div>

      {/* Documents */}
      {allPdfs.length > 0 && (
        <section className="mb-12" aria-labelledby="docs-title">
          <h2 id="docs-title" className="text-xl font-bold text-slate-900 font-outfit mb-5 flex items-center gap-2">
            <Download className="h-5 w-5 text-[#D59B2B]" /> Documents & Fiches Techniques
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allPdfs.map((pdf, i) => (
              <a key={i} href={`/${pdf}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white border border-slate-100 hover:border-[#D59B2B] rounded-xl shadow-sm hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-xs text-slate-600 font-medium leading-snug group-hover:text-slate-900 transition-colors">{getPdfLabel(pdf)}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
