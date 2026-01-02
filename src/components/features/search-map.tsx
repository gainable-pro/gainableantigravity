"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix Leaflet Default Icon in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

// Custom Brand Marker
const iconBrand = new L.Icon({
    iconUrl: "/assets/map-marker-g.jpg",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
    className: "rounded-full border-2 border-white shadow-lg object-cover"
});


// Helper to center map on results
function MapUpdater({ experts, geocodedCoords, hasLocationFilter }: { experts: any[], geocodedCoords: Record<string, [number, number]>, hasLocationFilter: boolean }) {
    const map = useMap();
    useEffect(() => {
        // STRICT RULE: Only auto-zoom if the user has explicitly requested a location (city/country)
        // Otherwise, keep the neutral "France" view.
        if (!hasLocationFilter) return;

        // Find the first expert with valid coords (either from DB or geocoded)
        const firstValid = experts.find(e => {
            const hasDbCoords = e.lat && e.lat !== 46.2276; // Ignore default mock
            const hasGeoCoords = !!geocodedCoords[e.id];
            return hasDbCoords || hasGeoCoords;
        });

        if (firstValid) {
            const hasDbCoords = firstValid.lat && firstValid.lat !== 46.2276;
            const coords = hasDbCoords ? [firstValid.lat, firstValid.lng] : geocodedCoords[firstValid.id];
            if (coords) {
                map.setView(coords as [number, number], 10);
            }
        }
    }, [experts, geocodedCoords, map, hasLocationFilter]);
    return null;
}

// LOWERCASE KEYS for reliable lookup
const CITY_COORDS: Record<string, [number, number]> = {
    "miramas": [43.5804, 5.0007],
    "bordeaux": [44.8378, -0.5792],
    "merignac": [44.8378, -0.65], // normalized
    "mérignac": [44.8378, -0.65],
    "paris": [48.8566, 2.3522],
    "genève": [46.2044, 6.1432],
    "geneve": [46.2044, 6.1432],
    "lyon": [45.7640, 4.8357],
    "marseille": [43.2965, 5.3698],
    "marseille 9eme": [43.2630, 5.4192], // FIXED: Added specific district
    "decines-charpieu": [45.7695, 4.9592], // FIXED: Added missing city
    "lausanne": [46.5197, 6.6323]
};

// Hardcoded coords for specific addresses that Nominatim might miss
const MANUAL_GEOCODES: Record<string, [number, number]> = {
    // Shared Address (Air G) - Correct via Nominatim [43.5828, 5.0069]
    "3 rue du pourra, miramas, france": [43.5828, 5.0069],
    "3 rue du pourra, miramas": [43.5828, 5.0069],

    // FEXIM 13 - Correct address: Chemin de l'Est, Miramas [43.5790, 5.0220]
    // (Database has wrong address '3 Rue du Pourra', forcing visual fix here)
    "franck expertise immobilier 13 (fexim13) (fexim13)": [43.5790, 5.0220],

    // PRECISE STREET LOCATIONS
    // SMB 13 - 15 Traverse de la Gouffonne, Marseille [43.2505, 5.4056]
    "smb 13": [43.2505, 5.4056],

    // CORETEC - 14 Rue des Frères Lumière, Genas/Chassieu (Actual location distinct from city center) [45.7289, 4.9863]
    "coretec conception realisat.thermique (conception realisation thermique energetique et climatique)": [45.7289, 4.9863]
};

export default function SearchMap({ experts, hasLocationFilter = false }: { experts: any[], hasLocationFilter?: boolean }) {
    const [geocodedCoords, setGeocodedCoords] = useState<Record<string, [number, number]>>({});

    useEffect(() => {
        experts.forEach(async (expert) => {
            // 0. Manual Override
            if (expert.address && expert.address.toLowerCase().includes("3 rue du pourra")) {
                setGeocodedCoords(prev => ({ ...prev, [expert.id]: [43.5882, 5.0135] }));
                return;
            }
            // Check by Name for test accounts
            const nameKey = expert.name?.toLowerCase().trim();
            if (nameKey && MANUAL_GEOCODES[nameKey]) {
                setGeocodedCoords(prev => ({ ...prev, [expert.id]: MANUAL_GEOCODES[nameKey] }));
                return;
            }

            // If already has DB coords (real ones) or already geocoded, skip
            if ((expert.lat && expert.lat !== 46.2276) || geocodedCoords[expert.id]) return;

            // 1. Try Mock City Lookup (Normalization)
            const cityKey = expert.city?.toLowerCase().trim();
            if (cityKey && CITY_COORDS[cityKey]) {
                setGeocodedCoords(prev => ({ ...prev, [expert.id]: CITY_COORDS[cityKey] }));
                return;
            }

            // 2. Try Nominatim Geocoding (Real Address)
            try {
                // Construct address query
                const query = [expert.address, expert.city, expert.country || "France"]
                    .filter(Boolean)
                    .join(", ");

                if (!query) return;

                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setGeocodedCoords(prev => ({
                            ...prev,
                            [expert.id]: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
                        }));
                    }
                }
            } catch (err) {
                console.error("Geocoding failed for", expert.name, err);
            }
        });
    }, [experts]); // Run when experts list changes

    return (
        <MapContainer center={[47.0, 4.5]} zoom={6} scrollWheelZoom={false} className="w-full h-full z-0">
            {/* Google Maps Tiles (Standard) */}
            <TileLayer
                attribution='&copy; Google Maps'
                url="https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
            <MapUpdater experts={experts} geocodedCoords={geocodedCoords} hasLocationFilter={hasLocationFilter} />

            {experts.map((expert) => {
                let position: [number, number] | null = null;

                // Use DB coords if they differ from the "default mock" value (46.2276)
                if (expert.lat && expert.lng && expert.lat !== 46.2276) {
                    position = [expert.lat, expert.lng];
                } else if (geocodedCoords[expert.id]) {
                    position = geocodedCoords[expert.id];
                }

                // IF NO POSITION FOUND, DO NOT RENDER A MARKER AT A RANDOM PLACE.
                if (!position) return null;

                // Select Icon
                const selectedIcon = iconBrand;

                return (
                    <Marker key={expert.id} position={position} icon={selectedIcon}>
                        <Popup>
                            <div className="text-sm font-sans">
                                <strong className="block mb-1 text-[#1F2D3D]">{expert.name}</strong>
                                <span className="text-slate-500">{expert.city}</span>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
