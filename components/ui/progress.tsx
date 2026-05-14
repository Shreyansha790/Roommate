"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}

export { Progress };
