"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import ProductSearchBox from "@/components/products/ProductSearchBox";
import { siteConfig } from "@/data/siteConfig";

export default function HeaderSearchModal({ isOpen, onClose, products }) {
  const { company } = siteConfig;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#BE0010] animate-[header-search-backdrop_320ms_ease-out]"
      role="dialog"
    >
      <div className="flex items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link
          aria-label={`${company.name} home`}
          className="relative block h-9 w-32 shrink-0 sm:h-10 sm:w-40"
          href="/"
          onClick={onClose}
        >
          <Image
            alt={`${company.name} logo`}
            className="object-contain object-left brightness-0 invert"
            fill
            sizes="160px"
            src={company.logo}
          />
        </Link>

        <button
          aria-label="Close search"
          className="text-sm font-semibold uppercase tracking-wide text-white/80 transition hover:text-white"
          onClick={onClose}
          type="button"
        >
          Close Search
        </button>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <h2 className="font-maxot text-4xl font-bold text-white sm:text-6xl">
          Search
        </h2>

        <div className="mt-10">
          <ProductSearchBox onClose={onClose} products={products} variant="fullscreen" />
        </div>
      </div>
    </div>,
    document.body
  );
}
