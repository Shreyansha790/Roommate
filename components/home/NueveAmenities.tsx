"use client";

import { Wifi, Wind, Flame, Utensils, Tv, Sun, Waves, Sparkles, ShieldCheck } from "lucide-react";

export function NueveAmenities() {
  const amenities = [
    { name: "High-Speed Fiber Internet", desc: "Dedicated dual-band 300 Mbps fiber connection for remote focus", icon: Wifi },
    { name: "Climate Control & Air Conditioning", desc: "Inverter ACs in all private rooms and common living areas", icon: Wind },
    { name: "Modular Chef's Kitchen", desc: "Fully equipped with microwave, refrigerator, chimney, and water purifier", icon: Utensils },
    { name: "Private Balcony & Natural Sunlight", desc: "Tree-canopy outdoor views and natural cross-ventilation", icon: Sun },
    { name: "Housekeeping & In-Unit Laundry", desc: "Automatic washing machine, dryer setup, and scheduled deep cleaning", icon: Sparkles },
    { name: "100% Zero Brokerage Guarantee", desc: "Direct communication with verified hosts and flatmates", icon: ShieldCheck }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eae6de] pb-6">
        <div>
          <span className="text-xs font-bold text-coral-500 uppercase tracking-widest block mb-1">
            distinct living comforts.
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-950">
            amenities<span className="text-coral-500">.</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-500 max-w-md">
          Every residence is furnished with essential comforts to ensure an effortless transition into your new home.
        </p>
      </div>

      {/* Tabular Hairline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[#eae6de] bg-white rounded-3xl overflow-hidden shadow-luxury">
        {amenities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="p-6 sm:p-8 border-r border-b border-[#eae6de] hover:bg-[#faf9f6] transition group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-950 group-hover:bg-coral-50 group-hover:text-coral-600 transition">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs font-bold text-stone-300">
                  0{idx + 1}.
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-stone-950 tracking-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
