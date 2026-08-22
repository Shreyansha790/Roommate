import Link from "next/link";
import { Crosshair, ShieldCheck, Terminal, Lock, Activity, Radio } from "lucide-react";
import { TacticalBadge } from "./HUD/TacticalBadge";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-tungsten-border bg-obsidian text-slate-400 font-mono">
      {/* Top Telemetry Metric Strip */}
      <div className="border-b border-tungsten-border/60 bg-obsidian-sub/80 py-2.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-[11px]">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-phosphor animate-pulse" />
            <span className="font-bold text-slate-200">SYS_TELEMETRY:</span>
            <span className="text-phosphor font-bold">OPTIMAL</span>
            <span className="text-slate-600">//</span>
            <span className="text-slate-400">LATENCY: 16ms</span>
            <span className="text-slate-600">//</span>
            <span className="text-cyan-400">PROTOCOL: ENCRYPTED_TLS</span>
          </div>

          <div className="flex items-center gap-3">
            <TacticalBadge variant="emerald" size="xs" pulse>
              RADAR_CORE_ONLINE
            </TacticalBadge>
            <span className="text-slate-500 hidden sm:inline">ZERO_BROKERAGE_SECURED</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 text-base font-black tracking-tight text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-phosphor/50 bg-phosphor/10 text-phosphor shadow-glow-phosphor">
                <Crosshair className="h-4.5 w-4.5" />
              </div>
              <span className="tracking-wider">
                ROOMMATE<span className="text-phosphor glow-text-emerald">SPHERE</span>
              </span>
            </Link>
            <p className="max-w-md text-xs text-slate-400 leading-relaxed font-mono">
              Cyber-Cartographic spatial living discovery platform. Matching verified humans through 5-dimensional lifestyle harmonic algorithms, commute isochrones, and smart agreements.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Terminal className="h-3 w-3 text-phosphor" />
                <span>BUILD: 2026.08.21</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-cyan" />
                <span>AES-256 ENCRYPTION</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-amber-400" />
                <span>99.98% UPTIME</span>
              </span>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-phosphor">[ NAVIGATION_INDEX ]</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <Link href="/browse" className="transition hover:text-phosphor hover:underline">
                  01 // BROWSE_SPATIAL_RADAR
                </Link>
              </li>
              <li>
                <Link href="/post" className="transition hover:text-solar hover:underline">
                  02 // SMART_LISTING_STUDIO
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="transition hover:text-violet hover:underline">
                  03 // VIBE_DNA_CALIBRATION
                </Link>
              </li>
              <li>
                <Link href="/saved" className="transition hover:text-cyan hover:underline">
                  04 // SAVED_COMPARISON_MATRIX
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white hover:underline">
                  05 // TERMINAL_LOGIN
                </Link>
              </li>
            </ul>
          </div>

          {/* Active Metro Zones Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan">[ ACTIVE_RADAR_ZONES ]</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <Link href="/browse?city=Bangalore" className="transition hover:text-cyan hover:underline">
                  &gt; BANGALORE [ TECH_CORRIDOR ]
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Mumbai" className="transition hover:text-cyan hover:underline">
                  &gt; MUMBAI [ COASTAL_HUB ]
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Delhi" className="transition hover:text-cyan hover:underline">
                  &gt; DELHI_NCR [ METRO_RING ]
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Hyderabad" className="transition hover:text-cyan hover:underline">
                  &gt; HYDERABAD [ HITEC_ZONE ]
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Pune" className="transition hover:text-cyan hover:underline">
                  &gt; PUNE [ TECH_VALLEY ]
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Verification Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-tungsten-border/80 pt-8 sm:flex-row text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} ROOMMATESPHERE // ALL PROTOCOLS RESERVED.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-phosphor" />
              100% VERIFIED LIVING UNITS
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="h-3.5 w-3.5 text-cyan" />
              ZERO_BROKERAGE_GUARANTEE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
