"use client";

import { useState } from "react";
import { Facebook, Linkedin, Instagram, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
    url: string;
    title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase hidden sm:block">Partager :</span>

            {/* Facebook */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all"
                title="Partager sur Facebook"
            >
                <Facebook className="w-4 h-4" />
            </a>

            {/* LinkedIn */}
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-50 hover:bg-[#0077b5] text-[#0077b5] hover:text-white flex items-center justify-center transition-all"
                title="Partager sur LinkedIn"
            >
                <Linkedin className="w-4 h-4" />
            </a>

            {/* Instagram (Copy Link) */}
            <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-full bg-pink-50 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 text-pink-600 hover:text-white flex items-center justify-center transition-all"
                title="Copier le lien pour Instagram"
            >
                {copied ? <Check className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
            </button>
        </div>
    );
}
