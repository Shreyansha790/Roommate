"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TacticalBadge } from "./TacticalBadge";
import { playPing, playBlip } from "@/lib/audio-telemetry";
import { Crosshair, Navigation, ShieldCheck, Zap } from "lucide-react";

export interface RadarNode {
  id: string;
  name: string;
  distanceKm: number;
  angleDeg: number;
  matchScore: number;
  rent?: number;
  locality?: string;
  roomType?: string;
  isHost?: boolean;
  avatarUrl?: string;
}

export interface RadarCanvasProps {
  nodes?: RadarNode[];
  maxDistanceKm?: number;
  height?: number;
  interactive?: boolean;
  onNodeSelect?: (node: RadarNode) => void;
  className?: string;
}

const DEFAULT_NODES: RadarNode[] = [
  {
    id: "node-1",
    name: "Alex M. // Indiranagar Hub",
    distanceKm: 2.1,
    angleDeg: 42,
    matchScore: 96,
    rent: 18500,
    locality: "Indiranagar, BLR",
    roomType: "Private Room",
    isHost: true
  },
  {
    id: "node-2",
    name: "Priya S. // Koramangala Loft",
    distanceKm: 3.8,
    angleDeg: 125,
    matchScore: 89,
    rent: 22000,
    locality: "Koramangala 4th Block",
    roomType: "Shared Flat",
    isHost: true
  },
  {
    id: "node-3",
    name: "Vikram R. // HSR Sector 2",
    distanceKm: 5.4,
    angleDeg: 210,
    matchScore: 82,
    rent: 16000,
    locality: "HSR Layout, BLR",
    roomType: "Private Room",
    isHost: false
  },
  {
    id: "node-4",
    name: "Ananya K. // Whitefield Tech",
    distanceKm: 7.9,
    angleDeg: 315,
    matchScore: 74,
    rent: 14500,
    locality: "Whitefield, BLR",
    roomType: "Master Bed",
    isHost: true
  },
  {
    id: "node-5",
    name: "Rohan D. // Bellandur EcoSpace",
    distanceKm: 6.2,
    angleDeg: 175,
    matchScore: 91,
    rent: 19000,
    locality: "Bellandur, BLR",
    roomType: "Private Room",
    isHost: true
  }
];

export function RadarCanvas({
  nodes = DEFAULT_NODES,
  maxDistanceKm = 10,
  height = 380,
  interactive = true,
  onNodeSelect,
  className
}: RadarCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const animFrameId = React.useRef<number | null>(null);
  const sweepAngleRef = React.useRef<number>(0);

  const [hoveredNode, setHoveredNode] = React.useState<RadarNode | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState<{ x: number; y: number } | null>(null);
  const [activeZone, setActiveZone] = React.useState<string>("METRO_CORE");
  const lastHoveredNodeId = React.useRef<string | null>(null);

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
      const centerX = displayWidth / 2;
      const centerY = displayHeight / 2;
      const maxRadius = Math.min(centerX, centerY) - 28;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // 1. Polar Background Radial Gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      bgGrad.addColorStop(0, "rgba(5, 7, 10, 0.95)");
      bgGrad.addColorStop(0.7, "rgba(9, 13, 20, 0.9)");
      bgGrad.addColorStop(1, "rgba(13, 17, 23, 0.98)");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Concentric Distance Rings
      const ringSteps = [0.25, 0.5, 0.75, 1.0];
      ctx.font = "9px ui-monospace, SFMono-Regular, monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.textAlign = "left";

      ringSteps.forEach((fraction) => {
        const r = maxRadius * fraction;
        ctx.beginPath();
        ctx.strokeStyle = fraction === 1.0 ? "rgba(0, 229, 255, 0.35)" : "rgba(31, 43, 62, 0.45)";
        ctx.lineWidth = 1;
        if (fraction < 1.0) {
          ctx.setLineDash([3, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();

        const kmLabel = `${(maxDistanceKm * fraction).toFixed(1)}KM`;
        ctx.fillText(kmLabel, centerX + 4, centerY - r + 11);
      });
      ctx.setLineDash([]);

      // 3. Cardinal & Intercardinal Bearing Spokes (8 directions)
      const bearings = [
        { angle: 0, label: "E (090°)" },
        { angle: 45, label: "SE (135°)" },
        { angle: 90, label: "S (180°)" },
        { angle: 135, label: "SW (225°)" },
        { angle: 180, label: "W (270°)" },
        { angle: 225, label: "NW (315°)" },
        { angle: 270, label: "N (000°)" },
        { angle: 315, label: "NE (045°)" }
      ];

      bearings.forEach((b) => {
        const rad = (b.angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        ctx.beginPath();
        ctx.strokeStyle = "rgba(31, 43, 62, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + maxRadius * cos, centerY + maxRadius * sin);
        ctx.stroke();

        // Cardinal Text
        if (b.angle % 90 === 0) {
          ctx.font = "9px ui-monospace, SFMono-Regular, monospace";
          ctx.fillStyle = "rgba(0, 229, 255, 0.7)";
          ctx.textAlign = "center";
          const labelDist = maxRadius + 14;
          ctx.fillText(b.label.split(" ")[0], centerX + labelDist * cos, centerY + labelDist * sin + 3);
        }
      });
      ctx.setLineDash([]);

      // 4. Rotating Sweep Beam & Trailing Alpha Wedge
      sweepAngleRef.current = (sweepAngleRef.current + 1.2) % 360;
      const sweepRad = (sweepAngleRef.current * Math.PI) / 180;

      // Trailing alpha gradient pie wedge
      const trailAngle = 50; // degrees of trail
      const trailRad = (trailAngle * Math.PI) / 180;
      const sweepGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius
      );
      sweepGradient.addColorStop(0, "rgba(0, 255, 136, 0.25)");
      sweepGradient.addColorStop(1, "rgba(0, 255, 136, 0.0)");

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepRad - trailRad, sweepRad);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sharp sweep line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + maxRadius * Math.cos(sweepRad), centerY + maxRadius * Math.sin(sweepRad));
      ctx.strokeStyle = "rgba(0, 255, 136, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#00ff88";
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.restore();

      // 5. Draw Active Nodes
      nodes.forEach((node) => {
        const clampedDist = Math.min(node.distanceKm, maxDistanceKm);
        const nodeRadius = (clampedDist / maxDistanceKm) * maxRadius;
        // Map bearing: 0 deg = North (270 on standard canvas math)
        const angleRad = ((node.angleDeg - 90) * Math.PI) / 180;
        const nodeX = centerX + nodeRadius * Math.cos(angleRad);
        const nodeY = centerY + nodeRadius * Math.sin(angleRad);

        // Check if sweep beam is currently crossing this node
        const nodeCanvasAngle = (node.angleDeg % 360);
        const angleDiff = Math.abs((sweepAngleRef.current - nodeCanvasAngle + 360) % 360);
        const isIlluminated = angleDiff < 12;

        const isSelected = hoveredNode?.id === node.id;

        // Determine node color by score
        let nodeColor = "#00ff88"; // Emerald for high
        if (node.matchScore < 75) nodeColor = "#ffb700"; // Amber for medium
        if (node.matchScore < 60) nodeColor = "#00e5ff"; // Cyan

        ctx.save();

        // Pulsing outer ring on sweep illumination or hover
        if (isIlluminated || isSelected) {
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, isSelected ? 12 : 8, 0, Math.PI * 2);
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = nodeColor;
          ctx.shadowBlur = 10;
          ctx.stroke();
        }

        // Inner solid core node
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, isSelected ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Monospace mini label
        ctx.font = "8px ui-monospace, SFMono-Regular, monospace";
        ctx.fillStyle = isSelected ? "#ffffff" : "rgba(203, 213, 225, 0.75)";
        ctx.textAlign = "center";
        ctx.fillText(`${node.matchScore}%`, nodeX, nodeY + 12);

        ctx.restore();
      });

      // 6. Center Origin Reticle Crosshair
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00e5ff";
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 229, 255, 0.6)";
      ctx.lineWidth = 1;
      ctx.moveTo(centerX - 6, centerY);
      ctx.lineTo(centerX + 6, centerY);
      ctx.moveTo(centerX, centerY - 6);
      ctx.lineTo(centerX, centerY + 6);
      ctx.stroke();

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [nodes, maxDistanceKm, height, hoveredNode]);

  // Mouse move handler for node hit testing
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const displayWidth = rect.width;
    const displayHeight = rect.height;
    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    const maxRadius = Math.min(centerX, centerY) - 28;

    let foundNode: RadarNode | null = null;

    for (const node of nodes) {
      const clampedDist = Math.min(node.distanceKm, maxDistanceKm);
      const nodeRadius = (clampedDist / maxDistanceKm) * maxRadius;
      const angleRad = ((node.angleDeg - 90) * Math.PI) / 180;
      const nodeX = centerX + nodeRadius * Math.cos(angleRad);
      const nodeY = centerY + nodeRadius * Math.sin(angleRad);

      const dist = Math.hypot(mouseX - nodeX, mouseY - nodeY);
      if (dist < 14) {
        foundNode = node;
        setTooltipPos({ x: nodeX, y: nodeY });
        break;
      }
    }

    if (foundNode) {
      if (lastHoveredNodeId.current !== foundNode.id) {
        lastHoveredNodeId.current = foundNode.id;
        playPing(1150, 0.08);
      }
      setHoveredNode(foundNode);
    } else {
      lastHoveredNodeId.current = null;
      setHoveredNode(null);
      setTooltipPos(null);
    }
  };

  const handleCanvasClick = () => {
    if (hoveredNode) {
      playBlip(1250, 0.04);
      onNodeSelect?.(hoveredNode);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-xl border border-tungsten-border bg-obsidian p-4 chamfer-card font-mono select-none overflow-hidden",
        className
      )}
    >
      {/* HUD Telemetry Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tungsten-border/60 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Crosshair className="h-4 w-4 text-phosphor animate-spin" style={{ animationDuration: "12s" }} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider text-white">
                SPATIAL_RADAR // METRO_RANGE
              </span>
              <TacticalBadge variant="emerald" size="xs" pulse>
                LIVE_SCAN
              </TacticalBadge>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              TARGET_RADIUS: {maxDistanceKm}KM • ACTIVE_TARGETS: {nodes.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TacticalBadge
            variant="cyan"
            size="xs"
            className="cursor-pointer"
            onClick={() => {
              playBlip(800, 0.02);
              setActiveZone(activeZone === "METRO_CORE" ? "OUTER_ORBIT" : "METRO_CORE");
            }}
          >
            {`ZONE: ${activeZone}`}
          </TacticalBadge>
        </div>
      </div>

      {/* Radar Canvas with Tooltip Container */}
      <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ height }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredNode(null);
            setTooltipPos(null);
            lastHoveredNodeId.current = null;
          }}
          onClick={handleCanvasClick}
        />

        {/* Tactical Hover Dossier Popover Tooltip */}
        {hoveredNode && tooltipPos && (
          <div
            className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-3"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="chamfer-card-sm border border-phosphor/60 bg-tungsten-card/95 p-2.5 shadow-glow-phosphor backdrop-blur-md min-w-[210px]">
              <div className="flex items-center justify-between border-b border-tungsten-border pb-1.5 mb-1.5">
                <span className="text-[10px] font-bold text-phosphor flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {hoveredNode.isHost ? "VERIFIED_HOST" : "VERIFIED_SEEKER"}
                </span>
                <TacticalBadge variant="emerald" size="xs">
                  {`${hoveredNode.matchScore}% MATCH`}
                </TacticalBadge>
              </div>

              <p className="text-xs font-black text-white truncate">{hoveredNode.name}</p>
              
              <div className="mt-1 space-y-0.5 text-[10px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">LOCALITY:</span>
                  <span className="font-bold">{hoveredNode.locality || "Central Zone"}</span>
                </div>
                {hoveredNode.rent && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">RENT:</span>
                    <span className="font-bold text-cyan-400">₹{hoveredNode.rent.toLocaleString()}/mo</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">DISTANCE:</span>
                  <span className="font-bold text-amber-400">{hoveredNode.distanceKm.toFixed(1)} km</span>
                </div>
              </div>

              <div className="mt-2 pt-1 border-t border-tungsten-border/50 text-[9px] text-slate-400 text-center">
                CLICK TO OPEN LIVING DOSSIER
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Radar Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-tungsten-border/60 pt-2 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-phosphor shadow-[0_0_6px_#00ff88]" />
            <span>≥80% SYNCHRONOUS</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-solar shadow-[0_0_6px_#ffb700]" />
            <span>60-79% COMPATIBLE</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_6px_#00e5ff]" />
            <span>&lt;60% MODERATE</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <Navigation className="h-3 w-3 text-cyan-400" />
          <span>POLAR_COORDINATES: AUTO_CENTERED</span>
        </div>
      </div>
    </div>
  );
}
