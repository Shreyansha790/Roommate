"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const safePhotos = photos.length ? photos : ["https://placehold.co/900x600?text=No+Photo"];

  return (
    <div className="space-y-3">
      <Image src={safePhotos[index]} alt={`${title} photo ${index + 1}`} width={900} height={600} priority={true} sizes="(max-width: 640px) 100vw, 800px" className="h-64 w-full rounded-lg object-cover sm:h-80" />
      <div className="flex items-center gap-2 overflow-x-auto">
        {safePhotos.map((photo, i) => (
          <button key={photo + i} onClick={() => setIndex(i)} className={`flex-shrink-0 overflow-hidden rounded border ${i === index ? "ring-2 ring-black" : ""}`}>
            <Image src={photo} alt={`Thumb ${i + 1}`} width={80} height={64} sizes="80px" className="h-16 w-20 object-cover" />
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
