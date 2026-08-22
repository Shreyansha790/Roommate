"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  MapPin,
  IndianRupee,
  Home,
  Moon,
  Sun,
  Laptop,
  Utensils,
  Dog,
  Cigarette,
  CigaretteOff,
  Wifi,
  Wind,
  Dumbbell,
  Sparkles,
  X
} from "lucide-react";

export interface FilterChipProps {
  label: string;
  category?: "geo" | "budget" | "room" | "lifestyle" | "amenity" | "default";
  iconName?: string;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

const CATEGORY_STYLES = {
  geo: "border-cyan/50 bg-cyan/10 text-cyan-300 hover:border-cyan hover:shadow-glow-cyan",
  budget: "border-solar/50 bg-solar/10 text-amber-300 hover:border-solar hover:shadow-glow-solar",
  room: "border-sky-500/50 bg-sky-500/10 text-sky-300 hover:border-sky-400",
  lifestyle: "border-phosphor/50 bg-phosphor/10 text-phosphor hover:border-phosphor hover:shadow-glow-phosphor",
  amenity: "border-violet/50 bg-violet/10 text-violet-300 hover:border-violet hover:shadow-glow-violet",
  default: "border-tungsten-border bg-tungsten-card text-slate-300 hover:border-slate-400"
};

export function VectorFilterChips({
  label,
  category = "default",
  active = true,
  onRemove,
  onClick,
  className
}: FilterChipProps) {
  const getIcon = () => {
    const l = label.toLowerCase();
    if (
      category === "geo" ||
      l.includes("bangalore") ||
      l.includes("mumbai") ||
      l.includes("delhi") ||
      l.includes("hyderabad") ||
      l.includes("pune") ||
      l.includes("nagar") ||
      l.includes("city") ||
      l.includes("metro") ||
      l.includes("locality")
    ) {
      return <MapPin className="h-3 w-3 shrink-0" />;
    }
    if (
      category === "budget" ||
      l.includes("₹") ||
      l.includes("k") ||
      l.includes("budget") ||
      l.includes("rent")
    ) {
      return <IndianRupee className="h-3 w-3 shrink-0" />;
    }
    if (
      category === "room" ||
      l.includes("single") ||
      l.includes("shared") ||
      l.includes("flat") ||
      l.includes("type")
    ) {
      return <Home className="h-3 w-3 shrink-0" />;
    }
    if (l.includes("night") || l.includes("owl")) return <Moon className="h-3 w-3 shrink-0" />;
    if (l.includes("early") || l.includes("bird")) return <Sun className="h-3 w-3 shrink-0" />;
    if (l.includes("wfh") || l.includes("remote") || l.includes("work")) return <Laptop className="h-3 w-3 shrink-0" />;
    if (l.includes("veg") || l.includes("diet") || l.includes("food")) return <Utensils className="h-3 w-3 shrink-0" />;
    if (l.includes("pet") || l.includes("dog") || l.includes("cat")) return <Dog className="h-3 w-3 shrink-0" />;
    if (l.includes("non-smoker") || l.includes("no smoking")) return <CigaretteOff className="h-3 w-3 shrink-0" />;
    if (l.includes("smoker")) return <Cigarette className="h-3 w-3 shrink-0" />;
    if (l.includes("wifi") || l.includes("internet")) return <Wifi className="h-3 w-3 shrink-0" />;
    if (l.includes("ac") || l.includes("air")) return <Wind className="h-3 w-3 shrink-0" />;
    if (l.includes("gym") || l.includes("fitness")) return <Dumbbell className="h-3 w-3 shrink-0" />;
    return <Sparkles className="h-3 w-3 shrink-0" />;
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-mono font-bold uppercase transition-all duration-150 select-none",
        active ? (CATEGORY_STYLES[category] || CATEGORY_STYLES.default) : "opacity-50 border-tungsten-border bg-tungsten text-slate-500",
        onClick && "cursor-pointer hover:scale-105 active:scale-95",
        className
      )}
    >
      {getIcon()}
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-1 rounded p-0.5 hover:bg-white/20 transition focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
