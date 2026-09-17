import Image from "next/image";

// Map brand names to their asset filenames in /public/assets/brands/
const BRAND_LOGOS: Record<string, string> = {
    "Daikin": "daikin.png",
    "Mitsubishi": "mitsubishi.png",
    "Toshiba": "toshiba.png",
    "Gree": "gree.png",
    "Green": "green.png",
    "LG": "lg.png",
    "Panasonic": "panasonic.png",
    "Atlantic": "atlantic.png",
    "Airzone": "airzone.png",
    "Koolnova": "koolnova.png",
    "Midea": "midea.png",
    "Samsung": "samsung.png",
    "Saunier Duval": "saunier_duval.png",
    "Hitachi": "hitachi.png"
};

export const BrandLogo = ({ brand, size = 40 }: { brand: string; size?: number }) => {
    if (!brand || brand === "Autre") {
        return <span className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md shadow-xs">Autre</span>;
    }

    // Handle full URL or path if passed
    if (brand.startsWith('http') || brand.startsWith('/')) {
        return (
            <div className="relative flex items-center justify-center p-1 bg-white border border-slate-100 rounded-md shadow-sm overflow-hidden" style={{ width: size * 2.5, height: size }}>
                <img src={brand} alt="Logo marque" className="w-full h-full object-contain p-1" />
            </div>
        );
    }

    const logoFile = BRAND_LOGOS[brand];

    if (!logoFile) {
        return (
            <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md shadow-xs">
                {brand}
            </span>
        );
    }

    return (
        <div className="relative flex items-center justify-center p-1 bg-white border border-slate-100 rounded-md shadow-sm" style={{ width: size * 2.5, height: size }}>
            <Image
                src={`/assets/brands/${logoFile}`}
                alt={`${brand} logo`}
                fill
                className="object-contain p-1"
                sizes={`${size * 2.5}px`}
            />
        </div>
    );
};
