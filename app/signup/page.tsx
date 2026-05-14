"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, GlowBadge } from "@/components/ui/premium";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      options: { data: { name: String(formData.get("name")) } }
    });

    setLoading(false);
    if (!error) router.push("/onboarding");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <GlassCard className="animate-lift-in p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Create account</h1>
          <GlowBadge>New profile</GlowBadge>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="transition-all duration-300 hover:-translate-y-0.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required className="bg-slate-900/70" />
          </div>

          <div className="transition-all duration-300 hover:-translate-y-0.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="bg-slate-900/70" />
          </div>

          <div className="transition-all duration-300 hover:-translate-y-0.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="bg-slate-900/70" />
          </div>

          <Button className="w-full border-0 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 transition-all duration-300 hover:scale-[1.01]" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
