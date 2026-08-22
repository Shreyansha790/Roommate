import Link from "next/link";
import { Zap } from "lucide-react";
import { TacticalBadge } from "@/components/HUD/TacticalBadge";

export type CompatibilityBadgeProps = {
  score: number;
};

export function CompatibilityBadge({ score }: CompatibilityBadgeProps) {
  if (score < 0) {
    return (
      <Link href="/onboarding">
        <TacticalBadge
          variant="amber"
          size="xs"
          pulse
          icon={<Zap className="h-2.5 w-2.5 mr-1" />}
          className="cursor-pointer"
        >
          CALIBRATE_DNA
        </TacticalBadge>
      </Link>
    );
  }

  const variant = score >= 80 ? "emerald" : score >= 60 ? "cyan" : "amber";

  return (
    <TacticalBadge variant={variant} size="xs" pulse>
      {`${score}%_SYNC`}
    </TacticalBadge>
  );
}
