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
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-[#BE0010] hover:text-[#BE0010]"
        onClick={handleShare}
        type="button"
      >
        {copied ? <FiCheck /> : <FiShare2 />}
        {copied ? "Link copied" : "Share"}
      </button>

      <button
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-[#BE0010] hover:text-[#BE0010]"
        type="button"
      >
        <FiSliders />
        Compare
      </button>

      <Link
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-[#BE0010] hover:text-[#BE0010]"
        href="/contact-us"
      >
        <FiUser />
        Meet Expert
      </Link>

      <Link
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#BE0010] px-4 text-sm font-semibold text-white transition hover:bg-[#9f000d]"
        href="/contact-us"
      >
        <FiMail />
        Enquiry
      </Link>
    </div>
  );
}
