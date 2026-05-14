"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type GoogleLoginButtonProps = {
  className?: string;
  onError?: (message: string) => void;
};

export function GoogleLoginButton({ className, onError }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      onError?.(error.message);
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" className={className} onClick={handleGoogleLogin} disabled={loading}>
      {loading ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}
