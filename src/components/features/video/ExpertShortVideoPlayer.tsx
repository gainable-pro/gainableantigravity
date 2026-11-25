"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ShieldCheck } from "lucide-react";

interface ExpertShortVideoPlayerProps {
  className?: string;
}

export function ExpertShortVideoPlayer({ className = "" }: ExpertShortVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoSrc = "/videos/gainable-expert-short-fr.mp4";

  // Schema.org VideoObject for Google Search & Video SEO on Gainable.fr
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Label Expert Vérifié Gainable.fr - Présentation en 30 secondes",
    "description": "Découvrez en 30 secondes comment le Label Expert Vérifié Gainable.fr audite, vérifie et sélectionne les meilleurs installateurs de climatisation réversible.",
    "thumbnailUrl": [
      "https://www.gainable.fr/gainable-fr-label-qualite-climatisation-rge.png"
    ],
    "uploadDate": "2026-11-25T12:00:00+01:00",
    "duration": "PT30S",
    "contentUrl": "https://www.gainable.fr/videos/gainable-expert-short-fr.mp4",
    "embedUrl": "https://www.gainable.fr/videos/gainable-expert-short-fr.mp4",
    "inLanguage": "fr-FR",
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isSubscribed = true;
    video.load();

    const startPlaybackWithSound = () => {
      if (!isSubscribed) return;
      video.muted = false;
      video.volume = 1;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isSubscribed) setIsMuted(false);
          })
          .catch(() => {
            if (isSubscribed) {
              video.muted = true;
              setIsMuted(true);
              video.play().catch(() => {});
            }
          });
      }
    };

    if (video.readyState >= 2) {
      startPlaybackWithSound();
    } else {
      video.addEventListener("canplay", startPlaybackWithSound, { once: true });
      video.addEventListener("loadeddata", startPlaybackWithSound, { once: true });
    }

    const unmuteOnUserGesture = () => {
      if (video) {
        video.muted = false;
        video.volume = 1;
        video.play().catch(() => {});
        setIsMuted(false);
      }
      removeListeners();
    };

    const removeListeners = () => {
      const events = ["click", "pointerdown", "touchstart", "touchend", "keydown", "wheel"];
      events.forEach((ev) => window.removeEventListener(ev, unmuteOnUserGesture, { capture: true }));
    };

    const events = ["click", "pointerdown", "touchstart", "touchend", "keydown", "wheel"];
    events.forEach((ev) => window.addEventListener(ev, unmuteOnUserGesture, { capture: true, once: true }));

    return () => {
      isSubscribed = false;
      removeListeners();
      video.removeEventListener("canplay", startPlaybackWithSound);
      video.removeEventListener("loadeddata", startPlaybackWithSound);
    };
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleContainerClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
      setIsMuted(false);
    }
  };

  return (
    <section className="bg-slate-900 py-12 md:py-16 px-4 border-b border-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D59B2B]/20 border border-[#D59B2B]/40 text-[#D59B2B] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-[#D59B2B]" />
            Le Label en 30 secondes
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-montserrat">
            Comprendre le label Expert Vérifié en 30 secondes
          </h2>
        </div>

        <div 
          onClick={handleContainerClick}
          className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 group cursor-pointer ${className}`}
        >
          <video
            ref={videoRef}
            title="Label Expert Vérifié Gainable.fr"
            className="w-full h-full object-contain mx-auto block"
            autoPlay
            loop
            playsInline
            controls
            preload="auto"
            poster="/gainable-fr-label-qualite-climatisation-rge.png"
          >
            <source src={videoSrc} type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
          </video>

          {/* Floating Sound Toggle Pill */}
          <button
            onClick={toggleSound}
            type="button"
            aria-label={isMuted ? "Activer le son 🔊" : "Son activé"}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#1F2D3D]/90 hover:bg-[#1F2D3D] text-white text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-xl backdrop-blur-md transition-all duration-300 transform hover:scale-105 border border-white/20 cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-[#D59B2B] animate-pulse" />
                <span>Activer le son 🔊</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Son activé</span>
              </>
            )}
          </button>

          {/* Center Unmute Banner if Browser Blocked Sound on Cold Start */}
          {isMuted && (
            <div className="absolute inset-x-0 bottom-12 sm:bottom-16 z-20 flex justify-center pointer-events-none px-4">
              <div className="bg-[#1F2D3D]/95 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-[#D59B2B]/40 flex items-center gap-3 animate-bounce">
                <Volume2 className="w-5 h-5 text-[#D59B2B]" />
                <span className="text-sm font-semibold">Activer le son 🔊</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
