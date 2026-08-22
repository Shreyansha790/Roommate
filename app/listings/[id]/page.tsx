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
  Sparkles,
  Clock,
  Leaf,
  Briefcase,
  Users,
  Train,
  Heart,
  Coffee,
  Check
} from "lucide-react";

function HarmonyMeter({ label, value, color }: { label: string; value: number; color: string }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  const colorStyles: Record<string, { stroke: string; text: string; bg: string }> = {
    coral: { stroke: "#e05d44", text: "text-coral-600", bg: "bg-coral-50" },
    emerald: { stroke: "#059669", text: "text-emerald-600", bg: "bg-emerald-50" },
    amber: { stroke: "#d97706", text: "text-amber-600", bg: "bg-amber-50" },
    indigo: { stroke: "#4f46e5", text: "text-indigo-600", bg: "bg-indigo-50" }
  };
  const style = colorStyles[color] || colorStyles.coral;

  return (
    <div className="flex flex-col items-center gap-2 bg-[#fcfbf9] rounded-2xl p-3 border border-stone-100">
      <div className="relative h-[68px] w-[68px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#e5e5e5" strokeWidth="4.5" />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={style.stroke}
            strokeWidth="4.5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-extrabold text-sm ${style.text}`}>
          {value}%
        </span>
      </div>
      <span className="text-[11px] font-bold text-stone-600 text-center leading-tight">{label}</span>
    </div>
  );
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const isDemo = !hasSupabaseEnv();
  const supabase = await createClient();
  const authResult = isDemo ? { data: { user: null } } : await supabase.auth.getUser();

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
    sleepSchedule: "11:30 PM – 7:30 AM (Moderate)",
    cleanliness: 9,
    foodHabit: "Vegetarian / Flexitarian",
    smoking: "Strictly Smoke-Free",
    workSchedule: "Hybrid (2-3 Days WFH)"
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans text-stone-800">
      {/* Return Link */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-stone-500 hover:text-coral-600 font-semibold transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Explore</span>
        </Link>
        <span className="text-stone-400 font-medium">
          Listing #{listing.id.slice(0, 8)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Gallery photos={listing.photos || []} title={listing.title} />

          {/* Space Details Card */}
          <div className="bento-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-coral-50 text-coral-700 font-bold text-xs px-3 py-1 rounded-full border border-coral-200">
                  {listing.room_type?.replace("_", " ").toUpperCase()}
                </span>
                <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                  Direct Host
                </span>
              </div>
              <CompatibilityBadge score={compatibilityScore} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {listing.title}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-stone-500 font-medium">
                <MapPin className="h-4 w-4 text-coral-500 shrink-0" />
                <span>{listing.locality}, {listing.city}</span>
              </p>
            </div>

            <div className="border-t border-stone-100 pt-5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">About the Space</h3>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {listing.description || "Sunlit apartment featuring modern furnishings, high-speed fiber internet, modular kitchen, and natural lighting throughout the day. Located in a quiet, friendly neighborhood close to cafes and metro."}
              </p>
            </div>
          </div>

          {/* Lifestyle Harmony Card */}
          <div className="bento-card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-coral-500" />
                <h3 className="text-base font-bold text-stone-900">Lifestyle & House Habits</h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">Mutual Harmony Matrix</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-stone-200/80 bg-[#fbfaf8] p-4 space-y-1">
                <span className="text-stone-500 font-semibold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-coral-500" /> Sleep Schedule
                </span>
                <p className="font-bold text-stone-800 text-sm">{lifestyle.sleepSchedule}</p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-[#fbfaf8] p-4 space-y-1.5">
                <span className="text-stone-500 font-semibold">Cleanliness Level</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600 text-sm">{lifestyle.cleanliness} / 10</span>
                  <div className="h-2 w-28 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: String(lifestyle.cleanliness * 10) + "%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-[#fbfaf8] p-4 space-y-1">
                <span className="text-stone-500 font-semibold flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5 text-emerald-500" /> Food Preferences
                </span>
                <p className="font-bold text-stone-800 text-sm">{lifestyle.foodHabit}</p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-[#fbfaf8] p-4 space-y-1">
                <span className="text-stone-500 font-semibold flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-amber-500" /> Work Routine
                </span>
                <p className="font-bold text-stone-800 text-sm">{lifestyle.workSchedule}</p>
              </div>
            </div>
          </div>

          {/* AI Vibe Co-Pilot */}
          <div className="bento-card p-6 sm:p-8 space-y-6 border-coral-200/80 bg-gradient-to-br from-white via-white to-[#fffcfb]">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral-100 text-coral-600 font-bold">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">AI Compatibility Co-Pilot</h3>
              </div>
              <span className="bg-coral-50 text-coral-600 font-bold text-xs px-2.5 py-1 rounded-full border border-coral-200">
                High Match
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <HarmonyMeter label="Sleep Sync" value={85} color="coral" />
              <HarmonyMeter label="Cleanliness" value={92} color="emerald" />
              <HarmonyMeter label="Diet Match" value={78} color="amber" />
              <HarmonyMeter label="Social Rhythm" value={88} color="indigo" />
            </div>

            <div className="rounded-2xl border border-coral-100 bg-[#fffbf9] p-4">
              <p className="text-xs text-stone-700 leading-relaxed">
                <span className="font-bold text-coral-600">Co-Pilot Insight:</span> This flatmate shows an excellent
                lifestyle alignment with your profile. Quiet hours match your sleep window, cleanliness standards are
                mutually respected, and remote work hours leave shared common areas quiet during peak focus blocks.
              </p>
            </div>
          </div>

          {/* Amenities Card */}
          <div className="bento-card p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Included Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {(listing.amenities || ["High-Speed Wifi", "Air Conditioning", "Washing Machine", "Power Backup", "Housekeeping", "Gym Access"]).map((amenity: string) => (
                <div key={amenity} className="flex items-center gap-2 rounded-xl border border-stone-100 bg-[#faf9f6] p-3 font-medium text-stone-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Rent & Inquiry Card */}
            <div className="bento-card p-6 sm:p-8 space-y-5 shadow-warm-lg">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Monthly Rent</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-black text-stone-900">
                    ₹{Number(listing.rent).toLocaleString()}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">/ month</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Security Deposit</span>
                  <span className="font-bold text-stone-900">₹{Number(listing.deposit || listing.rent * 2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Available From</span>
                  <span className="font-bold text-stone-900">{listing.available_from || "Immediate"}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Brokerage Fee</span>
                  <span className="font-bold text-emerald-600">₹0 (100% Direct)</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link href="/messages" className="neo-button w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-warm-coral">
                  <MessageCircle className="h-4 w-4" />
                  <span>Message Flatmate Directly</span>
                </Link>
                <Link href="/agreement" className="neo-button-secondary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2">
                  <span>Draft Roommate Agreement</span>
                </Link>
              </div>
            </div>

            {/* Host Profile Card */}
            {profile && (
              <div className="bento-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || "Host"}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral-100 text-base font-bold text-coral-600">
                      {profile.full_name?.[0] || "H"}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-stone-900">{profile.full_name}</p>
                      {profile.is_verified && (
                        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="truncate text-xs text-stone-500 font-medium">{profile.profession || "Verified Host"}</p>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-xs text-stone-600 border-t border-stone-100 pt-3 leading-relaxed">
                    &ldquo;{profile.bio}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Commute Highlights */}
            <div className="bento-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4 text-coral-500" />
                <h3 className="text-sm font-bold text-stone-900">Neighborhood & Commute</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-stone-600">
                  <span>Nearest Metro Station</span>
                  <span className="text-stone-900 font-semibold">0.8 km</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span>Tech Hub Transit Time</span>
                  <span className="text-stone-900 font-semibold">12 mins</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span>Walkable Cafes & Groceries</span>
                  <span className="text-stone-900 font-semibold">8 within 5 mins</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span>Neighborhood Safety Index</span>
                  <span className="text-emerald-600 font-bold">9.2 / 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
