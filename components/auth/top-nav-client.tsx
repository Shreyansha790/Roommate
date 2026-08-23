"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import {
  Search,
  Sparkles,
  Compass,
  PlusCircle,
  MessageSquare,
  FileText,
  Bookmark
} from "lucide-react";

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
    { href: "/browse", label: "Explore", icon: Compass },
    { href: "/post", label: "Post a Room", icon: PlusCircle },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/agreement", label: "Agreement", icon: FileText },
    { href: "/saved", label: "Saved", icon: Bookmark }
  ];

  return (
    <header className="sticky top-3 z-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans">
      <div className="glass-capsule rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-coral-600 to-coral-400 text-white shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-black text-stone-900 text-base tracking-tight">
            Roommate<span className="text-coral-500 font-bold">Sphere</span>
          </span>
        </Link>

        {/* Center Search Pill Trigger */}
        <button
          onClick={handleOpenSearch}
          className="hidden md:flex items-center gap-2.5 rounded-full bg-stone-100/80 hover:bg-stone-100 px-4 py-1.5 text-xs text-stone-500 border border-stone-200/60 transition shadow-inner"
        >
          <Search className="h-3.5 w-3.5 text-coral-500" />
          <span>Search with AI (e.g. 2BHK in Indiranagar)</span>
          <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 border border-stone-200 shadow-sm">
            ⌘K
          </kbd>
        </button>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-stone-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${
                  isActive
                    ? "bg-stone-900 text-white shadow-sm"
                    : "hover:text-stone-900 hover:bg-stone-100/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5 opacity-80" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Auth / Profile Menu */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <ProfileMenu
              name={name || user.email?.split("@")[0] || "Account"}
              email={user.email || null}
              avatarUrl={avatarUrl || null}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-bold text-stone-700 hover:text-stone-900 px-3 py-1.5 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="neo-button px-4 py-1.5 text-xs font-bold shadow-luxury-coral"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
