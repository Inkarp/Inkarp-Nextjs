"use client";

import { FiCheck, FiPlus } from "react-icons/fi";
import useQuoteBasket from "./useQuoteBasket";
import { addToBasket, itemKey, removeFromBasket } from "@/lib/quoteBasket";

const SIZES = {
  // Sits beside "View Details" in the product grid footer.
  card: "h-10 flex-1 text-xs",
  // Under "Enquire Now" on a product page.
  block: "h-14 w-full text-base",
  // Beside "Enquire Now" when the two sit side by side on a product page.
  duo: "h-14 w-full text-sm",
};

// The hero shows this beside "Enquire Now", so it spells out that it builds a
// shortlist rather than contacting us right away — the two were easy to mix up
// as just "two quote buttons" when both used the shorter label.
const SHORTLIST_LABEL_VARIANTS = new Set(["block", "duo"]);

export default function AddToQuoteButton({ product, variant = "card" }) {
  const basket = useQuoteBasket();
  if (!product?.slug) return null;

  const key = itemKey(product);
  const added = basket.some((item) => itemKey(item) === key);
  const useLongLabel = SHORTLIST_LABEL_VARIANTS.has(variant);
  const label = added
    ? (useLongLabel ? "Added to List" : "Added")
    : (useLongLabel ? "Add to Quote List" : "Add to Quote");

  return (
    <button
      aria-pressed={added}
      className={`inline-flex items-center justify-center gap-1.5 border font-semibold transition ${SIZES[variant] ?? SIZES.card} ${
        added
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-line-light bg-white text-ink hover:-translate-y-0.5 hover:border-red hover:text-red"
      }`}
      onClick={() => (added ? removeFromBasket(key) : addToBasket(product))}
      title={added ? `Remove ${product.name} from your quote list` : `Add ${product.name} to your quote list`}
      type="button"
    >
      {added ? <FiCheck className="shrink-0" /> : <FiPlus className="shrink-0" />}
      {label}
    </button>
  );
}
