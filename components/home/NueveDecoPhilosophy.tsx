"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Card3D } from "@/components/motion/Card3D";

export function NueveDecoPhilosophy() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans">
      <div className="rounded-3xl border border-[#eae6de] bg-[#fcfbf9] p-8 sm:p-14 space-y-12 shadow-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-coral-500 uppercase tracking-widest block">
              architectural aesthetic.
            </span>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-stone-950 leading-none">
              deco<span className="text-coral-500">.</span>
            </h2>

            <p className="text-base text-stone-700 leading-relaxed">
              Our curated selection of co-living residences, designed with an emphasis on comfort,
              spatial balance, and natural illumination, offers you a tranquil environment to live, work,
              and recharge.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Whether you prefer the expansive volumes of the <strong className="text-stone-950">Classic</strong> master ensuite,
              the compact elegance of the <strong className="text-stone-950">Mini</strong> shared studio, or the total peace
              of the <strong className="text-stone-950">Village</strong> loft sanctuary, every space guarantees zero broker interference
              and verified flatmate chemistry.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/onboarding"
                className="neo-button px-6 py-3 text-xs font-bold shadow-luxury-coral inline-flex items-center gap-2"
              >
                <span>calibrate your vibe DNA.</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Photographic Composition */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <Card3D depth={8} glareOpacity={0.15} className="block">
              <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden bg-stone-100 border border-[#eae6de] shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
                  alt="Deco Architectural Detail 1"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </Card3D>

            <Card3D depth={8} glareOpacity={0.15} className="block translate-y-6">
              <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden bg-stone-100 border border-[#eae6de] shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
                  alt="Deco Architectural Detail 2"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </Card3D>
          </div>
        </div>
      </div>
    </section>
  );
}
