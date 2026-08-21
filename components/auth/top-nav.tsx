import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { ProfileMenu } from "./profile-menu";
import { ensureProfileForUser } from "@/lib/auth/ensure-profile";
import { Zap, Compass, PlusCircle, Bookmark, Sparkles } from "lucide-react";

export async function TopNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) await ensureProfileForUser(supabase, user);
  const name = (user?.user_metadata?.full_name as string | undefined) || (user?.user_metadata?.name as string | undefined) || user?.email || "";
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || (user?.user_metadata?.picture as string | undefined) || null;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#09090b]/95">
      {/* Top Ticker Line */}
      <div className="border-b border-zinc-900 bg-[#121217] py-1 text-[11px] font-mono text-zinc-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ccff00] animate-ping" />
            <span className="font-bold text-zinc-300">LIVE_METRO_DISCOVERY</span>
            <span className="hidden sm:inline text-zinc-600">/</span>
            <span className="hidden sm:inline text-zinc-500">BLR • BOM • DEL • HYD • PNQ • GGN</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-[#ccff00] font-bold">100%_ZERO_BROKERAGE</span>
            <span className="text-zinc-400 hidden sm:inline">ALGO_ACCURACY: 98.4%</span>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ccff00] text-black font-black shadow-[2px_2px_0px_#ffffff] transition duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1">
              ROOMMATE<span className="text-[#ccff00]">SPHERE</span>
              <span className="rounded bg-zinc-800 px-1 py-0.2 font-mono text-[9px] font-bold text-zinc-400">v2.0</span>
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/browse"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#121217] px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-200 transition hover:border-[#ccff00] hover:text-[#ccff00]"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>[ EXPLORE_FLATS ]</span>
          </Link>
          <Link
            href="/post"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#121217] px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-200 transition hover:border-[#ff5500] hover:text-[#ff5500]"
          >
            <PlusCircle className="h-3.5 w-3.5 text-[#ff5500]" />
            <span>[ POST_SPACE ]</span>
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#121217] px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-200 transition hover:border-[#a855f7] hover:text-[#a855f7]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#a855f7]" />
            <span>[ VIBE_QUIZ ]</span>
          </Link>
          <Link
            href="/saved"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#121217] px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-200 transition hover:border-[#3b82f6] hover:text-[#3b82f6]"
          >
            <Bookmark className="h-3.5 w-3.5 text-[#3b82f6]" />
            <span>[ SAVED ]</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <ProfileMenu name={name} email={user.email ?? null} avatarUrl={avatarUrl} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-zinc-800 bg-[#121217] px-3.5 py-2 text-xs font-mono font-bold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                SIGN_IN
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[#ccff00] px-4 py-2 text-xs font-black text-black border border-black shadow-[2px_2px_0px_#ffffff] transition hover:translate-x-[-1px] hover:translate-y-[-1px]"
              >
                JOIN_NOW
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}


