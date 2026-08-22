"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Utensils,
  Briefcase,
  Sliders,
  ArrowRight,
  ShieldCheck,
  User,
  Heart,
  Sun,
  Moon,
  Home
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  );

  // Lifestyle fields
  const [sleepRhythm, setSleepRhythm] = useState("night_owl");
  const [cleanlinessScore, setCleanlinessScore] = useState(8);
  const [foodPreference, setFoodPreference] = useState("flexible");
  const [smokingPolicy, setSmokingPolicy] = useState("never");
  const [socialBattery, setSocialBattery] = useState("ambivert");

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!hasSupabaseEnv()) {
      setTimeout(() => {
        setLoading(false);
        router.push("/browse");
      }, 600);
      return;
    }

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Upsert profile
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      profession,
      bio,
      avatar_url: avatarUrl,
      is_verified: true
    });

    // Upsert roommate preferences
    await supabase.from("roommate_preferences").upsert({
      user_id: user.id,
      sleep_schedule: sleepRhythm,
      cleanliness: cleanlinessScore,
      food_preference: foodPreference,
      smoking: smokingPolicy === "smoker",
      social_battery: socialBattery
    });

    setLoading(false);
    router.push("/browse");
  }

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 font-sans text-stone-800 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-coral-200 bg-coral-50 px-3.5 py-1 text-xs font-semibold text-coral-700">
          <Sparkles className="h-3.5 w-3.5 text-coral-500" />
          <span>Step {step} of 2 • Vibe Profile Setup</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          {step === 1 ? "Set Up Your Profile" : "Calibrate Lifestyle Habits"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          {step === 1
            ? "Introduce yourself to potential roommates and verified hosts."
            : "Help our matching algorithm pair you with compatible flatmates."}
        </p>
      </div>

      <div className="bento-card p-6 sm:p-8 space-y-6 shadow-warm-lg">
        {step === 1 ? (
          <div className="space-y-6">
            {/* Avatar Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Choose an Avatar</label>
              <div className="flex items-center gap-3">
                {avatars.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`relative h-14 w-14 rounded-2xl overflow-hidden border-2 transition ${
                      avatarUrl === url
                        ? "border-coral-500 ring-2 ring-coral-200 shadow-sm"
                        : "border-stone-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={url} alt="avatar option" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Roy"
                className="w-full neo-input p-3 text-xs"
              />
            </div>

            {/* Profession */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Profession / Occupation</label>
              <input
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Product Designer at Tech Studio"
                className="w-full neo-input p-3 text-xs"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Share a little bit about your lifestyle, hobbies, or what kind of flat you're looking for..."
                className="w-full neo-input p-3 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="neo-button w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-warm-coral"
            >
              <span>Continue to Lifestyle Habits</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={onSave} className="space-y-6">
            {/* Sleep Rhythm */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Sleep Schedule</label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { id: "early_bird", label: "Early Bird", desc: "Sleep ~10:30 PM, up by 6:30 AM", icon: Sun },
                  { id: "night_owl", label: "Night Owl", desc: "Sleep ~1:00 AM, up later", icon: Moon }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSleepRhythm(item.id)}
                      className={`p-4 rounded-2xl border text-left transition ${
                        sleepRhythm === item.id
                          ? "border-coral-500 bg-coral-50/60 shadow-sm"
                          : "border-stone-200 bg-white hover:bg-stone-50"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-coral-500 mb-1" />
                      <p className="font-bold text-stone-900">{item.label}</p>
                      <p className="text-[11px] text-stone-500">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cleanliness Index */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>Cleanliness Standard</span>
                <span className="text-coral-600 font-extrabold">{cleanlinessScore} / 10</span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                value={cleanlinessScore}
                onChange={(e) => setCleanlinessScore(Number(e.target.value))}
                className="w-full accent-coral-500 cursor-pointer"
              />
              <p className="text-[11px] text-stone-400">
                {cleanlinessScore >= 9
                  ? "Very neat - clean surfaces after cooking, tidy common areas daily."
                  : "Moderate - regular weekly cleaning routines."}
              </p>
            </div>

            {/* Food Habits */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Food Preference</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: "veg", label: "Vegetarian" },
                  { id: "nonveg", label: "Non-Veg" },
                  { id: "flexible", label: "Flexible" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFoodPreference(item.id)}
                    className={`py-2.5 rounded-xl border text-center font-semibold transition ${
                      foodPreference === item.id
                        ? "border-coral-500 bg-coral-50 text-coral-700 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Battery */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Social Energy in the Flat</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: "introvert", label: "Quiet & Private" },
                  { id: "ambivert", label: "Balanced & Friendly" },
                  { id: "extrovert", label: "Social & Welcoming" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSocialBattery(item.id)}
                    className={`py-2.5 rounded-xl border text-center font-semibold transition ${
                      socialBattery === item.id
                        ? "border-coral-500 bg-coral-50 text-coral-700 font-bold"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="neo-button-secondary py-3.5 px-5 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="neo-button flex-1 py-3.5 text-xs font-bold shadow-warm-coral"
              >
                {loading ? "Saving Profile..." : "Complete Setup & Explore Spaces"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
