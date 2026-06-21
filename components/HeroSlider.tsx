"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const images = [
  "https://picsum.photos/1600/600?random=1",
  "https://picsum.photos/1600/600?random=2",
  "https://picsum.photos/1600/600?random=3",
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[420px] rounded-md border border-gray-200 overflow-hidden">
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