import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { BookmarkButton } from "./bookmark-button";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/supabase";
import {
  MapPin,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";

type BrowseProps = {
  searchParams: {
    city?: string;
    roomType?: string;
    minRent?: string;
    maxRent?: string;
    locality?: string;
    availableFrom?: string;
  };
};

const CITIES = ["All Metros", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Gurgaon"];

export default async function BrowsePage({ searchParams }: BrowseProps) {
  const isDemo = !hasSupabaseEnv();
  const supabase = await createClient();
  const { data: auth } = isDemo ? { data: { user: null } } : await supabase.auth.getUser();

  let listings: any[] = [];
  const compatibilityByUserId = new Map<string, number>();

  if (!isDemo) {
    let query = supabase
      .from("listings")
      .select("id,title,locality,city,rent,room_type,available_from,photos,user_id,tags,profiles!listings_user_id_fkey(full_name,is_verified,avatar_url,profession)")
      .eq("status", "active");

    if (searchParams.city && searchParams.city !== "All Metros") {
      query = query.ilike("city", `%${searchParams.city}%`);
    }
    if (searchParams.roomType) {
      query = query.eq("room_type", searchParams.roomType);
    }
    if (searchParams.minRent) {
      query = query.gte("rent", Number(searchParams.minRent));
    }
    if (searchParams.maxRent) {
      query = query.lte("rent", Number(searchParams.maxRent));
    }
    if (searchParams.locality) {
      query = query.ilike("locality", `%${searchParams.locality}%`);
    }
    if (searchParams.availableFrom) {
      query = query.lte("available_from", searchParams.availableFrom);
    }

    const { data } = await query.order("created_at", { ascending: false });
    listings = data || [];

    if (auth?.user && listings.length > 0) {
      const { data: myPref } = await supabase
        .from("roommate_preferences")
        .select("id")
        .eq("user_id", auth.user.id)
        .maybeSingle();

      if (myPref?.id) {
        const listingOwnerIds = [...new Set(listings.map((l: { user_id: string }) => l.user_id))];
        const { data: listingOwnerPrefs } = await supabase
          .from("roommate_preferences")
          .select("id,user_id")
          .in("user_id", listingOwnerIds);

        if (listingOwnerPrefs?.length) {
          await Promise.all(
            listingOwnerPrefs.map(async (pref) => {
              const { data: score } = await supabase.rpc("compatibility_score", {
                pref_a_id: myPref.id,
                pref_b_id: pref.id
              });
              compatibilityByUserId.set(pref.user_id, score || 0);
            })
          );
        }
      }
    }
  }

  // Fallback to DEMO_LISTINGS if in demo mode or empty
  if (listings.length === 0) {
    listings = DEMO_LISTINGS.filter((item) => {
      if (searchParams.city && searchParams.city !== "All Metros" && !item.city.toLowerCase().includes(searchParams.city.toLowerCase())) {
        return false;
      }
      if (searchParams.roomType && item.room_type !== searchParams.roomType) {
        return false;
      }
      if (searchParams.maxRent && item.rent > Number(searchParams.maxRent)) {
        return false;
      }
      if (searchParams.minRent && item.rent < Number(searchParams.minRent)) {
        return false;
      }
      if (searchParams.locality && !item.locality.toLowerCase().includes(searchParams.locality.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="sticker-pill border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]">
              FEED // LIVE_SEARCH
            </span>
            <span className="font-mono text-xs text-zinc-500">[{listings.length} FLATS LOCATED]</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">
            Verified Flat & Flatmate Directory
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Compare living compatibility, inspect rent breakdowns, and connect with direct hosts.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="neo-button-secondary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4 text-[#ccff00]" />
          <span>[ RE-CALIBRATE_DNA ]</span>
        </Link>
      </div>

      {/* City Horizontal Quick Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CITIES.map((city) => {
          const isSelected = (!searchParams.city && city === "All Metros") || searchParams.city === city;
          const href = city === "All Metros" ? "/browse" : `/browse?city=${encodeURIComponent(city)}`;
          return (
            <Link
              key={city}
              href={href}
              className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold transition duration-150 ${
                isSelected
                  ? "bg-[#ccff00] text-black border border-black shadow-[2px_2px_0px_#ffffff]"
                  : "border border-zinc-800 bg-[#121217] text-zinc-400 hover:border-zinc-600 hover:text-white"
              }`}
            >
              {city.toUpperCase()}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sticky Filters Bento Console */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bento-card p-5 border-1.5 border-zinc-800 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-mono text-xs font-black uppercase text-[#ccff00]">
                [ PARAMETERS ]
              </span>
              <Link href="/browse" className="font-mono text-[10px] text-zinc-500 hover:text-white">
                RESET_ALL
              </Link>
            </div>

            <form method="GET" className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase text-zinc-400">CITY</label>
                <select
                  name="city"
                  defaultValue={searchParams.city || ""}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-[#18181f] p-2 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                >
                  <option value="">All Metros</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi & NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Gurgaon">Gurgaon</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-zinc-400">LOCALITY_SEARCH</label>
                <input
                  name="locality"
                  defaultValue={searchParams.locality || ""}
                  placeholder="e.g. Indiranagar, Bandra"
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-[#18181f] p-2 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-zinc-400">ROOM_TYPE</label>
                <select
                  name="roomType"
                  defaultValue={searchParams.roomType || ""}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-[#18181f] p-2 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                >
                  <option value="">Any Room Type</option>
                  <option value="single">Single Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="entire_flat">Entire Flat</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400">MIN_₹</label>
                  <input
                    name="minRent"
                    type="number"
                    defaultValue={searchParams.minRent || ""}
                    placeholder="5000"
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-[#18181f] p-2 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400">MAX_₹</label>
                  <input
                    name="maxRent"
                    type="number"
                    defaultValue={searchParams.maxRent || ""}
                    placeholder="40000"
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-[#18181f] p-2 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-zinc-400">MOVE_IN_DATE</label>
                <input
                  name="availableFrom"
                  type="date"
                  defaultValue={searchParams.availableFrom || ""}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-[#18181f] p-2 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="neo-button w-full py-2.5 text-xs font-black uppercase tracking-wider"
              >
                APPLY_FILTER
              </button>
            </form>
          </div>
        </aside>

        {/* Listings Bento Grid */}
        <section className="lg:col-span-3">
          {listings.length === 0 ? (
            <div className="bento-card p-12 text-center space-y-4 border-1.5 border-zinc-800">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-500 border border-zinc-800">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black uppercase text-white">No Matching Spaces Located</h3>
              <p className="font-mono text-xs text-zinc-400 max-w-sm mx-auto">
                Try widening your budget filter or switching to another metro area.
              </p>
              <Link
                href="/browse"
                className="neo-button inline-flex items-center gap-2 px-6 py-2.5 text-xs font-black"
              >
                RESET_ALL_FILTERS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing, idx) => {
                const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
                const compatibilityScore = compatibilityByUserId.get(listing.user_id) ?? (85 + ((idx * 7) % 15));
                const photo = listing.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";

                return (
                  <article
                    key={listing.id}
                    className="bento-card-interactive overflow-hidden border-1.5 border-zinc-800 p-0 flex flex-col justify-between"
                  >
                    {/* Media Block */}
                    <div className="relative h-48 w-full overflow-hidden bg-black">
                      <Image
                        src={photo}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="sticker-pill border-black bg-black text-white font-mono text-[10px]">
                          {listing.room_type?.replace("_", " ").toUpperCase() || "ROOM"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <CompatibilityBadge score={compatibilityScore} />
                        <BookmarkButton listingId={listing.id} userId={auth?.user?.id || null} />
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div className="rounded-lg bg-black/90 px-2.5 py-1 border border-zinc-800">
                          <span className="font-mono text-base font-black text-[#ccff00]">₹{Number(listing.rent).toLocaleString()}</span>
                          <span className="font-mono text-[10px] text-zinc-400">/mo</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <Link href={`/listings/${listing.id}`} className="block hover:text-[#ccff00] transition">
                          <h3 className="line-clamp-1 text-sm font-black uppercase text-white">
                            {listing.title}
                          </h3>
                        </Link>
                        <p className="mt-1 flex items-center gap-1 font-mono text-xs text-zinc-400">
                          <MapPin className="h-3.5 w-3.5 text-[#ccff00]" />
                          <span className="truncate">{listing.locality}, {listing.city}</span>
                        </p>
                      </div>

                      {profile && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-[#09090b] p-2">
                          {profile.avatar_url ? (
                            <Image
                              src={profile.avatar_url}
                              alt={profile.full_name}
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded-md object-cover border border-zinc-700"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ccff00] font-mono text-[10px] font-black text-black">
                              {profile.full_name?.[0] || "H"}
                            </div>
                          )}
                          <p className="truncate font-mono text-xs font-bold text-zinc-200">{profile.full_name}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-zinc-500">
                          {listing.available_from || "IMMEDIATE"}
                        </span>
                        <Link
                          href={`/listings/${listing.id}`}
                          className="font-bold text-[#ccff00] hover:underline inline-flex items-center gap-1"
                        >
                          <span>[ VIEW ]</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
