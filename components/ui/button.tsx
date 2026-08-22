"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98] rounded-xl",
  {
    variants: {
      variant: {
        default:
          "bg-coral-500 text-white shadow-warm-coral hover:bg-coral-600 font-bold",
        secondary:
          "bg-white text-stone-800 border border-stone-200 hover:bg-stone-50 shadow-sm font-semibold",
        outline:
          "border border-stone-200 bg-transparent text-stone-700 hover:bg-stone-50",
        phosphor:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 font-bold",
        cyan:
          "bg-sky-600 text-white shadow-sm hover:bg-sky-700 font-bold",
        solar:
          "bg-amber-500 text-white shadow-sm hover:bg-amber-600 font-bold",
        crimson:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700 font-bold",
        tactical:
          "bg-white border border-stone-200 text-stone-800 hover:bg-stone-50",
        ghost:
          "hover:bg-stone-100 hover:text-stone-900 text-stone-600"
      },
      size: {
        default: "h-10 px-4 py-2 text-xs",
        sm: "h-8 rounded-lg px-3 text-[11px]",
        lg: "h-12 rounded-2xl px-8 text-sm",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, onClick, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={onClick}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
