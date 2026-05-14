import Link from "next/link";

export type CompatibilityBadgeProps = {
  score: number;
};

export function CompatibilityBadge({ score }: CompatibilityBadgeProps) {
  if (score < 0) {
    return (
      <Link
        href="/onboarding"
        className="inline-flex h-6 items-center rounded-full border border-slate-300 bg-slate-50 px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        Set preferences →
      </Link>
    );
  }

  const tone = score >= 75
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : score >= 50
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-slate-300 bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-semibold ${tone}`}>
      {score}% match
    </span>
  );
}
