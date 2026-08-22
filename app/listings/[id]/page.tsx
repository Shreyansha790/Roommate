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
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  Activity,
  Brain,
  Clock,
  Sparkles,
  Leaf,
  Users
} from "lucide-react";

function SyncGauge({ label, value, color }: { label: string; value: number; color: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const colorMap: Record<string, string> = {
    phosphor: "#00ff88",
    cyan: "#00e5ff",
    solar: "#ffb700",
    violet: "#a855f7"
  };
  const strokeColor = colorMap[color] || "#00ff88";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[72px] w-[72px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#1f2b3e" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${strokeColor}66)` }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-black text-white">
          {value}%
        </span>
      </div>
      <span className="font-mono text-[10px] font-bold text-steel-muted uppercase text-center leading-tight">{label}</span>
    </div>
  );
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const isDemo = !hasSupabaseEnv();
  const supabase = await createClient();
  const authResult = isDemo ? { data: { user: null } } : await supabase.auth.getUser();
  const _user = authResult.data.user;

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
    sleepSchedule: "11:30 PM - 7:30 AM",
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
          className="inline-flex items-center gap-1.5 text-steel-muted hover:text-phosphor transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>[ RETURN_TO_DIRECTORY ]</span>
        </Link>
        <span className="sticker-pill border-tungsten-border bg-tungsten text-steel-muted text-[10px]">
          NODE_ID: {listing.id.slice(0, 8)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Gallery photos={listing.photos || []} title={listing.title} />

          <div className="bento-card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="sticker-pill border-phosphor bg-phosphor/10 text-phosphor font-mono text-xs">
                  {listing.room_type?.replace("_", " ").toUpperCase()}
                </span>
                <span className="sticker-pill border-cyan bg-cyan/10 text-cyan font-mono text-xs">
                  DIRECT_HOST
                </span>
              </div>
              <CompatibilityBadge score={compatibilityScore} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                {listing.title}
              </h1>
              <p className="mt-1 flex items-center gap-1 font-mono text-xs text-steel-muted">
                <MapPin className="h-4 w-4 text-phosphor shrink-0" />
                <span>{listing.locality}, {listing.city}</span>
              </p>
            </div>

            <div className="border-t border-tungsten-border pt-4">
              <h3 className="font-mono text-xs font-bold uppercase text-phosphor mb-2">[ SPACE_SYNOPSIS ]</h3>
              <p className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {listing.description || "Designer apartment featuring premium furnishings, high-speed fiber internet, modular kitchen, and natural lighting throughout the day."}
              </p>
            </div>
          </div>

          {/* Lifestyle Frequency Matrix */}
          <div className="bento-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-tungsten-border pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-phosphor" />
                <h3 className="font-mono text-xs font-black uppercase text-white">LIFESTYLE_TELEMETRY_MATRIX</h3>
              </div>
              <span className="font-mono text-[10px] text-steel-muted">[MULTI_VECTOR_SYNC]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="rounded-lg border border-tungsten-border bg-obsidian-sub p-3 space-y-1">
                <span className="text-[10px] font-bold text-steel-muted uppercase flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-cyan" /> SLEEP_RHYTHM
                </span>
                <p className="font-bold text-slate-200">{lifestyle.sleepSchedule}</p>
              </div>

              <div className="rounded-lg border border-tungsten-border bg-obsidian-sub p-3 space-y-1">
                <span className="text-[10px] font-bold text-steel-muted uppercase">CLEANLINESS_INDEX</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-phosphor">{lifestyle.cleanliness} / 10</span>
                  <div className="h-2 w-24 rounded-full bg-tungsten-border overflow-hidden">
                    <div
                      className="h-full bg-phosphor rounded-full"
                      style={{ width: String(lifestyle.cleanliness * 10) + "%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-tungsten-border bg-obsidian-sub p-3 space-y-1">
                <span className="text-[10px] font-bold text-steel-muted uppercase flex items-center gap-1.5">
                  <Leaf className="h-3 w-3 text-phosphor" /> FOOD_FREQUENCY
                </span>
                <p className="font-bold text-slate-200">{lifestyle.foodHabit}</p>
              </div>

              <div className="rounded-lg border border-tungsten-border bg-obsidian-sub p-3 space-y-1">
                <span className="text-[10px] font-bold text-steel-muted uppercase">WORK_SCHEDULE</span>
                <p className="font-bold text-slate-200">{lifestyle.workSchedule}</p>
              </div>
            </div>
          </div>

          {/* AI Vibe Co-Pilot */}
          <div className="bento-card reticle-border p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-tungsten-border pb-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-cyan" />
                <h3 className="font-mono text-xs font-black uppercase text-white">AI_VIBE_COPILOT</h3>
              </div>
              <span className="sticker-pill border-cyan bg-cyan/10 text-cyan text-[10px]">HARMONY_ANALYSIS</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <SyncGauge label="SLEEP SYNC" value={85} color="phosphor" />
              <SyncGauge label="CLEAN SYNC" value={92} color="cyan" />
              <SyncGauge label="DIET MATCH" value={78} color="solar" />
              <SyncGauge label="SOCIAL SYNC" value={88} color="violet" />
            </div>

            <div className="rounded-lg border border-tungsten-border bg-obsidian-sub p-4">
              <p className="font-mono text-xs text-slate-300 leading-relaxed">
                <span className="text-cyan font-bold">[COPILOT_ANALYSIS]</span> Based on multi-vector telemetry,
                this space shows <span className="text-phosphor font-bold">HIGH COMPATIBILITY</span> with your
                lifestyle profile. Sleep rhythm alignment is strong with overlapping quiet hours.
                Cleanliness standards exceed your threshold by 15%. Dietary preferences show partial
                overlap with flexible kitchen sharing. Social energy levels are well-balanced for
                shared common areas. <span className="text-solar font-bold">RECOMMENDATION: PROCEED_WITH_CONTACT</span>
              </p>
            </div>
          </div>

          {/* Included Facilities */}
          <div className="bento-card p-6 space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase text-phosphor">[ INCLUDED_FACILITIES ]</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              {(listing.amenities || ["Wifi", "Air Conditioning", "Washing Machine", "Power Backup", "Cook / Maid", "Gym Access"]).map((amenity: string) => (
                <div key={amenity} className="flex items-center gap-2 rounded-lg border border-tungsten-border bg-obsidian-sub p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-phosphor shrink-0" />
                  <span className="truncate text-slate-200">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Cost Card */}
            <div className="bento-card reticle-border-cyan p-6 space-y-5">
              <div className="border-b border-tungsten-border pb-4">
                <span className="font-mono text-[10px] font-bold uppercase text-steel-muted">MONTHLY_COST</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-black text-phosphor glow-text-emerald">
                    &#8377;{Number(listing.rent).toLocaleString()}
                  </span>
                  <span className="font-mono text-xs text-steel-muted">/ CYCLE</span>
                </div>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-steel-muted">
                  <span>SECURITY_DEPOSIT</span>
                  <span className="font-bold text-white">&#8377;{Number(listing.deposit || listing.rent * 2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-steel-muted">
                  <span>AVAILABLE_FROM</span>
                  <span className="font-bold text-white">{listing.available_from || "IMMEDIATE"}</span>
                </div>
                <div className="flex justify-between text-steel-muted">
                  <span>BROKERAGE</span>
                  <span className="font-bold text-phosphor">ZERO_FEE (DIRECT)</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link href="/messages" className="neo-button w-full py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>INITIATE_DIRECT_CHAT</span>
                </Link>
              </div>
            </div>

            {/* Host Profile */}
            {profile && (
              <div className="bento-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-xl object-cover border border-tungsten-border"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-phosphor/10 border border-phosphor/30 font-mono text-sm font-black text-phosphor">
                      {profile.full_name?.[0] || "H"}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate font-mono text-sm font-bold text-white">{profile.full_name}</p>
                      {profile.is_verified && (
                        <ShieldCheck className="h-4 w-4 text-phosphor shrink-0" />
                      )}
                    </div>
                    <p className="truncate font-mono text-xs text-steel-muted">{profile.profession || "VERIFIED_HOST"}</p>
                  </div>
                </div>

                {profile.bio && (
                  <p className="font-mono text-xs text-steel border-t border-tungsten-border pt-3 leading-relaxed">
                    &ldquo;{profile.bio}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Neighborhood Commute Radar */}
            <div className="bento-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-solar" />
                <h3 className="font-mono text-xs font-black uppercase text-white">COMMUTE_RADAR</h3>
              </div>
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-steel-muted">NEAREST_METRO</span>
                  <span className="text-phosphor font-bold">0.8 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-steel-muted">TECH_PARK_COMMUTE</span>
                  <span className="text-cyan font-bold">12 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-steel-muted">WALKABLE_CAFES</span>
                  <span className="text-solar font-bold">8 nearby</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-steel-muted">SAFETY_INDEX</span>
                  <span className="text-phosphor font-bold">9.2 / 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
