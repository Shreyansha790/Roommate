"use client";

import * as React from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, Users, IndianRupee, Sparkles } from "lucide-react";

function Counter({ from = 0, to, duration = 2 }: { from?: number; to: number; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  const spring = useSpring(from, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  React.useEffect(() => {
    if (inView) {
      spring.set(to);
    }
  }, [inView, spring, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function AnimatedStats() {
  const stats = [
    {
      icon: Users,
      value: 12400,
      suffix: "+",
      label: "Verified Roommates",
      desc: "Vibe-profiled & ID verified",
      color: "text-coral-500",
      bg: "bg-coral-50"
    },
    {
      icon: ShieldCheck,
      value: 4800,
      suffix: "+",
      label: "Direct Flats Listed",
      desc: "Zero broker interference",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: IndianRupee,
      value: 38,
      suffix: " Cr+",
      label: "Brokerage Saved",
      desc: "Kept in tenants' pockets",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: Sparkles,
      value: 94,
      suffix: "%",
      label: "Match Satisfaction",
      desc: "Living together 12+ months",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 font-sans">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card p-5 sm:p-6 space-y-3 bg-white/90 backdrop-blur-sm border border-stone-200/80 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color} font-bold`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                <Counter to={stat.value} />
                <span>{stat.suffix}</span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-800 mt-0.5">{stat.label}</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">{stat.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
