"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";

function VideoPlayerInner() {
    const searchParams = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Try playing with sound enabled (unmuted)
        video.muted = false;
        setIsMuted(false);

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                // If browser policy blocks unmuted autoplay without click, fallback to muted + show unmute button
                console.log("[VIDEO_PLAYER] Unmuted autoplay blocked by browser policy, falling back to muted:", error);
                video.muted = true;
                setIsMuted(true);
                video.play().catch(() => {});
            });
        }
    }, [searchParams]);

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.muted) {
            video.muted = false;
            setIsMuted(false);
            video.play().catch(() => {});
        } else {
            video.muted = true;
            setIsMuted(true);
        }
    };

    return (
        <div className="relative rounded-2xl md:rounded-3xl p-2 bg-gradient-to-b from-[#D59B2B]/30 via-slate-200/60 to-slate-200/30 shadow-2xl border border-slate-200/80">
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-black aspect-video group">
                <video
                    ref={videoRef}
                    src="/videos/gainable-lancement-motion.mp4"
                    autoPlay
                    loop
                    controls
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                />

                {/* Floating Sound Button if Browser Muted the Audio */}
                {isMuted && (
                    <button
                        type="button"
                        onClick={toggleMute}
                        className="absolute bottom-16 right-4 z-20 flex items-center gap-2 bg-[#D59B2B] hover:bg-[#b88622] text-white px-5 py-3 rounded-full font-bold text-sm shadow-2xl transition-all animate-pulse"
                    >
                        <VolumeX className="w-5 h-5" />
                        <span>🔊 Activer le son (Audio)</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export function PourquoiGainableVideoPlayer() {
    return (
        <Suspense fallback={
            <div className="relative rounded-2xl md:rounded-3xl p-2 bg-slate-200 aspect-video flex items-center justify-center text-slate-500 font-bold">
                Chargement de la vidéo...
            </div>
        }>
            <VideoPlayerInner />
        </Suspense>
    );
}
