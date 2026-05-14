"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleLoginButton } from "@/components/auth/google-login-button";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="mb-3 text-2xl font-semibold">Log in</h1>
        <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Authentication is currently disabled in this preview because Supabase environment variables are not configured yet.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable email and Google login.
        </p>
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
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      {errorMessage ? <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</p> : null}
      <form className="space-y-4" onSubmit={onLogin}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      </form>
      <GoogleLoginButton className="mt-4 w-full" onError={setErrorMessage} />
    </main>
  );
}
