"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { GlassCard, GlowBadge } from "@/components/ui/premium";

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState(1);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const avatar = formData.get("avatar") as File;
    let avatar_url: string | null = null;
    if (avatar?.size) {
      const path = `${user.id}/${Date.now()}-${avatar.name}`;
      await supabase.storage.from("profile-photos").upload(path, avatar);
      const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
      avatar_url = data.publicUrl;
    }

    await supabase.from("profiles").upsert({
      id: user.id,
      age: Number(formData.get("age")),
      gender: String(formData.get("gender")),
      profession: String(formData.get("profession")),
      bio: String(formData.get("bio")),
      avatar_url
    });

    await supabase.from("roommate_preferences").upsert({
      user_id: user.id,
      sleep_time: String(formData.get("sleep_time")),
      cleanliness_scale: Number(formData.get("cleanliness_scale")),
      guests: String(formData.get("guests")),
      food_preference: String(formData.get("food_preference")),
      smoking: String(formData.get("smoking"))
    });

    router.push("/");
  }

  return <main className="mx-auto max-w-2xl p-6"><GlassCard className="p-6"><div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-semibold">Onboarding</h1><GlowBadge>Step {step} of 2</GlowBadge></div><Progress value={step === 1 ? 50 : 100} className="bg-slate-800" /><form className="mt-6 space-y-4" onSubmit={onSubmit}>{step === 1 ? <><div><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" required /></div><div><Label htmlFor="gender">Gender</Label><Input id="gender" name="gender" required /></div><div><Label htmlFor="profession">Profession</Label><Input id="profession" name="profession" required /></div><div><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" required /></div><div><Label htmlFor="avatar">Profile photo</Label><Input id="avatar" name="avatar" type="file" accept="image/*" /></div><Button type="button" className="border-0 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950" onClick={() => setStep(2)}>Next</Button></> : <><div><Label htmlFor="sleep_time">Sleep time</Label><Input id="sleep_time" name="sleep_time" placeholder="10:30 PM" required /></div><div><Label htmlFor="cleanliness_scale">Cleanliness scale (1-10)</Label><Input id="cleanliness_scale" name="cleanliness_scale" type="number" min="1" max="10" required /></div><div><Label htmlFor="guests">Guests</Label><Input id="guests" name="guests" placeholder="Rarely / Sometimes / Often" required /></div><div><Label htmlFor="food_preference">Food preference</Label><Input id="food_preference" name="food_preference" required /></div><div><Label htmlFor="smoking">Smoking</Label><Input id="smoking" name="smoking" placeholder="No / Occasionally / Yes" required /></div><div className="flex gap-2"><Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button><Button type="submit" className="border-0 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950">Complete onboarding</Button></div></>}</form></GlassCard></main>;
}
