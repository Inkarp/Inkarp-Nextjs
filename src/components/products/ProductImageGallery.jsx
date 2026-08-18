"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMail } from "react-icons/fi";

export default function ProductImageGallery({ ctaHref, images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex] ?? images[0];

  return (
    <>
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden border border-line-light bg-white sm:min-h-[420px] lg:min-h-[340px]">
        <Image
          alt={selected.alt ?? productName}
          className="mx-auto max-h-[520px] w-full object-contain p-6 transition duration-500 hover:scale-105"
          height={600}
          src={selected.src}
          width={600}
          priority={selectedIndex === 0}
        />
      </div>
      {ctaHref ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Link
            href={ctaHref}
            className="inline-flex h-12 items-center justify-center border border-red bg-red px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
          >
            Request Quote
          </Link>
          <Link
            href={ctaHref}
            className="inline-flex h-12 items-center justify-center gap-2 border border-line-light bg-white px-5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
          >
            <FiMail className="h-4 w-4 text-red" />
            Enquiry Now
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
