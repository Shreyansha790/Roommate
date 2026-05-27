import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { buttonVariants } from "@/components/ui/button";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
export default async function SavedListingsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/login");
  }

  // Fetch saved listings and join with listing details
  const { data: savedListings } = await supabase
    .from("saved_listings")
    .select("listing_id, listings(id,title,locality,city,rent,room_type,available_from,photos,user_id,profiles!listings_user_id_fkey(full_name,is_verified))")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  // Compute compatibility scores
  const compatibilityByUserId = new Map<string, number>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validListings: any[] = savedListings?.map(s => s.listings).flat().filter(Boolean) || [];

  if (validListings.length > 0) {
    const { data: myPref } = await supabase.from("roommate_preferences").select("id").eq("user_id", auth.user.id).maybeSingle();

    if (myPref?.id) {
      // Need type casting or checking depending on supabase types. Just handling arrays nicely here.
      const listingOwnerIds = [...new Set(validListings.map((listing: { user_id: string }) => listing.user_id))];
      const { data: listingOwnerPrefs } = await supabase.from("roommate_preferences").select("id,user_id").in("user_id", listingOwnerIds);

      if (listingOwnerPrefs?.length) {
        await Promise.all(listingOwnerPrefs.map(async (pref) => {
          const { data } = await supabase.rpc("compatibility_score", { pref_a_id: myPref.id, pref_b_id: pref.id });
          compatibilityByUserId.set(pref.user_id, data || 0);
        }));
      }
    }
  }

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Saved Listings</h1>
        <p className="mt-1 text-slate-300">Your bookmarked flats and flatmates.</p>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {validListings.map((listing: { id: string, title: string, locality: string, city: string, rent: number, room_type: string, available_from: string, photos: string[], user_id: string, profiles: unknown }) => {
          const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : (listing.profiles as { is_verified?: boolean } | null);
          const compatibilityScore = compatibilityByUserId.get(listing.user_id) ?? -1;

          return (
            <article key={listing.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(34,211,238,0.7)]">
              <Link href={`/listings/${listing.id}`} className="block">
                <Image src={listing.photos?.[0] || "https://placehold.co/640x400?text=No+Photo"} alt={listing.title} width={640} height={400} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={true} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="space-y-2 p-4 text-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="line-clamp-1 text-lg font-semibold">{listing.title}</h2>
                    <CompatibilityBadge score={compatibilityScore} />
                  </div>
                  <p className="text-sm text-slate-300">{listing.locality}, {listing.city}</p>
                  <p className="text-base font-medium">₹{Number(listing.rent).toLocaleString()}/month</p>
                  <p className="text-sm">Room type: <span className="capitalize">{listing.room_type.replace("_", " ")}</span></p>
                  <p className="text-sm">Available from: {listing.available_from || "Flexible"}</p>
                  {profile?.is_verified ? <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Verified</span> : null}
                </div>
              </Link>
              <div className="flex items-center justify-between border-t border-white/10 p-3">
                <Link href={`/listings/${listing.id}`} className={buttonVariants({ size: "sm" })}>View Details</Link>
              </div>
            </article>
          );
        })}
        {!validListings.length ? <p className="text-sm text-slate-300">You haven&apos;t saved any listings yet.</p> : null}
      </section>
    </main>
  );
}
