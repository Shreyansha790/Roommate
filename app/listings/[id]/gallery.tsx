"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl border-1.5 border-zinc-800 bg-[#121217] font-mono text-xs text-zinc-500">
        [ NO_PHOTOS_LOADED ]
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image Stage */}
      <div className="relative h-80 w-full overflow-hidden rounded-2xl border-1.5 border-zinc-800 bg-black sm:h-[460px]">
        <Image
          src={photos[index]}
          alt={`${title} - Photo ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover transition-all duration-300"
        />

        {/* Index sticker */}
        <div className="absolute top-4 left-4">
          <span className="sticker-pill border-black bg-black text-white font-mono text-xs">
            FRAME_{index + 1} / {photos.length}
          </span>
        </div>

        {/* Controls */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black bg-black text-white transition hover:bg-[#ccff00] hover:text-black"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black bg-black text-white transition hover:bg-[#ccff00] hover:text-black"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {photos.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-1.5 transition ${
                i === index
                  ? "border-[#ccff00] shadow-[2px_2px_0px_#ccff00]"
                  : "border-zinc-800 opacity-60 hover:opacity-100"
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
