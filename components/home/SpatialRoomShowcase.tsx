"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ShieldCheck, Sun, Wifi, Coffee, Users, Heart, MapPin } from "lucide-react";

export function SpatialRoomShowcase() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 20 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-14deg", "14deg"]);

  const floatCard1X = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);
  const floatCard1Y = useTransform(mouseY, [-0.5, 0.5], [-18, 18]);

  const floatCard2X = useTransform(mouseX, [-0.5, 0.5], [20, -20]);
  const floatCard2Y = useTransform(mouseY, [-0.5, 0.5], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-5xl py-8 px-4 [perspective:1200px]"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -top-12 left-1/4 h-72 w-72 rounded-full bg-coral-400/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-12 right-1/4 h-72 w-72 rounded-full bg-amber-400/20 blur-[100px]" />

      {/* 3D Master Cockpit Card */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-3xl border border-stone-200/80 bg-white/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl"
      >
        {/* Main 3D Spatial Visual */}
        <div className="relative h-72 sm:h-[420px] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-inner">
          <Image
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=85"
            alt="3D Spatial Living Space"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          {/* Top Location Pill */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-stone-800 backdrop-blur-md shadow-md">
            <MapPin className="h-3.5 w-3.5 text-coral-500" />
            <span>Indiranagar 100ft Rd, Bangalore</span>
          </div>

          {/* Bottom Space Synopsis */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between text-white">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-coral-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                Private Master Suite
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1">Sunny Loft with Tree-Canopy Balcony</h3>
              <p className="text-xs text-stone-200">Verified Direct Host • Move in Immediately</p>
            </div>
            <div className="rounded-2xl bg-white/95 backdrop-blur-md px-4 py-2 text-stone-900 shadow-lg border border-stone-100 hidden sm:block">
              <span className="font-extrabold text-lg text-coral-600">₹26,000</span>
              <span className="text-xs text-stone-500 font-medium">/mo</span>
            </div>
          </div>
        </div>

        {/* Floating 3D Satellite Card 1: Vibe Co-Pilot */}
        <motion.div
          style={{
            x: floatCard1X,
            y: floatCard1Y,
            transformStyle: "preserve-3d",
            transform: "translateZ(50px)",
          }}
          className="absolute -top-6 -right-2 sm:-right-8 z-30 w-52 sm:w-64 rounded-2xl border border-stone-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-[11px] font-bold text-coral-600 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> VIBE HARMONY
            </span>
            <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
              96% Match
            </span>
          </div>
          <div className="pt-2 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between items-center">
              <span>Sleep Schedule</span>
              <span className="font-bold text-stone-800">Night Owl Sync</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Diet Compatibility</span>
              <span className="font-bold text-stone-800">Vegetarian Friendly</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cleanliness Level</span>
              <span className="font-bold text-emerald-600">9.5 / 10</span>
            </div>
          </div>
        </motion.div>

        {/* Floating 3D Satellite Card 2: Verified Host Dossier */}
        <motion.div
          style={{
            x: floatCard2X,
            y: floatCard2Y,
            transformStyle: "preserve-3d",
            transform: "translateZ(60px)",
          }}
          className="absolute -bottom-6 -left-2 sm:-left-8 z-30 w-52 sm:w-64 rounded-2xl border border-stone-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-stone-200 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Verified Host"
                fill
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-bold text-stone-900 text-xs flex items-center gap-1">
                Maya Roy <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              </p>
              <p className="truncate text-[11px] text-stone-500">UX Lead at Design Studio</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-stone-100 pt-2 text-[10px] text-stone-500 font-semibold">
            <span>Direct Connection</span>
            <span className="text-coral-600">100% Zero Brokerage</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
