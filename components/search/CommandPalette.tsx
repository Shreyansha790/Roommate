"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { parseNlpQuery, ParsedSearchVectors } from "@/lib/nlp-parser";
import {
  Search,
  Sparkles,
  MapPin,
  IndianRupee,
  Home,
  Check,
  X,
  ArrowRight,
  Clock,
  Compass
} from "lucide-react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [parsed, setParsed] = React.useState<ParsedSearchVectors | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener("open-command-palette", handleOpen);
    window.addEventListener("close-command-palette", handleClose);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-command-palette", handleOpen);
      window.removeEventListener("close-command-palette", handleClose);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (query.trim().length > 2) {
      setParsed(parseNlpQuery(query));
    } else {
      setParsed(null);
    }
  }, [query]);

  const handleExecuteSearch = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/browse?q=${encodeURIComponent(query.trim())}`);
  };

  const sampleQueries = [
    "2BHK in Indiranagar under 25k with night owls",
    "Private room in Bandra West for vegetarian working in tech",
    "Shared flat near metro in HSR layout under 18k",
    "Quiet apartment in Hauz Khas with balcony and wifi"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 font-sans text-stone-800">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl space-y-6">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-100 text-coral-600 font-bold shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExecuteSearch()}
              placeholder="Describe your ideal space (e.g. 2BHK in Indiranagar under 25k)..."
              className="w-full bg-transparent text-sm sm:text-base font-medium text-stone-900 placeholder-stone-400 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live Vector Chips Preview */}
        {parsed && parsed.extractedTokensCount > 0 && (
          <div className="rounded-2xl border border-coral-100 bg-[#fffbf9] p-4 space-y-2">
            <span className="text-[11px] font-bold text-coral-600 uppercase tracking-wider">
              AI Extracted Search Filters:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {parsed.geoFence?.locality && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-stone-200 px-3 py-1 text-stone-800 font-semibold shadow-sm">
                  <MapPin className="h-3 w-3 text-coral-500" /> Locality: {parsed.geoFence.locality}
                </span>
              )}
              {parsed.budget?.max && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-stone-200 px-3 py-1 text-stone-800 font-semibold shadow-sm">
                  Budget: ≤ ₹{parsed.budget.max.toLocaleString()}
                </span>
              )}
              {parsed.roomType && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-stone-200 px-3 py-1 text-stone-800 font-semibold shadow-sm">
                  <Home className="h-3 w-3 text-amber-500" /> Type: {parsed.roomType.replace("_", " ")}
                </span>
              )}
              {parsed.lifestyleSync?.sleepRhythm && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-stone-200 px-3 py-1 text-stone-800 font-semibold shadow-sm">
                  <Clock className="h-3 w-3 text-emerald-500" /> Schedule: {parsed.lifestyleSync.sleepRhythm.replace("_", " ")}
                </span>
              )}
              {parsed.lifestyleSync?.foodPreference && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-stone-200 px-3 py-1 text-stone-800 font-semibold shadow-sm">
                  Diet: {parsed.lifestyleSync.foodPreference}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Suggested Queries */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Try natural language queries
          </span>
          <div className="space-y-1.5">
            {sampleQueries.map((sample) => (
              <button
                key={sample}
                onClick={() => {
                  setQuery(sample);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center justify-between group transition"
              >
                <span>{sample}</span>
                <ArrowRight className="h-3.5 w-3.5 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:text-coral-500 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-400">
          <span>Press Enter to search</span>
          <button
            onClick={handleExecuteSearch}
            className="neo-button px-4 py-2 text-xs font-bold shadow-warm-coral"
          >
            Search Now
          </button>
        </div>
      </div>
    </div>
  );
}
