"use client";

import { useState } from "react";
import Image from "next/image";
import ProductImageZoom from "./ProductImageZoom";

export default function ProductImageGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex] ?? images[0];

  return (
    <>
      <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden border border-line-light bg-white sm:min-h-[280px] lg:min-h-[300px]">
        <Image
          alt={selected.alt ?? productName}
          className="mx-auto max-h-[340px] w-full object-contain p-4 transition duration-500 hover:scale-105"
          height={700}
          src={selected.src}
          width={700}
          priority={selectedIndex === 0}
        />
        <ProductImageZoom alt={selected.alt ?? productName} src={selected.src} />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {images.map((img, index) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={img.alt ?? `View image ${index + 1}`}
              aria-pressed={index === selectedIndex}
              className={`relative h-14 w-14 shrink-0 overflow-hidden border bg-white transition ${
                index === selectedIndex
                  ? "border-red"
                  : "border-line-light hover:border-ink"
              }`}
            >
              <Image
                alt={img.alt ?? `${productName} view ${index + 1}`}
                className="object-contain p-1"
                fill
                sizes="56px"
                src={img.src}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
