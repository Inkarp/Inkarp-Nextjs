"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAnalyticaShowcaseFallbackPrincipalSlugs,
  getAnalyticaShowcaseProductSlugs,
  isAnalyticaShowcaseActive,
} from "@/data/stallWorkflows";

function isShowcased({ productSlug, principalSlug }) {
  if (productSlug && getAnalyticaShowcaseProductSlugs().has(productSlug)) {
    return true;
  }
  return Boolean(principalSlug && getAnalyticaShowcaseFallbackPrincipalSlugs().has(principalSlug));
}

/**
 * "On display at analytica" flag for product pages/cards. Renders nothing
 * until mounted and re-checked client-side — this page has no revalidation,
 * so a server-side date check would get baked in at build time and never
 * expire on its own once Sept 10 passes.
 */
export default function AnalyticaShowcaseBadge({ principalSlug, productSlug, variant = "pill" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      setVisible(isAnalyticaShowcaseActive() && isShowcased({ productSlug, principalSlug }));
    };
    check();
  }, [productSlug, principalSlug]);

  if (!visible) {
    return null;
  }

  if (variant === "ribbon") {
    return (
      <span className="pointer-events-none absolute left-2 top-2 z-10 inline-flex items-center gap-1 bg-[#8C2F63] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
        🧪 At analytica
      </span>
    );
  }

  return (
    <Link
      className="inline-flex items-center gap-1.5 border border-[#8C2F63]/30 bg-[#8C2F63]/5 px-3 py-2 text-xs font-semibold text-[#8C2F63] transition hover:bg-[#8C2F63]/10"
      href="/events"
    >
      🧪 On display at analytica Lab India · 10–12 Sept, HITEX Hyderabad
    </Link>
  );
}
