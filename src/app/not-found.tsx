import Link from 'next/link';
import { Search, MapPin, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 text-[#D59B2B] rounded-full text-3xl font-bold border border-amber-200">
          404
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F2D3D]">
            Page introuvable
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">
            La page que vous recherchez a été déplacée ou n'existe plus. Trouvez un installateur certifié près de chez vous en quelques clics.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-[#1F2D3D] hover:bg-[#15202B] text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Button>
          </Link>
          <Link href="/trouver-installateur">
            <Button variant="outline" className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 text-[#1F2D3D] font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2">
              <Search className="w-4 h-4 text-[#D59B2B]" />
              Trouver un installateur
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-100 space-y-4">
          <p className="text-sm font-semibold text-[#1F2D3D] uppercase tracking-wider">
            Villes populaires
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Bordeaux'].map((city) => (
              <Link
                key={city}
                href={`/climatisation/${city.toLowerCase()}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-[#D59B2B] text-slate-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D59B2B]" />
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
