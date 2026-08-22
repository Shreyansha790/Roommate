"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { playBlip } from "@/lib/audio-telemetry";

export type TacticalBadgeVariant =
  | "emerald"
  | "amber"
  | "cyan"
  | "violet"
  | "crimson"
  | "steel"
  | "outline";

export type TacticalBadgeSize = "xs" | "sm" | "md";

export interface TacticalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TacticalBadgeVariant;
  size?: TacticalBadgeSize;
  pulse?: boolean;
  icon?: React.ReactNode;
  brackets?: boolean;
  soundEffect?: boolean;
}

const variantStyles: Record<TacticalBadgeVariant, { container: string; dot: string; glow: string }> = {
  emerald: {
    container: "border-emerald-500/40 bg-emerald-950/30 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-950/50",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(0,255,136,0.8)]",
    glow: "glow-text-emerald"
  },
  cyan: {
    container: "border-cyan-500/40 bg-cyan-950/30 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-950/50",
    dot: "bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.8)]",
    glow: "glow-text-cyan"
  },
  amber: {
    container: "border-amber-500/40 bg-amber-950/30 text-amber-400 hover:border-amber-400 hover:bg-amber-950/50",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(255,183,0,0.8)]",
    glow: "glow-text-amber"
  },
  violet: {
    container: "border-violet-500/40 bg-violet-950/30 text-violet-400 hover:border-violet-400 hover:bg-violet-950/50",
    dot: "bg-violet-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
    glow: "glow-text-violet"
  },
  crimson: {
    container: "border-rose-500/40 bg-rose-950/30 text-rose-400 hover:border-rose-400 hover:bg-rose-950/50",
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(255,0,85,0.8)]",
    glow: "glow-text-crimson"
  },
  steel: {
    container: "border-slate-700/60 bg-slate-900/40 text-slate-400 hover:border-slate-500 hover:text-slate-200",
    dot: "bg-slate-400",
    glow: ""
  },
  outline: {
    container: "border-tungsten-border bg-transparent text-slate-300 hover:border-slate-500 hover:text-white",
    dot: "bg-slate-400",
    glow: ""
  }
};

const sizeStyles: Record<TacticalBadgeSize, string> = {
  xs: "text-[10px] px-1.5 py-0.5 tracking-wider gap-1",
  sm: "text-xs px-2.5 py-1 tracking-wide gap-1.5",
  md: "text-sm px-3 py-1.5 tracking-wide gap-2"
};

export function TacticalBadge({
  children,
  variant = "emerald",
  size = "sm",
  pulse = false,
  icon,
  brackets = true,
  soundEffect = false,
  className,
  onMouseEnter,
  onClick,
  ...props
}: TacticalBadgeProps) {
  const currentVariant = variantStyles[variant] || variantStyles.emerald;
  const currentSize = sizeStyles[size] || sizeStyles.sm;

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (soundEffect || onClick) {
      playBlip(980, 0.02);
    }
    onMouseEnter?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (soundEffect || onClick) {
      playBlip(1200, 0.03);
    }
    onClick?.(e);
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono font-bold uppercase transition-all duration-150 select-none border chamfer-card-sm",
        currentVariant.container,
        currentSize,
        onClick ? "cursor-pointer active:scale-95" : "",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", currentVariant.dot)} />
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", currentVariant.dot)} />
        </span>
      )}
      {icon && <span className="inline-flex items-center shrink-0">{icon}</span>}
      <span className="truncate">
        {brackets ? `[ ${children} ]` : children}
      </span>
    </span>
  );
}
