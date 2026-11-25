"use client";

import * as React from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

interface LanguageItem {
  code: string;
  name: string;
  url: string;
  isCurrent?: boolean;
}

const LANGUAGES: LanguageItem[] = [
  {
    code: "FR",
    name: "Français",
    url: "https://www.gainable.fr/pourquoi-gainable",
    isCurrent: true,
  },
  {
    code: "EN",
    name: "English",
    url: "https://www.ductedexpert.com/why-ducted-expert",
    isCurrent: false,
  },
  {
    code: "DE",
    name: "Deutsch",
    url: "https://www.ductedexpert.com/warum-ducted-expert",
    isCurrent: false,
  },
  {
    code: "ES",
    name: "Español",
    url: "https://www.ductedexpert.com/por-que-ducted-expert",
    isCurrent: false,
  },
  {
    code: "IT",
    name: "Italiano",
    url: "https://www.ductedexpert.com/perche-ducted-expert",
    isCurrent: false,
  },
  {
    code: "FI",
    name: "Suomi",
    url: "https://www.ductedexpert.com/miksi-ducted-expert",
    isCurrent: false,
  },
  {
    code: "AR",
    name: "العربية",
    url: "https://www.ductedexpert.com/ar/why-ducted-expert",
    isCurrent: false,
  },
];

export function LanguageDropdown({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (mobile) {
    return (
      <div className="py-2 border-t border-slate-100">
        <div className="px-1 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Langue / International
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {LANGUAGES.map((lang) => (
            <a
              key={lang.code}
              href={lang.url}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                lang.isCurrent
                  ? "bg-[#1F2D3D] text-white border-[#1F2D3D]"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-[#D59B2B]"
              }`}
            >
              <span>{lang.name}</span>
              <span className={`text-[10px] uppercase font-bold ${lang.isCurrent ? "text-amber-400" : "text-slate-400"}`}>
                {lang.code}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#D59B2B] text-xs font-bold text-[#1F2D3D] transition-all cursor-pointer shadow-sm"
        aria-label="Sélectionner la langue"
      >
        <Globe className="w-3.5 h-3.5 text-[#D59B2B]" />
        <span className="uppercase tracking-wider">FR</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Langue / Language
          </div>

          {/* Current language: French on Gainable.fr */}
          <a
            href="https://www.gainable.fr/pourquoi-gainable"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold bg-amber-50 text-[#D59B2B] font-bold transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#D59B2B]" />
              <span>Français</span>
            </span>
            <span className="uppercase text-[10px] font-bold text-[#D59B2B]">gainable.fr</span>
          </a>

          <div className="my-1 border-t border-slate-100" />
          <div className="px-3.5 py-0.5 text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            International (DuctedExpert)
          </div>

          {/* Other languages redirect to ductedexpert.com */}
          {LANGUAGES.filter((l) => !l.isCurrent).map((lang) => (
            <a
              key={lang.code}
              href={lang.url}
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1F2D3D] transition-colors"
            >
              <span className="font-medium">{lang.name}</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-[#D59B2B] font-semibold uppercase">
                ductedexpert.com ↗
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
