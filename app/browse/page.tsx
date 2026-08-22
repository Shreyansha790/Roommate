import { createClient } from "@/lib/supabase-server";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { hasSupabaseEnv } from "@/lib/supabase";
import { parseNlpQuery, rankListingsByQuery, ParsedSearchVectors } from "@/lib/nlp-parser";
import { BrowseClientView, BrowseListingItem } from "./browse-client-view";

type BrowseProps = {
  searchParams: {
    city?: string;
    roomType?: string;
    minRent?: string;
    maxRent?: string;
    locality?: string;
    availableFrom?: string;
    isochrone?: string;
    vibe?: string;
    q?: string;
  };
};

export default async function BrowsePage({ searchParams }: BrowseProps) {
  const isDemo = !hasSupabaseEnv();
  const supabase = await createClient();
  const { data: auth } = isDemo ? { data: { user: null } } : await supabase.auth.getUser();

  let rawListings: any[] = [];
  const compatibilityByUserId = new Map<string, number>();

  if (!isDemo) {
    let query = supabase
      .from("listings")
      .select("id,title,locality,city,rent,room_type,available_from,photos,user_id,tags,profiles!listings_user_id_fkey(id,full_name,is_verified,avatar_url,profession)")
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
    rawListings = data || [];

    if (auth?.user && rawListings.length > 0) {
      const { data: myPref } = await supabase
        .from("roommate_preferences")
        .select("id")
        .eq("user_id", auth.user.id)
        .maybeSingle();

      if (myPref?.id) {
        const listingOwnerIds = [...new Set(rawListings.map((l: { user_id: string }) => l.user_id))];
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

  // Fallback to DEMO_LISTINGS if in demo mode or empty database
  if (rawListings.length === 0) {
    rawListings = DEMO_LISTINGS.filter((item) => {
      if (
        searchParams.city &&
        searchParams.city !== "All Metros" &&
        !item.city.toLowerCase().includes(searchParams.city.toLowerCase())
      ) {
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
      if (
        searchParams.locality &&
        !item.locality.toLowerCase().includes(searchParams.locality.toLowerCase())
      ) {
        return false;
      }
      if (searchParams.vibe) {
        const vibes = searchParams.vibe.split(",").map((v) => v.toLowerCase().trim());
        const hasVibe = vibes.some(
          (v) =>
            item.tags?.some((t) => t.toLowerCase().includes(v)) ||
            item.title.toLowerCase().includes(v)
        );
        if (!hasVibe) return false;
      }
      return true;
    });
  }

  // NLP Freeform Query Parsing & Multi-Vector Re-ranking
  let parsedVectors: ParsedSearchVectors | null = null;
  let formattedListings: BrowseListingItem[] = [];

  if (searchParams.q && searchParams.q.trim()) {
    parsedVectors = parseNlpQuery(searchParams.q);
    formattedListings = rankListingsByQuery(rawListings, searchParams.q).map((l, idx) => {
      const profile = Array.isArray(l.profiles) ? l.profiles[0] : l.profiles;
      return {
        ...l,
        profiles: profile,
        matchScore: l.matchScore,
        isochroneMins: 10 + ((idx * 3) % 15)
      };
    });
  } else {
    formattedListings = rawListings.map((l, idx) => {
      const profile = Array.isArray(l.profiles) ? l.profiles[0] : l.profiles;
      const score = compatibilityByUserId.get(l.user_id) ?? (88 + ((idx * 5) % 11));
      return {
        ...l,
        profiles: profile,
        matchScore: score,
        isochroneMins: 10 + ((idx * 3) % 15)
      };
    });
  }

  // Discovery grid routes directly to listing dossiers at /listings/[id]
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      <BrowseClientView
        initialListings={formattedListings}
        searchParams={searchParams}
        parsedVectors={parsedVectors}
        userId={auth?.user?.id || null}
      />
    </main>
  );
}
