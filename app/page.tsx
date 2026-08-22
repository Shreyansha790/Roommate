import Link from "next/link";
import Image from "next/image";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { TacticalBadge } from "@/components/HUD/TacticalBadge";
import { RadarCanvas } from "@/components/HUD/RadarCanvas";
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
  Lock,
  Compass,
  Cpu,
  Radar,
  Radio
} from "lucide-react";

const CURATED_ZONES = [
  {
    tag: "BANGALORE_TECH_CORRIDOR",
    city: "Bangalore",
    locality: "Indiranagar / Koramangala",
    count: "340+ SPACES",
    vibe: "Tech Founders & Remote Engineers",
    accent: "text-[#ccff00]",
    icon: Zap
  },
  {
    tag: "MUMBAI_CREATIVE_LOFTS",
    city: "Mumbai",
    locality: "Bandra West / Juhu",
    count: "190+ SPACES",
    vibe: "Designers & Media Creatives",
    accent: "text-[#ff5500]",
    icon: Activity
  },
  {
    tag: "DELHI_STUDIO_SANCTUARY",
    city: "Delhi",
    locality: "Hauz Khas / Saket",
    count: "120+ SPACES",
    vibe: "Artists, Writers & Analysts",
    accent: "text-[#3b82f6]",
    icon: Building2
  },
  {
    tag: "HYDERABAD_SMART_TOWNSHIP",
    city: "Hyderabad",
    locality: "Hitec City / Gachibowli",
    count: "210+ SPACES",
    vibe: "AI Engineers & Bio-Techies",
    accent: "text-[#a855f7]",
    icon: Terminal
  },
  {
    tag: "PUNE_SERENE_GREENS",
    city: "Pune",
    locality: "Koregaon Park / Viman Nagar",
    count: "140+ SPACES",
    vibe: "Product Teams & Researchers",
    accent: "text-[#ccff00]",
    icon: ShieldCheck
  }
];

const PROTOCOL_STEPS = [
  {
    step: "STEP_01",
    title: "CALIBRATE VIBE DNA",
    description: "60-second lifestyle calibration covering sleep rhythm, cleanliness quotient, food synergy, and social energy frequency.",
    badge: "NO_FRICTION",
    icon: Sparkles
  },
  {
    step: "STEP_02",
    title: "ALGORITHMIC RADAR MATCH",
    description: "Multi-vector spatial matrix scans verified profiles to compute exact harmonic compatibility ratings with zero guesswork.",
    badge: "98.4%_ACCURACY",
    icon: CrosshairIcon
  },
  {
    step: "STEP_03",
    title: "DIRECT MOVE-IN PROTOCOL",
    description: "Coordinate viewings and generate cryptographic co-habitation agreements directly with verified hosts. Zero broker fees.",
    badge: "ZERO_BROKERAGE",
    icon: ShieldCheck
  }
];

function CrosshairIcon(props: React.ComponentProps<typeof Compass>) {
  return <Compass {...props} />;
}

export default function HomePage() {
  const featuredListings = DEMO_LISTINGS.slice(0, 3);

  return (
    <main className="min-h-screen pb-16 bg-obsidian text-slate-100 font-mono selection:bg-phosphor selection:text-black">
      {/* Top Telemetry Notification Ribbon */}
      <div className="border-b border-tungsten-border/80 bg-tungsten-panel/80 px-4 py-2 text-[11px] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-phosphor animate-pulse" />
            <span className="font-bold text-white">SYSTEM_STATUS: ALL_RADAR_CLUSTERS_ONLINE</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">LATENCY: 14MS</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-phosphor font-bold">100% DIRECT HOSTS</span>
            <span>ZERO_BROKERAGE_GUARANTEE</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Interactive Radar Canvas */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          {/* Main Hero Cockpit Panel */}
          <div className="chamfer-card border border-tungsten-border bg-obsidian-sub p-6 sm:p-10 lg:col-span-7 flex flex-col justify-between relative overflow-hidden shadow-2xl reticle-border">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <TacticalBadge variant="emerald" size="sm" pulse>
                  SYSTEM_V2.0 // ACTIVE
                </TacticalBadge>
                <TacticalBadge variant="cyan" size="sm">
                  SPATIAL_RADAR
                </TacticalBadge>
                <TacticalBadge variant="amber" size="sm">
                  ZERO_BROKERAGE
                </TacticalBadge>
              </div>

              <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.05]">
                STOP LIVING WITH <span className="text-slate-600 line-through decoration-rose-500 decoration-2">STRANGERS</span>.<br />
                FIND FLATMATES WHO MATCH YOUR{" "}
                <span className="bg-phosphor text-black px-2.5 py-0.5 inline-block -rotate-1 font-mono shadow-glow-phosphor">
                  FREQUENCY
                </span>
                .
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                The high-precision roommate discovery engine. Verified profiles, multi-vector lifestyle DNA telemetry, and direct human-to-human connections across India&apos;s leading tech clusters.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/browse"
                  className="chamfer-card-sm flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase bg-phosphor text-black hover:bg-phosphor-glow shadow-glow-phosphor transition"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>EXPLORE_SPACES</span>
                </Link>
                <Link
                  href="/onboarding"
                  className="chamfer-card-sm flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase border border-tungsten-border bg-tungsten text-slate-200 hover:border-violet hover:text-violet transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                  <span>[ CALIBRATE_VIBE_DNA ]</span>
                </Link>
              </div>
            </div>

            {/* Quick Search Telemetry Console */}
            <div className="mt-8 rounded-xl border border-tungsten-border bg-tungsten/90 p-4 shadow-lg">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-3 border-b border-tungsten-border/60 pb-2">
                <span className="flex items-center gap-1.5 text-phosphor">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>QUICK_MATCH_TELEMETRY_CONSOLE</span>
                </span>
                <span className="text-slate-500">PARAM_SEARCH_V2</span>
              </div>

              <form action="/browse" method="GET" className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-center">
                <div className="flex items-center gap-2 rounded-lg bg-obsidian px-3 py-2.5 border border-tungsten-border">
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                  <select
                    name="city"
                    defaultValue=""
                    className="w-full bg-transparent text-xs text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="" className="bg-tungsten text-slate-200">METRO: ALL</option>
                    <option value="Bangalore" className="bg-tungsten text-slate-200">Bangalore</option>
                    <option value="Mumbai" className="bg-tungsten text-slate-200">Mumbai</option>
                    <option value="Delhi" className="bg-tungsten text-slate-200">Delhi & NCR</option>
                    <option value="Hyderabad" className="bg-tungsten text-slate-200">Hyderabad</option>
                    <option value="Pune" className="bg-tungsten text-slate-200">Pune</option>
                    <option value="Gurgaon" className="bg-tungsten text-slate-200">Gurgaon</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-obsidian px-3 py-2.5 border border-tungsten-border">
                  <SlidersHorizontal className="h-4 w-4 text-solar shrink-0" />
                  <select
                    name="roomType"
                    defaultValue=""
                    className="w-full bg-transparent text-xs text-slate-100 focus:outline-none cursor-pointer"
                  >
                    <option value="" className="bg-tungsten text-slate-200">TYPE: ANY</option>
                    <option value="single" className="bg-tungsten text-slate-200">Single Room</option>
                    <option value="shared" className="bg-tungsten text-slate-200">Shared Room</option>
                    <option value="entire_flat" className="bg-tungsten text-slate-200">Entire Flat</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-obsidian px-3 py-2.5 border border-tungsten-border">
                  <span className="text-xs font-bold text-slate-500">MAX_₹</span>
                  <input
                    type="number"
                    name="maxRent"
                    placeholder="25000"
                    className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="chamfer-card-sm flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider bg-phosphor text-black hover:bg-phosphor-glow shadow-glow-phosphor transition cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>EXECUTE_SEARCH</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Hero Radar Visualizer */}
          <div className="lg:col-span-5 flex flex-col">
            <RadarCanvas height={360} className="h-full flex-1" />
          </div>
        </div>
      </section>

      {/* Live System Metrics Stream Ribbon */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="chamfer-card-sm border border-tungsten-border bg-tungsten-panel p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-phosphor">48.5K+</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">ACTIVE_SEEKERS</p>
            </div>
            <Users className="h-6 w-6 text-slate-600" />
          </div>

          <div className="chamfer-card-sm border border-tungsten-border bg-tungsten-panel p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">12.4K+</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">VERIFIED_SPACES</p>
            </div>
            <Building2 className="h-6 w-6 text-slate-600" />
          </div>

          <div className="chamfer-card-sm border border-tungsten-border bg-tungsten-panel p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">98.4%</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">MATCH_SUCCESS_RATE</p>
            </div>
            <Sparkles className="h-6 w-6 text-slate-600" />
          </div>

          <div className="chamfer-card-sm border border-tungsten-border bg-tungsten-panel p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">99.98%</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">SYSTEM_UPTIME</p>
            </div>
            <Activity className="h-6 w-6 text-slate-600" />
          </div>
        </div>
      </section>

      {/* Curated Spatial Zones (5 Metro Tech Clusters) */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 border-b border-tungsten-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-phosphor">// SPATIAL_ZONES</span>
              <TacticalBadge variant="emerald" size="xs">5 METRO CLUSTERS</TacticalBadge>
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight mt-1">
              Explore by Community Frequency
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>VIEW_ALL_ZONES</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CURATED_ZONES.map((zone) => {
            const Icon = zone.icon;
            return (
              <Link
                key={zone.tag}
                href={`/browse?city=${encodeURIComponent(zone.city)}`}
                className="chamfer-card-sm border border-tungsten-border bg-tungsten-panel p-4 hover:border-phosphor hover:bg-tungsten-card transition duration-150 block space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-obsidian border border-tungsten-border text-phosphor group-hover:border-phosphor">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold text-phosphor">
                    {zone.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-white group-hover:text-phosphor uppercase">
                    {zone.city}
                  </h3>
                  <p className="text-[11px] text-cyan-400 mt-0.5">{zone.locality}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{zone.vibe}</p>
                </div>

                <div className="pt-2 border-t border-tungsten-border/60 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-slate-300">
                  <span>ENTER_ZONE</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Spaces Feed */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 border-b border-tungsten-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-phosphor">// VERIFIED_FEED</span>
              <TacticalBadge variant="cyan" size="xs">DIRECT_HOSTS</TacticalBadge>
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight mt-1">
              High-Frequency Verified Spaces
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>EXPLORE_ALL_LISTINGS</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing, idx) => (
            <article
              key={listing.id}
              className="chamfer-card border border-tungsten-border bg-tungsten-panel p-0 overflow-hidden hover:border-phosphor transition duration-200 flex flex-col justify-between group"
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
                  <TacticalBadge variant="cyan" size="xs">
                    {listing.room_type.toUpperCase()}
                  </TacticalBadge>
                </div>
                <div className="absolute top-3 right-3">
                  <CompatibilityBadge score={idx === 0 ? 96 : idx === 1 ? 91 : 84} />
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="chamfer-card-sm bg-obsidian/90 px-3 py-1 border border-tungsten-border backdrop-blur-md">
                    <span className="text-base font-black text-phosphor">₹{listing.rent.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">/mo</span>
                  </div>
                  <div className="chamfer-card-sm bg-obsidian/90 px-2 py-1 border border-tungsten-border text-[10px] text-slate-300 backdrop-blur-md">
                    0% BROKERAGE
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="line-clamp-1 text-sm font-black uppercase text-white group-hover:text-phosphor transition">
                    {listing.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{listing.locality}, {listing.city}</span>
                  </p>
                </div>

                {/* Host DNA Strip */}
                <div className="flex items-center gap-3 rounded-lg border border-tungsten-border bg-obsidian p-2.5">
                  {listing.profiles.avatar_url ? (
                    <Image
                      src={listing.profiles.avatar_url}
                      alt={listing.profiles.full_name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded object-cover border border-tungsten-border"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-phosphor text-black font-black text-xs">
                      {listing.profiles.full_name[0]}
                    </div>
                  )}
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-xs font-bold text-white">{listing.profiles.full_name}</p>
                      {listing.profiles.is_verified && (
                        <ShieldCheck className="h-3.5 w-3.5 text-phosphor" />
                      )}
                    </div>
                    <p className="truncate text-[10px] text-slate-400">{listing.profiles.profession || "VERIFIED_HOST"}</p>
                  </div>
                </div>

                {/* Vibe Tags */}
                {listing.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {listing.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-tungsten-border bg-tungsten px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        #{t.replace(" ", "_")}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-tungsten-border flex items-center justify-between text-xs">
                  <span className="text-slate-500">AVAIL: {listing.available_from}</span>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="font-bold text-phosphor hover:underline inline-flex items-center gap-1"
                  >
                    <span>[ VIEW_DOSSIER ]</span>
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
        <div className="chamfer-card p-8 sm:p-12 border border-tungsten-border bg-obsidian-sub shadow-xl">
          <div className="max-w-xl mb-10">
            <TacticalBadge variant="emerald" size="sm">
              PROTOCOL_SPECIFICATION
            </TacticalBadge>
            <h2 className="mt-3 text-3xl font-black uppercase text-white tracking-tight">
              How Roommate Sphere Operates
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Zero brokers. Zero sketchy listings. 100% lifestyle telemetry and algorithmic harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROTOCOL_STEPS.map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.step}
                  className="chamfer-card-sm border border-tungsten-border bg-tungsten-panel p-6 space-y-4 hover:border-phosphor transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-phosphor">{item.step}</span>
                    <TacticalBadge variant="cyan" size="xs">
                      {item.badge}
                    </TacticalBadge>
                  </div>
                  <div className="flex items-center gap-2">
                    <StepIcon className="h-4 w-4 text-phosphor" />
                    <h3 className="text-sm font-black uppercase text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Conversion Box */}
      <section className="mx-auto max-w-5xl px-4 pt-6 text-center">
        <div className="chamfer-card p-10 border border-phosphor bg-obsidian-card shadow-glow-phosphor space-y-4">
          <TacticalBadge variant="emerald" size="sm" pulse>
            LIVING_HARMONY_READY
          </TacticalBadge>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Ready to find your harmonious living frequency?
          </h2>
          <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
            Join thousands of verified techies, designers, founders, and students discovering high-vibe spaces every single day.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="chamfer-card-sm bg-phosphor text-black font-black uppercase px-8 py-3 text-xs tracking-wider hover:bg-phosphor-glow shadow-glow-phosphor transition"
            >
              CREATE_ACCOUNT_NOW
            </Link>
            <Link
              href="/browse"
              className="chamfer-card-sm border border-tungsten-border bg-tungsten text-slate-200 font-bold uppercase px-6 py-3 text-xs hover:border-cyan hover:text-cyan transition"
            >
              BROWSE_LISTINGS_DIRECTLY
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
