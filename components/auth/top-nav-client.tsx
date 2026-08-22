"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import {
  Compass,
  PlusCircle,
  Bookmark,
  Sparkles,
  Search,
  Menu,
  X,
  MessageSquare,
  FileText
} from "lucide-react";

export interface TopNavClientProps {
  user: {
    id: string;
    email?: string | null;
  } | null;
  name: string;
  avatarUrl: string | null;
}

export function TopNavClient({ user, name, avatarUrl }: TopNavClientProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && navigator.platform) {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const navLinks = [
    {
      href: "/browse",
      label: "Explore Flats",
      icon: Compass,
      active: pathname.startsWith("/browse")
    },
    {
      href: "/post",
      label: "Post a Room",
      icon: PlusCircle,
      active: pathname.startsWith("/post")
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageSquare,
      active: pathname.startsWith("/messages")
    },
    {
      href: "/agreement",
      label: "Agreement",
      icon: FileText,
      active: pathname.startsWith("/agreement")
    },
    {
      href: "/saved",
      label: "Saved",
      icon: Bookmark,
      active: pathname.startsWith("/saved")
    }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      {/* Top Banner */}
      <div className="border-b border-stone-100 bg-[#fcfbf9] py-1.5 text-xs text-stone-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-stone-700">Explore Rooms in:</span>
            <span className="text-stone-500 hidden sm:inline">Bangalore • Mumbai • Delhi • Hyderabad • Pune • Gurgaon</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-coral-600">100% Zero Brokerage</span>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <span className="text-stone-500 hidden sm:inline">Direct Host Connections</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral-500 text-white font-bold shadow-warm-coral transition duration-200 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-stone-900">
            Roommate<span className="text-coral-500">Sphere</span>
          </span>
        </Link>

        {/* Global AI Search Trigger */}
        <button
          onClick={triggerCommandPalette}
          className="hidden md:flex items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs text-stone-500 hover:border-coral-300 hover:bg-white hover:text-stone-800 transition shadow-sm"
        >
          <Search className="h-3.5 w-3.5 text-coral-500" />
          <span className="font-medium">Search with AI (e.g. 2BHK in Indiranagar under 25k)</span>
          <kbd className="rounded bg-stone-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600">
            {isMac ? "⌘K" : "Ctrl+K"}
          </kbd>
        </button>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-1 font-medium text-sm text-stone-600">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${
                  link.active
                    ? "bg-coral-50 text-coral-600 font-semibold"
                    : "hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Auth / Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerCommandPalette}
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:text-coral-500"
            title="Search (Cmd+K)"
          >
            <Search className="h-4 w-4" />
          </button>

          {user ? (
            <ProfileMenu name={name} email={user.email ?? null} avatarUrl={avatarUrl} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-coral-500 px-4 py-1.5 text-xs font-bold text-white shadow-warm-coral hover:bg-coral-600 transition active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Drawer */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex lg:hidden items-center justify-center h-9 w-9 rounded-full border border-stone-200 bg-stone-50 text-stone-600"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white p-4 space-y-3">
          <button
            onClick={() => {
              triggerCommandPalette();
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 p-3 text-xs font-semibold text-coral-700"
          >
            <Search className="h-4 w-4" />
            <span>Search spaces with AI [ ⌘K ]</span>
          </button>

          <div className="space-y-1 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl p-2.5 text-sm font-medium transition ${
                    link.active
                      ? "bg-coral-50 text-coral-600 font-semibold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
