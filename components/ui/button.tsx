"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { playBlip } from "@/lib/audio-telemetry";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-mono font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-phosphor text-obsidian shadow-glow-phosphor hover:bg-phosphor-dim border border-phosphor",
        secondary:
          "bg-tungsten-card text-slate-200 border border-tungsten-border hover:border-cyan hover:text-cyan",
        outline:
          "border border-tungsten-border bg-transparent text-slate-300 hover:bg-tungsten-panel hover:text-white",
        phosphor:
          "bg-phosphor text-obsidian shadow-glow-phosphor hover:bg-phosphor-dim border border-phosphor font-black",
        cyan:
          "bg-cyan text-obsidian shadow-glow-cyan hover:bg-cyan-dim border border-cyan font-black",
        solar:
          "bg-solar text-obsidian shadow-glow-solar hover:bg-solar-dim border border-solar font-black",
        crimson:
          "bg-crimson text-white shadow-glow-crimson hover:bg-crimson-dim border border-crimson font-black",
        tactical:
          "chamfer-card-sm bg-tungsten-card border border-tungsten-border text-slate-200 hover:border-phosphor hover:text-phosphor",
        ghost:
          "hover:bg-tungsten-panel hover:text-slate-100 text-slate-400"
      },
      size: {
        default: "h-10 px-4 py-2 text-xs",
        sm: "h-8 rounded px-3 text-[11px]",
        lg: "h-12 rounded px-8 text-sm",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  soundEffect?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, soundEffect = true, onClick, onMouseEnter, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundEffect) {
        playBlip(1080, 0.03);
      }
      onClick?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundEffect) {
        playBlip(750, 0.015);
      }
      onMouseEnter?.(e);
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
