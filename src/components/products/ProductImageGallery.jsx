"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductImageZoom from "./ProductImageZoom";

export default function ProductImageGallery({ ctaHref, images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex] ?? images[0];

  return (
    <>
      <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden border border-line-light bg-white sm:min-h-[320px] lg:min-h-[260px]">
        <Image
          alt={selected.alt ?? productName}
          className="mx-auto max-h-[380px] w-full object-contain p-5 transition duration-500 hover:scale-105"
          height={600}
          src={selected.src}
          width={600}
          priority={selectedIndex === 0}
        />
        <ProductImageZoom alt={selected.alt ?? productName} src={selected.src} />
      </div>
      {ctaHref ? (
        <div className="mt-4">
          <Link
            href={ctaHref}
            className="inline-flex h-12 w-full items-center justify-center border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
          >
            Request Quote
          </Link>
        </div>
      ) : null}
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
