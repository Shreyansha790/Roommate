"use client";

import { Card3D } from "@/components/motion/Card3D";
import { Sparkles, Sliders, ShieldCheck, MessageSquare } from "lucide-react";

export function HarmonyProtocolSection() {
  const steps = [
    {
      step: "01",
      icon: Sliders,
      title: "Calibrate Your Vibe DNA",
      desc: "Answer a 60-second questionnaire on sleep schedules, cleanliness standards, dietary choices, and social battery.",
      badge: "60-Sec Profiling",
      color: "text-coral-600",
      bg: "bg-coral-50",
      border: "border-coral-200"
    },
    {
      step: "02",
      icon: Sparkles,
      title: "Multi-Vector Compatibility",
      desc: "Our matching algorithm calculates mutual harmony across lifestyle dimensions to prevent flatmate friction.",
      badge: "Real-Time Scoring",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200"
    },
    {
      step: "03",
      icon: ShieldCheck,
      title: "Direct Connect & Zero Brokerage",
      desc: "Message verified hosts directly, schedule visits, and generate customized roommate agreements with 0 brokerage fees.",
      badge: "Direct & Safe",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans">
      <div className="rounded-3xl bg-gradient-to-b from-[#fbfaf8] via-white to-[#f8f7f4] border border-stone-200/80 p-8 sm:p-14 space-y-10 shadow-luxury">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
            The Living Harmony Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            How RoommateSphere Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            A scientifically designed 3-step process to find a home you love and flatmates who respect your rhythm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card3D key={item.step} depth={8} glareOpacity={0.15} className="block">
                <div className="luxury-card p-6 sm:p-8 space-y-4 bg-white h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg} ${item.color} font-bold shadow-sm`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono font-black text-2xl text-stone-200">
                        {item.step}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.bg} ${item.color} ${item.border}`}>
                        {item.badge}
                      </span>
                      <h3 className="font-bold text-base text-stone-900">{item.title}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <a
            href="/onboarding"
            className="neo-button inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-luxury-coral"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Calibrate Your Vibe DNA Questionnaire (60 Seconds)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
