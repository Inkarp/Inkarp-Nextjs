"use client";

import { FiCheck, FiPlus } from "react-icons/fi";
import useQuoteBasket from "./useQuoteBasket";
import { addToBasket, itemKey, removeFromBasket } from "@/lib/quoteBasket";

const SIZES = {
  // Sits beside "View Details" in the product grid footer.
  card: "h-10 flex-1 text-xs",
  // Under "Request Quote" on a product page.
  block: "h-12 w-full text-sm",
};

export default function AddToQuoteButton({ product, variant = "card" }) {
  const basket = useQuoteBasket();
  if (!product?.slug) return null;

  const key = itemKey(product);
  const added = basket.some((item) => itemKey(item) === key);

  return (
    <button
      aria-pressed={added}
      className={`inline-flex items-center justify-center gap-1.5 border font-semibold transition ${SIZES[variant] ?? SIZES.card} ${
        added
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-line-light bg-white text-ink hover:-translate-y-0.5 hover:border-red hover:text-red"
      }`}
      onClick={() => (added ? removeFromBasket(key) : addToBasket(product))}
      title={added ? `Remove ${product.name} from your quote` : `Add ${product.name} to your quote`}
      type="button"
    >
      {added ? <FiCheck className="shrink-0" /> : <FiPlus className="shrink-0" />}
      {added ? "Added" : "Add to Quote"}
    </button>
  );
}
