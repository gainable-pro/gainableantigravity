"use client";

import React from "react";

interface VerifiedExpertBadgeProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function VerifiedExpertBadge({ size = "md", className = "" }: VerifiedExpertBadgeProps) {
    const dimensions = {
        sm: "w-[175px]",
        md: "w-[210px]",
        lg: "w-full max-w-[380px]"
    }[size];

    return (
        <div
            className={`inline-flex items-center justify-center select-none group ${dimensions} ${className}`}
            title="Expert Vérifié — Réseau Gainable® (profil modéré par Gainable.fr)"
        >
            <svg
                viewBox="0 0 460 155"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto overflow-visible"
                role="img"
                aria-label="Expert Vérifié Réseau Gainable (profil modéré par Gainable.fr)"
            >
                <defs>
                    {/* Dégradé doré lumineux pour la barre du G et le check */}
                    <linearGradient id="gainableGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#D59B2B" />
                    </linearGradient>

                    {/* Filtre lueur subtile sur le G doré */}
                    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.35" />
                    </filter>

                    <style>{`
                        @keyframes textHeartbeat {
                            0%, 100% {
                                transform: scale(1);
                                filter: drop-shadow(0 0 0 rgba(213, 155, 43, 0));
                            }
                            14% {
                                transform: scale(1.055);
                                filter: drop-shadow(0 2px 8px rgba(213, 155, 43, 0.45));
                            }
                            28% {
                                transform: scale(1.015);
                                filter: drop-shadow(0 0 0 rgba(213, 155, 43, 0));
                            }
                            42% {
                                transform: scale(1.045);
                                filter: drop-shadow(0 2px 6px rgba(213, 155, 43, 0.35));
                            }
                            56% {
                                transform: scale(1);
                                filter: drop-shadow(0 0 0 rgba(213, 155, 43, 0));
                            }
                        }
                        .gainable-text-heartbeat {
                            transform-box: fill-box;
                            transform-origin: center center;
                            animation: textHeartbeat 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                        }
                    `}</style>
                </defs>

                {/* ================= LOGO "G" FIXE (GAUCHE) ================= */}
                <g>
                    {/* Arc du G en bleu ardoise officiel */}
                    <path
                        d="M 104 45 A 46 46 0 1 0 112 91"
                        stroke="#3A4F5C"
                        strokeWidth="22"
                        strokeLinecap="butt"
                        fill="none"
                    />
                    {/* Barre horizontale dorée du G (fixe) */}
                    <rect
                        x="68"
                        y="67"
                        width="54"
                        height="21"
                        rx="1.5"
                        fill="url(#gainableGoldGrad)"
                        filter="url(#goldGlow)"
                    />
                </g>

                {/* ================= TEXTE & ICÔNE CHECK ANIMÉS (BATTEMENT DE CŒUR LÉGER) ================= */}
                <g className="gainable-text-heartbeat">
                    {/* Ligne 1 : Expert Vérifié */}
                    <text
                        x="142"
                        y="61"
                        fill="#3A4F5C"
                        fontFamily="Montserrat, Inter, system-ui, -apple-system, sans-serif"
                        fontWeight="700"
                        fontSize="36"
                        letterSpacing="-0.5"
                    >
                        Expert Vérifié
                    </text>

                    {/* Ligne de séparation horizontale */}
                    <line
                        x1="136"
                        y1="76"
                        x2="386"
                        y2="76"
                        stroke="#3A4F5C"
                        strokeWidth="2.2"
                    />

                    {/* Cercle ouvert + Checkmark doré à droite */}
                    <g>
                        <path
                            d="M 397 34 A 27 27 0 1 1 391 64"
                            stroke="#3A4F5C"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M 403 54 L 414 64 L 434 44"
                            stroke="url(#gainableGoldGrad)"
                            strokeWidth="7.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            filter="url(#goldGlow)"
                        />
                    </g>

                    {/* Ligne 2 : Réseau Gainable® */}
                    <text
                        x="142"
                        y="113"
                        fill="#3A4F5C"
                        fontFamily="Montserrat, Inter, system-ui, -apple-system, sans-serif"
                        fontWeight="700"
                        fontSize="34"
                        letterSpacing="-0.5"
                    >
                        Réseau Gainable
                        <tspan fontSize="18" dy="-13" fontWeight="600">®</tspan>
                    </text>

                    {/* Ligne 3 : (profil modéré par Gainable.fr) */}
                    <text
                        x="144"
                        y="140"
                        fill="#3A4F5C"
                        fontFamily="Montserrat, Inter, system-ui, -apple-system, sans-serif"
                        fontWeight="500"
                        fontSize="18"
                    >
                        (profil modéré par Gainable.fr)
                    </text>
                </g>
            </svg>
        </div>
    );
}
