"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { playBlip } from "@/lib/audio-telemetry";
import { Bookmark, PlusCircle, LogOut, Compass, Sparkles, ChevronDown, UserCheck } from "lucide-react";

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
    playBlip(600, 0.04);
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative font-mono" ref={menuRef}>
      <button
        onClick={() => {
          playBlip(880, 0.02);
          setOpen((prev) => !prev);
        }}
        className="flex items-center gap-2.5 rounded-lg border border-tungsten-border bg-tungsten-card px-3 py-1.5 text-xs font-bold text-slate-200 shadow-tactical-card transition duration-150 hover:border-phosphor hover:text-phosphor focus:outline-none"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={24}
            height={24}
            className="h-6 w-6 rounded object-cover border border-tungsten-border"
          />
        ) : (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-phosphor/20 border border-phosphor/50 text-[10px] font-black text-phosphor">
            {initials || "U"}
          </span>
        )}
        <span className="max-w-[110px] truncate">{name || email || "OPERATOR"}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${
            open ? "rotate-180 text-phosphor" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-tungsten-border bg-obsidian-card/98 p-2 shadow-tactical-card backdrop-blur-xl chamfer-card">
          <div className="border-b border-tungsten-border/80 px-3 py-2">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase text-slate-500">OPERATOR_SESSION</p>
              <UserCheck className="h-3 w-3 text-phosphor" />
            </div>
            <p className="truncate text-xs font-bold text-white font-mono mt-0.5">{name || email}</p>
          </div>

          <div className="py-1.5 space-y-1">
            <Link
              href="/onboarding"
              onClick={() => {
                playBlip(980, 0.02);
                setOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-tungsten-panel hover:text-phosphor"
            >
              <Sparkles className="h-4 w-4 text-phosphor" />
              <span>[ VIBE_DNA_PROFILE ]</span>
            </Link>
            <Link
              href="/saved"
              onClick={() => {
                playBlip(980, 0.02);
                setOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-tungsten-panel hover:text-cyan"
            >
              <Bookmark className="h-4 w-4 text-cyan" />
              <span>[ SAVED_LISTINGS ]</span>
            </Link>
            <Link
              href="/post"
              onClick={() => {
                playBlip(980, 0.02);
                setOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-tungsten-panel hover:text-solar"
            >
              <PlusCircle className="h-4 w-4 text-solar" />
              <span>[ POST_YOUR_SPACE ]</span>
            </Link>
            <Link
              href="/browse"
              onClick={() => {
                playBlip(980, 0.02);
                setOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-tungsten-panel hover:text-violet"
            >
              <Compass className="h-4 w-4 text-violet" />
              <span>[ EXPLORE_FLATS ]</span>
            </Link>
          </div>

          <div className="border-t border-tungsten-border/80 pt-1.5">
            <button
              onClick={onLogout}
              disabled={loading}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-rose-400 transition hover:bg-rose-950/40"
            >
              <LogOut className="h-4 w-4 text-rose-500" />
              <span>{loading ? "TERMINATING_SESSION..." : "[ SIGN_OUT ]"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
