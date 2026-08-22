"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import { Lock, Mail, Shield } from "lucide-react";

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
      <div className="bento-card reticle-border w-full p-8 space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-phosphor/10 border border-phosphor/30 text-phosphor">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">ACCESS_TERMINAL</h1>
          <p className="text-steel-muted text-[11px]">Authenticate to access your flatmate matches and saved telemetry</p>
        </div>

        {errorMessage ? (
          <div className="rounded-lg border border-crimson/30 bg-crimson/10 p-3 text-crimson font-mono text-xs">
            [AUTH_ERROR] {errorMessage}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onLogin}>
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-1.5">EMAIL_ADDRESS</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-steel-muted" />
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
            <label className="text-steel-muted font-bold uppercase block mb-1.5">PASSWORD</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-steel-muted" />
              <input
                name="password"
                type="password"
                placeholder="Enter secure passphrase"
                required
                className="w-full neo-input pl-10 p-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neo-button w-full py-3.5 font-black uppercase tracking-wider text-xs"
          >
            {loading ? "AUTHENTICATING..." : "SIGN_IN_TO_NETWORK"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-tungsten-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-tungsten px-3 text-steel-muted font-bold">OR_AUTHENTICATE_VIA</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="neo-button-secondary flex w-full items-center justify-center gap-2 py-3 font-bold text-xs"
        >
          <span>CONTINUE_WITH_GOOGLE</span>
        </button>

        <p className="text-center text-steel-muted">
          NO_ACCOUNT?{" "}
          <Link href="/signup" className="font-bold text-phosphor hover:underline">
            [ CREATE_ACCOUNT ]
          </Link>
        </p>
      </div>
    </main>
  );
}
