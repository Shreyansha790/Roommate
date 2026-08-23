"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";
import { Card3D } from "@/components/motion/Card3D";

export function NeighborhoodEditorialGrid() {
  const curatedZones = [
    {
      city: "Bangalore",
      area: "Indiranagar & HSR",
      tag: "Tech & Artisan Cafes",
      desc: "Tree-lined boulevards, coworking hubs, microbreweries, and quiet residential lanes.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      count: "340+ Verified Rooms",
      accent: "from-coral-500/80"
    },
    {
      city: "Mumbai",
      area: "Bandra & Juhu",
      tag: "Creative Lofts & Coast",
      desc: "High-ceiling heritage apartments, sea-breeze balconies, and creative studios.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      count: "190+ Verified Rooms",
      accent: "from-amber-500/80"
    },
    {
      city: "Delhi NCR",
      area: "Hauz Khas & Gurgaon",
      tag: "Parkside Studio Sanctuaries",
      desc: "Modern condominiums with metro access, park views, and fast transit to cyber hubs.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      count: "120+ Verified Rooms",
      accent: "from-emerald-500/80"
    },
    {
      city: "Hyderabad",
      area: "Hitec City & Gachibowli",
      tag: "Modern Gated Highrises",
      desc: "Clubhouse amenities, swimming pools, tennis courts, and walkable office parks.",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
      count: "210+ Verified Rooms",
      accent: "from-indigo-500/80"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-xs font-bold text-coral-600 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" /> Curated Living Zones
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            Explore Neighborhood Chemistry
          </h2>
        </div>
        <Link
          href="/browse"
          className="text-xs font-bold text-coral-600 hover:text-coral-700 inline-flex items-center gap-1.5 transition"
        >
          <span>View all neighborhoods</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {curatedZones.map((zone) => (
          <Card3D key={zone.area} depth={10} glareOpacity={0.2} className="block">
            <Link
              href={`/browse?city=${encodeURIComponent(zone.city)}`}
              className="luxury-card group overflow-hidden p-0 block bg-white h-full flex flex-col justify-between"
            >
              <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                <Image
                  src={zone.image}
                  alt={zone.area}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md text-stone-900 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                    {zone.city}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                    {zone.tag}
                  </span>
                  <h3 className="font-black text-base mt-1 leading-snug">{zone.area}</h3>
                  <p className="text-[11px] text-stone-200">{zone.count}</p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {zone.desc}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-coral-600 group-hover:underline">
                  <span>Explore Rooms</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </Card3D>
        ))}
      </div>
    </section>
  );
}
