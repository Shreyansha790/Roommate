"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TacticalBadge } from "./TacticalBadge";
import { playBlip } from "@/lib/audio-telemetry";
import { Activity, Clock, Zap } from "lucide-react";

export type Chronotype = "early_bird" | "night_owl" | "flexible";

export interface WaveformOscilloscopeProps {
  seekerChronotype?: Chronotype;
  hostChronotype?: Chronotype;
  synchronicityScore?: number;
  seekerLabel?: string;
  hostLabel?: string;
  height?: number;
  interactive?: boolean;
  className?: string;
}

const CHRONO_PHASE_OFFSET: Record<Chronotype, number> = {
  early_bird: 0, // Peak around 08:00
  flexible: Math.PI * 0.35, // Peak around 14:00
  night_owl: Math.PI * 0.85 // Peak around 22:00
};

export function WaveformOscilloscope({
  seekerChronotype = "early_bird",
  hostChronotype = "night_owl",
  synchronicityScore = 78,
  seekerLabel = "SEEKER_CYCLE",
  hostLabel = "HOST_CYCLE",
  height = 180,
  interactive = true,
  className
}: WaveformOscilloscopeProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const animFrameId = React.useRef<number | null>(null);
  const timeOffsetRef = React.useRef<number>(0);
  const [isRunning, setIsRunning] = React.useState<boolean>(true);

  // Compute phase offset delta for telemetry readout
  const phaseDeltaHours = React.useMemo(() => {
    const p1 = CHRONO_PHASE_OFFSET[seekerChronotype];
    const p2 = CHRONO_PHASE_OFFSET[hostChronotype];
    const diffRad = Math.abs(p1 - p2);
    // 2*PI rad = 24 hours
    const hours = (diffRad / (2 * Math.PI)) * 24;
    return hours.toFixed(1);
  }, [seekerChronotype, hostChronotype]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    canvas.height = height;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement.clientWidth;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;
      const centerY = displayHeight / 2;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // 1. Draw Reticle Grid
      ctx.strokeStyle = "rgba(31, 43, 62, 0.45)";
      ctx.lineWidth = 1;

      // Horizontal baseline and amplitude limits
      const gridYSteps = [0.15, 0.35, 0.5, 0.65, 0.85];
      gridYSteps.forEach((step) => {
        const y = displayHeight * step;
        ctx.beginPath();
        if (step === 0.5) {
          ctx.strokeStyle = "rgba(0, 229, 255, 0.25)";
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = "rgba(31, 43, 62, 0.35)";
          ctx.setLineDash([2, 4]);
        }
        ctx.moveTo(0, y);
        ctx.lineTo(displayWidth, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Vertical time grid lines (00:00, 06:00, 12:00, 18:00, 24:00)
      const timeLabels = ["00:00", "06:00", "12:00", "18:00", "24:00"];
      const timeSteps = timeLabels.length - 1;

      ctx.font = "9px ui-monospace, SFMono-Regular, monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.textAlign = "center";

      for (let i = 0; i <= timeSteps; i++) {
        const x = (displayWidth / timeSteps) * i;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(31, 43, 62, 0.4)";
        ctx.setLineDash([2, 4]);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, displayHeight);
        ctx.stroke();

        ctx.fillText(timeLabels[i], Math.max(16, Math.min(displayWidth - 16, x)), displayHeight - 6);
      }
      ctx.setLineDash([]);

      // Advance animation offset if running
      if (isRunning) {
        timeOffsetRef.current += 0.025;
      }
      const t = timeOffsetRef.current;

      const seekerPhase = CHRONO_PHASE_OFFSET[seekerChronotype];
      const hostPhase = CHRONO_PHASE_OFFSET[hostChronotype];

      const amplitude = displayHeight * 0.32;
      const waveFreq = (Math.PI * 2) / (displayWidth * 0.85);

      // 2. Draw Host Wave (Phosphor Emerald #00ff88)
      ctx.beginPath();
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(0, 255, 136, 0.55)";
      ctx.shadowBlur = 8;

      for (let x = 0; x <= displayWidth; x += 2) {
        const y = centerY + Math.sin(x * waveFreq + t + hostPhase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Draw Seeker Wave (Cyber Cyan #00e5ff)
      ctx.beginPath();
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(0, 229, 255, 0.55)";
      ctx.shadowBlur = 8;

      for (let x = 0; x <= displayWidth; x += 2) {
        const y = centerY + Math.sin(x * waveFreq + t + seekerPhase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [seekerChronotype, hostChronotype, height, isRunning]);

  const toggleAnimation = () => {
    if (interactive) {
      playBlip(isRunning ? 600 : 900, 0.02);
      setIsRunning((prev) => !prev);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-lg border border-tungsten-border bg-obsidian-sub/90 p-3 chamfer-card font-mono select-none overflow-hidden",
        interactive && "cursor-pointer",
        className
      )}
      onClick={toggleAnimation}
    >
      {/* Header Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-tungsten-border/60 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 tracking-wider">
            CIRCADIAN_SYNCHRONICITY_OSCILLOSCOPE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TacticalBadge
            variant={synchronicityScore >= 75 ? "emerald" : synchronicityScore >= 50 ? "amber" : "crimson"}
            size="xs"
            pulse
            icon={<Zap className="h-2.5 w-2.5 mr-1" />}
          >
            {`SYNC: ${synchronicityScore}%`}
          </TacticalBadge>
          <TacticalBadge variant="steel" size="xs" icon={<Clock className="h-2.5 w-2.5 mr-1" />}>
            {`Δ PHASE: ${phaseDeltaHours}H`}
          </TacticalBadge>
        </div>
      </div>

      {/* Canvas Oscilloscope */}
      <div className="relative w-full overflow-hidden" style={{ height }}>
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Legend Overlay */}
        <div className="absolute top-2 left-2 flex items-center gap-3 bg-obsidian/80 px-2 py-1 rounded border border-tungsten-border/50 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
            <span className="text-cyan-300 font-bold">{seekerLabel} ({seekerChronotype.replace("_", " ")})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-phosphor shadow-[0_0_6px_#00ff88]" />
            <span className="text-emerald-300 font-bold">{hostLabel} ({hostChronotype.replace("_", " ")})</span>
          </div>
        </div>

        {/* Live Status Ticker */}
        <div className="absolute bottom-2 right-2 text-[9px] text-slate-500 font-mono">
          {isRunning ? "[ LIVE_HARMONIC_SCAN ]" : "[ SCAN_PAUSED ]"}
        </div>
      </div>
    </div>
  );
}
