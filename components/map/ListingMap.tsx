"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons issue when using Next.js
const initLeaflet = async () => {
  const L = await import("leaflet");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });

type MapProps = {
  city: string;
  locality: string;
};

// Hardcoded coordinates for some major Indian cities as fallbacks
const CITY_COORDS: Record<string, [number, number]> = {
  Bangalore: [12.9716, 77.5946],
  Mumbai: [19.0760, 72.8777],
  Delhi: [28.7041, 77.1025],
  Hyderabad: [17.3850, 78.4867],
  Pune: [18.5204, 73.8567],
};

export function ListingMap({ city, locality }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initLeaflet();
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[300px] w-full animate-pulse rounded-xl bg-slate-800" />;

  // Approximate coordinate for the marker. If we don't have Geocoding API, we use fallback coords.
  // We offset it slightly randomly so it doesn't look like exactly the city center every time.
  const baseCoord = CITY_COORDS[city] || [20.5937, 78.9629]; // Default India

  // Create a pseudo-random offset based on the locality name string length to give a sense of unique location
  const offset = locality ? (locality.length * 0.005) : 0;
  const position: [number, number] = [baseCoord[0] + offset, baseCoord[1] + offset];

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-xl z-0 relative">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
}
