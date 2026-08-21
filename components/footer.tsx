import Link from "next/link";
import { Zap, ShieldCheck, Heart, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800 bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#ccff00] text-black">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <span>ROOMMATE<span className="text-[#ccff00]">SPHERE</span></span>
            </Link>
            <p className="max-w-sm text-xs font-mono text-zinc-400 leading-relaxed">
              Tactile, zero-brokerage roommate discovery engine. Connecting humans through lifestyle frequency matching and verified profiles.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
              <Terminal className="h-3.5 w-3.5 text-[#ccff00]" />
              <span>SYS_STATUS: OPTIMAL [LATENCY: 18ms]</span>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#ccff00]">[ NAVIGATION ]</h3>
            <ul className="mt-3 space-y-2 font-mono text-xs text-zinc-400">
              <li>
                <Link href="/browse" className="transition hover:text-white">/browse-flats</Link>
              </li>
              <li>
                <Link href="/post" className="transition hover:text-white">/post-space</Link>
              </li>
              <li>
                <Link href="/onboarding" className="transition hover:text-white">/vibe-dna-quiz</Link>
              </li>
              <li>
                <Link href="/saved" className="transition hover:text-white">/saved-wishlist</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#ccff00]">[ ACTIVE_ZONES ]</h3>
            <ul className="mt-3 space-y-2 font-mono text-xs text-zinc-400">
              <li>
                <Link href="/browse?city=Bangalore" className="transition hover:text-white">Bangalore (Tech Hubs)</Link>
              </li>
              <li>
                <Link href="/browse?city=Mumbai" className="transition hover:text-white">Mumbai (Sea View)</Link>
              </li>
              <li>
                <Link href="/browse?city=Delhi" className="transition hover:text-white">Delhi & NCR</Link>
              </li>
              <li>
                <Link href="/browse?city=Hyderabad" className="transition hover:text-white">Hyderabad (Hitec)</Link>
              </li>
              <li>
                <Link href="/browse?city=Pune" className="transition hover:text-white">Pune (KP / Hinjewadi)</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-8 sm:flex-row font-mono text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} ROOMMATESPHERE // ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-zinc-400"><ShieldCheck className="h-3.5 w-3.5 text-[#ccff00]" /> 100% Verified Humans</span>
            <span className="flex items-center gap-1.5 text-zinc-400"><Heart className="h-3.5 w-3.5 text-rose-500" /> Zero Brokerage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

