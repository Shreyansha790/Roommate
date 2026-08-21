"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasEnv = hasSupabaseEnv();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const name = String(formData.get("name"));

    if (!hasEnv) {
      setTimeout(() => {
        setLoading(false);
        router.push("/onboarding");
      }, 500);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/onboarding");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-4 py-12 sm:px-6 font-mono text-xs">
      <div className="bento-card w-full p-8 border-1.5 border-zinc-800 shadow-[6px_6px_0px_#000]">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#ccff00] text-black font-black shadow-[2px_2px_0px_#ffffff]">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white">NEW_USER_REGISTRATION</h1>
          <p className="text-zinc-400 text-[11px]">Join Roommate Sphere to discover verified flats & high-vibe roommates</p>
        </div>

        {errorMessage ? (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">
            {errorMessage}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-zinc-400 font-bold uppercase block mb-1">FULL_NAME</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                name="name"
                placeholder="Riya Shah"
                required
                className="w-full neo-input pl-10 p-3"
              />
            </div>
          </div>

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
                placeholder="Create secure password"
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
            {loading ? "INITIALIZING_PROFILE..." : "CONTINUE_TO_VIBE_QUIZ →"}
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-400">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link href="/login" className="font-bold text-[#ccff00] hover:underline">
            [ SIGN_IN ]
          </Link>
        </p>
      </div>
    </main>
  );
}


