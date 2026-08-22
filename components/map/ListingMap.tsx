"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export interface MapListingItem {
  id: string;
  title: string;
  locality: string;
  city: string;
  rent: number;
  photos?: string[];
  matchScore?: number;
  lat?: number;
  lng?: number;
}

export interface ListingMapProps {
  city?: string;
  locality?: string;
  listings?: MapListingItem[];
  height?: string | number;
  selectedId?: string | null;
  onSelectListing?: (id: string) => void;
}

const CITY_COORDS: Record<string, [number, number]> = {
  Bangalore: [12.9716, 77.5946],
  Mumbai: [19.0760, 72.8777],
  Delhi: [28.7041, 77.1025],
  Hyderabad: [17.3850, 78.4867],
  Pune: [18.5204, 73.8567],
  Gurgaon: [28.4595, 77.0266],
};

const LOCALITY_OFFSETS: Record<string, [number, number]> = {
  indiranagar: [0.007, 0.045],
  koramangala: [-0.035, 0.024],
  "hsr layout": [-0.065, 0.048],
  whitefield: [0.005, 0.155],
  bellandur: [-0.045, 0.085],
  "bandra west": [-0.015, -0.045],
  bandra: [-0.015, -0.045],
  andheri: [0.045, -0.035],
  juhu: [0.035, -0.048],
  "hauz khas": [-0.155, 0.065],
  "hauz khas village": [-0.155, 0.065],
  saket: [-0.185, 0.075],
  "hitec city": [0.065, -0.115],
  hitec: [0.065, -0.115],
  gachibowli: [0.055, -0.135],
  "koregaon park": [0.015, 0.045],
  koregaon: [0.015, 0.045],
  "viman nagar": [0.035, 0.065],
  "dlf phase 5": [0.025, 0.055],
};

export function ListingMap({
  city = "Bangalore",
  locality = "",
  listings = [],
  height = "100%",
  selectedId,
  onSelectListing
}: ListingMapProps) {
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [leafletL, setLeafletL] = React.useState<any>(null);

  React.useEffect(() => {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeafletL(L);
      setMounted(true);
    });
  }, []);

  if (!mounted || !leafletL) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-tungsten-border bg-obsidian-card font-mono text-xs text-slate-500 animate-pulse"
        style={{ height }}
      >
        <span>INITIALIZING_RADAR_MAP_TILES...</span>
      </div>
    );
  }

  // Determine Center Coordinates
  const cleanCity = city && city !== "All Metros" ? city : "Bangalore";
  const baseCoord = CITY_COORDS[cleanCity] || [12.9716, 77.5946];
  const offsetKey = locality.toLowerCase().trim();
  const localityOffset = LOCALITY_OFFSETS[offsetKey] || [0, 0];
  const centerPos: [number, number] = [
    baseCoord[0] + localityOffset[0],
    baseCoord[1] + localityOffset[1]
  ];

  // Helper to create custom HTML Pin
  const createMarkerIcon = (isSelected: boolean, score?: number) => {
    const pinColor = isSelected ? "#ffb700" : "#00ff88";

    return leafletL.divIcon({
      className: "custom-leaflet-pin",
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background-color: ${pinColor}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 14px; height: 14px; border-radius: 9999px; background-color: #05070a; border: 2.5px solid ${pinColor}; box-shadow: 0 0 10px ${pinColor};"></div>
          ${score ? `<span style="position: absolute; bottom: -14px; font-family: monospace; font-size: 8px; font-weight: bold; color: #ffffff; background: #0d1117; border: 1px solid ${pinColor}; border-radius: 3px; padding: 0 2px;">${score}%</span>` : ""}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });
  };

  // If listings are passed, render all pins; otherwise render single marker for city/locality
  const displayItems = listings.length > 0 ? listings : [{
    id: "single-pos",
    title: `${locality ? locality + ", " : ""}${cleanCity}`,
    locality: locality || "Central Metro",
    city: cleanCity,
    rent: 20000,
    lat: centerPos[0],
    lng: centerPos[1]
  }];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-tungsten-border bg-obsidian chamfer-card-sm select-none"
      style={{ height }}
    >
      {/* Top Map HUD Ticker Overlay */}
      <div className="absolute top-2 left-2 z-[400] flex items-center gap-2 rounded border border-tungsten-border/80 bg-obsidian-sub/90 px-2.5 py-1 text-[10px] font-mono text-slate-300 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-phosphor animate-pulse" />
        <span className="font-bold text-white">RADAR_TILES: CARTO_DARK</span>
        <span className="text-slate-500">|</span>
        <span className="text-cyan-400">{cleanCity.toUpperCase()}</span>
        <span className="text-slate-500">|</span>
        <span className="text-phosphor font-bold">{listings.length > 0 ? `${listings.length} NODES` : "1 NODE"}</span>
      </div>

      <MapContainer
        center={centerPos}
        zoom={listings.length > 1 ? 12 : 13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0, backgroundColor: "#05070a" }}
      >
        {/* CartoDB Dark Matter Obsidian Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {displayItems.map((item, idx) => {
          const itemCityCoord = CITY_COORDS[item.city] || baseCoord;
          const locOffset = LOCALITY_OFFSETS[item.locality?.toLowerCase().trim()] || [
            (idx * 0.012) - 0.02,
            (idx * 0.015) - 0.02
          ];
          const pos: [number, number] = [
            item.lat || itemCityCoord[0] + locOffset[0],
            item.lng || itemCityCoord[1] + locOffset[1]
          ];
          const isSelected = selectedId === item.id;

          return (
            <Marker
              key={item.id}
              position={pos}
              icon={createMarkerIcon(isSelected, item.matchScore)}
              eventHandlers={{
                click: () => onSelectListing?.(item.id)
              }}
            >
              <Popup className="dark-cyber-popup">
                <div className="chamfer-card-sm border border-tungsten-border bg-tungsten-card p-2 text-slate-100 font-mono text-xs max-w-[200px]">
                  {item.photos?.[0] && (
                    <div className="relative h-20 w-full mb-1.5 overflow-hidden rounded">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.photos[0]}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="font-bold text-white line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.locality}, {item.city}</p>
                  <div className="mt-1 flex items-center justify-between border-t border-tungsten-border/60 pt-1">
                    <span className="font-bold text-phosphor">₹{item.rent.toLocaleString()}/mo</span>
                    <a
                      href={`/listings/${item.id}`}
                      className="text-[10px] text-cyan-400 hover:underline font-bold"
                    >
                      DOSSIER [→]
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
