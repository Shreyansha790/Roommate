"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import { Lock, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasEnv = hasSupabaseEnv();

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!hasEnv) {
      setTimeout(() => {
        setLoading(false);
        router.push("/browse");
      }, 500);
      return;
    }

    const supabase = createClient();
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password"))
    });

    setLoading(false);
    if (error) return setErrorMessage(error.message);

    const next = searchParams.get("next") || "/browse";
    router.push(next);
    router.refresh();
  }

  async function onGoogle() {
    if (!hasEnv) {
      router.push("/browse");
      return;
    }
    const supabase = createClient();
    const next = searchParams.get("next") || "/browse";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
    });
    if (error) setErrorMessage(error.message);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-4 py-12 sm:px-6 font-sans text-stone-800">
      <div className="bento-card w-full p-8 space-y-6 shadow-warm-lg">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-100 text-coral-600 font-bold shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Welcome Back</h1>
          <p className="text-stone-500 text-xs">Sign in to access your flatmate matches and saved spaces</p>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 text-xs">
            {errorMessage}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onLogin}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full neo-input pl-10 p-3 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                required
                className="w-full neo-input pl-10 p-3 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neo-button w-full py-3.5 font-bold text-sm tracking-wide"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-stone-400 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="neo-button-secondary flex w-full items-center justify-center gap-2 py-3 font-semibold text-xs"
        >
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-stone-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-coral-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
