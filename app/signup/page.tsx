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
    <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-4 py-12 sm:px-6 font-mono text-xs">
      <div className="bento-card reticle-border w-full p-8 space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-phosphor/10 border border-phosphor/30 text-phosphor">
            <UserPlus className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">NEW_NODE_REGISTRATION</h1>
          <p className="text-steel-muted text-[11px]">Join the network to discover verified spaces and compatible flatmates</p>
        </div>

        {errorMessage ? (
          <div className="rounded-lg border border-crimson/30 bg-crimson/10 p-3 text-crimson font-mono text-xs">
            [REG_ERROR] {errorMessage}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-steel-muted font-bold uppercase block mb-1.5">FULL_NAME</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-steel-muted" />
              <input
                name="name"
                placeholder="Riya Shah"
                required
                className="w-full neo-input pl-10 p-3"
              />
            </div>
          </div>

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
                placeholder="Create secure passphrase"
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
            {loading ? "INITIALIZING_PROFILE..." : "CONTINUE_TO_VIBE_CALIBRATION"}
          </button>
        </form>

        <p className="text-center text-steel-muted">
          EXISTING_NODE?{" "}
          <Link href="/login" className="font-bold text-phosphor hover:underline">
            [ SIGN_IN ]
          </Link>
        </p>
      </div>
    </main>
  );
}
