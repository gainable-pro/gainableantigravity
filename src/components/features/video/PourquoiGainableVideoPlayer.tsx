"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";

function VideoPlayerInner() {
    const searchParams = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const activeSrc = isMobile
        ? "/videos/gainable-lancement-motion-mobile.mp4"
        : "/videos/gainable-lancement-motion.mp4";

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Try playing with sound first
        video.muted = false;
        video.volume = 1.0;

        const startPlayback = async () => {
            try {
                await video.play();
                setIsPlaying(true);
                setIsMuted(video.muted);
            } catch (err) {
                // If browser blocks unmuted autoplay, fallback to muted autoplay
                console.log("[VIDEO_PLAYER] Unmuted autoplay blocked, falling back to muted:", err);
                video.muted = true;
                setIsMuted(true);
                try {
                    await video.play();
                    setIsPlaying(true);
                } catch (e) {
                    console.log("[VIDEO_PLAYER] Playback failed:", e);
                }
            }
        };

        startPlayback();
    }, [searchParams, activeSrc]);

    const toggleSound = (e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        if (video.muted) {
            video.muted = false;
            video.volume = 1.0;
            setIsMuted(false);
        } else {
            video.muted = true;
            setIsMuted(true);
        }
    };

    return (
        <div className="w-full">
            <div className={`relative transition-all duration-300 ${
                isMobile
                    ? "max-w-[360px] sm:max-w-[390px] mx-auto p-1.5 sm:p-2 bg-gradient-to-b from-[#D59B2B]/40 via-slate-200/60 to-[#1F2D3D]/20 rounded-[2.5rem] shadow-2xl border-2 border-amber-300/40"
                    : "w-full p-2 bg-gradient-to-b from-[#D59B2B]/30 via-slate-200/60 to-slate-200/30 rounded-3xl shadow-2xl border border-slate-200/80"
            }`}>
                <div className={`relative overflow-hidden bg-black group transition-all duration-300 ${
                    isMobile
                        ? "aspect-[9/16] rounded-[2rem] max-h-[78vh]"
                        : "aspect-video rounded-2xl"
                }`}>
                    <video
                        ref={videoRef}
                        key={activeSrc}
                        src={activeSrc}
                        autoPlay
                        loop
                        controls
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                        onVolumeChange={() => {
                            if (videoRef.current) {
                                setIsMuted(videoRef.current.muted);
                            }
                        }}
                    />

                    {/* Floating sound toggle badge if muted */}
                    {isMuted && (
                        <button
                            type="button"
                            onClick={toggleSound}
                            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/75 hover:bg-black text-white text-xs font-bold rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-105 border border-white/20 animate-pulse"
                            aria-label="Activer le son"
                        >
                            <VolumeX className="w-4 h-4 text-amber-400" />
                            <span>Activer le son</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Scroll Indicator below vertical video on mobile */}
            {isMobile && (
                <div className="mt-4 flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Faites défiler pour choisir un créneau
                    </span>
                    <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D59B2B] shadow-xs animate-bounce">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            )}
        </div>
    );
}

export function PourquoiGainableVideoPlayer() {
    return (
        <Suspense fallback={
            <div className="relative rounded-3xl p-4 bg-slate-200 aspect-video flex items-center justify-center text-slate-500 font-bold">
                Chargement de la vidéo...
            </div>
        }>
            <VideoPlayerInner />
        </Suspense>
    );
}
