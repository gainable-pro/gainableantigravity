import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center items-center space-x-2 mb-8">
                    <span className="text-2xl font-bold text-white">Gainable.fr</span>
                </div>

                <div className="flex justify-center flex-wrap gap-8 mb-8 text-sm font-medium">
                    <Link href="/mentions-legales" className="hover:text-amber-500 transition-colors">
                        Mentions Légales
                    </Link>
                    <Link href="/politique-confidentialite" className="hover:text-amber-500 transition-colors">
                        Politique de Confidentialité
                    </Link>
                    <Link href="/faq-visibilite-referencement" className="hover:text-amber-500 transition-colors text-amber-500/90 font-semibold">
                        FAQ Visibilité & Référencement
                    </Link>
                    <Link href="/articles" className="hover:text-amber-500 transition-colors">
                        Articles
                    </Link>
                    <Link href="/la-solution-gainable" className="hover:text-amber-500 transition-colors">
                        La Solution Gainable
                    </Link>
                    <Link href="/contact" className="hover:text-amber-500 transition-colors">
                        Contact
                    </Link>
                    <Link href="/espace-pro" className="hover:text-amber-500 transition-colors">
                        Espace Pro
                    </Link>
                    <Link href="/plan-du-site" className="hover:text-amber-500 transition-colors">
                        Plan du site (Zones d'intervention)
                    </Link>
                </div>

                <p className="text-xs text-slate-600">
                    &copy; {new Date().getFullYear()} Gainable.fr. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}
