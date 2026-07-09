"use client";

import Link from "next/link";
import { useState } from "react";
import { FiCheck, FiMail, FiShare2, FiSliders, FiTag, FiUser } from "react-icons/fi";

export default function ProductActionButtons({ productName, productPath }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${productPath}`
        : productPath;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: productName, url });
        return;
      } catch {
        // user cancelled or share failed, fall back to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="inline-flex h-10 items-center gap-2 border border-line-light bg-white px-4 text-sm font-semibold text-ink-soft transition hover:border-red hover:text-red"
        onClick={handleShare}
        type="button"
      >
        {copied ? <FiCheck /> : <FiShare2 />}
        {copied ? "Link copied" : "Share"}
      </button>

      <button
        className="inline-flex h-10 items-center gap-2 border border-line-light bg-white px-4 text-sm font-semibold text-ink-soft transition hover:border-red hover:text-red"
        type="button"
      >
        <FiSliders />
        Compare
      </button>

      <Link
        className="inline-flex h-10 items-center gap-2 border border-line-light bg-white px-4 text-sm font-semibold text-ink-soft transition hover:border-red hover:text-red"
        href="/contact"
      >
        <FiUser />
        Meet Expert
      </Link>

      <Link
        className="inline-flex h-10 items-center gap-2 border border-red bg-red px-4 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red"
        href="/contact"
      >
        <FiMail />
        Enquiry
      </Link>
    </div>
  );
}
