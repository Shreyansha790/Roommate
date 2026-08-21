import Link from "next/link";
import { Zap } from "lucide-react";

export type CompatibilityBadgeProps = {
  score: number;
};

export function CompatibilityBadge({ score }: CompatibilityBadgeProps) {
  if (score < 0) {
    return (
      <Link
        href="/onboarding"
        className="inline-flex items-center gap-1 rounded-md border-1.5 border-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#ccff00] transition hover:bg-[#ccff00] hover:text-black"
      >
        <Zap className="h-3 w-3 fill-current" />
        <span>VIBE_DNA: SET</span>
      </Link>
    );
  }

  const isHigh = score >= 80;
  const isMed = score >= 60;

  const styleClass = isHigh
    ? "border-1.5 border-[#ccff00] bg-[#ccff00] text-black font-extrabold shadow-[2px_2px_0px_#000]"
    : isMed
      ? "border-1.5 border-[#3b82f6] bg-[#3b82f6]/20 text-[#3b82f6] font-bold"
      : "border-1.5 border-[#ff5500] bg-[#ff5500]/20 text-[#ff5500] font-bold";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${styleClass}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${isHigh ? 'bg-black' : isMed ? 'bg-[#3b82f6]' : 'bg-[#ff5500]'}`} />
      <span>{score}%_MATCH</span>
    </span>
  );
}


