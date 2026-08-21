import Link from "next/link";
import Image from "next/image";
import { BentoCard, GlowBadge, VibePill } from "@/components/ui/premium";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import {
  Zap,
  Search,
  MapPin,
  Flame,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Terminal,
  Activity,
  CheckCircle2,
  Lock
} from "lucide-react";

const bentoVibes = [
  { tag: "TECH_&_STARTUPS", city: "Bangalore", count: "340+ FLATS", accent: "lime", emoji: "⚡" },
  { tag: "CREATIVE_LOFTS", city: "Mumbai", count: "190+ FLATS", accent: "orange", emoji: "🌊" },
  { tag: "STUDIO_SANCTUARY", city: "Delhi", count: "120+ FLATS", accent: "blue", emoji: "🎨" },
  { tag: "SMART_HOMES", city: "Hyderabad", count: "210+ FLATS", accent: "purple", emoji: "🎮" },
  { tag: "SERENE_GREENS", city: "Pune", count: "140+ FLATS", accent: "lime", emoji: "🌿" }
];

const howItWorks = [
  {
    step: "STEP_01",
    title: "CALIBRATE VIBE DNA",
    description: "60-second lifestyle calibration on sleep rhythm, cleanliness quotient, social battery, and food choices.",
    badge: "NO_FRICTION"
  },
  {
    step: "STEP_02",
    title: "ALGORITHMIC MATCH",
    description: "Our matrix scans verified flat profiles to compute multi-vector compatibility ratings with zero guesswork.",
    badge: "98.4%_ACCURACY"
  },
  {
    step: "STEP_03",
    title: "DIRECT MOVE-IN",
    description: "Chat securely with verified hosts. Zero middlemen, zero broker fees, zero spam calls.",
    badge: "ZERO_BROKERAGE"
  }
];

export default function HomePage() {
  const featured = DEMO_LISTINGS.slice(0, 3);

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Bento Matrix */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Main Hero Bento Tile */}
          <div className="bento-card relative overflow-hidden p-8 sm:p-12 lg:col-span-8 flex flex-col justify-between border-1.5 border-zinc-800">
            <div className="space-y-5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="sticker-pill border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]">
                  SYSTEM_V2.0 // ACTIVE
                </span>
                <span className="sticker-pill border-zinc-700 bg-zinc-900 text-zinc-300">
                  ZERO_BROKERAGE
                </span>
              </div>

              <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.05]">
                STOP LIVING WITH <span className="text-zinc-500 line-through">STRANGERS</span>.<br />
                FIND FLATMATES WHO MATCH YOUR{" "}
                <span className="bg-[#ccff00] text-black px-2 py-0.5 inline-block -rotate-1 shadow-[3px_3px_0px_#ffffff]">
                  FREQUENCY
                </span>
                .
              </h1>

              <p className="text-sm sm:text-base font-mono text-zinc-400 max-w-xl leading-relaxed">
                The high-precision roommate discovery engine. Verified profiles, lifestyle DNA metrics, and direct human-to-human connections.
              </p>
            </div>

            {/* Quick Search Console */}
            <div className="mt-8 rounded-2xl border-1.5 border-zinc-800 bg-[#09090b] p-3 sm:p-4 shadow-[4px_4px_0px_#18181b]">
              <form action="/browse" method="GET" className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-center">
                <div className="flex items-center gap-2 rounded-xl bg-[#121217] px-3 py-2.5 border border-zinc-800">
                  <MapPin className="h-4 w-4 text-[#ccff00] shrink-0" />
                  <select name="city" defaultValue="" className="w-full bg-transparent font-mono text-xs text-zinc-200 focus:outline-none cursor-pointer">
                    <option value="" className="bg-[#121217] text-zinc-200">METRO: ALL</option>
                    <option value="Bangalore" className="bg-[#121217] text-zinc-200">Bangalore</option>
                    <option value="Mumbai" className="bg-[#121217] text-zinc-200">Mumbai</option>
                    <option value="Delhi" className="bg-[#121217] text-zinc-200">Delhi & NCR</option>
                    <option value="Hyderabad" className="bg-[#121217] text-zinc-200">Hyderabad</option>
                    <option value="Pune" className="bg-[#121217] text-zinc-200">Pune</option>
                    <option value="Gurgaon" className="bg-[#121217] text-zinc-200">Gurgaon</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-[#121217] px-3 py-2.5 border border-zinc-800">
                  <SlidersHorizontal className="h-4 w-4 text-[#3b82f6] shrink-0" />
                  <select name="roomType" defaultValue="" className="w-full bg-transparent font-mono text-xs text-zinc-200 focus:outline-none cursor-pointer">
                    <option value="" className="bg-[#121217] text-zinc-200">TYPE: ANY</option>
                    <option value="single" className="bg-[#121217] text-zinc-200">Single Room</option>
                    <option value="shared" className="bg-[#121217] text-zinc-200">Shared Room</option>
                    <option value="entire_flat" className="bg-[#121217] text-zinc-200">Entire Flat</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-[#121217] px-3 py-2.5 border border-zinc-800">
                  <span className="font-mono text-xs font-bold text-zinc-500">MAX_₹</span>
                  <input
                    type="number"
                    name="maxRent"
                    placeholder="25000"
                    className="w-full bg-transparent font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="neo-button flex items-center justify-center gap-1.5 py-2.5 text-xs font-black uppercase"
                >
                  <Search className="h-4 w-4" />
                  <span>EXECUTE_SEARCH</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Side Bento Grid Stack */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-4">
            {/* Vibe Quiz Card */}
            <div className="bento-card p-6 border-1.5 border-zinc-800 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="sticker-pill border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]">
                  VIBE_RADAR
                </span>
                <Sparkles className="h-5 w-5 text-[#a855f7]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Take the 60s Lifestyle Calibration
                </h3>
                <p className="mt-1 text-xs font-mono text-zinc-400">
                  Generate your custom Vibe DNA matrix and unlock instant % compatibility ratings.
                </p>
              </div>
              <Link
                href="/onboarding"
                className="neo-button-secondary inline-flex items-center justify-between px-4 py-2.5 text-xs font-mono font-bold"
              >
                <span>[ START_CALIBRATION ]</span>
                <ArrowRight className="h-4 w-4 text-[#ccff00]" />
              </Link>
            </div>

            {/* Live Metrics Card */}
            <div className="bento-card p-6 border-1.5 border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="sticker-pill border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]">
                  MATRIX_STATUS
                </span>
                <Activity className="h-5 w-5 text-[#3b82f6]" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3">
                  <p className="font-mono text-2xl font-black text-[#ccff00]">48.5K+</p>
                  <p className="font-mono text-[10px] text-zinc-500 uppercase">ACTIVE_SEEKERS</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3">
                  <p className="font-mono text-2xl font-black text-white">12.4K+</p>
                  <p className="font-mono text-[10px] text-zinc-500 uppercase">VERIFIED_SPACES</p>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-400">MATCH_SUCCESS_RATE</span>
                <span className="font-mono text-xs font-bold text-[#ccff00]">98.4%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Lifestyle Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#ccff00]">// CURATED_ZONES</span>
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">Explore by Community Frequency</h2>
          </div>
          <Link href="/browse" className="font-mono text-xs font-bold text-[#ccff00] hover:underline">
            VIEW_ALL_ZONES →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {bentoVibes.map((v) => (
            <Link
              key={v.tag}
              href={`/browse?city=${encodeURIComponent(v.city)}`}
              className="bento-card-interactive p-4 border-1.5 border-zinc-800 block"
            >
              <div className="text-2xl mb-2">{v.emoji}</div>
              <h3 className="font-mono text-xs font-bold text-white uppercase">{v.tag}</h3>
              <p className="font-mono text-[11px] text-zinc-500 mt-0.5">{v.city}</p>
              <span className="mt-3 inline-block font-mono text-[10px] text-[#ccff00] font-bold">
                {v.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Spaces Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="font-mono text-xs font-bold text-[#ccff00]">// VERIFIED_FEED</span>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">High-Frequency Verified Spaces</h2>
          </div>
          <Link href="/browse" className="font-mono text-xs font-bold text-[#ccff00] hover:underline">
            EXPLORE_ALL_LISTINGS →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing, idx) => (
            <article
              key={listing.id}
              className="bento-card-interactive overflow-hidden border-1.5 border-zinc-800 p-0 flex flex-col justify-between"
            >
              {/* Media Block */}
              <div className="relative h-56 w-full overflow-hidden bg-black">
                <Image
                  src={listing.photos[0]}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="sticker-pill border-black bg-black text-white font-mono text-[10px]">
                    {listing.room_type.toUpperCase()}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <CompatibilityBadge score={idx === 0 ? 94 : idx === 1 ? 88 : 82} />
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="rounded-lg bg-black/90 px-3 py-1 border border-zinc-800">
                    <span className="font-mono text-lg font-black text-[#ccff00]">₹{listing.rent.toLocaleString()}</span>
                    <span className="font-mono text-[10px] text-zinc-400">/mo</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="line-clamp-1 text-base font-black uppercase text-white">
                    {listing.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 font-mono text-xs text-zinc-400">
                    <MapPin className="h-3.5 w-3.5 text-[#ccff00]" />
                    <span>{listing.locality}, {listing.city}</span>
                  </p>
                </div>

                {/* Host DNA Strip */}
                <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#09090b] p-2.5">
                  {listing.profiles.avatar_url ? (
                    <Image
                      src={listing.profiles.avatar_url}
                      alt={listing.profiles.full_name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-lg object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ccff00] text-black font-black text-xs">
                      {listing.profiles.full_name[0]}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="truncate font-mono text-xs font-bold text-white">{listing.profiles.full_name}</p>
                    <p className="truncate font-mono text-[10px] text-zinc-500">{listing.profiles.profession || "HOST"}</p>
                  </div>
                </div>

                {/* Vibe Tags */}
                {listing.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {listing.tags.map((t) => (
                      <span key={t} className="sticker-pill border-zinc-800 bg-zinc-900 text-zinc-300 text-[10px]">
                        #{t.replace(" ", "_")}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-500">AVAIL: {listing.available_from}</span>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="font-bold text-[#ccff00] hover:underline inline-flex items-center gap-1"
                  >
                    <span>[ VIEW_SPACE ]</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3-Step Protocol Architecture */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="bento-card p-8 sm:p-12 border-1.5 border-zinc-800">
          <div className="max-w-xl mb-10">
            <span className="sticker-pill border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]">
              PROTOCOL_SPEC
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase text-white">How Roommate Sphere Operates</h2>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Zero brokers. Zero sketchy listings. Total lifestyle harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border-1.5 border-zinc-800 bg-[#09090b] p-6 space-y-4 hover:border-zinc-600 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-[#ccff00]">{item.step}</span>
                  <span className="sticker-pill border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-black uppercase text-white">{item.title}</h3>
                <p className="font-mono text-xs text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion Bento Box */}
      <section className="mx-auto max-w-5xl px-4 pt-6 text-center">
        <div className="bento-card p-10 border-1.5 border-[#ccff00] bg-[#121217] shadow-[8px_8px_0px_#ccff00]">
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Ready to find your harmonious living frequency?
          </h2>
          <p className="mt-3 max-w-lg mx-auto font-mono text-xs sm:text-sm text-zinc-400">
            Join thousands of verified builders, designers, and students discovering high-vibe spaces every day.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="neo-button px-8 py-3 text-xs font-black uppercase"
            >
              CREATE_ACCOUNT_NOW
            </Link>
            <Link
              href="/browse"
              className="neo-button-secondary px-6 py-3 text-xs font-mono font-bold uppercase"
            >
              BROWSE_LISTINGS_DIRECTLY
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


