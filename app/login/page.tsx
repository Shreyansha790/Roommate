"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password"))
    });
    setLoading(false);
    if (!error) router.push("/");
  }

  async function onGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/` } });
  }

  return <main className="mx-auto max-w-md p-6"><h1 className="mb-6 text-2xl font-semibold">Log in</h1><form className="space-y-4" onSubmit={onLogin}><div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div><div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div><Button className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button></form><Button variant="outline" className="mt-4 w-full" onClick={onGoogle}>Continue with Google</Button></main>;
}
