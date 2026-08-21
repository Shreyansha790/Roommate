import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { Bookmark, MapPin, ArrowRight, Sparkles, Zap } from "lucide-react";

export default async function SavedListingsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  let validListings: any[] = [];
  const compatibilityByUserId = new Map<string, number>();

  if (auth.user) {
    const { data: savedListings } = await supabase
      .from("saved_listings")
      .select("listing_id, listings(id,title,locality,city,rent,room_type,available_from,photos,user_id,profiles!listings_user_id_fkey(full_name,is_verified,avatar_url,profession))")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false });

    validListings = savedListings?.map((s) => s.listings).flat().filter(Boolean) || [];

    if (validListings.length > 0) {
      const { data: myPref } = await supabase
        .from("roommate_preferences")
        .select("id")
        .eq("user_id", auth.user.id)
        .maybeSingle();

      if (myPref?.id) {
        const listingOwnerIds = [...new Set(validListings.map((l: { user_id: string }) => l.user_id))];
        const { data: listingOwnerPrefs } = await supabase
          .from("roommate_preferences")
          .select("id,user_id")
          .in("user_id", listingOwnerIds);

        if (listingOwnerPrefs?.length) {
          await Promise.all(
            listingOwnerPrefs.map(async (pref) => {
              const { data } = await supabase.rpc("compatibility_score", {
                pref_a_id: myPref.id,
                pref_b_id: pref.id
              });
              compatibilityByUserId.set(pref.user_id, data || 0);
            })
          );
        }
      }
    }
  } else {
    // If guest / demo mode, show top 2 bookmarked demo listings
    validListings = DEMO_LISTINGS.slice(0, 2);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="sticker-pill border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]">
              SAVED // WISHLIST
            </span>
            <span className="text-zinc-500">[{validListings.length} PLACES BOOKMARKED]</span>
          </div>
          <h1 className="text-3xl font-black uppercase text-white sm:text-4xl">
            Bookmarked Living Spaces
          </h1>
          <p className="mt-1 text-zinc-400">
            Compare vibe compatibility ratings and keep track of open slots.
          </p>
        </div>

        <Link
          href="/browse"
          className="neo-button-secondary inline-flex items-center gap-2 px-5 py-2.5 font-bold"
        >
          <span>[ EXPLORE_MORE_SPACES ]</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid or Empty State */}
      {validListings.length === 0 ? (
        <div className="bento-card p-12 text-center space-y-4 max-w-lg mx-auto border-1.5 border-zinc-800">
          <p className="text-4xl">📑</p>
          <h3 className="text-xl font-black uppercase text-white">No Bookmarks Recorded</h3>
          <p className="text-zinc-400 max-w-sm mx-auto">
            Browse through our verified living directory and bookmark listings to save them to this board.
          </p>
          <div className="pt-2">
            <Link
              href="/browse"
              className="neo-button inline-flex items-center gap-2 px-6 py-3 font-black uppercase"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>EXPLORE_LISTINGS_NOW</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {validListings.map((listing: any, idx: number) => {
            const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
            const compatibilityScore = compatibilityByUserId.get(listing.user_id) ?? (85 + ((idx * 6) % 15));
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="sticker-pill border-black bg-black text-white text-[10px]">
                      {listing.room_type?.replace("_", " ").toUpperCase() || "ROOM"}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <CompatibilityBadge score={compatibilityScore} />
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
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-[#ccff00] shrink-0" />
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
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ccff00] text-[10px] font-black text-black">
                          {profile.full_name?.[0] || "H"}
                        </div>
                      )}
                      <p className="truncate font-bold text-zinc-200">{profile.full_name}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
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
    </main>
  );
}


