"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CityInteractiveMapProps {
    cityName: string;
    companies: any[];
    onSelectCompany: (company: any) => void;
    selectedCompanyId?: string | null;
}

const CITY_COORDINATES: Record<string, [number, number]> = {
    lyon: [45.7640, 4.8357],
    marseille: [43.2965, 5.3698],
    miramas: [43.5815, 5.0006],
    nice: [43.7102, 7.2620],
    toulouse: [43.6047, 1.4442],
    bordeaux: [44.8378, -0.5792],
    paris: [48.8566, 2.3522],
    nantes: [47.2184, -1.5536],
    lille: [50.6292, 3.0573],
    strasbourg: [48.5734, 7.7521],
    montpellier: [43.6108, 3.8767]
};

export default function CityInteractiveMap({
    cityName,
    companies,
    onSelectCompany,
    selectedCompanyId
}: CityInteractiveMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const layerGroupRef = useRef<L.LayerGroup | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const cityKey = cityName ? cityName.toLowerCase().trim() : "lyon";
    const centerCoords = CITY_COORDINATES[cityKey] || [46.603354, 1.888334]; // Default France center

    // 1. Initialize Map Instance ONCE per city
    useEffect(() => {
        if (typeof window === "undefined" || !containerRef.current) return;

        // Fix Leaflet marker icon paths in Next.js
        try {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            });
        } catch (e) {
            console.error("Leaflet icon init error:", e);
        }

        // Clean up previous map if exists
        if (mapRef.current) {
            try {
                mapRef.current.remove();
            } catch (e) {}
            mapRef.current = null;
        }

        // Clear container DOM node completely
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
            (containerRef.current as any)._leaflet_id = null;
        }

        try {
            const newMap = L.map(containerRef.current).setView(centerCoords, 12);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(newMap);

            const newLayerGroup = L.layerGroup().addTo(newMap);
            layerGroupRef.current = newLayerGroup;
            mapRef.current = newMap;
        } catch (err) {
            console.error("Leaflet map init error:", err);
        }

        return () => {
            if (mapRef.current) {
                try {
                    mapRef.current.remove();
                } catch (e) {}
                mapRef.current = null;
                layerGroupRef.current = null;
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
                (containerRef.current as any)._leaflet_id = null;
            }
        };
    }, [cityName]);

    // 2. Update Markers on LayerGroup dynamically without re-creating the map
    useEffect(() => {
        if (!mapRef.current || !layerGroupRef.current) return;

        const layerGroup = layerGroupRef.current;
        layerGroup.clearLayers();

        const goldIcon = L.divIcon({
            className: "custom-div-icon",
            html: `<div style="background-color:#D59B2B;width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:bold;">📍</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const activeGoldIcon = L.divIcon({
            className: "custom-div-icon-active",
            html: `<div style="background-color:#2563EB;width:30px;height:30px;border-radius:50%;border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:bold;">📍</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        (companies || []).slice(0, 40).forEach((comp, index) => {
            if (!comp) return;
            const angle = index * 0.7;
            const radius = 0.008 + (index * 0.003);
            const lat = centerCoords[0] + (Math.sin(angle) * radius);
            const lng = centerCoords[1] + (Math.cos(angle) * radius);

            const isSelected = selectedCompanyId === comp.id;
            const marker = L.marker([lat, lng], { icon: isSelected ? activeGoldIcon : goldIcon }).addTo(layerGroup);

            const ratingHtml = comp.noteGoogle && comp.noteGoogle > 0 
                ? `<div style="color:#b45309;font-weight:bold;font-size:11px;margin-top:2px;">⭐ ${comp.noteGoogle} (${comp.nombreAvis || 0} avis)</div>` 
                : '';

            const popupContent = `
                <div style="font-family:sans-serif;padding:4px;max-width:200px;">
                    <div style="font-weight:bold;font-size:13px;color:#1F2D3D;">${comp.nomEntreprise || ''}</div>
                    ${ratingHtml}
                    <div style="font-size:11px;color:#475569;margin-top:4px;">📞 ${comp.telephone || 'Tél non renseigné'}</div>
                    <div style="font-size:11px;color:#2563eb;margin-top:2px;">🌐 ${comp.siteWeb || 'Pas de site'}</div>
                    <button id="btn-select-${comp.id}" style="margin-top:8px;width:100%;background-color:#D59B2B;color:white;border:none;padding:6px;border-radius:8px;font-weight:bold;font-size:11px;cursor:pointer;">
                        ⚡ Pré-remplir le Formulaire 👉
                    </button>
                </div>
            `;

            marker.bindPopup(popupContent);

            marker.on("click", () => {
                onSelectCompany(comp);
            });

            marker.on("popupopen", () => {
                const btn = document.getElementById(`btn-select-${comp.id}`);
                if (btn) {
                    btn.onclick = () => {
                        onSelectCompany(comp);
                    };
                }
            });
        });
    }, [companies, selectedCompanyId]);

    return (
        <div className="w-full h-[450px] bg-slate-100 relative rounded-b-2xl overflow-hidden shadow-inner z-0">
            <div ref={containerRef} className="w-full h-full" />
        </div>
    );
}
