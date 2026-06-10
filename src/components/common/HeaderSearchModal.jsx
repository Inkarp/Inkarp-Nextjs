"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import ProductSearchBox from "@/components/products/ProductSearchBox";

export default function HeaderSearchModal({ isOpen, onClose, products }) {
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div>
          <p className="font-maxot text-sm font-semibold uppercase text-[#BE0010]">
            Search
          </p>
          <h2 className="font-maxot mt-1 text-2xl font-bold text-zinc-950">
            Find products instantly
          </h2>
        </div>
        <button
          aria-label="Close search"
          className="inline-flex size-11 items-center justify-center rounded-md border border-zinc-200 text-2xl text-zinc-800 transition hover:border-[#BE0010] hover:text-[#BE0010]"
          onClick={onClose}
          type="button"
        >
          <FiX />
        </button>
      </div>

      <div className="mx-auto mt-8 max-w-5xl">
        <ProductSearchBox products={products} variant="modal" />
      </div>
    </div>
  );
}
