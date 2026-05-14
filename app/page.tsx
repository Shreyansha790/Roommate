import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FloatingPanel, GlassCard, GlowBadge } from "@/components/ui/premium";

const stats = [{ label: "Active seekers", value: "42K+" }, { label: "Verified hosts", value: "9.8K" }, { label: "Compatibility matches", value: "1.2M" }];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-texture opacity-30" />
      <section className="relative mx-auto max-w-7xl px-6 py-12 sm:py-20">
        <GlassCard className="p-8 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <GlowBadge className="animate-glow">Next-gen roommate platform</GlowBadge>
              <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">Discover flatmates that match your <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">lifestyle energy</span>.</h1>
              <p className="text-slate-300">Immersive roommate matching with social-first profiles, real compatibility signals, and premium discovery flows.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/browse" className={cn(buttonVariants({ size: "lg" }), "border-0 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950")}>Explore listings</Link>
                <Link href="/post" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white/30 bg-white/10 text-white hover:bg-white/20")}>Post your space</Link>
              </div>
            </div>
            <div className="grid gap-4">
              {stats.map((s) => <FloatingPanel key={s.label} className="p-5"><p className="text-3xl font-semibold text-cyan-200">{s.value}</p><p className="text-sm text-slate-300">{s.label}</p></FloatingPanel>)}
            </div>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
