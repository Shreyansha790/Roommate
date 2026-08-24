"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, MapPin } from "lucide-react";
import { Card3D } from "@/components/motion/Card3D";

export function NueveResidences() {
  const collections = [
    {
      id: "classic",
      code: "CLASSIC.",
      subtitle: "The Master Ensuite Sanctuary",
      city: "Bangalore • Indiranagar",
      desc: "Designed with generous volumes, high ceilings, private tree-canopy balcony, and dedicated focus workspace.",
      rent: "₹26,000",
      type: "Private Room",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      match: 96
    },
    {
      id: "mini",
      code: "MINI.",
      subtitle: "Compact Luxury & Shared Co-Living",
      city: "Mumbai • Bandra West",
      desc: "High-efficiency studio flatmate setup with bespoke modular storage, sunlit common areas, and modern amenities.",
      rent: "₹19,000",
      type: "Shared Room",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      match: 92
    },
    {
      id: "village",
      code: "VILLAGE.",
      subtitle: "Standalone Architectural Sanctuary",
      city: "Delhi NCR • Hauz Khas",
      desc: "Full apartment tranquility surrounded by greenery, quiet residential lanes, and effortless connectivity to tech corridors.",
      rent: "₹38,000",
      type: "Full Apartment",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      match: 94
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eae6de] pb-6">
        <div>
          <span className="text-xs font-bold text-coral-500 uppercase tracking-widest block mb-1">
            distinctive collections.
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-950">
            residences<span className="text-coral-500">.</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-500 max-w-md">
          Three carefully curated living tiers, engineered for comfort, style, and mutual flatmate harmony.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((item) => (
          <Card3D key={item.code} depth={10} glareOpacity={0.2} className="block">
            <div className="luxury-card group overflow-hidden p-0 block bg-white h-full flex flex-col justify-between border border-[#eae6de]">
              {/* Photo Frame */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
                <Image
                  src={item.image}
                  alt={item.code}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-md text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                    {item.code}
                  </span>
                </div>

                {/* Match Pill */}
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-500/90 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> {item.match}%
                  </span>
                </div>

                {/* Bottom City */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-coral-500" /> {item.city}
                  </span>
                  <span className="font-extrabold text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    {item.rent}<span className="text-[10px] text-stone-200">/mo</span>
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-stone-950 tracking-tight">
                    {item.subtitle}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#eae6de] flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">
                    {item.type} • 0 Brokerage
                  </span>
                  <Link
                    href={`/browse?type=${item.id === "classic" ? "single" : item.id === "mini" ? "shared" : "entire_flat"}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-stone-950 hover:text-coral-500 transition group-hover:translate-x-0.5"
                  >
                    <span>explore {item.code.toLowerCase()}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Card3D>
        ))}
      </div>
    </section>
  );
}
