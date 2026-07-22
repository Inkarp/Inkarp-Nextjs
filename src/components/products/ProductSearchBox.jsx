"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiArrowUpRight, FiSearch, FiX } from "react-icons/fi";
import { productMatchesSearch } from "@/lib/productSearch";
import PrincipalLogo from "@/components/products/PrincipalLogo";

// Same tracking endpoint the /products search uses. Every submitted global
// search is recorded before results are shown, whichever entry point it came from.
function logSearch({ query, resultsCount }) {
  return fetch("/api/search-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, brands: [], resultsCount }),
    keepalive: true,
  }).catch(() => {});
}

function ProductResultLink({ product, compact = false, onDark = false, onClose }) {
  if (onDark) {
    return (
      <Link
        className="group block border border-zinc-200 bg-white p-4 shadow-[0_16px_36px_rgba(15,23,42,0.08)] outline-none transition duration-200 hover:-translate-y-0.5 hover:border-red/40 hover:shadow-[0_20px_44px_rgba(15,23,42,0.12)] focus-visible:ring-2 focus-visible:ring-red/40"
        href={product.href}
        onClick={onClose}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-ink group-hover:text-red">
              {product.name}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
              <PrincipalLogo
                className="h-4 w-16"
                principalName={product.principalName}
                principalSlug={product.principalSlug}
              />
              <span>- {product.countryOfOrigin}</span>
            </div>
          </div>
          <FiArrowUpRight className="mt-0.5 shrink-0 text-lg text-red opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </div>
        <p className="mt-3 inline-flex bg-red/10 px-2.5 py-1 text-xs font-semibold text-red">
          {product.industry}
        </p>
      </Link>
    );
  }

  return (
    <Link
      className={
        compact
          ? "block p-3 outline-none transition-colors duration-200 hover:bg-parchment-alt focus-visible:ring-2 focus-visible:ring-red/40"
          : "block border border-line-light bg-white p-4 outline-none transition-colors duration-200 hover:border-red/40 hover:bg-parchment-alt focus-visible:ring-2 focus-visible:ring-red/40"
      }
      href={product.href}
      onClick={onClose}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
            <PrincipalLogo
              className="h-4 w-16"
              principalName={product.principalName}
              principalSlug={product.principalSlug}
            />
            <span>- {product.countryOfOrigin}</span>
          </div>
        </div>
        {compact ? (
          <span className="shrink-0 bg-parchment-alt px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
            {product.industry}
          </span>
        ) : null}
      </div>
      {!compact ? (
        <p className="mt-3 text-xs font-medium text-red">{product.industry}</p>
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
  // Results only reflect an explicitly submitted query, never as-you-type, so
  // every result set shown corresponds to a search word actually captured.
  const [submittedQuery, setSubmittedQuery] = useState(defaultValue.trim());
  const trimmedQuery = query.trim();
  const isHeader = variant === "header";
  const isModal = variant === "modal";
  const isFullscreen = variant === "fullscreen";

  const showSearchButton = trimmedQuery.length >= 2;
  const canSubmit = trimmedQuery.length === 0 || trimmedQuery.length >= 2;

  const results = useMemo(() => {
    if (!submittedQuery) {
      return [];
    }

    return products
      .filter((product) => productMatchesSearch(product, submittedQuery))
      .slice(0, isHeader ? 6 : 12);
  }, [isHeader, products, submittedQuery]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmittedQuery(trimmedQuery);

    if (trimmedQuery) {
      const matchCount = products.filter((product) =>
        productMatchesSearch(product, trimmedQuery)
      ).length;
      logSearch({ query: trimmedQuery, resultsCount: matchCount });
    }
  };

  const clearQuery = () => {
    setQuery("");
  };

  if (isFullscreen) {
    return (
      <div className="relative">
        <form onSubmit={handleSubmit} role="search">
          <div className="overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] transition focus-within:border-red/35 focus-within:shadow-[0_28px_80px_rgba(190,0,16,0.16)]">
            <div className="h-1 bg-[linear-gradient(90deg,#be0010,#d71920,#161616)]" />
            <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="inline-flex size-12 shrink-0 items-center justify-center bg-[#161616] text-xl text-white shadow-sm">
                  <FiSearch aria-hidden="true" />
                </span>
                <input
                  aria-label="Search products"
                  autoComplete="off"
                  autoFocus
                  className="h-14 w-full min-w-0 bg-transparent text-xl font-semibold text-ink caret-red outline-none placeholder:text-ink-soft/55 sm:text-2xl"
                  name="q"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Type your search keywords here"
                  type="text"
                  value={query}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                {query ? (
                  <button
                    aria-label="Clear search"
                    className="inline-flex size-12 items-center justify-center border border-line-light bg-parchment-alt text-xl text-ink-soft transition hover:border-red/40 hover:text-red focus:outline-none focus:ring-2 focus:ring-red/20"
                    onClick={clearQuery}
                    type="button"
                  >
                    <FiX aria-hidden="true" />
                  </button>
                ) : null}

                <button
                  aria-label="Search"
                  className={`inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap bg-red text-sm font-bold text-white transition-all duration-300 ease-out hover:bg-[#9f000d] disabled:cursor-not-allowed disabled:opacity-40 ${
                    showSearchButton
                      ? "h-12 max-w-[136px] px-5 opacity-100"
                      : "h-12 max-w-0 px-0 opacity-0"
                  }`}
                  disabled={!showSearchButton}
                  type="submit"
                >
                  Search
                  <FiArrowUpRight aria-hidden="true" className="text-base" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {submittedQuery ? (
          <div className="mt-6 border border-zinc-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink-soft">
                Related products for{" "}
                <span className="font-semibold text-ink">{submittedQuery}</span>
              </p>
              <Link
                className="inline-flex items-center gap-1.5 border border-red/30 px-3 py-2 text-sm font-semibold text-red outline-none transition hover:bg-red hover:text-white focus-visible:ring-2 focus-visible:ring-red/40"
                href={`/products?q=${encodeURIComponent(submittedQuery)}`}
                onClick={onClose}
              >
                Open search results
                <FiArrowUpRight aria-hidden="true" />
              </Link>
            </div>

            {results.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {results.map((product) => (
                  <ProductResultLink
                    key={`${product.principalSlug}-${product.slug}`}
                    onClose={onClose}
                    onDark
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-5 border border-line-light bg-parchment-alt p-4 text-sm text-ink-soft">
                No related products found. Try a product name, principal, or industry.
              </p>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <FiSearch
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft ${
                isHeader ? "text-lg" : isModal ? "text-2xl" : "text-xl"
              }`}
            />
            <input
              aria-label="Search products"
              autoComplete="off"
              autoFocus={isHeader || isModal}
              className={`w-full border border-line-light bg-parchment-alt text-ink outline-none transition-colors duration-200 placeholder:text-ink-soft/70 focus:border-red/40 focus:bg-white focus:ring-2 focus:ring-red/15 ${
                isHeader
                  ? "h-12 pl-11 pr-4 text-sm"
                  : isModal
                    ? "h-16 pl-14 pr-4 text-lg"
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

          <button
            aria-label="Search"
            className={`shrink-0 overflow-hidden whitespace-nowrap border border-red bg-red font-bold text-parchment transition-all duration-300 ease-out hover:bg-transparent hover:text-red disabled:cursor-not-allowed disabled:opacity-40 ${
              isHeader ? "text-xs" : "text-sm"
            } ${
              showSearchButton
                ? `${isHeader ? "h-12" : isModal ? "h-16" : "h-14"} max-w-[110px] px-5 opacity-100`
                : `${isHeader ? "h-12" : isModal ? "h-16" : "h-14"} max-w-0 px-0 opacity-0`
            }`}
            disabled={!showSearchButton}
            type="submit"
          >
            Search
          </button>
        </div>
      </form>

      {submittedQuery && isHeader ? (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-[440px] overflow-hidden border border-line-light bg-white">
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
              <div className="p-4 text-sm text-ink-soft">
                No related products found.
              </div>
            )}

            <div className="border-t border-line-light p-2">
              <Link
                className="block w-full border border-red bg-red px-4 py-2.5 text-center text-sm font-semibold text-parchment outline-none transition-colors duration-200 hover:bg-transparent hover:text-red focus-visible:ring-2 focus-visible:ring-red/40"
                href={`/products?q=${encodeURIComponent(submittedQuery)}`}
                onClick={onClose}
              >
                Search all products
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {submittedQuery && !isHeader ? (
        <div
          className={
            isModal
              ? "mt-4 max-h-[min(62vh,560px)] overflow-y-auto border border-line-light bg-white p-4"
              : "mt-3 border border-line-light bg-white p-4"
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink-soft">
              Related products for{" "}
              <span className="font-semibold text-ink">{submittedQuery}</span>
            </p>
            <Link
              className="text-sm font-semibold text-red outline-none transition-colors hover:text-[#9f000d] focus-visible:ring-2 focus-visible:ring-red/40"
              href={`/products?q=${encodeURIComponent(submittedQuery)}`}
              onClick={onClose}
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
            <p className="mt-4 text-sm text-ink-soft">
              No related products found.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}