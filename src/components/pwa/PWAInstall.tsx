"use client";

import { useState, useEffect } from "react";
import { Share, PlusSquare, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Hide by default

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(err => console.log('SW registration failed:', err));
    }

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Handle Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (isIOS) {
      console.log('iOS detected');
      setShowIOSPrompt(true);
      setIsVisible(true); // Show immediately for iOS
    }

    // For testing/fallback: if not standalone and not iOS, show after 5s anyway?
    // No, better not to annoy Android users if browser thinks it's not installable.

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
        console.log('No deferredPrompt available');
        return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (isStandalone || !isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white border-2 border-[#D59B2B] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 md:max-w-md md:mx-auto relative overflow-hidden">
        {/* Gainable "G" Background Decoration */}
        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
            <img src="/favicon.jpg" alt="" className="w-24 h-24 object-contain grayscale" />
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white border border-slate-100 p-1.5 rounded-xl shrink-0 shadow-sm">
            <img src="/favicon.jpg" alt="Gainable" className="w-10 h-10 object-contain rounded-lg" />
          </div>
          <div className="flex-1 pr-4">
            <h3 className="font-bold text-slate-900 text-base leading-tight">Installer l'App Gainable</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Accès rapide à vos leads et articles.</p>
          </div>
        </div>

        <div className="mt-4 relative z-10">
          {deferredPrompt ? (
            <Button 
              onClick={handleInstallClick}
              className="w-full bg-[#1F2D3D] hover:bg-slate-800 text-white rounded-xl py-6 font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5 text-[#D59B2B]" />
              INSTALLER MAINTENANT
            </Button>
          ) : showIOSPrompt ? (
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 flex flex-col gap-2 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-[#D59B2B] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">1</div>
                <span>Appuyez sur l'icône <Share className="w-4 h-4 inline text-blue-600" /> (Partager)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#D59B2B] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">2</div>
                <span>Sélectionnez <PlusSquare className="w-4 h-4 inline text-blue-600" /> <strong>"Sur l'écran d'accueil"</strong></span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
