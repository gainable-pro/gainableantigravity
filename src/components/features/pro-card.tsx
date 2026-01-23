"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Building2, Wrench, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";

interface ProCardProps {
    id: string;
    slug: string;
    name: string;
    city: string;
    country: string;
    expertTypes: string[];
    interventions: string[];
    technologies: string[];
    marques?: string[];
    logoUrl?: string;
    telephone?: string | null;
    // Selection Props
    isSelected?: boolean;
    onToggleSelect?: () => void;
    selectable?: boolean;
    actionButton?: React.ReactNode;
    // Label Prop
    isLabeled?: boolean;
    // Optimization
    priority?: boolean;
}

export function ProCard({
    id, slug, name, city, country, expertTypes, interventions, technologies, marques, logoUrl, telephone,
    isSelected = false, onToggleSelect, selectable = false, actionButton, isLabeled = false, priority = false
}: ProCardProps) {
    const [showPhone, setShowPhone] = useState(false);

    const handleContactClick = () => {
        if (!telephone) return;
        setShowPhone(true);
        window.location.href = `tel:${telephone}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-4 lg:p-3 xl:p-6 flex flex-col md:flex-row gap-4 lg:gap-3 xl:gap-6 hover:shadow-md transition-shadow">
            {/* Logo & Selection */}
            <div className="relative w-full h-32 md:w-56 md:h-36 lg:w-40 lg:h-28 xl:w-64 xl:h-40 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-100 group overflow-hidden">
                {logoUrl ? (
                    <Image
                        src={logoUrl}
                        alt={name}
                        fill
                        className="object-contain p-2"
                        priority={priority}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 15vw"
                    />
                ) : (
                    <span className="text-3xl font-bold text-slate-300">{name.charAt(0)}</span>
                )}

                {/* Selection Checkbox Overlay */}
                {selectable && (
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            onToggleSelect?.();
                        }}
                        className={`absolute top-2 left-2 w-6 h-6 rounded-md border-2 cursor-pointer flex items-center justify-center transition-all ${isSelected ? 'bg-[#D59B2B] border-[#D59B2B]' : 'bg-white border-slate-300 hover:border-[#D59B2B]'}`}
                    >
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2 md:space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-[#1F2D3D]">{name}</h3>
                        <div className="flex items-center text-xs md:text-sm text-slate-500 mt-1">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 text-[#D59B2B]" />
                            {city} – {country}
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                        <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-700">Expert :</span>
                        <span>{expertTypes.join(", ")}</span>
                    </p>

                    {/* Hidden on mobile to save space */}
                    <p className="hidden md:flex items-start gap-2">
                        <Wrench className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-700">Interventions :</span>
                        <span>{interventions.join(", ")}</span>
                    </p>

                    {/* Simplified on mobile */}
                    {technologies.length > 0 && (
                        <p className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                            <span className="font-semibold text-slate-700">Technos :</span>
                            <span className="md:hidden">{technologies.slice(0, 3).join(", ")}{technologies.length > 3 ? "..." : ""}</span>
                            <span className="hidden md:inline">{technologies.join(", ")}</span>
                        </p>
                    )}

                    {marques && marques.length > 0 && (
                        <div className="hidden md:flex flex-wrap gap-2 pt-2">
                            {marques.map(m => (
                                <BrandLogo key={m} brand={m} size={24} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 justify-center lg:min-w-[150px] xl:min-w-[180px]">
                <Link href={`/pro/${slug}`} className="w-full">
                    <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors">
                        Voir la fiche
                    </Button>
                </Link>

                <Button
                    variant={showPhone ? "default" : "outline"}
                    className={`w-full transition-all ${showPhone ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : 'border-slate-300 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'}`}
                    onClick={handleContactClick}
                >
                    {showPhone ? (
                        <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {telephone}
                        </span>
                    ) : (
                        <span className="flex items-center justify-center w-full">
                            <Phone className="w-5 h-5" />
                        </span>
                    )}
                </Button>

                {actionButton || (
                    <Button className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold">
                        Devis gratuit
                    </Button>
                )}

                {/* Verified Badge - Conditioned */}
                {isLabeled && (
                    <div className="flex justify-center mt-3">
                        <img src="/expert-verifie-logo-v3.jpg" alt="Expert Vérifié" className="h-20 w-auto object-contain" />
                    </div>
                )}
            </div>
        </div>
    );
}
