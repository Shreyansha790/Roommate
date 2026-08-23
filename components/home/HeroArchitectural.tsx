"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Home,
  Sun,
  Moon,
  Sliders,
  CheckCircle2,
  Coffee,
  Heart
} from "lucide-react";
import { Card3D } from "@/components/motion/Card3D";

export function HeroArchitectural() {
  // Interactive Live Vibe DNA Sliders
  const [sleepHabit, setSleepHabit] = React.useState<number>(75); // 0: Early, 100: Night Owl
  const [cleanliness, setCleanliness] = React.useState<number>(9); // 5 to 10
  const [socialBattery, setSocialBattery] = React.useState<number>(60); // 0: Quiet, 100: Social

  // Dynamic calculation for the live preview match
  const liveMatchScore = React.useMemo(() => {
    const base = 82;
    const cleanBonus = (cleanliness - 7) * 2.5;
    const sleepBonus = sleepHabit > 50 ? 5 : 2;
    const socialBonus = socialBattery > 40 ? 4 : 1;
    return Math.min(99, Math.max(78, Math.round(base + cleanBonus + sleepBonus + socialBonus)));
  }, [sleepHabit, cleanliness, socialBattery]);

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pb-24 border-b border-stone-200/60 font-sans">
      {/* Background Ambient Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[550px] w-full max-w-7xl">
        <div className="absolute top-10 left-1/4 h-80 w-80 rounded-full bg-coral-300/15 blur-[120px]" />
        <div className="absolute top-24 right-1/4 h-80 w-80 rounded-full bg-amber-300/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: High-Editorial Pitch & Search */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-coral-200/90 bg-coral-50/90 px-3.5 py-1 text-xs font-bold text-coral-700 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-coral-500 animate-pulse" />
              <span>Multi-Vector Vibe Matching • 100% Zero Brokerage</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.08]">
                Living spaces curated for{" "}
                <span className="text-coral-500 italic font-serif">human chemistry.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                Discover verified flats and match with roommates who genuinely share your sleep rhythms, cleanliness habits, and lifestyle standards.
              </p>
            </div>

            {/* Architectural Search Console */}
            <div className="pt-2">
              <form action="/browse" method="GET" className="luxury-card p-3 bg-white/95 backdrop-blur-xl border border-stone-200 shadow-luxury grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6 flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-100">
                  <MapPin className="h-4 w-4 text-coral-500 shrink-0" />
                  <input
                    name="city"
                    placeholder="City or locality (e.g. Indiranagar)"
                    className="w-full bg-transparent text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-6 flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2">
                    <Home className="h-4 w-4 text-amber-500 shrink-0" />
                    <select name="type" className="w-full bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer">
                      <option value="">Any Room</option>
                      <option value="single">Private Room</option>
                      <option value="shared">Shared Room</option>
                      <option value="entire_flat">Full Apartment</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="neo-button py-2.5 px-4 flex items-center justify-center gap-1.5 text-xs font-bold shadow-luxury-coral shrink-0"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Popular Metros */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-400">Popular:</span>
              {["Indiranagar, BLR", "Koramangala, BLR", "Bandra West, BOM", "Hauz Khas, DEL", "Hitec City, HYD"].map((loc) => (
                <Link
                  key={loc}
                  href={`/browse?q=${encodeURIComponent(loc)}`}
                  className="rounded-full bg-white border border-stone-200 hover:border-coral-300 hover:text-coral-600 px-3 py-1 text-stone-700 font-medium transition shadow-luxury-sm"
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Live Vibe DNA Calibration Canvas */}
          <div className="lg:col-span-6 space-y-4">
            <div className="luxury-card p-5 sm:p-6 bg-gradient-to-b from-white via-white to-[#faf9f6] border border-stone-200/90 shadow-luxury-lg space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral-100 text-coral-600 font-bold">
                    <Sliders className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-xs">Live Vibe DNA Simulator</h3>
                    <p className="text-[11px] text-stone-500">Slide to test instant flatmate compatibility</p>
                  </div>
                </div>
                <span className="bg-coral-50 text-coral-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-coral-200">
                  Interactive
                </span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Sleep Slider */}
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center text-[11px] font-bold text-stone-700">
                    <span className="flex items-center gap-1">
                      {sleepHabit > 50 ? <Moon className="h-3 w-3 text-indigo-500" /> : <Sun className="h-3 w-3 text-amber-500" />}
                      Sleep
                    </span>
                    <span className="text-stone-500">{sleepHabit > 50 ? "Night Owl" : "Early Bird"}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sleepHabit}
                    onChange={(e) => setSleepHabit(Number(e.target.value))}
                    className="w-full accent-coral-500 cursor-pointer h-1.5"
                  />
                </div>

                {/* Cleanliness Slider */}
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center text-[11px] font-bold text-stone-700">
                    <span>Cleanliness</span>
                    <span className="text-emerald-600 font-extrabold">{cleanliness} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    value={cleanliness}
                    onChange={(e) => setCleanliness(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5"
                  />
                </div>

                {/* Social Energy Slider */}
                <div className="rounded-xl border border-stone-200/80 bg-white p-3 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center text-[11px] font-bold text-stone-700">
                    <span>Social Battery</span>
                    <span className="text-stone-500">{socialBattery > 50 ? "Friendly" : "Quiet"}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={socialBattery}
                    onChange={(e) => setSocialBattery(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* Dynamic 3D Roommate Match Preview Card */}
              <Card3D depth={8} glareOpacity={0.2} className="block">
                <div className="relative rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-md">
                  <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                    <Image
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80"
                      alt="Matched Living Space"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-md text-stone-900 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                        PRIVATE ROOM • INDIRANAGAR
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <div className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50/95 backdrop-blur-md px-2.5 py-1 text-xs font-black text-emerald-700 shadow-sm">
                        <Sparkles className="h-3 w-3 text-emerald-500" />
                        <span>{liveMatchScore}% Match</span>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <h4 className="font-bold text-sm">Sunlit Master Suite & Tree Balcony</h4>
                        <p className="text-[11px] text-stone-200">Indiranagar 100ft Rd, Bangalore</p>
                      </div>
                      <div className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1 text-stone-900 font-extrabold text-xs shadow-sm">
                        ₹26,000<span className="text-[10px] text-stone-500 font-medium">/mo</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between bg-[#fcfbf9]">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden border border-stone-200">
                        <Image
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          alt="Host"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 text-xs flex items-center gap-1">
                          Maya Roy <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        </p>
                        <p className="text-[10px] text-stone-500">UX Lead • Verified Resident</p>
                      </div>
                    </div>

                    <Link
                      href="/browse"
                      className="neo-button px-3.5 py-1.5 text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <span>Explore Space</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </Card3D>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
