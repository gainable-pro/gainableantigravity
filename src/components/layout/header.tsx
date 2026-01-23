"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Menu } from "lucide-react";
import { LoginDropdown } from "@/components/layout/login-dropdown";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import * as React from "react";

export function Header({ countryCode = 'FR' }: { countryCode?: string }) {
    // Dynamic Logo based on Country
    let logoSrc = "/logo.png"; // Default (FR/Global)
    if (countryCode === 'CH') logoSrc = "/logo-ch.png"; // Suisse
    if (countryCode === 'MA') logoSrc = "/logo-ma.png"; // Maroc
    if (countryCode === 'BE') logoSrc = "/logo-be.png"; // Belgique

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex py-0 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="relative h-24 w-auto md:h-28 md:w-[250px] block transition-all">
                    <img
                        src={logoSrc}
                        alt="Gainable.fr"
                        className="w-full h-full object-contain"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-base font-medium text-slate-700">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-[#D59B2B] transition-colors">
                        Trouver un expert
                    </Link>
                    <Link href="/climatisation" className="text-sm font-medium text-slate-600 hover:text-[#1F2D3D] transition-colors">Les Experts de la Climatisation</Link>
                    <Link href="/bureau-etude" className="text-sm font-medium text-slate-600 hover:text-[#1F2D3D] transition-colors">
                        Bureau d'étude
                    </Link>
                    <Link href="/diagnostic-immobilier" className="text-sm font-medium text-slate-600 hover:text-[#1F2D3D] transition-colors">Diagnostic Immobilier</Link>
                    <Link href="/labels" className="text-sm font-medium text-slate-600 hover:text-[#1F2D3D] transition-colors">Expert Vérifié</Link>
                    <Link href="/pourquoi-gainable" className="text-sm font-medium text-slate-600 hover:text-[#D59B2B] transition-colors">
                        Pourquoi Gainable.fr
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-[#D59B2B] transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* Right Side: CTA */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <LoginDropdown />
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <MobileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}

function MobileMenu() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-slate-700">
                    <Menu className="h-6 w-6" />
                </button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                <SheetDescription className="sr-only">Menu principal pour mobile</SheetDescription>
                <nav className="flex flex-col space-y-4 mt-8">
                    <div className="mb-4">
                        <LoginDropdown />
                    </div>
                    <hr className="border-slate-100" />
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-[#D59B2B] transition-colors">
                        Trouver un expert
                    </Link>
                    <Link href="/climatisation" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-[#1F2D3D] transition-colors">Les Experts de la Climatisation</Link>
                    <Link href="/bureau-etude" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-[#1F2D3D] transition-colors">
                        Bureau d'étude
                    </Link>
                    <Link href="/diagnostic-immobilier" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-[#1F2D3D] transition-colors">Diagnostic Immobilier</Link>
                    <Link href="/labels" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-[#1F2D3D] transition-colors">Expert Vérifié</Link>
                    <Link href="/pourquoi-gainable" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-[#D59B2B] transition-colors">
                        Pourquoi Gainable.fr
                    </Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700 hover:text-[#D59B2B] transition-colors">
                        Contact
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
