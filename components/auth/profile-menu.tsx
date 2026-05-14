"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type ProfileMenuProps = {
  name: string;
  email: string | null;
  avatarUrl: string | null;
};

export function ProfileMenu({ name, email, avatarUrl }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");

  async function onLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((prev) => !prev)} className="flex items-center gap-2 rounded-full border bg-white px-2 py-1 text-sm shadow-sm">
        {avatarUrl ? <Image src={avatarUrl} alt={name} width={28} height={28} className="h-7 w-7 rounded-full object-cover" /> : <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">{initials || "U"}</span>}
        <span className="max-w-28 truncate text-muted-foreground">{name || email || "User"}</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border bg-white p-1 shadow-lg">
          <Link href="/onboarding" className="block rounded px-3 py-2 text-sm hover:bg-slate-100">Profile</Link>
          <Link href="/browse" className="block rounded px-3 py-2 text-sm hover:bg-slate-100">My Listings</Link>
          <button onClick={onLogout} disabled={loading} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-100">
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
