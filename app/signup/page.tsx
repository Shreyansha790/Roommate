"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import { UserPlus, Mail, Lock, User } from "lucide-react";

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
    <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-4 py-12 sm:px-6 font-sans text-stone-800">
      <div className="bento-card w-full p-8 space-y-6 shadow-warm-lg">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-100 text-coral-600 font-bold shadow-sm">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Create Account</h1>
          <p className="text-stone-500 text-xs">Join RoommateSphere to discover verified rooms and compatible flatmates</p>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 text-xs">
            {errorMessage}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Full Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
              <input
                name="name"
                placeholder="Riya Shah"
                required
                className="w-full neo-input pl-10 p-3 text-xs"
              />
            </div>
          </div>

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
                placeholder="Create a secure password"
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
            {loading ? "Creating Account..." : "Continue to Vibe Quiz"}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-coral-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
