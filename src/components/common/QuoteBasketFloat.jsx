"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiFileText, FiTrash2, FiX } from "react-icons/fi";
import useQuoteBasket from "@/components/products/useQuoteBasket";
import { clearBasket, itemKey, removeFromBasket } from "@/lib/quoteBasket";

export default function QuoteBasketFloat() {
  const basket = useQuoteBasket();
  const [isOpen, setIsOpen] = useState(false);

  // An empty basket has nothing to show, so the tray closes itself rather than
  // leaving an empty panel pinned over the page.
  useEffect(() => {
    if (!basket.length) setIsOpen(false);
  }, [basket.length]);

  // Nothing shortlisted yet — stay out of the way entirely.
  if (!basket.length) return null;

  const count = basket.length;
  const label = count === 1 ? "1 product" : `${count} products`;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-3" data-floating-widget>
      {isOpen && (
        <div className="w-[min(22rem,calc(100vw-2rem))] border border-line-light bg-parchment shadow-2xl shadow-zinc-900/15">
          <div className="flex items-start justify-between gap-3 border-b border-line-light px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red">
                Your quote
              </p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{label} shortlisted</p>
            </div>
            <button
              aria-label="Close quote list"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-line-light bg-white text-ink-soft transition hover:border-red hover:text-red"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <FiX />
            </button>
          </div>

          <ul className="max-h-[46vh] divide-y divide-line-light overflow-y-auto">
            {basket.map((item) => {
              const key = itemKey(item);
              return (
                <li className="flex items-center gap-3 px-4 py-3" key={key}>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-line-light bg-white">
                    {item.image ? (
                      <Image
                        alt={item.imageAlt ?? item.name}
                        className="h-full w-full object-contain p-1"
                        height={48}
                        src={item.image}
                        width={48}
                      />
                    ) : (
                      <FiFileText aria-hidden className="text-ink-soft" />
                    )}
                  </div>
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
                    onClick={() => removeFromBasket(key)}
                    type="button"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="space-y-2 border-t border-line-light px-4 py-3">
            <Link
              className="inline-flex h-11 w-full items-center justify-center border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              href="/quote"
              onClick={() => setIsOpen(false)}
            >
              {`Request quote for ${label}`}
            </Link>
            <button
              className="w-full text-xs font-semibold text-ink-soft transition hover:text-red"
              onClick={clearBasket}
              type="button"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      <button
        aria-expanded={isOpen}
        aria-label={`${label} in your quote list`}
        className="relative inline-flex min-h-[52px] items-center gap-2 border border-red bg-parchment px-4 text-sm font-semibold text-red shadow-lg shadow-zinc-900/15 transition hover:bg-[#fdf2f2]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <FiFileText className="text-lg" />
        <span>My Quote</span>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red px-1.5 text-xs font-bold text-white">
          {count}
        </span>
      </button>
    </div>
  );
}
