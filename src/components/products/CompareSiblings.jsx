"use client";

import { useEffect } from "react";
import { clearCompareSiblings, setCompareSiblings } from "@/lib/compareSiblings";

/** Registers this product's same-category products with the Compare pill; renders nothing. */
export default function CompareSiblings({ product, category, items }) {
  useEffect(() => {
    if (!items?.length) return undefined;
    setCompareSiblings({ product, category, items });
    return () => clearCompareSiblings(product.slug);
  }, [product, category, items]);

  return null;
}
