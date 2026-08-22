"use client";

import { Sparkles } from "lucide-react";

export function CompatibilityBadge({ score = 92 }: { score?: number }) {
  const isHigh = score >= 85;
  const isMedium = score >= 70;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
        isHigh
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : isMedium
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-stone-100 text-stone-700 border border-stone-200"
      }`}
    >
      <Sparkles className="h-3 w-3" />
      <span>{score}% Match</span>
    </div>
  );
}
