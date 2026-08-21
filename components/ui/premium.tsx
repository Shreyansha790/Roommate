import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, HTMLAttributes } from "react";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bento-card p-6",
        className
      )}
      {...props}
    />
  );
}

export function BentoCard({
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        interactive ? "bento-card-interactive" : "bento-card",
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
        "rounded-2xl border-1.5 border-zinc-800 bg-[#121217] p-5 shadow-[4px_4px_0px_0px_#18181b] transition-all hover:border-zinc-700 hover:translate-x-[-2px] hover:translate-y-[-2px]",
        className
      )}
      {...props}
    />
  );
}

export function GlowBadge({
  className,
  variant = "lime",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: "lime" | "orange" | "blue" | "purple" | "cyan" | "violet" | "emerald" }) {
  const variantStyles = {
    lime: "border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]",
    cyan: "border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]",
    orange: "border-[#ff5500] bg-[#ff5500]/10 text-[#ff5500]",
    blue: "border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]",
    purple: "border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]",
    violet: "border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]",
    emerald: "border-[#34d399] bg-[#34d399]/10 text-[#34d399]"
  };

  return (
    <span
      className={cn(
        "sticker-pill inline-flex items-center gap-1.5 font-mono text-[11px]",
        variantStyles[variant] || variantStyles.lime,
        className
      )}
      {...props}
    />
  );
}

export function VibePill({
  className,
  active,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-all duration-150",
        active
          ? "border-1.5 border-[#ccff00] bg-[#ccff00] text-black font-bold shadow-[2px_2px_0px_#ffffff]"
          : "border-1.5 border-zinc-800 bg-[#18181f] text-zinc-300 hover:border-zinc-600 hover:text-white",
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
        "neo-button px-6 py-3 text-sm",
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-zinc-800", className)} />;
}


