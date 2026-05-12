"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const phone = String(formData.get("phone"));

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } }
    });

    setLoading(false);
    if (!error) router.push("/onboarding");
  }

  return <main className="mx-auto max-w-md p-6"><h1 className="mb-6 text-2xl font-semibold">Sign up</h1><form className="space-y-4" onSubmit={onSubmit}><div><Label htmlFor="name">Name</Label><Input id="name" name="name" required /></div><div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div><div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div><div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required /></div><Button className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button></form></main>;
}
