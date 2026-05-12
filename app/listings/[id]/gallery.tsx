"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const safePhotos = photos.length ? photos : ["https://placehold.co/900x600?text=No+Photo"];

  return (
    <div className="space-y-3">
      <img src={safePhotos[index]} alt={`${title} photo ${index + 1}`} className="h-64 w-full rounded-lg object-cover sm:h-80" />
      <div className="flex items-center gap-2 overflow-x-auto">
        {safePhotos.map((photo, i) => (
          <button key={photo + i} onClick={() => setIndex(i)} className={`overflow-hidden rounded border ${i === index ? "ring-2 ring-black" : ""}`}>
            <img src={photo} alt={`Thumb ${i + 1}`} className="h-16 w-20 object-cover" />
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setIndex((prev) => (prev === 0 ? safePhotos.length - 1 : prev - 1))}>Prev</Button>
        <Button size="sm" variant="outline" onClick={() => setIndex((prev) => (prev + 1) % safePhotos.length)}>Next</Button>
      </div>
    </div>
  );
}
