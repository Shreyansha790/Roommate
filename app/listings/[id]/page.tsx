import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { Gallery } from "./gallery";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/supabase";
import {
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Mail,
  Phone,
  MessageCircle,
  Share2,
  ArrowLeft,
  Tv,
  Wifi,
  Waves,
  Car,
  Utensils,
  Dumbbell,
  Clock,
  Flame,
  Terminal,
  Activity
} from "lucide-react";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const isDemo = !hasSupabaseEnv();
  const supabase = await createClient();
  const { data: auth } = isDemo ? { data: { user: null } } : await supabase.auth.getUser();

  let listing: any = null;

  if (!isDemo) {
    const { data } = await supabase
      .from("listings")
      .select("id,title,description,locality,city,rent,deposit,room_type,available_from,photos,amenities,tags,user_id,profiles!listings_user_id_fkey(id,full_name,avatar_url,bio,is_verified,phone,email,profession)")
      .eq("id", params.id)
      .maybeSingle();

    listing = data;
  }

  if (!listing) {
    listing = DEMO_LISTINGS.find((l) => l.id === params.id) || DEMO_LISTINGS[0];
  }

  if (!listing) {
    notFound();
  }

  const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
  const compatibilityScore = 92;

  const lifestyle = listing.lifestyle || {
    sleepSchedule: "11:30 PM – 7:30 AM",
    cleanliness: 9,
    foodHabit: "Vegetarian / Flexitarian",
    smoking: "Strictly No",
    workSchedule: "Hybrid (2 Days WFH)"
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      <div className="flex items-center justify-between font-mono text-xs">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#ccff00] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>[ RETURN_TO_DIRECTORY ]</span>
        </Link>
        <span className="sticker-pill border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px]">
          LISTING_ID: {listing.id.slice(0, 8)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Gallery photos={listing.photos || []} title={listing.title} />

          <div className="bento-card p-6 border-1.5 border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="sticker-pill border-black bg-white text-black font-mono text-xs">
                  {listing.room_type?.replace("_", " ").toUpperCase()}
                </span>
                <span className="sticker-pill border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00] font-mono text-xs">
                  DIRECT_HOST
                </span>
              </div>
              <CompatibilityBadge score={compatibilityScore} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                {listing.title}
              </h1>
              <p className="mt-1 flex items-center gap-1 font-mono text-xs text-zinc-400">
                <MapPin className="h-4 w-4 text-[#ccff00] shrink-0" />
                <span>{listing.locality}, {listing.city}</span>
              </p>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <h3 className="font-mono text-xs font-bold uppercase text-[#ccff00] mb-2">[ SPACE_SYNOPSIS ]</h3>
              <p className="font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {listing.description || "Designer apartment featuring premium furnishings, high-speed fiber internet, modular kitchen, and natural lighting throughout the day."}
              </p>
            </div>
          </div>

          <div className="bento-card p-6 border-1.5 border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#ccff00]" />
                <h3 className="font-mono text-xs font-black uppercase text-white">LIFESTYLE_FREQUENCY_MATRIX</h3>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">[MULTI_VECTOR_HARMONY]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">SLEEP_RHYTHM</span>
                <p className="font-bold text-zinc-200">{lifestyle.sleepSchedule}</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">CLEANLINESS_INDEX</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#ccff00]">{lifestyle.cleanliness} / 10</span>
                  <div className="h-2 w-24 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-[#ccff00]"
                      style={{ width: String(lifestyle.cleanliness * 10) + '%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">FOOD_FREQUENCY</span>
                <p className="font-bold text-zinc-200">{lifestyle.foodHabit}</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">WORK_SCHEDULE</span>
                <p className="font-bold text-zinc-200">{lifestyle.workSchedule}</p>
              </div>
            </div>
          </div>

          <div className="bento-card p-6 border-1.5 border-zinc-800 space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase text-[#ccff00]">[ INCLUDED_FACILITIES ]</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              {(listing.amenities || ["Wifi", "Air Conditioning", "Washing Machine", "Power Backup", "Cook / Maid", "Gym Access"]).map((amenity: string) => (
                <div key={amenity} className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#09090b] p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#ccff00] shrink-0" />
                  <span className="truncate text-zinc-200">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="bento-card p-6 border-1.5 border-zinc-800 space-y-5">
              <div className="border-b border-zinc-800 pb-4">
                <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">MONTHLY_RENT</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-black text-[#ccff00]">₹{Number(listing.rent).toLocaleString()}</span>
                  <span className="font-mono text-xs text-zinc-400">/ MONTH</span>
                </div>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>SECURITY_DEPOSIT</span>
                  <span className="font-bold text-white">₹{Number(listing.deposit || listing.rent * 2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>AVAILABLE_FROM</span>
                  <span className="font-bold text-white">{listing.available_from || "IMMEDIATE"}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>BROKERAGE_FEE</span>
                  <span className="font-bold text-[#ccff00]">₹0 (100%_DIRECT)</span>
                </div>
              </div>

              <div className="pt-2">
                <button className="neo-button w-full py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>INITIATE_DIRECT_CHAT</span>
                </button>
              </div>
            </div>

            {profile && (
              <div className="bento-card p-6 border-1.5 border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-xl object-cover border-1.5 border-zinc-700"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ccff00] font-mono text-sm font-black text-black">
                      {profile.full_name?.[0] || "H"}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate font-mono text-sm font-bold text-white">{profile.full_name}</p>
                      {profile.is_verified && (
                        <ShieldCheck className="h-4 w-4 text-[#ccff00] shrink-0" />
                      )}
                    </div>
                    <p className="truncate font-mono text-xs text-zinc-400">{profile.profession || "VERIFIED_RESIDENT"}</p>
                  </div>
                </div>

                {profile.bio && (
                  <p className="font-mono text-xs text-zinc-400 border-t border-zinc-800 pt-3 leading-relaxed">
                    &ldquo;{profile.bio}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
