"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const images = [
  "https://emsfthlfptmysgzpectv.supabase.co/storage/v1/object/public/media/Events/A7402285.jpg",
  "https://emsfthlfptmysgzpectv.supabase.co/storage/v1/object/public/media/Events/DSCF5603.JPG",
  "https://emsfthlfptmysgzpectv.supabase.co/storage/v1/object/public/media/Events/DSCF4958.JPG",
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[420px] rounded-xl border border-white/40 bg-white/30 backdrop-blur-sm shadow-lg overflow-hidden p-1">
      <img
        src={images[index]}
        alt="Community highlight"
        className="w-full h-full object-cover"
      />
      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
      >
        <ChevronLeftIcon className="size-8" />
      </button>
      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
      >
        <ChevronRightIcon className="size-8" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
