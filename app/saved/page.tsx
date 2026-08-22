import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { Bookmark, MapPin, ArrowRight, Sparkles } from "lucide-react";

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
    validListings = DEMO_LISTINGS.slice(0, 3);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans text-stone-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-coral-50 text-coral-700 font-bold text-xs px-2.5 py-1 rounded-full border border-coral-200">
              Wishlist
            </span>
            <span className="text-stone-400 text-xs font-semibold">{validListings.length} Spaces Saved</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Bookmarked Living Spaces
          </h1>
          <p className="mt-1 text-stone-500 text-xs sm:text-sm">
            Keep track of open listings and compare vibe compatibility ratings.
          </p>
        </div>

        <Link
          href="/browse"
          className="neo-button-secondary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
        >
          <span>Explore More Spaces</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid or Empty */}
      {validListings.length === 0 ? (
        <div className="bento-card p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral-500">
            <Bookmark className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Saved Listings Yet</h3>
          <p className="text-xs text-stone-500">
            Click the bookmark icon on any listing card to save it here for easy comparison.
          </p>
          <div className="pt-2">
            <Link
              href="/browse"
              className="neo-button inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold shadow-warm-coral"
            >
              <span>Explore Listings Now</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {validListings.map((listing: any, idx: number) => {
            const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
            const compatibilityScore = compatibilityByUserId.get(listing.user_id) ?? (86 + ((idx * 5) % 10));
            const photo = listing.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";

            return (
              <article
                key={listing.id}
                className="bento-card-interactive group overflow-hidden p-0 flex flex-col justify-between"
              >
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={photo}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-stone-800 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                      {listing.room_type?.replace("_", " ").toUpperCase() || "ROOM"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <CompatibilityBadge score={compatibilityScore} />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1 shadow-sm border border-stone-200">
                      <span className="font-extrabold text-sm text-stone-900">₹{Number(listing.rent).toLocaleString()}</span>
                      <span className="text-[10px] text-stone-500 font-medium">/mo</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <Link href={`/listings/${listing.id}`} className="hover:text-coral-600 transition">
                      <h3 className="line-clamp-1 text-sm font-bold text-stone-900">
                        {listing.title}
                      </h3>
                    </Link>
                    <p className="mt-1 flex items-center gap-1 text-xs text-stone-500 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-coral-500 shrink-0" />
                      <span>{listing.locality}, {listing.city}</span>
                    </p>
                  </div>

                  {profile && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-stone-100 bg-[#faf9f6] p-2">
                      {profile.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={profile.full_name || "Host"}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full object-cover border border-stone-200"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-100 text-[10px] font-bold text-coral-600">
                          {profile.full_name?.[0] || "H"}
                        </div>
                      )}
                      <p className="truncate text-xs font-semibold text-stone-800">{profile.full_name}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>{listing.available_from || "Immediate"}</span>
                    <Link
                      href={`/listings/${listing.id}`}
                      className="font-bold text-coral-600 hover:text-coral-700 inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
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
