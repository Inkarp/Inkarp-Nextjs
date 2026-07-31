"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex] ?? images[0];

  return (
    <>
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden border border-line-light bg-white sm:min-h-[420px] lg:min-h-[500px]">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-2/5">
          <Image
            alt="Dr Dexter"
            className="object-contain object-bottom"
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 200px, 150px"
            src="/dexter.png"
          />
        </div>
        <Image
          alt={selected.alt ?? productName}
          className="mx-auto max-h-[520px] w-full object-contain p-6 transition duration-500 hover:scale-105"
          height={600}
          src={selected.src}
          width={600}
          priority={selectedIndex === 0}
        />
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
        <span>{`Fig. ${String(selectedIndex + 1).padStart(2, "0")} - Product Overview`}</span>
        <span>{selected.alt ?? productName}</span>
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((img, index) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={img.alt ?? `View image ${index + 1}`}
              aria-pressed={index === selectedIndex}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-white transition ${
                index === selectedIndex
                  ? "border-red"
                  : "border-line-light hover:border-ink"
              }`}
            >
              <Image
                alt={img.alt ?? `${productName} view ${index + 1}`}
                className="object-contain p-1"
                fill
                sizes="64px"
                src={img.src}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
