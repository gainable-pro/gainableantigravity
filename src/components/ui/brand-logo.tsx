
import Image from "next/image";

// Map brand names to their asset filenames
const BRAND_LOGOS: Record<string, string> = {
    "Daikin": "daikin.png",
    "Mitsubishi": "mitsubishi.png",
    "Toshiba": "toshiba.png",
    "Green": "green.png",
    "LG": "lg.png",
    "Panasonic": "panasonic.png",
    "Atlantic": "atlantic.png",
    "Midea": "midea.png",
    "Samsung": "samsung.png",
    "Saunier Duval": "saunier_duval.png",
    "Autre": "" // Fallback or empty
};

export const BrandLogo = ({ brand, size = 40 }: { brand: string; size?: number }) => {
    const logoFile = BRAND_LOGOS[brand];

    if (!logoFile) {
        return <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">{brand}</span>;
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
