import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Roommate Finder</h1>
      <p className="text-muted-foreground">Next.js 14 + Tailwind + shadcn/ui + Supabase starter</p>
      <Link href="/browse" className={buttonVariants()}>
        Get Started
      </Link>
    </main>
  );
}
