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
function MapUpdater({ experts, geocodedCoords, hasLocationFilter, initialView }: { experts: any[], geocodedCoords: Record<string, [number, number]>, hasLocationFilter: boolean, initialView: { center: number[], zoom: number } }) {
    const map = useMap();
    useEffect(() => {
        // STRICT RULE: Only auto-zoom if the user has explicitly requested a location (city/country)
        if (!hasLocationFilter) {
            // Force reset to dynamic global view (based on IP)
            map.setView(initialView.center as [number, number], initialView.zoom);
            return;
        }

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
    }, [experts, geocodedCoords, map, hasLocationFilter, initialView]);
    return null;
}

// ... (omitted constants)

export default function SearchMap({ experts, hasLocationFilter = false, initialView }: { experts: any[], hasLocationFilter?: boolean, initialView?: { center: number[], zoom: number } }) {
    const [geocodedCoords, setGeocodedCoords] = useState<Record<string, [number, number]>>({});

    // Default fallback if not provided
    const defaultView = initialView || { center: [46.603354, 1.888334], zoom: 6 };

    useEffect(() => {
        // ... (existing logic)
    }, [experts]);

    return (
        <MapContainer center={defaultView.center as [number, number]} zoom={defaultView.zoom} scrollWheelZoom={false} className="w-full h-full z-0">
            {/* Google Maps Tiles (Standard) */}
            <TileLayer
                attribution='&copy; Google Maps'
                url="https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
            <MapUpdater experts={experts} geocodedCoords={geocodedCoords} hasLocationFilter={hasLocationFilter} initialView={defaultView} />

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
