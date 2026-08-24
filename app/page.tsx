import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { Card3D } from "@/components/motion/Card3D";
import { HeroArchitectural } from "@/components/home/HeroArchitectural";
import { AnimatedStats } from "@/components/home/AnimatedStats";
import { NeighborhoodEditorialGrid } from "@/components/home/NeighborhoodEditorialGrid";
import { HarmonyProtocolSection } from "@/components/home/HarmonyProtocolSection";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
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
    <div className="space-y-20 pb-24 font-sans text-stone-800 overflow-x-hidden">
      {/* Architectural Split Hero with Live Vibe Simulator */}
      <HeroArchitectural />

      {/* Live Animated Statistics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedStats />
      </section>

      {/* Curated Neighborhood Chemistry Grid */}
      <NeighborhoodEditorialGrid />

      {/* The 3-Step Harmony Protocol with Vibe Onboarding */}
      <div className="space-y-4">
        <HarmonyProtocolSection />
        <div className="text-center">
          <Link
            href="/onboarding"
            className="text-xs font-bold text-coral-600 hover:underline"
          >
            Take 60-Second Vibe DNA Questionnaire →
          </Link>
        </div>
      </div>

      {/* Featured Verified Spaces */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Curated Verified Homes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
              Trending Spaces This Week
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-xs font-bold text-coral-600 hover:text-coral-700 inline-flex items-center gap-1.5 transition"
          >
            <span>Explore all {listings.length}+ spaces</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(0, 6).map((listing: any, idx: number) => {
            const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
            const photo = listing.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";

            return (
              <Card3D key={listing.id} depth={10} glareOpacity={0.15} className="block">
                <div className="luxury-card group overflow-hidden p-0 flex flex-col justify-between h-full bg-white">
                  <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={photo}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-white/90 backdrop-blur-md text-stone-900 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                        {listing.room_type?.replace("_", " ").toUpperCase() || "ROOM"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <CompatibilityBadge score={idx === 0 ? 94 : idx === 1 ? 88 : 82} />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 shadow-sm border border-stone-200">
                        <span className="font-extrabold text-base text-stone-900">₹{Number(listing.rent).toLocaleString()}</span>
                        <span className="text-xs text-stone-500 font-medium">/month</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5">
                    <div>
                      <Link href={`/listings/${listing.id}`} className="hover:text-coral-600 transition">
                        <h3 className="line-clamp-1 text-base font-bold text-stone-900">
                          {listing.title}
                        </h3>
                      </Link>
                      <p className="mt-1 flex items-center gap-1 text-xs text-stone-500 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-coral-500 shrink-0" />
                        <span>{listing.locality}, {listing.city}</span>
                      </p>
                    </div>

                    {profile && (
                      <div className="flex items-center gap-3 rounded-xl border border-stone-100 bg-[#faf9f6] p-2.5">
                        {profile.avatar_url ? (
                          <Image
                            src={profile.avatar_url}
                            alt={profile.full_name || "Host"}
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-full object-cover border border-stone-200"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-coral-100 text-xs font-bold text-coral-600">
                            {profile.full_name?.[0] || "H"}
                          </div>
                        )}
                        <div className="overflow-hidden flex-1">
                          <p className="truncate text-xs font-bold text-stone-800">{profile.full_name}</p>
                          <p className="truncate text-[11px] text-stone-500">{profile.profession || "Verified Resident"}</p>
                        </div>
                        {profile.is_verified && (
                          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>Move in: {listing.available_from || "Immediate"}</span>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="font-bold text-coral-600 hover:text-coral-700 inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>
      </section>
    </div>
  );
}
