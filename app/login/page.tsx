"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, GlowBadge } from "@/components/ui/premium";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto max-w-md p-6">
        <GlassCard className="animate-lift-in p-6">
          <h1 className="mb-3 text-2xl font-semibold">Log in</h1>
          <p className="rounded-md border border-amber-300/40 bg-amber-500/10 p-3 text-sm text-amber-100">
            Authentication is disabled in this preview because Supabase environment variables are missing.
          </p>
        </GlassCard>
      </main>
    );
  }

  const supabase = createClient();

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password"))
    });

    setLoading(false);
    if (error) return setErrorMessage(error.message);

    const next = searchParams.get("next") || "/";
    router.push(next);
    router.refresh();
  }

  async function onGoogle() {
    const next = searchParams.get("next") || "/";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
    });
    if (error) setErrorMessage(error.message);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <GlassCard className="animate-lift-in p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <GlowBadge className="animate-glow">Secure login</GlowBadge>
        </div>

        {errorMessage ? <p className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{errorMessage}</p> : null}

        <form className="space-y-4" onSubmit={onLogin}>
          <div className="transition-all duration-300 hover:-translate-y-0.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="bg-slate-900/70" />
          </div>

          <div className="transition-all duration-300 hover:-translate-y-0.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="bg-slate-900/70" />
          </div>

          <Button className="w-full border-0 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 transition-all duration-300 hover:scale-[1.01]" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <Button variant="outline" className="mt-4 w-full border-white/20 bg-white/5 text-white transition-all duration-300 hover:bg-white/10" onClick={onGoogle}>
          Continue with Google
        </Button>
      </GlassCard>
    </main>
  );
}
