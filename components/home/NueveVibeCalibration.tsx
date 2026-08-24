"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowUpRight, Sun, Moon, Sliders } from "lucide-react";
import { Card3D } from "@/components/motion/Card3D";

export function NueveVibeCalibration() {
  const [sleepHabit, setSleepHabit] = React.useState<number>(75);
  const [cleanliness, setCleanliness] = React.useState<number>(9);
  const [socialBattery, setSocialBattery] = React.useState<number>(60);

  const liveMatchScore = React.useMemo(() => {
    const base = 82;
    const cleanBonus = (cleanliness - 7) * 2.5;
    const sleepBonus = sleepHabit > 50 ? 5 : 2;
    const socialBonus = socialBattery > 40 ? 4 : 1;
    return Math.min(99, Math.max(78, Math.round(base + cleanBonus + sleepBonus + socialBonus)));
  }, [sleepHabit, cleanliness, socialBattery]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eae6de] pb-6">
        <div>
          <span className="text-xs font-bold text-coral-500 uppercase tracking-widest block mb-1">
            human chemistry algorithm.
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-950">
            chemistry<span className="text-coral-500">.</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-500 max-w-md">
          Calibrate your circadian rhythms, cleanliness standards, and social energy to ensure mutual flatmate compatibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Sliders Card */}
        <div className="lg:col-span-7 rounded-3xl border border-[#eae6de] bg-white p-6 sm:p-10 shadow-luxury space-y-6">
          <div className="flex items-center justify-between border-b border-[#eae6de] pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-coral-500" />
              <h3 className="font-black text-stone-950 text-sm">Vibe DNA Simulator</h3>
            </div>
            <span className="bg-stone-100 text-stone-900 font-bold text-[11px] px-3 py-1 rounded-full">
              Real-Time Vector Sync
            </span>
          </div>

          <div className="space-y-5">
            {/* Sleep */}
            <div className="rounded-2xl border border-[#eae6de] bg-[#fcfbf9] p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-stone-950">
                <span className="flex items-center gap-1.5">
                  {sleepHabit > 50 ? <Moon className="h-3.5 w-3.5 text-indigo-500" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
                  Circadian Schedule
                </span>
                <span className="text-stone-500 font-semibold">{sleepHabit > 50 ? "Night Owl (1:00 AM)" : "Early Bird (10:30 PM)"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sleepHabit}
                onChange={(e) => setSleepHabit(Number(e.target.value))}
                className="w-full accent-coral-500 cursor-pointer"
              />
            </div>

            {/* Cleanliness */}
            <div className="rounded-2xl border border-[#eae6de] bg-[#fcfbf9] p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-stone-950">
                <span>Cleanliness Standard</span>
                <span className="text-emerald-600 font-extrabold">{cleanliness} / 10</span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                value={cleanliness}
                onChange={(e) => setCleanliness(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Social Battery */}
            <div className="rounded-2xl border border-[#eae6de] bg-[#fcfbf9] p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-stone-950">
                <span>Social Battery in the Flat</span>
                <span className="text-stone-500 font-semibold">{socialBattery > 50 ? "Friendly & Welcoming" : "Quiet & Private"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={socialBattery}
                onChange={(e) => setSocialBattery(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Match Card */}
        <div className="lg:col-span-5">
          <Card3D depth={10} glareOpacity={0.2} className="block">
            <div className="rounded-3xl border border-[#eae6de] bg-white overflow-hidden shadow-luxury-lg">
              <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                <Image
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80"
                  alt="Matched Residence"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-md text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                    CLASSIC. SUITE
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 rounded-full bg-emerald-500 text-white px-3 py-1 text-xs font-black shadow-md">
                    <Sparkles className="h-3 w-3" />
                    <span>{liveMatchScore}% Match</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-black text-lg">Indiranagar 100ft Loft</h4>
                  <p className="text-xs text-stone-200">Bangalore • Move in Immediately</p>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between bg-[#fcfbf9] border-t border-[#eae6de]">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 rounded-full overflow-hidden border border-stone-200">
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
                    <p className="text-[11px] text-stone-500">UX Lead • Verified Host</p>
                  </div>
                </div>

                <Link
                  href="/browse"
                  className="neo-button px-4 py-2 text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>explore space.</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Card3D>
        </div>
      </div>
    </section>
  );
}
