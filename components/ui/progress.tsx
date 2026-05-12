"use client";

import * as React from "react";

function Progress({ value = 0 }: { value?: number }) {
  return (
    <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
      <div className="bg-primary h-full transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

export { Progress };
