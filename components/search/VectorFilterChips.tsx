"use client";

import * as React from "react";
import { ParsedSearchVectors } from "@/lib/nlp-parser";
import { X, MapPin, IndianRupee, Home, Clock, Sparkles } from "lucide-react";

export interface VectorFilterChipsProps {
  parsed: ParsedSearchVectors;
  onClearFilter?: (key: string) => void;
  onClearAll?: () => void;
}

export function VectorFilterChips({
  parsed,
  onClearFilter,
  onClearAll
}: VectorFilterChipsProps) {
  if (parsed.extractedTokensCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
      <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
        <Sparkles className="h-3.5 w-3.5 text-coral-500" /> Active Filters:
      </span>

      {/* Locality */}
      {parsed.geoFence?.locality && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm">
          <MapPin className="h-3 w-3 text-coral-500" />
          <span>{parsed.geoFence.locality}</span>
          {onClearFilter && (
            <button onClick={() => onClearFilter("geoFence")} className="hover:text-coral-500">
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      )}

      {/* Budget */}
      {parsed.budget && (parsed.budget.min || parsed.budget.max) && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm">
          <span>
            Budget:{" "}
            {parsed.budget.min && parsed.budget.max
              ? `₹${parsed.budget.min.toLocaleString()} - ₹${parsed.budget.max.toLocaleString()}`
              : parsed.budget.max
              ? `≤ ₹${parsed.budget.max.toLocaleString()}`
              : `≥ ₹${parsed.budget.min?.toLocaleString()}`}
          </span>
          {onClearFilter && (
            <button onClick={() => onClearFilter("budget")} className="hover:text-coral-500">
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      )}

      {/* Room Type */}
      {parsed.roomType && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm">
          <Home className="h-3 w-3 text-amber-500" />
          <span>{parsed.roomType.replace("_", " ").toUpperCase()}</span>
          {onClearFilter && (
            <button onClick={() => onClearFilter("roomType")} className="hover:text-coral-500">
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      )}

      {/* Clear All */}
      {onClearAll && (
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-coral-600 hover:underline ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
