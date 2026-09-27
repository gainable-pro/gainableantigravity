"use client";

import { useState, useEffect } from "react";

const heroImages = [
  "/gainable-fr-climatisation-villa-residentiel.png",
  "/gainable-fr-climatisation-locaux-professionnels.png",
  "/gainable-fr-climatisation-bureau-tertiaire.png",
  "/gainable-fr-climatisation-centre-commercial.png",
  "/gainable-fr-climatisation-hotellerie-hero.png",
  "/gainable-fr-climatisation-industrie-hero.png",
  "/gainable-fr-climatisation-hopital-sante.png"
];

export function HeroSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {heroImages.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${img}')` }}
        >
          <div className="absolute inset-0 bg-white/60"></div>
        </div>
      ))}
    </>
  );
}
