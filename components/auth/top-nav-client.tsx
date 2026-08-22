"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import { TacticalBadge } from "@/components/HUD/TacticalBadge";
import {
  playBlip,
  toggleAudioMute,
  isAudioMuted
} from "@/lib/audio-telemetry";
import {
  Crosshair,
  Compass,
  PlusCircle,
  Bookmark,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Menu,
  X,
  Activity,
  ShieldCheck,
  Terminal
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
  const [latency, setLatency] = React.useState<number>(18);
  const [muted, setMuted] = React.useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [isMac, setIsMac] = React.useState<boolean>(false);

  // Initialize client sound state & OS detection
  React.useEffect(() => {
    setMuted(isAudioMuted());

    const handleSoundToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail !== undefined) {
        setMuted(customEvent.detail.muted);
      }
    };

    window.addEventListener("telemetry-sound-toggled", handleSoundToggle);

    if (typeof window !== "undefined" && navigator.platform) {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));
    }

    // Fluctuating latency simulation (14ms - 22ms)
    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(14 + Math.random() * 8));
    }, 4500);

    // Global Cmd+K / Ctrl+K hotkey handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        playBlip(1100, 0.04);
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("telemetry-sound-toggled", handleSoundToggle);
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(latencyInterval);
    };
  }, []);

  const handleToggleSound = () => {
    const nextMuted = toggleAudioMute();
    setMuted(nextMuted);
  };

  const triggerCommandPalette = () => {
    playBlip(1100, 0.04);
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const navLinks = [
    {
      href: "/browse",
      label: "EXPLORE",
      code: "01",
      icon: Compass,
      color: "hover:border-phosphor hover:text-phosphor",
      active: pathname.startsWith("/browse")
    },
    {
      href: "/post",
      label: "POST_SPACE",
      code: "02",
      icon: PlusCircle,
      color: "hover:border-solar hover:text-solar",
      active: pathname.startsWith("/post")
    },
    {
      href: "/messages",
      label: "COMMS",
      code: "03",
      icon: Activity,
      color: "hover:border-cyan hover:text-cyan",
      active: pathname.startsWith("/messages")
    },
    {
      href: "/agreement",
      label: "AGREEMENT",
      code: "04",
      icon: ShieldCheck,
      color: "hover:border-solar hover:text-solar",
      active: pathname.startsWith("/agreement")
    },
    {
      href: "/saved",
      label: "SAVED",
      code: "05",
      icon: Bookmark,
      color: "hover:border-violet hover:text-violet",
      active: pathname.startsWith("/saved")
    }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-tungsten-border/80 bg-obsidian/95 backdrop-blur-md">
      {/* Top Telemetry Ticker Ribbon */}
      <div className="border-b border-tungsten-border/50 bg-obsidian-sub/90 py-1 text-[11px] font-mono text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6">
          {/* Left: Active Metro Nodes */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-phosphor opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-phosphor" />
            </span>
            <span className="font-bold text-slate-200">METRO_NODES:</span>
            <span className="text-slate-400 tracking-wider hidden sm:inline">
              [ BLR • BOM • DEL • HYD • PNQ • GGN ]
            </span>
          </div>

          {/* Right: Telemetry Metrics & SFX Toggle */}
          <div className="flex items-center gap-3">
            {/* Fluctuating Live Latency */}
            <div className="hidden items-center gap-1.5 sm:flex text-slate-400">
              <Activity className="h-3 w-3 text-cyan-400 animate-pulse" />
              <span className="text-[10px]">
                LATENCY: <span className="font-bold text-cyan-400">{latency}ms</span>
              </span>
            </div>

            <span className="hidden sm:inline text-tungsten-border">|</span>

            {/* Zero Brokerage Badge */}
            <div className="hidden items-center gap-1 sm:flex">
              <ShieldCheck className="h-3 w-3 text-phosphor" />
              <span className="text-[10px] font-bold text-phosphor tracking-wider">
                100%_ZERO_BROKERAGE
              </span>
            </div>

            <span className="hidden sm:inline text-tungsten-border">|</span>

            {/* Audio Telemetry SFX Toggle */}
            <button
              onClick={handleToggleSound}
              className="flex items-center gap-1 rounded border border-tungsten-border/80 bg-tungsten/60 px-2 py-0.5 text-[10px] font-mono text-slate-300 transition hover:border-phosphor hover:text-phosphor focus:outline-none"
              title={muted ? "Unmute Tactical SFX" : "Mute Tactical SFX"}
            >
              {muted ? (
                <>
                  <VolumeX className="h-3 w-3 text-rose-400" />
                  <span className="text-rose-400 font-bold">SFX: OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3 w-3 text-phosphor" />
                  <span className="text-phosphor font-bold">SFX: ON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tactical Navigation Bar */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Brand Logo with Radar Crosshair */}
        <Link
          href="/"
          onClick={() => playBlip(880, 0.02)}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-phosphor/50 bg-phosphor/10 text-phosphor shadow-glow-phosphor transition duration-200 group-hover:scale-105 group-hover:bg-phosphor/20">
            <Crosshair className="h-5 w-5 animate-spin" style={{ animationDuration: "16s" }} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1 font-mono">
              ROOMMATE<span className="text-phosphor glow-text-emerald">SPHERE</span>
              <span className="rounded border border-tungsten-border bg-tungsten-card px-1.5 py-0.2 text-[9px] font-bold text-slate-400">
                v2.0
              </span>
            </span>
          </div>
        </Link>

        {/* Global Command Palette (Cmd+K) Trigger */}
        <button
          onClick={triggerCommandPalette}
          className="hidden lg:flex items-center gap-2.5 rounded-lg border border-tungsten-border bg-tungsten-card/80 px-3.5 py-1.5 text-xs font-mono text-slate-400 transition hover:border-cyan hover:text-white shadow-tactical-card"
        >
          <Search className="h-3.5 w-3.5 text-cyan-400" />
          <span>AI_QUERY_RADAR</span>
          <kbd className="rounded border border-tungsten-border/80 bg-obsidian px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
            {isMac ? "⌘K" : "Ctrl+K"}
          </kbd>
        </button>

        {/* Center Nav Links */}
        <div className="hidden items-center gap-2 md:flex font-mono">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playBlip(980, 0.02)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-150 ${
                  link.active
                    ? "border-phosphor/80 bg-phosphor/10 text-phosphor shadow-glow-phosphor"
                    : "border-tungsten-border bg-tungsten-card text-slate-300 hover:bg-tungsten-panel " +
                      link.color
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{`[ ${link.code} // ${link.label} ]`}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Actions / Auth Menu */}
        <div className="flex items-center gap-2.5 font-mono">
          {/* Mobile Search Button */}
          <button
            onClick={triggerCommandPalette}
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-tungsten-border bg-tungsten-card text-slate-300 hover:border-cyan hover:text-cyan"
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
                onClick={() => playBlip(880, 0.02)}
                className="hidden sm:inline-flex rounded-lg border border-tungsten-border bg-tungsten-card px-3.5 py-1.5 text-xs font-bold text-slate-300 transition hover:border-slate-400 hover:text-white"
              >
                [ SIGN_IN ]
              </Link>
              <Link
                href="/signup"
                onClick={() => playBlip(1200, 0.03)}
                className="rounded-lg bg-phosphor px-3.5 py-1.5 text-xs font-black text-obsidian shadow-glow-phosphor transition hover:bg-phosphor-dim active:scale-95"
              >
                JOIN_NOW
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Drawer Toggle */}
          <button
            onClick={() => {
              playBlip(750, 0.02);
              setMobileMenuOpen((prev) => !prev);
            }}
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-tungsten-border bg-tungsten-card text-slate-300 hover:border-phosphor hover:text-phosphor"
            aria-label="Toggle Mobile HUD Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Over HUD Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-tungsten-border bg-obsidian-card/95 backdrop-blur-xl p-4 font-mono scanline-overlay">
          <div className="space-y-2 pb-3 border-b border-tungsten-border/80">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span className="flex items-center gap-1">
                <Terminal className="h-3.5 w-3.5 text-phosphor" />
                <span>NAVIGATION_HUD</span>
              </span>
              <TacticalBadge variant="emerald" size="xs">
                ONLINE
              </TacticalBadge>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    playBlip(980, 0.02);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-lg border p-2.5 text-xs font-bold transition ${
                    link.active
                      ? "border-phosphor bg-phosphor/10 text-phosphor"
                      : "border-tungsten-border bg-tungsten-panel text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">[{link.code}]</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Telemetry Controls */}
          <div className="pt-3 space-y-3">
            <button
              onClick={() => {
                triggerCommandPalette();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 p-2.5 text-xs font-bold text-cyan-300"
            >
              <Search className="h-4 w-4" />
              <span>LAUNCH AI NLP QUERY [ ⌘K ]</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border border-tungsten-border rounded-lg p-2 bg-obsidian">
              <span>TACTICAL_AUDIO:</span>
              <button
                onClick={handleToggleSound}
                className="flex items-center gap-1 font-bold text-slate-200"
              >
                {muted ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <VolumeX className="h-3.5 w-3.5" /> MUTED
                  </span>
                ) : (
                  <span className="text-phosphor flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5" /> ACTIVE
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
