import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { hasSupabaseEnv } from "@/lib/supabase";
import { DEMO_LISTINGS, type DemoListing } from "@/lib/demo-data";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookmarkButton } from "./bookmark-button";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { GlassCard } from "@/components/ui/premium";

const ROOM_TYPES = ["single", "shared", "entire_flat"] as const;

type ListingCard = DemoListing & {
  profiles: DemoListing["profiles"] | DemoListing["profiles"][];
};

type BrowsePageProps = {
  searchParams: {
    city?: string;
    locality?: string;
    minRent?: string;
    maxRent?: string;
    roomType?: string;
    availableFrom?: string;
  };
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const hasEnv = hasSupabaseEnv();
  const supabase = await createClient();
  const { data: auth } = hasEnv ? await supabase.auth.getUser() : { data: { user: null } };

  const city = searchParams.city || "";
  const locality = searchParams.locality || "";
  const minRent = searchParams.minRent ? Number(searchParams.minRent) : 0;
  const maxRent = searchParams.maxRent ? Number(searchParams.maxRent) : 1000000;
  const roomType = searchParams.roomType || "";
  const availableFrom = searchParams.availableFrom || "";

  let listings: ListingCard[] = [];
  let uniqueCities: string[] = [];

  if (hasEnv) {
    let query = supabase
      .from("listings")
      .select("id,title,locality,city,rent,room_type,available_from,photos,user_id,profiles!listings_user_id_fkey(full_name,is_verified)")
      .eq("is_active", true)
      .gte("rent", minRent)
      .lte("rent", maxRent)
      .order("created_at", { ascending: false });

    if (city) query = query.eq("city", city);
    if (locality) query = query.ilike("locality", `%${locality}%`);
    if (roomType) query = query.eq("room_type", roomType);
    if (availableFrom) query = query.gte("available_from", availableFrom);

    const [{ data: dbListings }, { data: cities }] = await Promise.all([
      query,
      supabase.from("listings").select("city").eq("is_active", true)
    ]);

    listings = (dbListings || []) as ListingCard[];
    uniqueCities = [...new Set((cities || []).map((row) => row.city))];
  } else {
    listings = DEMO_LISTINGS.filter((listing) => {
      if (city && listing.city !== city) return false;
      if (locality && !listing.locality.toLowerCase().includes(locality.toLowerCase())) return false;
      if (listing.rent < minRent || listing.rent > maxRent) return false;
      if (roomType && listing.room_type !== roomType) return false;
      if (availableFrom && listing.available_from < availableFrom) return false;
      return true;
    });

    uniqueCities = [...new Set(DEMO_LISTINGS.map((row) => row.city))];
  }

  const compatibilityByUserId = new Map<string, number>();
  if (auth.user?.id) {
    const { data: myPref } = await supabase.from("roommate_preferences").select("id").eq("user_id", auth.user.id).maybeSingle();

    if (myPref?.id) {
      const listingOwnerIds = [...new Set((listings || []).map((listing) => listing.user_id))];
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
      <div className="mb-6"><h1 className="text-3xl font-semibold text-white sm:text-4xl">Browse Listings</h1><p className="mt-1 text-slate-300">Filter by vibe, budget, and move-in timeline.</p></div>
      
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <GlassCard className="h-fit p-4">
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <select name="city" defaultValue={city} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">All cities</option>
                {uniqueCities.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Locality</label>
              <Input name="locality" placeholder="Search locality" defaultValue={locality} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Rent range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min={0} name="minRent" defaultValue={minRent || ""} placeholder="Min" />
                <Input type="number" min={0} name="maxRent" defaultValue={maxRent === 1000000 ? "" : maxRent} placeholder="Max" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Room type</label>
              <select name="roomType" defaultValue={roomType} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Any</option>
                {ROOM_TYPES.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Available from</label>
              <Input type="date" name="availableFrom" defaultValue={availableFrom} />
            </div>

            <Button type="submit" className="w-full">Apply Filters</Button>
          </form>
        </GlassCard>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {!hasEnv ? <p className="sm:col-span-2 xl:col-span-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">Supabase environment variables are missing, so you are viewing demo listings.</p> : null}
          {(listings || []).map((listing) => {
            const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
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
                  <BookmarkButton listingId={listing.id} userId={auth.user?.id || null} />
                </div>
              </article>
            );
          })}
          {!listings?.length ? <p className="text-sm text-slate-300">No listings match your filters.</p> : null}
        </section>
      </div>
    </main>
  );
}
