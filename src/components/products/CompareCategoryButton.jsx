"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiBarChart2, FiCheck, FiX } from "react-icons/fi";
import useCompareBasket from "./useCompareBasket";
import { addToCompare, COMPARE_LIMIT, itemKey, removeFromCompare } from "@/lib/compareBasket";

/**
 * A left-edge floating tab, icon-only. Only rendered once this product's
 * category actually has something to compare it against — same condition as
 * "Related Products" — and only ever lets the visitor build a comparison
 * within that one category.
 */
export default function CompareCategoryButton({ product, relatedProducts }) {
  const basket = useCompareBasket();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const hasSiblings = !!relatedProducts?.length;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!hasSiblings) return null;

  const inBasket = (item) => basket.some((entry) => itemKey(entry) === itemKey(item));

  function handleToggle(item) {
    if (inBasket(item)) {
      removeFromCompare(itemKey(item));
      return;
    }

    const slotsNeeded = inBasket(product) ? 1 : 2;
    if (basket.length + slotsNeeded > COMPARE_LIMIT) return;

    if (!inBasket(product)) addToCompare(product);
    addToCompare(item);
  }

  const selectedCount = basket.length;
  const canCompare = selectedCount >= 2;

  return (
    <div className="fixed left-0 top-1/2 z-40 -translate-y-1/2" data-floating-widget ref={rootRef}>
      <div className="relative">
        <button
          aria-expanded={isOpen}
          aria-label="Compare with similar products"
          className="flex items-center border border-l-0 border-ink bg-ink p-3.5 text-white shadow-lg shadow-zinc-900/25 transition-colors hover:bg-black"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <FiBarChart2 className="shrink-0 text-base" />
        </button>

        {isOpen ? (
          <div className="absolute left-full top-0 z-30 w-72 border border-line-light bg-white shadow-2xl shadow-zinc-900/20">
            <div className="flex items-center justify-between gap-2 border-b border-line-light bg-parchment-alt px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                Compare {product.category}
              </p>
              <button
                aria-label="Close comparison picker"
                className="inline-flex size-7 shrink-0 items-center justify-center text-ink-soft transition hover:text-red"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <FiX />
              </button>
            </div>

            <ul className="max-h-72 divide-y divide-line-light overflow-y-auto">
              {relatedProducts.map((item) => {
                const added = inBasket(item);
                const slotsNeeded = inBasket(product) ? 1 : 2;
                const full = !added && basket.length + slotsNeeded > COMPARE_LIMIT;
                const disabled = full;

                return (
                  <li className="flex items-center gap-3 px-4 py-3" key={itemKey(item)}>
                    <div className="flex size-10 shrink-0 items-center justify-center border border-line-light bg-parchment-alt">
                      {item.image ? (
                        <Image
                          alt={item.name}
                          className="h-full w-full object-contain p-1"
                          height={40}
                          src={item.image}
                          width={40}
                        />
                      ) : null}
                    </div>
                    <span className="line-clamp-2 flex-1 text-xs font-semibold leading-5 text-ink">
                      {item.name}
                    </span>
                    <button
                      className={`inline-flex h-8 shrink-0 items-center gap-1 border px-2.5 text-[11px] font-semibold transition ${
                        added
                          ? "border-ink bg-ink text-white"
                          : disabled
                            ? "cursor-not-allowed border-line-light bg-parchment-alt text-ink-soft/50"
                            : "border-line-light bg-white text-ink hover:border-ink"
                      }`}
                      disabled={disabled}
                      onClick={() => handleToggle(item)}
                      type="button"
                    >
                      {added ? <FiCheck className="text-xs" /> : null}
                      {added ? "Added" : "Add"}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-line-light p-3">
              <Link
                className={`inline-flex h-10 w-full items-center justify-center border font-semibold transition ${
                  canCompare
                    ? "border-ink bg-ink text-sm text-white hover:bg-ink/90"
                    : "pointer-events-none border-line-light bg-white text-sm text-ink-soft/60"
                }`}
                href="/compare"
                onClick={() => setIsOpen(false)}
              >
                {selectedCount >= 2
                  ? `Compare ${selectedCount} products`
                  : "Add at least one to compare"}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
