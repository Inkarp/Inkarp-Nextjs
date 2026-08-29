"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiBarChart2, FiFileText, FiTrash2, FiX } from "react-icons/fi";
import useCompareBasket from "@/components/products/useCompareBasket";
import { clearCompare, COMPARE_LIMIT, itemKey, removeFromCompare } from "@/lib/compareBasket";

const AVATAR_COUNT = 3;

export default function CompareBasketFloat() {
  const basket = useCompareBasket();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!basket.length) setIsOpen(false);
  }, [basket.length]);

  if (!basket.length) return null;

  const count = basket.length;
  const label = count === 1 ? "1 product" : `${count} products`;

  return (
    <>
      {isOpen && (
        <div className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden border border-line-light bg-parchment shadow-2xl shadow-zinc-900/15">
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
                  {label} selected <span className="text-white/50">({count}/{COMPARE_LIMIT})</span>
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
                    onClick={() => removeFromCompare(key)}
                    type="button"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              );
            })}
          </ul>

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
              {count >= 2 ? `Compare ${label}` : "Add 1 more to compare"}
            </Link>
            <button
              className="w-full text-xs font-semibold text-ink-soft transition hover:text-red"
              onClick={clearCompare}
              type="button"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      <button
        aria-expanded={isOpen}
        aria-label={`${label} selected to compare`}
        className="group relative inline-flex min-h-[56px] items-center gap-3 border border-ink bg-white pl-2.5 pr-4 shadow-xl shadow-zinc-900/15 transition hover:-translate-y-0.5 hover:shadow-2xl motion-safe:animate-[float-widget-pop_0.35s_ease-out]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
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
        <span className="text-sm font-semibold text-ink">Compare</span>
        <span
          className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-bold text-white motion-safe:animate-[float-badge-pop_0.4s_ease-out]"
          key={count}
        >
          {count}
        </span>
      </button>
    </>
  );
}
