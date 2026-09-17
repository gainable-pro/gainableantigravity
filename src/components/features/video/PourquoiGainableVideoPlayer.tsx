"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VideoPlayerInner() {
    const searchParams = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Force sound ACTIVE (unmuted) at launch
        video.muted = false;
        video.volume = 1.0;

        const startPlaybackWithSound = async () => {
            try {
                video.muted = false;
                await video.play();
            } catch (err) {
                console.log("[VIDEO_PLAYER] Attempting unmuted play:", err);
                video.muted = false;
                await video.play().catch(() => {});
            }
        };

        startPlaybackWithSound();
    }, [searchParams]);

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
