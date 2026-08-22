"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { playBlip } from "@/lib/audio-telemetry";

export type CircularGaugeVariant = "emerald" | "cyan" | "amber" | "violet" | "crimson";

export interface CircularGaugeProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  variant?: CircularGaugeVariant;
  autoVariant?: boolean;
  showTicks?: boolean;
  tickCount?: number;
  showValue?: boolean;
  unit?: string;
  className?: string;
  interactive?: boolean;
}

const variantColorMap: Record<
  CircularGaugeVariant,
  { stroke: string; glow: string; text: string; bgStroke: string }
> = {
  emerald: {
    stroke: "#00ff88",
    glow: "rgba(0, 255, 136, 0.5)",
    text: "text-emerald-400 glow-text-emerald",
    bgStroke: "rgba(0, 255, 136, 0.12)"
  },
  cyan: {
    stroke: "#00e5ff",
    glow: "rgba(0, 229, 255, 0.5)",
    text: "text-cyan-400 glow-text-cyan",
    bgStroke: "rgba(0, 229, 255, 0.12)"
  },
  amber: {
    stroke: "#ffb700",
    glow: "rgba(255, 183, 0, 0.5)",
    text: "text-amber-400 glow-text-amber",
    bgStroke: "rgba(255, 183, 0, 0.12)"
  },
  violet: {
    stroke: "#a855f7",
    glow: "rgba(168, 85, 247, 0.5)",
    text: "text-violet-400 glow-text-violet",
    bgStroke: "rgba(168, 85, 247, 0.12)"
  },
  crimson: {
    stroke: "#ff0055",
    glow: "rgba(255, 0, 85, 0.5)",
    text: "text-rose-400 glow-text-crimson",
    bgStroke: "rgba(255, 0, 85, 0.12)"
  }
};

export function CircularGauge({
  value,
  maxValue = 100,
  size = 140,
  strokeWidth = 8,
  label,
  sublabel,
  variant,
  autoVariant = true,
  showTicks = true,
  tickCount = 28,
  showValue = true,
  unit = "%",
  className,
  interactive = true
}: CircularGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  // Determine variant automatically if not explicitly provided
  const resolvedVariant: CircularGaugeVariant = React.useMemo(() => {
    if (variant) return variant;
    if (!autoVariant) return "emerald";
    if (percentage >= 80) return "emerald";
    if (percentage >= 60) return "cyan";
    if (percentage >= 40) return "amber";
    return "crimson";
  }, [variant, autoVariant, percentage]);

  const colors = variantColorMap[resolvedVariant];

  const center = size / 2;
  const radius = center - strokeWidth - (showTicks ? 14 : 4);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Generate 28 tick marks around the perimeter
  const ticks = React.useMemo(() => {
    if (!showTicks) return [];
    const items: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      isActive: boolean;
      angle: number;
    }> = [];

    const tickRadiusOuter = center - 2;
    const tickRadiusInner = tickRadiusOuter - 6;

    for (let i = 0; i < tickCount; i++) {
      // Start ticks from top (-90 degrees)
      const angleDeg = (i / tickCount) * 360 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;

      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);

      const fraction = i / tickCount;
      const isActive = fraction <= percentage / 100;

      items.push({
        x1: center + tickRadiusInner * cos,
        y1: center + tickRadiusInner * sin,
        x2: center + tickRadiusOuter * cos,
        y2: center + tickRadiusOuter * sin,
        isActive,
        angle: angleDeg
      });
    }
    return items;
  }, [showTicks, tickCount, center, percentage]);

  const handleMouseEnter = () => {
    if (interactive) {
      playBlip(1040, 0.02);
    }
  };

  const filterId = React.useId();

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-3 font-mono transition-transform duration-200",
        interactive && "hover:scale-[1.02]",
        className
      )}
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Perimeter Ticks */}
          {ticks.map((t, idx) => (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.isActive ? colors.stroke : "#1f2b3e"}
              strokeWidth={t.isActive ? 2 : 1}
              strokeLinecap="round"
              opacity={t.isActive ? 0.9 : 0.4}
              filter={t.isActive ? `url(#glow-${filterId})` : undefined}
            />
          ))}

          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.bgStroke}
            strokeWidth={strokeWidth}
          />

          {/* Progress Arc Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            filter={`url(#glow-${filterId})`}
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          />

          {/* Cardinal Crosshair Indicators at 12, 3, 6, 9 o'clock */}
          <circle cx={center} cy={center - radius} r={1.5} fill="#ffffff" opacity={0.6} />
          <circle cx={center + radius} cy={center} r={1.5} fill="#ffffff" opacity={0.6} />
          <circle cx={center} cy={center + radius} r={1.5} fill="#ffffff" opacity={0.6} />
          <circle cx={center - radius} cy={center} r={1.5} fill="#ffffff" opacity={0.6} />
        </svg>

        {/* Center Monospace Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          {showValue && (
            <div className="flex items-baseline justify-center">
              <span className={cn("text-2xl font-black tracking-tight", colors.text)}>
                {Math.round(value)}
              </span>
              {unit && (
                <span className="text-[11px] font-bold text-slate-400 ml-0.5">{unit}</span>
              )}
            </div>
          )}
          {label && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 max-w-[85px] truncate">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[8px] font-mono text-slate-500 max-w-[80px] truncate mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
