import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { Card3D } from "@/components/motion/Card3D";
import { NueveHero } from "@/components/home/NueveHero";
import { NueveResidences } from "@/components/home/NueveResidences";
import { NueveDecoPhilosophy } from "@/components/home/NueveDecoPhilosophy";
import { NueveAmenities } from "@/components/home/NueveAmenities";
import { NueveVibeCalibration } from "@/components/home/NueveVibeCalibration";
import { NeighborhoodEditorialGrid } from "@/components/home/NeighborhoodEditorialGrid";
import { AnimatedStats } from "@/components/home/AnimatedStats";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  let listings: any[] = DEMO_LISTINGS;

  try {
    const { data } = await supabase
      .from("listings")
      .select("id,title,locality,city,rent,deposit,room_type,available_from,photos,amenities,tags,user_id,profiles!listings_user_id_fkey(id,full_name,avatar_url,bio,is_verified,profession)")
      .limit(6);
    if (data && data.length > 0) {
      listings = data;
    }
  } catch (err) {
    listings = DEMO_LISTINGS;
  }

  return (
    <div className="space-y-24 pb-28 font-sans text-stone-900 overflow-x-hidden">
      {/* Nueve Signature Hero */}
      <NueveHero />

      {/* Residence Collections: CLASSIC, MINI, VILLAGE */}
      <NueveResidences />

      {/* Live Count-up Metrics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedStats />
      </section>

      {/* Deco Philosophy */}
      <NueveDecoPhilosophy />

      {/* Tabular Hairline Amenities Grid */}
      <NueveAmenities />

      {/* Vibe DNA Chemistry Simulator */}
      <NueveVibeCalibration />

      {/* Curated Neighborhood Experiences Grid */}
      <NeighborhoodEditorialGrid />

      {/* Trending Verified Spaces Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eae6de] pb-6">
          <div>
            <span className="text-xs font-bold text-coral-500 uppercase tracking-widest block mb-1">
              verified co-living homes.
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
              trending spaces this week<span className="text-coral-500">.</span>
            </h2>
          </div>

          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-950 hover:text-coral-500 transition"
          >
            <span>view all residences</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.slice(0, 6).map((item, index) => {
            const host = item.profiles;
            const photoUrl =
              item.photos && item.photos.length > 0
                ? item.photos[0]
                : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

            return (
              <Card3D key={item.id || index} depth={8} glareOpacity={0.15} className="block">
                <Link
                  href={`/listings/${item.id}`}
                  className="luxury-card group overflow-hidden block bg-white h-full flex flex-col justify-between border border-[#eae6de]"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                      <Image
                        src={photoUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-stone-950 shadow-sm capitalize">
                          {item.room_type ? item.room_type.replace("_", " ") : "Private Room"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <CompatibilityBadge score={90 + (index % 8)} />
                      </div>

                      {/* Price Pill on image */}
                      <div className="absolute bottom-3 left-3">
                        <span className="rounded-full bg-stone-950/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm">
                          ₹{Number(item.rent).toLocaleString("en-IN")}
                          <span className="text-[10px] text-stone-300 font-normal">/mo</span>
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                        <MapPin className="h-3.5 w-3.5 text-coral-500 shrink-0" />
                        <span>{item.locality}, {item.city}</span>
                      </div>

                      <h3 className="font-black text-stone-950 text-base line-clamp-1 group-hover:text-coral-500 transition">
                        {item.title}
                      </h3>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.tags.slice(0, 3).map((t: string) => (
                            <span
                              key={t}
                              className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Host Footer */}
                  <div className="px-5 py-3 border-t border-[#eae6de] flex items-center justify-between bg-[#fcfbf9]">
                    <div className="flex items-center gap-2">
                      <div className="relative h-7 w-7 rounded-full overflow-hidden border border-stone-200">
                        <Image
                          src={host?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                          alt={host?.full_name || "Host"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900 flex items-center gap-1">
                          {host?.full_name || "Verified Host"}
                          {host?.is_verified && (
                            <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                          )}
                        </p>
                        <p className="text-[10px] text-stone-400 truncate max-w-[120px]">
                          {host?.profession || "Member"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-stone-950 group-hover:text-coral-500 flex items-center gap-0.5">
                      View Space <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Card3D>
            );
          })}
        </div>

        {/* Onboarding Callout Link */}
        <div className="text-center pt-6">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-950 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-coral-500" />
            <span>Ready to find your match? Take the 60-Second Vibe DNA Questionnaire →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
