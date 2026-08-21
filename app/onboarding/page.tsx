"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase";
import {
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  Utensils,
  Briefcase,
  Sliders,
  ArrowRight,
  ShieldCheck,
  User,
  Heart,
  Volume2,
  Sun,
  Moon,
  Activity
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
    const { data: auth } = await supabase.auth.getUser();

    if (auth.user) {
      await supabase.from("profiles").upsert({
        id: auth.user.id,
        full_name: fullName,
        profession,
        bio,
        avatar_url: avatarUrl,
        is_verified: true
      });

      await supabase.from("roommate_preferences").upsert({
        user_id: auth.user.id,
        sleep_schedule: sleepRhythm,
        cleanliness: cleanlinessScore,
        food_preference: foodPreference,
        smoking: smokingPolicy === "never" ? false : true,
        social_preference: socialBattery
      });
    }

    setLoading(false);
    router.push("/browse");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 font-mono text-xs">
      {/* Header */}
      <div className="mb-8 space-y-3 text-center max-w-xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <span className="sticker-pill border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]">
            CALIBRATION_PROTOCOL // STEP_{step}_OF_2
          </span>
        </div>
        <h1 className="text-3xl font-black uppercase text-white tracking-tight">
          Calibrate Your Vibe DNA Matrix
        </h1>
        <p className="text-zinc-400">
          Match algorithms use these parameters to compute real-time compatibility scores.
        </p>
      </div>

      {/* Form Bento Container */}
      <div className="bento-card p-6 sm:p-10 border-1.5 border-zinc-800 space-y-8">
        {step === 1 ? (
          /* Step 1: Personal Identity */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-bold text-[#ccff00] uppercase">[ 01_HUMAN_IDENTITY ]</span>
              <span className="text-[10px] text-zinc-500">PUBLIC_COMMUNITY_PROFILE</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-zinc-400 font-bold uppercase block mb-1">FULL_NAME *</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Shankar"
                    className="w-full neo-input p-3"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold uppercase block mb-1">OCCUPATION_ROLE</label>
                  <input
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. AI Engineer @ Startup / Designer"
                    className="w-full neo-input p-3"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-bold uppercase block mb-1">BIO_SUMMARY</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Weekend cook, work hybrid, respect private time, love techno & chai..."
                    className="w-full neo-input p-3"
                  />
                </div>
              </div>

              {/* Avatar Preset Selector */}
              <div className="rounded-2xl border border-zinc-800 bg-[#09090b] p-5 space-y-4">
                <label className="text-zinc-400 font-bold uppercase block">SELECT_AVATAR_DNA</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border-1.5 border-[#ccff00] shadow-[2px_2px_0px_#ccff00]">
                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase text-[11px]">ACTIVE_BADGE</p>
                    <p className="text-[10px] text-zinc-500">Auto-verified profile ID</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                  ].map((url, i) => (
                    <button
                      type="button"
                      key={url}
                      onClick={() => setAvatarUrl(url)}
                      className={`relative h-14 overflow-hidden rounded-lg border-1.5 transition ${
                        avatarUrl === url
                          ? "border-[#ccff00] shadow-[2px_2px_0px_#ccff00]"
                          : "border-zinc-800 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image src={url} alt={`Preset ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="neo-button px-6 py-3 uppercase font-black"
              >
                PROCEED_TO_HABIT_MATRIX →
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Lifestyle & Habits */
          <form onSubmit={onSave} className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-bold text-[#ccff00] uppercase">[ 02_LIFESTYLE_HABIT_CALIBRATION ]</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-zinc-500 hover:text-white"
              >
                ← BACK_TO_STEP_01
              </button>
            </div>

            {/* Sleep rhythm */}
            <div className="space-y-2">
              <label className="text-zinc-400 font-bold uppercase">SLEEP_RHYTHM</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { id: "early_bird", label: "EARLY_BIRD", time: "10:00 PM – 6:00 AM" },
                  { id: "flexible", label: "STANDARD_SYNC", time: "11:30 PM – 7:30 AM" },
                  { id: "night_owl", label: "NIGHT_OWL", time: "1:00 AM – 9:00 AM" }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSleepRhythm(item.id)}
                    className={`rounded-xl border-1.5 p-3.5 text-left transition ${
                      sleepRhythm === item.id
                        ? "border-[#ccff00] bg-[#ccff00]/10 text-white shadow-[2px_2px_0px_#ccff00]"
                        : "border-zinc-800 bg-[#09090b] text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <p className="font-bold uppercase text-xs">{item.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{item.time}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Cleanliness slider */}
            <div className="space-y-2 rounded-xl border border-zinc-800 bg-[#09090b] p-4">
              <div className="flex items-center justify-between">
                <label className="text-zinc-400 font-bold uppercase">CLEANLINESS_INDEX</label>
                <span className="text-[#ccff00] font-black text-sm">{cleanlinessScore} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={cleanlinessScore}
                onChange={(e) => setCleanlinessScore(Number(e.target.value))}
                className="w-full accent-[#ccff00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600">
                <span>RELAXED (1)</span>
                <span>NEAT & ORGANIZED (5)</span>
                <span>SURGICAL PRECISION (10)</span>
              </div>
            </div>

            {/* Food preferences */}
            <div className="space-y-2">
              <label className="text-zinc-400 font-bold uppercase">FOOD_FREQUENCY</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { id: "veg_only", label: "STRICT_VEG" },
                  { id: "eggetarian", label: "EGGETARIAN" },
                  { id: "non_veg", label: "NON_VEGETARIAN" },
                  { id: "flexible", label: "ANYTHING_GOES" }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setFoodPreference(item.id)}
                    className={`rounded-xl border-1.5 p-3 text-center font-bold transition ${
                      foodPreference === item.id
                        ? "border-[#3b82f6] bg-[#3b82f6]/10 text-white shadow-[2px_2px_0px_#3b82f6]"
                        : "border-zinc-800 bg-[#09090b] text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social battery */}
            <div className="space-y-2">
              <label className="text-zinc-400 font-bold uppercase">SOCIAL_BATTERY_IN_SHARED_SPACE</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "introvert", label: "QUIET_SANCTUARY", desc: "Private space focus" },
                  { id: "ambivert", label: "BALANCED_VIBE", desc: "Hangout + recharge" },
                  { id: "extrovert", label: "HIGH_ENERGY_HOUSE", desc: "Social dinners & hosting" }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSocialBattery(item.id)}
                    className={`rounded-xl border-1.5 p-3 text-left transition ${
                      socialBattery === item.id
                        ? "border-[#a855f7] bg-[#a855f7]/10 text-white shadow-[2px_2px_0px_#a855f7]"
                        : "border-zinc-800 bg-[#09090b] text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <p className="font-bold text-xs">{item.label}</p>
                    <p className="text-[10px] text-zinc-500">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="neo-button w-full py-4 text-sm font-black uppercase tracking-wider"
              >
                {loading ? "CALIBRATING_FREQUENCY..." : "SAVE_DNA_&_EXPLORE_FLATS →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}


