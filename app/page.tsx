import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { Card3D } from "@/components/motion/Card3D";
import { MotionFade, MotionStagger } from "@/components/motion/MotionFade";
import { SpatialRoomShowcase } from "@/components/home/SpatialRoomShowcase";
import { AnimatedStats } from "@/components/home/AnimatedStats";
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Home,
  CheckCircle2
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

  const curatedZones = [
    { city: "Bangalore", area: "Indiranagar & HSR", tag: "Tech & Cafes", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80", count: "340+ Rooms" },
    { city: "Mumbai", area: "Bandra & Juhu", tag: "Creative Lofts", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80", count: "190+ Rooms" },
    { city: "Delhi NCR", area: "Hauz Khas & Gurgaon", tag: "Studio Sanctuaries", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80", count: "120+ Rooms" },
    { city: "Hyderabad", area: "Hitec & Gachibowli", tag: "Modern Highrises", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80", count: "210+ Rooms" }
  ];

  return (
    <div className="space-y-20 pb-24 font-sans text-stone-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fefbf6] via-[#faf9f6] to-white pt-16 pb-20 border-b border-stone-200/60">
        {/* Background Ambient Lighting Orbs */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-coral-400/15 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionFade direction="up" duration={0.6} className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-coral-200/80 bg-coral-50/90 px-4 py-1.5 text-xs font-semibold text-coral-700 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-coral-500 animate-pulse" />
              <span>Multi-Vector Vibe Matching • 100% Zero Brokerage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.12]">
              Find a home & roommates you&apos;ll <span className="text-coral-500 underline decoration-coral-200 decoration-wavy underline-offset-8">genuinely love</span> living with.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Match on sleep rhythms, cleanliness, food habits, and social battery. Connect directly with verified flatmates with zero broker interference.
            </p>

            {/* Quick Search Console */}
            <div className="pt-2 max-w-3xl mx-auto">
              <form action="/browse" method="GET" className="bento-card p-2.5 shadow-warm-lg border border-stone-200/90 bg-white/95 backdrop-blur-md grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-100">
                  <MapPin className="h-4 w-4 text-coral-500 shrink-0" />
                  <input
                    name="city"
                    placeholder="Which city or area?"
                    className="w-full bg-transparent text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-100">
                  <Home className="h-4 w-4 text-amber-500 shrink-0" />
                  <select name="type" className="w-full bg-transparent text-xs font-medium text-stone-800 focus:outline-none cursor-pointer">
                    <option value="">Any Room Type</option>
                    <option value="single">Private Room</option>
                    <option value="shared">Shared Room</option>
                    <option value="entire_flat">Full Apartment</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="neo-button py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold shadow-warm-coral"
                >
                  <Search className="h-4 w-4" />
                  <span>Search Spaces</span>
                </button>
              </form>
            </div>

            {/* Popular Metros Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-stone-500">
              <span className="font-medium text-stone-400">Popular:</span>
              {["Indiranagar, BLR", "Koramangala, BLR", "Bandra West, BOM", "Hauz Khas, DEL", "Hitec City, HYD"].map((loc) => (
                <Link
                  key={loc}
                  href={`/browse?q=${encodeURIComponent(loc)}`}
                  className="rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1 transition font-medium"
                >
                  {loc}
                </Link>
              ))}
            </div>
          </MotionFade>

          {/* Interactive 3D Spatial Room Showcase */}
          <MotionFade delay={0.2} duration={0.8} direction="up" className="pt-10">
            <SpatialRoomShowcase />
          </MotionFade>
        </div>
      </section>

      {/* Live Animated Statistics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedStats />
      </section>

      {/* Curated Neighborhood Zones with 3D Tilt */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">Neighborhood Guide</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Explore by Community Vibe</h2>
          </div>
          <Link href="/browse" className="text-xs font-bold text-coral-600 hover:text-coral-700 inline-flex items-center gap-1">
            <span>View all neighborhoods</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedZones.map((zone) => (
            <Card3D key={zone.area} depth={10} glareOpacity={0.2} className="block">
              <Link
                href={`/browse?city=${encodeURIComponent(zone.city)}`}
                className="group overflow-hidden p-0 block bg-stone-100 rounded-2xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={zone.image}
                    alt={zone.area}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                      {zone.tag}
                    </span>
                    <h3 className="font-bold text-base mt-1.5">{zone.area}</h3>
                    <p className="text-xs text-stone-200">{zone.count}</p>
                  </div>
                </div>
              </Link>
            </Card3D>
          ))}
        </div>
      </section>

      {/* How It Works - 3D Steps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#fbfaf8] to-[#f5f4ef] border border-stone-200/80 p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">The Harmony Protocol</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">How RoommateSphere Works</h2>
            <p className="text-sm text-stone-600">3 simple steps to find your ideal home and compatible flatmates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card3D depth={8} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-coral-100 text-coral-600 font-black text-base shadow-inner">
                1
              </div>
              <h3 className="font-bold text-base text-stone-900">Calibrate Your Vibe DNA</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Take a 60-second questionnaire on sleep schedules, cleanliness habits, diet preferences, and social battery.
              </p>
            </Card3D>

            <Card3D depth={8} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-black text-base shadow-inner">
                2
              </div>
              <h3 className="font-bold text-base text-stone-900">Multi-Vector Compatibility</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our algorithm scores mutual compatibility across lifestyle habits so you never encounter awkward flatmate surprises.
              </p>
            </Card3D>

            <Card3D depth={8} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-black text-base shadow-inner">
                3
              </div>
              <h3 className="font-bold text-base text-stone-900">Direct Chat & Zero Brokerage</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Message verified hosts directly, schedule visits, and generate a customized flatmate agreement in one click.
              </p>
            </Card3D>
          </div>
        </div>
      </section>

      {/* Featured Verified Listings with 3D Card Tilt */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">Verified Homes</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Trending Spaces This Week</h2>
          </div>
          <Link href="/browse" className="text-xs font-bold text-coral-600 hover:text-coral-700 inline-flex items-center gap-1">
            <span>Explore all {listings.length}+ spaces</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(0, 6).map((listing: any, idx: number) => {
            const profile = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
            const photo = listing.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";

            return (
              <Card3D key={listing.id} depth={10} glareOpacity={0.15} className="bento-card p-0 flex flex-col justify-between">
                <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={photo}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-white/90 backdrop-blur-md text-stone-800 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-sm">
                      {listing.room_type?.replace("_", " ").toUpperCase()}
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

                <div className="p-5 space-y-3">
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
                      <ArrowRight className="h-3 w-3" />
                    </Link>
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
