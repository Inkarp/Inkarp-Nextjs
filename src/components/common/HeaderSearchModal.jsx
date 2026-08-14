"use client";

import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import CompanyLogoMedia from "@/components/common/CompanyLogoMedia";
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
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#f7f7f7] text-ink animate-[header-search-backdrop_320ms_ease-out]"
      role="dialog"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#be0010,#161616,#be0010)]" />

      <div className="flex items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link
          aria-label={`${company.name} home`}
          className="relative block h-9 w-32 shrink-0 rounded-md bg-white p-1 shadow-sm sm:h-10 sm:w-40"
          href="/"
          onClick={onClose}
        >
          <CompanyLogoMedia
            alt={`${company.name} logo`}
            className="object-contain object-left"
            sizes="160px"
            src={company.logo}
          />
        </Link>

        <button
          aria-label="Close search"
          className="inline-flex h-11 items-center gap-2 border border-line-light bg-white px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-red/40 hover:text-red focus:outline-none focus:ring-2 focus:ring-red/20"
          onClick={onClose}
          type="button"
        >
          <FiX aria-hidden="true" className="text-lg" />
          Close
        </button>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-red">
              Inkarp finder
            </p>
            <h2 className="font-maxot mt-2 text-4xl font-bold text-ink sm:text-6xl">
              Search products
            </h2>
          </div>
          <p className="max-w-sm text-sm font-medium leading-6 text-ink-soft">
            Products, principals, applications, industries
          </p>
        </div>

        <div>
          <ProductSearchBox onClose={onClose} products={products} variant="fullscreen" />
        </div>
      </div>
    </div>,
    document.body
  );
}
