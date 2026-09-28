"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FiBarChart2, FiFileText, FiTrash2, FiX } from "react-icons/fi";
import useCompareBasket from "@/components/products/useCompareBasket";
import { addToCompare, clearCompare, COMPARE_LIMIT, itemKey, removeFromCompare } from "@/lib/compareBasket";
import { getCompareSiblings, getServerCompareSiblings, subscribeCompareSiblings } from "@/lib/compareSiblings";

const AVATAR_COUNT = 3;

function Thumb({ item, size }) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center border border-line-light bg-white`}>
      {item.image ? (
        <Image alt={item.imageAlt ?? item.name} className="h-full w-full object-contain p-1" height={48} src={item.image} width={48} />
      ) : (
        <FiFileText aria-hidden className="text-ink-soft" />
      )}
    </div>
  );
}

/**
 * The site's one compare widget. Anywhere, it shows the shortlist once it has
 * items; on a product page it is always there and also offers the page's
 * same-category products to add (picking one adds this product too).
 */
export default function CompareBasketFloat() {
  const basket = useCompareBasket();
  const siblings = useSyncExternalStore(subscribeCompareSiblings, getCompareSiblings, getServerCompareSiblings);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const count = basket.length;
  const inBasket = (item) => basket.some((entry) => itemKey(entry) === itemKey(item));
  const candidates = (siblings?.items ?? []).filter((item) => !inBasket(item));
  const visible = count > 0 || candidates.length > 0;
  const open = isOpen && visible;

  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setIsOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!visible) return null;

  const label = count === 1 ? "1 product" : `${count} products`;
  const slotsNeeded = siblings && !inBasket(siblings.product) ? 2 : 1;
  const full = count + slotsNeeded > COMPARE_LIMIT;

  function handleAdd(item) {
    if (full) return;
    if (siblings && !inBasket(siblings.product)) addToCompare(siblings.product);
    addToCompare(item);
  }

  let footerLabel = `Compare ${label}`;
  if (count === 1) footerLabel = "Add 1 more to compare";
  if (count === 0) footerLabel = "Pick a product to compare with";

  return (
    <div className="flex flex-col items-start gap-3" ref={rootRef}>
      {open && (
        // On phones, stop short of the right-edge WhatsApp / call / scroll buttons so they never cover "Add".
        <div className="w-[min(22rem,calc(100vw-4.5rem))] overflow-hidden border border-line-light bg-parchment shadow-2xl shadow-zinc-900/15">
          <div className="flex items-center justify-between gap-3 bg-[linear-gradient(135deg,#161616_0%,#242424_62%,#be0010_100%)] px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center bg-white/10 text-white ring-1 ring-white/15">
                <FiBarChart2 />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Compare
                </p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {count ? `${label} selected` : `Compare ${siblings?.category ?? "products"}`}{" "}
                  <span className="text-white/50">({count}/{COMPARE_LIMIT})</span>
                </p>
              </div>
            </div>
            <button
              aria-label="Close compare list"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/20 text-white/70 transition hover:border-white hover:text-white"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <FiX />
            </button>
          </div>

          <div className="max-h-[36vh] overflow-y-auto sm:max-h-[50vh]">
            {count > 0 && (
              <>
                <p className="bg-parchment-alt px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">Your list</p>
                <ul className="divide-y divide-line-light">
                  {basket.map((item) => {
                    const key = itemKey(item);
                    return (
                      <li className="flex items-center gap-3 px-4 py-3" key={key}>
                        <Thumb item={item} size="h-12 w-12" />
                        <div className="min-w-0 flex-1">
                          <Link
                            className="line-clamp-2 text-xs font-semibold leading-5 text-ink transition hover:text-red"
                            href={`/products/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                          {item.principalName ? (
                            <p className="mt-0.5 text-[11px] text-ink-soft">{item.principalName}</p>
                          ) : null}
                        </div>
                        <button
                          aria-label={`Remove ${item.name}`}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-ink-soft transition hover:text-red"
                          onClick={() => removeFromCompare(key)}
                          type="button"
                        >
                          <FiTrash2 />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {candidates.length > 0 && (
              <>
                <p className="border-t border-line-light bg-parchment-alt px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                  Add from {siblings.category}
                </p>
                {full ? (
                  <p className="px-4 pt-3 text-[11px] leading-5 text-ink-soft">
                    Your list is full ({COMPARE_LIMIT} max) - remove one to add another.
                  </p>
                ) : null}
                <ul className="divide-y divide-line-light">
                  {candidates.map((item) => (
                    <li className="flex items-center gap-3 px-4 py-3" key={itemKey(item)}>
                      <Thumb item={item} size="size-10" />
                      <span className="line-clamp-2 min-w-0 flex-1 text-xs font-semibold leading-5 text-ink">{item.name}</span>
                      <button
                        className={`inline-flex h-8 shrink-0 items-center border px-2.5 text-[11px] font-semibold transition ${
                          full
                            ? "cursor-not-allowed border-line-light bg-parchment-alt text-ink-soft/50"
                            : "border-line-light bg-white text-ink hover:border-ink"
                        }`}
                        disabled={full}
                        onClick={() => handleAdd(item)}
                        type="button"
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="space-y-2 border-t border-line-light bg-white px-4 py-3">
            <Link
              className={`inline-flex h-11 w-full items-center justify-center border font-semibold transition ${
                count >= 2
                  ? "border-ink bg-ink text-sm text-white hover:bg-ink/90"
                  : "pointer-events-none border-line-light bg-white text-sm text-ink-soft/60"
              }`}
              href="/compare"
              onClick={() => setIsOpen(false)}
            >
              {footerLabel}
            </Link>
            {count > 0 ? (
              <button
                className="w-full text-xs font-semibold text-ink-soft transition hover:text-red"
                onClick={clearCompare}
                type="button"
              >
                Clear all
              </button>
            ) : null}
          </div>
        </div>
      )}

      <button
        aria-expanded={open}
        aria-label={count ? `${label} selected to compare` : `Compare ${siblings?.category ?? "products"}`}
        className="group relative inline-flex min-h-[56px] items-center gap-2 border border-ink bg-white pl-2.5 pr-3 shadow-xl shadow-zinc-900/15 transition hover:-translate-y-0.5 hover:shadow-2xl motion-safe:animate-[float-widget-pop_0.35s_ease-out] sm:gap-3 sm:pr-4"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {count ? (
          <span className="flex -space-x-2.5">
            {basket.slice(0, AVATAR_COUNT).map((item) => (
              <span
                className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-parchment-alt shadow-sm"
                key={itemKey(item)}
              >
                {item.image ? (
                  <Image alt="" className="h-full w-full object-contain p-1" height={32} src={item.image} width={32} />
                ) : (
                  <FiBarChart2 className="text-xs text-ink-soft" />
                )}
              </span>
            ))}
          </span>
        ) : (
          <span className="flex size-8 items-center justify-center bg-ink text-white">
            <FiBarChart2 className="text-sm" />
          </span>
        )}
        <span className="hidden text-sm font-semibold text-ink sm:inline">Compare</span>
        {count ? (
          <span
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-bold text-white motion-safe:animate-[float-badge-pop_0.4s_ease-out]"
            key={count}
          >
            {count}
          </span>
        ) : null}
      </button>
    </div>
  );
}
