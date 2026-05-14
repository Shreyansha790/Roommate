import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    title: "Browse rooms fast",
    description: "Filter by budget, city, and vibe to quickly discover roommate-friendly spaces.",
  },
  {
    title: "List your place",
    description: "Post your room or full apartment in minutes with photos, amenities, and house rules.",
  },
  {
    title: "Match with confidence",
    description: "Share preferences and compare fit so both renters and hosts feel good before chatting.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-texture opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-cyan-500/35 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-16 top-32 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-8 left-1/3 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl animate-float-reverse" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12">
        <header className="mb-16 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
          <p className="text-lg font-semibold tracking-tight">Roommate Finder</p>
          <div className="flex gap-2">
            <Link href="/browse" className={cn(buttonVariants({ variant: "outline" }), "text-white hover:bg-white/15")}>
              Browse
            </Link>
            <Link href="/post" className={cn(buttonVariants({ variant: "secondary" }), "bg-white text-slate-900 hover:bg-slate-100")}>
              List a Place
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-7">
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/15 px-3 py-1 text-sm text-cyan-100">
              Find your next home, or your next roommate.
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A lively home base for both <span className="text-cyan-300">browsing</span> and <span className="text-violet-300">listing</span> rooms.
            </h1>
            <p className="max-w-xl text-lg text-slate-200/90">
              Explore available spots, publish your own place, and connect with people who match your lifestyle — all in one clean flow.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/browse" className={cn(buttonVariants({ size: "lg" }), "bg-cyan-400 text-slate-950 hover:bg-cyan-300")}>
                Start Browsing
              </Link>
              <Link href="/post" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "bg-violet-400 text-slate-950 hover:bg-violet-300")}>
                Post a Listing
              </Link>
              <Link href="/signup" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white/40 bg-transparent text-white hover:bg-white/10")}>
                Create Account
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {featureCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:bg-white/15">
                <h2 className="mb-2 text-xl font-medium">{card.title}</h2>
                <p className="text-slate-200/90">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
