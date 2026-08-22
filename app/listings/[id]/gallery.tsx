"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 font-sans text-xs text-stone-400">
        No photos available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 sm:h-[460px] shadow-sm">
        <Image
          src={photos[index]}
          alt={`${title} - Photo ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover transition-all duration-300"
        />

        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-stone-800 font-bold text-xs px-3 py-1 rounded-full shadow-sm">
            Photo {index + 1} of {photos.length}
          </span>
        </div>

        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-stone-800 transition hover:bg-white shadow-sm border border-stone-200"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-stone-800 transition hover:bg-white shadow-sm border border-stone-200"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {photos.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === index
                  ? "border-coral-500 shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="thumbnail" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
