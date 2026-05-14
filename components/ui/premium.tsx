import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl",
        "shadow-[0_20px_70px_-35px_rgba(56,189,248,0.55)]",
        "transition-all duration-300 hover:border-cyan-300/35 hover:bg-white/10",
        className
      )}
      {...props}
    />
  );
}

export function FloatingPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-slate-900/65 backdrop-blur-xl",
        "shadow-[0_18px_50px_-24px_rgba(168,85,247,0.55)]",
        "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]",
        className
      )}
      {...props}
    />
  );
}

export function GlowBadge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-300/30",
        "bg-cyan-400/15 px-3 py-1 text-xs font-medium text-cyan-100",
        "shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-all duration-300",
        className
      )}
      {...props}
    />
  );
}

export function AnimatedButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-xl bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400",
        "animate-gradient px-4 py-2 text-sm font-semibold text-slate-950",
        "transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] active:scale-[0.98]",
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-gradient-to-r from-slate-700/60 via-slate-600/40 to-slate-700/60", className)} />;
}
