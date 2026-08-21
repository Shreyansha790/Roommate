"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import { Lock, Mail, Zap } from "lucide-react";

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
    <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-4 py-12 sm:px-6 font-mono text-xs">
      <div className="bento-card w-full p-8 border-1.5 border-zinc-800 shadow-[6px_6px_0px_#000]">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#ccff00] text-black font-black shadow-[2px_2px_0px_#ffffff]">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white">ACCESS_ACCOUNT</h1>
          <p className="text-zinc-400 text-[11px]">Sign in to access your flatmate matches and saved spaces</p>
        </div>

        {errorMessage ? (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">
            {errorMessage}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onLogin}>
          <div>
            <label className="text-zinc-400 font-bold uppercase block mb-1">EMAIL_ADDRESS</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full neo-input pl-10 p-3"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 font-bold uppercase block mb-1">PASSWORD</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full neo-input pl-10 p-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neo-button w-full py-3.5 font-black uppercase tracking-wider"
          >
            {loading ? "AUTHENTICATING..." : "SIGN_IN_TO_NETWORK"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#121217] px-2 text-zinc-500 font-bold">OR_AUTHENTICATE_WITH</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="neo-button-secondary flex w-full items-center justify-center gap-2 py-3 font-bold"
        >
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-zinc-400">
          DON&apos;T HAVE AN ACCOUNT?{" "}
          <Link href="/signup" className="font-bold text-[#ccff00] hover:underline">
            [ CREATE_ACCOUNT ]
          </Link>
        </p>
      </div>
    </main>
  );
}


