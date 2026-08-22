"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { TacticalBadge } from "@/components/HUD/TacticalBadge";
import { VectorFilterChips } from "@/components/search/VectorFilterChips";
import { BookmarkButton } from "./bookmark-button";
import { ListingMap, MapListingItem } from "@/components/map/ListingMap";
import { ParsedSearchVectors } from "@/lib/nlp-parser";
import { playBlip, playPing } from "@/lib/audio-telemetry";
import {
  MapPin,
  SlidersHorizontal,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Navigation,
  Clock,
  Layers,
  Map as MapIcon,
  Grid,
  RotateCcw,
  Zap,
  Flame,
  CheckCircle2
} from "lucide-react";

export interface BrowseListingItem {
  id: string;
  title: string;
  description?: string;
  locality: string;
  city: string;
  rent: number;
  deposit?: number;
  room_type: string;
  available_from?: string;
  photos: string[];
  user_id: string;
  tags?: string[];
  amenities?: string[];
  profiles?: {
    id?: string;
    full_name: string;
    avatar_url?: string | null;
    profession?: string | null;
    is_verified?: boolean;
  };
  matchScore?: number;
  isochroneMins?: number;
}

interface BrowseClientViewProps {
  initialListings: BrowseListingItem[];
  searchParams: {
    city?: string;
    locality?: string;
    roomType?: string;
    minRent?: string;
    maxRent?: string;
    isochrone?: string;
    vibe?: string;
    q?: string;
    availableFrom?: string;
  };
  parsedVectors: ParsedSearchVectors | null;
  userId: string | null;
}

const CITIES = ["All Metros", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Gurgaon"];
const ROOM_TYPES = [
  { id: "", label: "ALL TYPES" },
  { id: "single", label: "SINGLE ROOM" },
  { id: "shared", label: "SHARED ROOM" },
  { id: "entire_flat", label: "ENTIRE FLAT" }
];
const VIBE_PRESETS = [
  "Night Owl",
  "Vegetarian",
  "Pet Friendly",
  "Remote WFH",
  "Early Bird",
  "Zero Smoking",
  "Fitness Enthusiast"
];

export function BrowseClientView({
  initialListings,
  searchParams,
  parsedVectors,
  userId
}: BrowseClientViewProps) {
  const router = useRouter();

  // Local Filter States
  const [qInput, setQInput] = React.useState<string>(searchParams.q || "");
  const [selectedCity, setSelectedCity] = React.useState<string>(searchParams.city || "");
  const [localityInput, setLocalityInput] = React.useState<string>(searchParams.locality || "");
  const [selectedRoomType, setSelectedRoomType] = React.useState<string>(searchParams.roomType || "");
  const [minRentInput, setMinRentInput] = React.useState<string>(searchParams.minRent || "");
  const [maxRentInput, setMaxRentInput] = React.useState<string>(searchParams.maxRent || "");
  const [isochroneDistance, setIsochroneDistance] = React.useState<number>(
    searchParams.isochrone ? parseInt(searchParams.isochrone, 10) : 15
  );
  const [selectedVibes, setSelectedVibes] = React.useState<string[]>(
    searchParams.vibe ? searchParams.vibe.split(",") : []
  );

  // Split-View Interactive State
  const [selectedListingId, setSelectedListingId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"split" | "grid" | "map">("split");

  // Sync Form Submission
  const applyFilters = () => {
    playBlip(1050, 0.03);
    const params = new URLSearchParams();

    if (qInput.trim()) params.set("q", qInput.trim());
    if (selectedCity && selectedCity !== "All Metros") params.set("city", selectedCity);
    if (localityInput.trim()) params.set("locality", localityInput.trim());
    if (selectedRoomType) params.set("roomType", selectedRoomType);
    if (minRentInput) params.set("minRent", minRentInput);
    if (maxRentInput) params.set("maxRent", maxRentInput);
    if (isochroneDistance) params.set("isochrone", String(isochroneDistance));
    if (selectedVibes.length > 0) params.set("vibe", selectedVibes.join(","));

    router.push(`/browse?${params.toString()}`);
  };

  const toggleVibe = (vibe: string) => {
    playBlip(880, 0.02);
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const resetFilters = () => {
    playPing(750, 0.04);
    setQInput("");
    setSelectedCity("");
    setLocalityInput("");
    setSelectedRoomType("");
    setMinRentInput("");
    setMaxRentInput("");
    setIsochroneDistance(15);
    setSelectedVibes([]);
    router.push("/browse");
  };

  // Convert Listings for Map
  const mapItems: MapListingItem[] = initialListings.map((l) => ({
    id: l.id,
    title: l.title,
    locality: l.locality,
    city: l.city,
    rent: l.rent,
    photos: l.photos,
    matchScore: l.matchScore
  }));

  const activeCityLabel = selectedCity && selectedCity !== "All Metros" ? selectedCity : "Bangalore";

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Top HUD Header Banner */}
      <div className="chamfer-card border border-tungsten-border bg-obsidian-sub p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TacticalBadge variant="emerald" size="xs" pulse>
                DISCOVERY_ENGINE // V2.0
              </TacticalBadge>
              <span className="text-xs text-slate-400 font-bold">
                [{initialListings.length} LIVING_SPACES_LOCATED]
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Verified Living Spaces &amp; Roommates
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-vector lifestyle telemetry, isochrone transit mapping, and zero-brokerage direct host connections.
            </p>
          </div>

          {/* Quick Actions & Mobile View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded border border-tungsten-border bg-tungsten p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  playBlip(950, 0.02);
                  setViewMode("split");
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
                  viewMode === "split"
                    ? "bg-phosphor text-black shadow-glow-phosphor"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">SPLIT_VIEW</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playBlip(950, 0.02);
                  setViewMode("grid");
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
                  viewMode === "grid"
                    ? "bg-phosphor text-black shadow-glow-phosphor"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">CARDS</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playBlip(950, 0.02);
                  setViewMode("map");
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold transition ${
                  viewMode === "map"
                    ? "bg-phosphor text-black shadow-glow-phosphor"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">RADAR_MAP</span>
              </button>
            </div>

            <Link
              href="/onboarding"
              className="chamfer-card-sm flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-violet bg-violet/10 text-violet-300 hover:bg-violet/20 hover:shadow-glow-violet transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>RE-CALIBRATE_DNA</span>
            </Link>
          </div>
        </div>

        {/* City Metro Switcher Ribbon */}
        <div className="mt-4 pt-3 border-t border-tungsten-border/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">METRO_HUB:</span>
          {CITIES.map((city) => {
            const isSelected =
              (!selectedCity && city === "All Metros") || selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => {
                  playBlip(880, 0.02);
                  const newCity = city === "All Metros" ? "" : city;
                  setSelectedCity(newCity);
                  const params = new URLSearchParams();
                  if (newCity) params.set("city", newCity);
                  if (localityInput) params.set("locality", localityInput);
                  if (selectedRoomType) params.set("roomType", selectedRoomType);
                  if (qInput) params.set("q", qInput);
                  router.push(`/browse?${params.toString()}`);
                }}
                className={`whitespace-nowrap rounded px-2.5 py-1 text-[11px] font-bold uppercase transition ${
                  isSelected
                    ? "bg-cyan text-black border border-cyan shadow-glow-cyan"
                    : "border border-tungsten-border bg-tungsten/80 text-slate-400 hover:border-slate-400 hover:text-white"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Vector Filter Chips Banner */}
      {parsedVectors && parsedVectors.extractedTokensCount > 0 && (
        <div className="chamfer-card-sm border border-cyan/40 bg-cyan/5 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-black text-cyan-300">
              NLP_VECTOR_QUERY: &ldquo;{parsedVectors.rawQuery}&rdquo;
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {parsedVectors.geoFence?.city && (
              <VectorFilterChips label={`CITY: ${parsedVectors.geoFence.city}`} category="geo" />
            )}
            {parsedVectors.geoFence?.locality && (
              <VectorFilterChips label={`LOC: ${parsedVectors.geoFence.locality}`} category="geo" />
            )}
            {parsedVectors.budget?.max && (
              <VectorFilterChips label={`MAX_RENT: ₹${parsedVectors.budget.max.toLocaleString()}`} category="budget" />
            )}
            {parsedVectors.roomType && (
              <VectorFilterChips label={`ROOM: ${parsedVectors.roomType}`} category="room" />
            )}
            {parsedVectors.lifestyleSync.sleepRhythm && (
              <VectorFilterChips label={`SLEEP: ${parsedVectors.lifestyleSync.sleepRhythm}`} category="lifestyle" />
            )}
            {parsedVectors.lifestyleSync.workStyle && (
              <VectorFilterChips label={`WORK: ${parsedVectors.lifestyleSync.workStyle}`} category="lifestyle" />
            )}
            {parsedVectors.amenityTokens.map((a) => (
              <VectorFilterChips key={a} label={a} category="amenity" />
            ))}
          </div>
        </div>
      )}

      {/* Main 3-Column Split-View Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Sticky Parameter Filter Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="sticky top-24 chamfer-card border border-tungsten-border bg-obsidian-sub p-4 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-tungsten-border pb-3">
              <span className="text-xs font-black uppercase text-phosphor flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>PARAMETERS</span>
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>RESET</span>
              </button>
            </div>

            {/* Freeform NLP Input */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                FREEFORM_NLP_QUERY
              </label>
              <div className="relative">
                <input
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applyFilters();
                  }}
                  placeholder="e.g. Indiranagar night owl <=25k"
                  className="w-full rounded border border-tungsten-border bg-tungsten p-2 text-xs text-white placeholder:text-slate-500 focus:border-phosphor focus:outline-none"
                />
              </div>
            </div>

            {/* City Selection */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                METRO_CITY
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded border border-tungsten-border bg-tungsten p-2 text-xs text-white focus:border-phosphor focus:outline-none"
              >
                <option value="">All Metros</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi & NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Gurgaon">Gurgaon</option>
              </select>
            </div>

            {/* Locality Search */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                LOCALITY / TECH_HUB
              </label>
              <input
                value={localityInput}
                onChange={(e) => setLocalityInput(e.target.value)}
                placeholder="e.g. Indiranagar, Bandra"
                className="w-full rounded border border-tungsten-border bg-tungsten p-2 text-xs text-white placeholder:text-slate-500 focus:border-phosphor focus:outline-none"
              />
            </div>

            {/* Room Type Pill Group */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                ROOM_TYPE
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ROOM_TYPES.map((rt) => (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => {
                      playBlip(900, 0.02);
                      setSelectedRoomType(rt.id);
                    }}
                    className={`rounded border p-1.5 text-[10px] font-bold text-center transition ${
                      selectedRoomType === rt.id
                        ? "border-cyan bg-cyan/20 text-cyan-300"
                        : "border-tungsten-border bg-tungsten text-slate-400 hover:text-white"
                    }`}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rent Range Min/Max */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                MONTHLY_RENT_RANGE (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    value={minRentInput}
                    onChange={(e) => setMinRentInput(e.target.value)}
                    placeholder="MIN (5000)"
                    className="w-full rounded border border-tungsten-border bg-tungsten p-2 text-xs text-white placeholder:text-slate-500 focus:border-solar focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={maxRentInput}
                    onChange={(e) => setMaxRentInput(e.target.value)}
                    placeholder="MAX (45000)"
                    className="w-full rounded border border-tungsten-border bg-tungsten p-2 text-xs text-white placeholder:text-slate-500 focus:border-solar focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Isochrone Commute Radius Slider */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Navigation className="h-3 w-3" />
                  <span>ISOCHRONE_RADIUS</span>
                </span>
                <span className="text-phosphor font-bold">{isochroneDistance} KM</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={isochroneDistance}
                onChange={(e) => setIsochroneDistance(Number(e.target.value))}
                className="w-full accent-phosphor cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
                <span>5KM (WALK/BIKE)</span>
                <span>15KM (METRO)</span>
                <span>30KM (DRIVE)</span>
              </div>
            </div>

            {/* Vibe & Lifestyle Tags */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                LIFESTYLE_VIBE_DNA
              </label>
              <div className="flex flex-wrap gap-1.5">
                {VIBE_PRESETS.map((vibe) => {
                  const isChecked = selectedVibes.includes(vibe);
                  return (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => toggleVibe(vibe)}
                      className={`rounded border px-2 py-1 text-[10px] font-bold transition ${
                        isChecked
                          ? "border-phosphor bg-phosphor/20 text-phosphor shadow-glow-phosphor"
                          : "border-tungsten-border bg-tungsten text-slate-400 hover:text-white"
                      }`}
                    >
                      {vibe}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={applyFilters}
              className="chamfer-card-sm w-full py-2.5 text-xs font-black uppercase tracking-wider bg-phosphor text-black hover:bg-phosphor-glow shadow-glow-phosphor transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="h-3.5 w-3.5" />
              <span>APPLY_FILTERS</span>
            </button>
          </div>
        </aside>

        {/* Center Listings Cards Grid (5 cols in split, 9 cols in grid mode) */}
        <section
          className={`${
            viewMode === "grid"
              ? "lg:col-span-9"
              : viewMode === "map"
              ? "hidden lg:block lg:col-span-4"
              : "lg:col-span-5"
          } space-y-4`}
        >
          {initialListings.length === 0 ? (
            <div className="chamfer-card p-10 text-center border border-tungsten-border bg-obsidian-sub space-y-3">
              <SlidersHorizontal className="mx-auto h-8 w-8 text-slate-600" />
              <h3 className="text-base font-black uppercase text-white">No Matching Spaces Located</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No active listings matched your parameters. Try expanding your budget range or resetting filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="chamfer-card-sm bg-phosphor text-black font-black text-xs uppercase px-4 py-2 mt-2 inline-block cursor-pointer"
              >
                RESET_ALL_FILTERS
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
              }`}
            >
              {initialListings.map((listing, idx) => {
                const profile = listing.profiles;
                const score = listing.matchScore || (88 + ((idx * 5) % 11));
                const photo =
                  listing.photos?.[0] ||
                  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";
                const isSelected = selectedListingId === listing.id;

                return (
                  <article
                    key={listing.id}
                    onMouseEnter={() => setSelectedListingId(listing.id)}
                    className={`chamfer-card border bg-tungsten-panel p-0 overflow-hidden transition duration-150 flex flex-col justify-between group ${
                      isSelected
                        ? "border-phosphor shadow-glow-phosphor bg-tungsten-card"
                        : "border-tungsten-border hover:border-slate-500"
                    }`}
                  >
                    {/* Media Block */}
                    <div className="relative h-44 w-full overflow-hidden bg-black">
                      <Image
                        src={photo}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <TacticalBadge variant="cyan" size="xs">
                          {listing.room_type?.replace("_", " ").toUpperCase() || "ROOM"}
                        </TacticalBadge>
                      </div>

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <CompatibilityBadge score={score} />
                        <BookmarkButton listingId={listing.id} userId={userId} />
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                        <div className="chamfer-card-sm bg-obsidian/90 px-2.5 py-1 border border-tungsten-border backdrop-blur-md">
                          <span className="text-sm font-black text-phosphor">
                            ₹{Number(listing.rent).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400">/mo</span>
                        </div>

                        <div className="chamfer-card-sm bg-obsidian/90 px-2 py-0.5 border border-tungsten-border text-[9px] text-amber-300 flex items-center gap-1 backdrop-blur-md">
                          <Clock className="h-2.5 w-2.5" />
                          <span>~{10 + ((idx * 4) % 15)}m TO TECH HUB</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 space-y-2.5">
                      <div>
                        <Link
                          href={`/listings/${listing.id}`}
                          className="block hover:text-phosphor transition"
                        >
                          <h3 className="line-clamp-1 text-xs font-black uppercase text-white">
                            {listing.title}
                          </h3>
                        </Link>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                          <span className="truncate">
                            {listing.locality}, {listing.city}
                          </span>
                        </p>
                      </div>

                      {/* Host Micro-Dossier */}
                      {profile && (
                        <div className="flex items-center gap-2 rounded border border-tungsten-border bg-obsidian p-1.5">
                          {profile.avatar_url ? (
                            <Image
                              src={profile.avatar_url}
                              alt={profile.full_name}
                              width={22}
                              height={22}
                              className="h-5.5 w-5.5 rounded object-cover border border-tungsten-border"
                            />
                          ) : (
                            <div className="flex h-5.5 w-5.5 items-center justify-center rounded bg-phosphor font-black text-[9px] text-black">
                              {profile.full_name?.[0] || "H"}
                            </div>
                          )}
                          <div className="truncate flex-1">
                            <span className="text-[11px] font-bold text-slate-200">
                              {profile.full_name}
                            </span>
                          </div>
                          {profile.is_verified && (
                            <ShieldCheck className="h-3 w-3 text-phosphor shrink-0" />
                          )}
                        </div>
                      )}

                      {/* Vibe Tags */}
                      {listing.tags && (
                        <div className="flex flex-wrap gap-1">
                          {listing.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="rounded border border-tungsten-border bg-tungsten px-1.5 py-0.5 text-[9px] text-slate-300"
                            >
                              #{t.replace(" ", "_")}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-tungsten-border flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">
                          AVAIL: {listing.available_from || "IMMEDIATE"}
                        </span>
                        <Link
                          href={`/listings/${listing.id}`}
                          className="font-bold text-phosphor hover:underline inline-flex items-center gap-1"
                        >
                          <span>DOSSIER</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Sticky Dark Leaflet Radar Map (4 cols in split, 8 cols in map mode) */}
        <div
          className={`${
            viewMode === "grid"
              ? "hidden"
              : viewMode === "map"
              ? "lg:col-span-9"
              : "hidden lg:block lg:col-span-4"
          }`}
        >
          <div className="sticky top-24 space-y-3">
            <div className="chamfer-card border border-tungsten-border bg-obsidian-sub p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Navigation className="h-4 w-4 text-cyan-400" />
                <span>SPATIAL_RADAR_MAP</span>
              </div>
              <TacticalBadge variant="emerald" size="xs">
                CARTO_DARK_MATTER
              </TacticalBadge>
            </div>

            <ListingMap
              city={activeCityLabel}
              locality={localityInput || (initialListings[0]?.locality ?? "")}
              listings={mapItems}
              height="620px"
              selectedId={selectedListingId}
              onSelectListing={(id) => setSelectedListingId(id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
