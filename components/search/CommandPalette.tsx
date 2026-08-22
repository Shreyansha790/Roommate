"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { parseNlpQuery, rankListingsByQuery, ParsedSearchVectors } from "@/lib/nlp-parser";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { VectorFilterChips } from "./VectorFilterChips";
import { TacticalBadge } from "@/components/HUD/TacticalBadge";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { playBlip, playPing, playSuccess } from "@/lib/audio-telemetry";
import {
  Crosshair,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  PlusCircle,
  Bookmark,
  MapPin,
  Flame,
  Terminal
} from "lucide-react";

const SUGGESTED_QUERIES = [
  { label: "Indiranagar night owl techie <=25k with wifi and ac", tag: "INDIRANAGAR_BLR" },
  { label: "Shared room in Bandra West under 35k for creative professional", tag: "BANDRA_BOM" },
  { label: "Single room in Hitec City under 20k for remote developer with gym", tag: "HITEC_HYD" },
  { label: "Entire flat in Hauz Khas Village with terrace", tag: "HAUZ_KHAS_DEL" },
  { label: "Cozy furnished room in Koregaon Park Pune vegetarian", tag: "KOREGAON_PNQ" }
];

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>("");
  const [parsed, setParsed] = React.useState<ParsedSearchVectors | null>(null);
  const [previewResults, setPreviewResults] = React.useState<any[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Hotkey listener (Cmd+K / Ctrl+K and open-command-palette event)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          playBlip(next ? 1100 : 750, 0.04);
          return next;
        });
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        playBlip(750, 0.03);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
      playBlip(1100, 0.04);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on modal open
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setParsed(null);
      setPreviewResults([]);
    }
  }, [isOpen]);

  // Parse NLP Query as user types
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setParsed(null);
      setPreviewResults([]);
      return;
    }

    const vectors = parseNlpQuery(val);
    setParsed(vectors);

    const ranked = rankListingsByQuery(DEMO_LISTINGS, val).slice(0, 3);
    setPreviewResults(ranked);
  };

  const executeSearch = (targetQuery?: string) => {
    const qToRun = targetQuery || query;
    playSuccess();
    setIsOpen(false);

    const vectors = parseNlpQuery(qToRun);
    const params = new URLSearchParams();

    if (vectors.geoFence?.city) params.set("city", vectors.geoFence.city);
    if (vectors.geoFence?.locality) params.set("locality", vectors.geoFence.locality);
    if (vectors.roomType) params.set("roomType", vectors.roomType);
    if (vectors.budget?.max) params.set("maxRent", String(vectors.budget.max));
    if (vectors.budget?.min) params.set("minRent", String(vectors.budget.min));
    if (qToRun) params.set("q", qToRun);

    router.push(`/browse?${params.toString()}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="chamfer-card w-full max-w-2xl border border-tungsten-border bg-obsidian-sub p-0 shadow-2xl reticle-border font-mono overflow-hidden">
        {/* Top Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-tungsten-border bg-tungsten/80 px-4 py-3.5">
          <Crosshair className="h-5 w-5 text-phosphor animate-spin" style={{ animationDuration: "16s" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                executeSearch();
              }
            }}
            placeholder="Type freeform query (e.g. 'Indiranagar night owl techie <=25k with wifi')..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="rounded border border-tungsten-border bg-obsidian px-2 py-0.5 text-[10px] text-slate-400 font-bold">
            ESC
          </kbd>
        </div>

        {/* Live Vector Extraction Chips Ribbon */}
        {parsed && parsed.extractedTokensCount > 0 && (
          <div className="border-b border-tungsten-border bg-obsidian px-4 py-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span className="flex items-center gap-1 text-phosphor">
                <Sparkles className="h-3 w-3" />
                <span>PARSED_VECTOR_TELEMETRY:</span>
              </span>
              <span>{parsed.extractedTokensCount} VECTORS EXTRACTED</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {parsed.geoFence?.city && (
                <VectorFilterChips
                  label={`METRO: ${parsed.geoFence.city}`}
                  category="geo"
                />
              )}
              {parsed.geoFence?.locality && (
                <VectorFilterChips
                  label={`LOCALITY: ${parsed.geoFence.locality}`}
                  category="geo"
                />
              )}
              {parsed.budget?.max && (
                <VectorFilterChips
                  label={`MAX_RENT: ₹${parsed.budget.max.toLocaleString()}`}
                  category="budget"
                />
              )}
              {parsed.budget?.min && (
                <VectorFilterChips
                  label={`MIN_RENT: ₹${parsed.budget.min.toLocaleString()}`}
                  category="budget"
                />
              )}
              {parsed.roomType && (
                <VectorFilterChips
                  label={`TYPE: ${parsed.roomType.replace("_", " ")}`}
                  category="room"
                />
              )}
              {parsed.lifestyleSync.sleepRhythm && (
                <VectorFilterChips
                  label={`SLEEP: ${parsed.lifestyleSync.sleepRhythm.replace("_", " ")}`}
                  category="lifestyle"
                />
              )}
              {parsed.lifestyleSync.foodPreference && (
                <VectorFilterChips
                  label={`DIET: ${parsed.lifestyleSync.foodPreference}`}
                  category="lifestyle"
                />
              )}
              {parsed.lifestyleSync.workStyle && (
                <VectorFilterChips
                  label={`WORK: ${parsed.lifestyleSync.workStyle}`}
                  category="lifestyle"
                />
              )}
              {parsed.lifestyleSync.petsAllowed && (
                <VectorFilterChips
                  label="PET_FRIENDLY"
                  category="lifestyle"
                />
              )}
              {parsed.amenityTokens.map((amenity) => (
                <VectorFilterChips
                  key={amenity}
                  label={amenity.replace("_", " ")}
                  category="amenity"
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Body / Results / Presets */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Live Preview of Matched Listings */}
          {previewResults.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Flame className="h-3.5 w-3.5" />
                  <span>TOP_HARMONIC_MATCHES ({previewResults.length})</span>
                </span>
                <button
                  onClick={() => executeSearch()}
                  className="text-phosphor hover:underline flex items-center gap-1"
                >
                  <span>SEE_ALL_IN_BROWSE</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2">
                {previewResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      playSuccess();
                      setIsOpen(false);
                      router.push(`/listings/${item.id}`);
                    }}
                    className="flex items-center justify-between gap-3 rounded-lg border border-tungsten-border bg-tungsten-panel p-2.5 transition hover:border-phosphor hover:bg-tungsten-card cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded overflow-hidden bg-black shrink-0 border border-tungsten-border">
                        <Image
                          src={item.photos[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-100 group-hover:text-phosphor line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-cyan-400" />
                          <span>{item.locality}, {item.city}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-phosphor font-bold">₹{item.rent.toLocaleString()}/mo</span>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <CompatibilityBadge score={item.matchScore} />
                      <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-phosphor group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Preset Suggested Vector Queries */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              [ SUGGESTED_VECTOR_SEARCHES ]
            </span>
            <div className="space-y-1.5">
              {SUGGESTED_QUERIES.map((s, idx) => (
                <button
                  key={s.tag}
                  onClick={() => {
                    playPing(1100, 0.04);
                    executeSearch(s.label);
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-tungsten-border/80 bg-tungsten/50 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-phosphor/80 hover:bg-tungsten-panel hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">0{idx + 1} //</span>
                    <span className="line-clamp-1">{s.label}</span>
                  </div>
                  <TacticalBadge variant="cyan" size="xs">
                    {s.tag}
                  </TacticalBadge>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Route Jump Navigation */}
          <div className="pt-2 border-t border-tungsten-border/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              [ QUICK_ROUTE_TRIGGERS ]
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <button
                onClick={() => {
                  playBlip(980, 0.02);
                  setIsOpen(false);
                  router.push("/browse");
                }}
                className="flex items-center gap-1.5 rounded border border-tungsten-border bg-tungsten p-2 text-xs text-slate-300 hover:border-phosphor hover:text-phosphor transition"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>EXPLORE_ALL</span>
              </button>
              <button
                onClick={() => {
                  playBlip(980, 0.02);
                  setIsOpen(false);
                  router.push("/onboarding");
                }}
                className="flex items-center gap-1.5 rounded border border-tungsten-border bg-tungsten p-2 text-xs text-slate-300 hover:border-violet hover:text-violet transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>VIBE_DNA</span>
              </button>
              <button
                onClick={() => {
                  playBlip(980, 0.02);
                  setIsOpen(false);
                  router.push("/post");
                }}
                className="flex items-center gap-1.5 rounded border border-tungsten-border bg-tungsten p-2 text-xs text-slate-300 hover:border-solar hover:text-solar transition"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>POST_SPACE</span>
              </button>
              <button
                onClick={() => {
                  playBlip(980, 0.02);
                  setIsOpen(false);
                  router.push("/saved");
                }}
                className="flex items-center gap-1.5 rounded border border-tungsten-border bg-tungsten p-2 text-xs text-slate-300 hover:border-cyan hover:text-cyan transition"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>SAVED_MATRIX</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Hotkeys */}
        <div className="flex items-center justify-between border-t border-tungsten-border bg-obsidian px-4 py-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="rounded border border-tungsten-border px-1">↵</kbd> TO EXECUTE</span>
            <span><kbd className="rounded border border-tungsten-border px-1">ESC</kbd> TO CLOSE</span>
          </div>
          <span className="text-phosphor font-bold flex items-center gap-1">
            <Terminal className="h-3 w-3" /> ROOMMATESPHERE_NLP_V2.0
          </span>
        </div>
      </div>
    </div>
  );
}
