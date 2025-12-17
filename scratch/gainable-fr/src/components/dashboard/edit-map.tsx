"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useMemo, useRef, useEffect } from "react";

// Fix for Leaflet icons
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
    iconUrl: "/assets/map-marker-g.jpg",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
    className: "rounded-full border-2 border-white shadow-lg object-cover"
});

// Draggable Marker Component
function DraggableMarker({
    position,
    setPosition,
    centerParams,
    maxDistKm
}: {
    position: { lat: number, lng: number },
    setPosition: (pos: { lat: number, lng: number }) => void,
    centerParams: { lat: number, lng: number },
    maxDistKm: number
}) {
    const markerRef = useRef<L.Marker>(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker) {
                    const newPos = marker.getLatLng();

                    // CHECK DISTANCE
                    const distKm = wrapperDistance(newPos.lat, newPos.lng, centerParams.lat, centerParams.lng);

                    if (distKm > maxDistKm) {
                        alert(`Vous ne pouvez pas déplacer le point à plus de ${maxDistKm}km de votre ville (${distKm.toFixed(1)}km).`);
                        // Reset to center or previous valid (simplification: reset to center)
                        marker.setLatLng([centerParams.lat, centerParams.lng]);
                        setPosition(centerParams);
                    } else {
                        setPosition({ lat: newPos.lat, lng: newPos.lng });
                    }
                }
            },
        }),
        [centerParams, maxDistKm, setPosition],
    );

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={defaultIcon}
        >
            <Popup minWidth={90}>
                <span>Déplacez-moi pour corriger !</span>
            </Popup>
        </Marker>
    );
}

// Distance Helper (Haversine)
function wrapperDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function EditMap({
    address,
    city,
    initialLat,
    initialLng,
    radius,
    onLocationChange
}: {
    address: string,
    city: string,
    initialLat?: number,
    initialLng?: number,
    radius: number, // in km
    onLocationChange: (lat: number, lng: number) => void
}) {
    // Current Marker Position
    const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);

    // "Anchor" Position (City Center or Initial Valid Address) used for Radius Check
    const [anchor, setAnchor] = useState<{ lat: number, lng: number } | null>(null);

    // Initialize
    useEffect(() => {
        const init = async () => {
            // 1. If we have initial saved coords, use them for Marker
            let startPos = (initialLat && initialLng) ? { lat: initialLat, lng: initialLng } : null;

            // 2. We need an ANCHOR (City Center) to constrain movement.
            // We'll geocode the CITY ONLY to get the center.
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ", France")}&limit=1`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const cityCenter = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                        setAnchor(cityCenter);

                        // If no saved position, start at city center (or geocoded full address if possible, but simplicity: city center)
                        if (!startPos) {
                            startPos = cityCenter;
                            // Also try full address for better start? optional.
                        }
                    }
                }
            } catch (e) {
                console.error("Geocoding failed", e);
            }

            if (startPos) {
                setPosition(startPos);
                onLocationChange(startPos.lat, startPos.lng);
            }
        };

        if (city) init();
    }, [city]); // Run if city changes (or once on mount)

    useEffect(() => {
        if (position) {
            onLocationChange(position.lat, position.lng);
        }
    }, [position]);

    if (!position || !anchor) return <div className="h-64 bg-slate-100 animate-pulse rounded-md flex items-center justify-center text-slate-400">Chargement de la carte...</div>;

    return (
        <MapContainer center={position} zoom={12} scrollWheelZoom={false} className="w-full h-full rounded-md z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Valid Zone Circle (Max Distance ~15km from City Center) */}
            <Circle center={anchor} radius={15000} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.05, dashArray: '5, 5', weight: 1 }} />

            {/* Intervention Radius Circle (Visual Feedback for user setting) */}
            <Circle center={position} radius={radius * 1000} pathOptions={{ color: '#D59B2B', fillColor: '#D59B2B', fillOpacity: 0.1, weight: 1 }} />

            <DraggableMarker
                position={position}
                setPosition={setPosition}
                centerParams={anchor}
                maxDistKm={15} // Constraint: 15km max from city center
            />
        </MapContainer>
    );
}
