"use client";

import { useState, useEffect } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
    }

    // Handle Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS && !(window.navigator as any).standalone) {
      setShowIOSPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone || !isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 md:max-w-md md:mx-auto">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow-lg hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="bg-blue-600 p-3 rounded-xl shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 leading-tight">Installer Gainable.fr</h3>
            <p className="text-sm text-slate-500 mt-1">Accédez à votre espace pro en un clic depuis votre écran d'accueil.</p>
            
            <div className="mt-4">
              {deferredPrompt ? (
                <Button 
                  onClick={handleInstallClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-6 font-bold"
                >
                  Installer maintenant
                </Button>
              ) : showIOSPrompt ? (
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 flex flex-col gap-2 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-xs font-bold">1</span>
                    <span>Appuyez sur l'icône <Share className="w-4 h-4 inline text-blue-500" /> (Partager)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-xs font-bold">2</span>
                    <span>Sélectionnez <PlusSquare className="w-4 h-4 inline text-blue-500" /> <strong>"Sur l'écran d'accueil"</strong></span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Ouvrez le menu de votre navigateur pour installer.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
