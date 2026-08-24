"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { Card3D } from "@/components/motion/Card3D";

export function NueveHero() {
  return (
    <section className="relative pt-12 pb-20 border-b border-[#eae6de] font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Typographic Statement */}
        <div className="space-y-6 max-w-4xl">
          <p className="text-sm font-semibold tracking-widest text-stone-500 lowercase">
            there is no place like
          </p>

          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-stone-950 leading-[0.9]">
            home<span className="text-coral-500 font-black">.</span>
          </h1>

          <p className="text-base sm:text-xl text-stone-600 font-normal max-w-2xl leading-relaxed">
            Our collection of distinctive living spaces, designed with an emphasis on comfort,
            architectural style, and human chemistry, offers you a seamless co-living experience.
            Zero brokerage, 100% verified direct connections.
          </p>

          {/* Quick Residence Tier Anchors */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {[
              { label: "CLASSIC.", href: "/browse?type=single" },
              { label: "MINI.", href: "/browse?type=shared" },
              { label: "LOFT.", href: "/browse?type=entire_flat" },
              { label: "VILLAGE.", href: "/browse" }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#eae6de] hover:border-stone-900 px-4 py-2 text-xs font-bold text-stone-950 transition shadow-luxury-sm hover:-translate-y-0.5"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-stone-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Minimalist Search Console */}
        <div className="max-w-3xl">
          <form
            action="/browse"
            method="GET"
            className="rounded-2xl border border-[#eae6de] bg-white p-2.5 shadow-luxury flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2.5 px-3 py-2 flex-1 w-full border-b sm:border-b-0 sm:border-r border-stone-100">
              <MapPin className="h-4 w-4 text-coral-500 shrink-0" />
              <input
                name="city"
                placeholder="Search by city or locality (e.g. Indiranagar, Bandra)..."
                className="w-full bg-transparent text-xs font-semibold text-stone-950 placeholder-stone-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="neo-button w-full sm:w-auto px-6 py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-luxury-coral"
            >
              <Search className="h-3.5 w-3.5" />
              <span>search spaces.</span>
            </button>
          </form>
        </div>

        {/* Full-Bleed Architectural Feature Gallery Spread */}
        <Card3D depth={8} glareOpacity={0.15} className="block">
          <div className="relative h-[380px] sm:h-[520px] w-full rounded-3xl overflow-hidden bg-stone-100 border border-[#eae6de] shadow-luxury-lg">
            <Image
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=85"
              alt="Nueve Architectural Living Space"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 85vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            {/* Top Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="bg-white/90 backdrop-blur-md text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                CLASSIC. RESIDENCE
              </span>
              <span className="bg-emerald-500/90 backdrop-blur-md text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> 96% Match
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight">Indiranagar 100ft Loft</h3>
                <p className="text-xs sm:text-sm text-stone-200">
                  Tree-Canopy Balcony • High-Speed Fiber • Sunlit Work Sanctuary
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md px-4 py-2 text-stone-950 font-black text-sm shadow-md">
                  ₹26,000<span className="text-xs text-stone-500 font-medium">/mo</span>
                </div>
                <Link
                  href="/browse"
                  className="rounded-2xl bg-stone-950 hover:bg-coral-500 text-white px-5 py-2.5 text-xs font-bold transition inline-flex items-center gap-1 shadow-md"
                >
                  <span>explore details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Card3D>
      </div>
    </section>
  );
}
