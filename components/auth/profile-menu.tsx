"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { User, Bookmark, PlusCircle, LogOut, Compass, Sparkles, ChevronDown } from "lucide-react";

type ProfileMenuProps = {
  name: string;
  email: string | null;
  avatarUrl: string | null;
};

export function ProfileMenu({ name, email, avatarUrl }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function onLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-lg border-1.5 border-zinc-800 bg-[#121217] px-3 py-1.5 text-xs font-mono font-bold text-zinc-200 shadow-[2px_2px_0px_#18181b] transition duration-150 hover:border-[#ccff00] hover:text-[#ccff00] focus:outline-none"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} width={24} height={24} className="h-6 w-6 rounded-md object-cover border border-zinc-700" />
        ) : (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#ccff00] text-[10px] font-black text-black">
            {initials || "U"}
          </span>
        )}
        <span className="max-w-[110px] truncate">{name || email || "PROFILE"}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-150 ${open ? 'rotate-180 text-[#ccff00]' : ''}`} />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-xl border-1.5 border-zinc-700 bg-[#121217] p-2 shadow-[6px_6px_0px_#000]">
          <div className="border-b border-zinc-800 px-3 py-2">
            <p className="font-mono text-[10px] uppercase text-zinc-500">AUTHENTICATED_AS</p>
            <p className="truncate text-xs font-bold text-white font-mono">{name || email}</p>
          </div>

          <div className="py-1.5 space-y-1">
            <Link
              href="/onboarding"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-mono font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-[#ccff00]"
            >
              <Sparkles className="h-4 w-4 text-[#ccff00]" />
              <span>[ VIBE_DNA_PROFILE ]</span>
            </Link>
            <Link
              href="/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-mono font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-[#3b82f6]"
            >
              <Bookmark className="h-4 w-4 text-[#3b82f6]" />
              <span>[ SAVED_LISTINGS ]</span>
            </Link>
            <Link
              href="/post"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-mono font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-[#ff5500]"
            >
              <PlusCircle className="h-4 w-4 text-[#ff5500]" />
              <span>[ POST_YOUR_SPACE ]</span>
            </Link>
            <Link
              href="/browse"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-mono font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-[#a855f7]"
            >
              <Compass className="h-4 w-4 text-[#a855f7]" />
              <span>[ EXPLORE_FLATS ]</span>
            </Link>
          </div>

          <div className="border-t border-zinc-800 pt-1.5">
            <button
              onClick={onLogout}
              disabled={loading}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-mono font-bold text-rose-400 transition hover:bg-rose-950/40"
            >
              <LogOut className="h-4 w-4 text-rose-500" />
              <span>{loading ? "LOGGING_OUT..." : "[ SIGN_OUT ]"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}


