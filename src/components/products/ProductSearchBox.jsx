"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { productMatchesSearch } from "@/lib/productSearch";

function ProductResultLink({ product, compact = false, onClose }) {
  return (
    <Link
      className={
        compact
          ? "block rounded-md p-3 transition hover:bg-zinc-50"
          : "rounded-md border border-zinc-200 p-4 transition hover:border-[#BE0010] hover:bg-zinc-50"
      }
      href={product.href}
      onClick={onClose}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-950">{product.name}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {product.principalName} - {product.countryOfOrigin}
          </p>
        </div>
        {compact ? (
          <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-semibold text-zinc-600">
            {product.industry}
          </span>
        ) : null}
      </div>
      {!compact ? (
        <p className="mt-3 text-xs font-medium text-[#BE0010]">
          {product.industry}
        </p>
      ) : null}
    </Link>
  );
}

export default function ProductSearchBox({
  products,
  defaultValue = "",
  variant = "page",
  onClose,
}) {
  const [query, setQuery] = useState(defaultValue);
  const trimmedQuery = query.trim();
  const isHeader = variant === "header";

  const results = useMemo(() => {
    if (!trimmedQuery) {
      return [];
    }

    return products
      .filter((product) => productMatchesSearch(product, trimmedQuery))
      .slice(0, isHeader ? 6 : 12);
  }, [isHeader, products, trimmedQuery]);

  return (
    <div className="relative">
      <form action="/products" role="search">
        <div className="relative">
          <FiSearch
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 ${
              isHeader ? "text-lg" : "text-xl"
            }`}
          />
          <input
            aria-label="Search products"
            autoComplete="off"
            className={`w-full rounded-md border border-zinc-200 bg-white text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#BE0010] focus:ring-2 focus:ring-[#BE0010]/10 ${
              isHeader
                ? "h-12 pl-11 pr-4 text-sm"
                : "h-14 pl-12 pr-4 text-base"
            }`}
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              isHeader
                ? "Search products..."
                : "Type product, principal, country, industry, application..."
            }
            type="search"
            value={query}
          />
        </div>
      </form>

      {trimmedQuery && isHeader ? (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-[440px] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/15">
          <div className="max-h-[inherit] overflow-y-auto p-2">
            {results.length ? (
              <div className="space-y-1">
                {results.map((product) => (
                  <ProductResultLink
                    compact
                    key={`${product.principalSlug}-${product.slug}`}
                    onClose={onClose}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-zinc-600">
                No related products found.
              </div>
            )}

            <div className="border-t border-zinc-100 p-2">
              <Link
                className="block w-full rounded-md bg-[#BE0010] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#9f000d]"
                href={`/products?q=${encodeURIComponent(trimmedQuery)}`}
              >
                Search all products
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {trimmedQuery && !isHeader ? (
        <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-zinc-950">
              Related products for <span>{trimmedQuery}</span>
            </p>
            <Link
              className="text-sm font-semibold text-[#BE0010] hover:text-[#9f000d]"
              href={`/products?q=${encodeURIComponent(trimmedQuery)}`}
            >
              Open search results
            </Link>
          </div>

          {results.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {results.map((product) => (
                <ProductResultLink
                  key={`${product.principalSlug}-${product.slug}`}
                  onClose={onClose}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-600">
              No related products found.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
