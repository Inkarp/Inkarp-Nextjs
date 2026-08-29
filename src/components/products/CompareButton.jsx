"use client";

import { FiBarChart2, FiCheck } from "react-icons/fi";
import useCompareBasket from "./useCompareBasket";
import { COMPARE_LIMIT, itemKey, toggleCompare } from "@/lib/compareBasket";

const SIZES = {
  // Compact square toggle — sits beside "View Details" in the product grid footer.
  icon: "h-10 w-10 shrink-0 text-sm",
  // Under "Request Quote" / "Add to Quote" on a product page.
  block: "h-14 w-full text-base",
};

export default function CompareButton({ product, variant = "block" }) {
  const basket = useCompareBasket();
  if (!product?.slug) return null;

  const key = itemKey(product);
  const added = basket.some((item) => itemKey(item) === key);
  const full = !added && basket.length >= COMPARE_LIMIT;
  const iconOnly = variant === "icon";

  return (
    <button
      aria-label={iconOnly ? (added ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`) : undefined}
      aria-pressed={added}
      className={`inline-flex items-center justify-center gap-1.5 border font-semibold transition ${SIZES[variant] ?? SIZES.block} ${
        added
          ? "border-ink bg-ink text-white hover:bg-ink/90"
          : full
            ? "cursor-not-allowed border-line-light bg-parchment-alt text-ink-soft/50"
            : "border-line-light bg-white text-ink hover:-translate-y-0.5 hover:border-ink"
      }`}
      disabled={full}
      onClick={() => toggleCompare(product)}
      title={
        full
          ? `You can compare up to ${COMPARE_LIMIT} products at a time`
          : added
            ? `Remove ${product.name} from comparison`
            : `Add ${product.name} to comparison`
      }
      type="button"
    >
      {added ? <FiCheck className="shrink-0" /> : <FiBarChart2 className="shrink-0" />}
      {iconOnly ? null : added ? "Comparing" : full ? "Compare list full" : "Compare"}
    </button>
  );
}
