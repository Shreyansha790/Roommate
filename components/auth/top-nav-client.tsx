"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import { Search, Sparkles } from "lucide-react";

export function TopNavClient({
  user,
  name,
  avatarUrl
}: {
  user: { id: string; email?: string | null } | null;
  name?: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const navLinks = [
    { href: "/browse", label: "residences." },
    { href: "/post", label: "post a room." },
    { href: "/onboarding", label: "vibe match." },
    { href: "/messages", label: "chat." },
    { href: "/agreement", label: "agreement." },
    { href: "/saved", label: "saved." }
  ];

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans">
      <div className="glass-capsule rounded-full px-5 sm:px-7 py-3 flex items-center justify-between transition-all">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="font-black text-stone-950 text-lg tracking-tighter">
            Roommate<span className="text-coral-500 font-black">Sphere.</span>
          </span>
        </Link>

        {/* Minimalist Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-tight text-stone-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition lowercase ${
                  isActive
                    ? "text-stone-950 font-bold underline underline-offset-8 decoration-coral-500"
                    : "hover:text-stone-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Search & Profile CTA */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <button
            onClick={handleOpenSearch}
            className="flex items-center gap-2 rounded-full bg-stone-100 hover:bg-stone-200/80 px-3.5 py-1.5 text-xs text-stone-600 border border-stone-200 transition"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5 text-stone-500" />
            <span className="hidden sm:inline">search.</span>
            <kbd className="hidden sm:inline rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-stone-400 border border-stone-200">
              ⌘K
            </kbd>
          </button>

          <Link
            href="/post"
            className="hidden sm:inline-flex text-xs font-bold bg-stone-950 text-white hover:bg-coral-500 px-4 py-2 rounded-full transition shadow-sm"
          >
            post a room.
          </Link>

          {user ? (
            <ProfileMenu
              name={name || user.email?.split("@")[0] || "Account"}
              email={user.email || null}
              avatarUrl={avatarUrl || null}
            />
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold text-stone-950 hover:text-coral-500 px-3 py-1.5 transition lowercase"
            >
              sign in.
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
