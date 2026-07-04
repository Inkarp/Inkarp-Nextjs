"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

function getProductsUrl(pathname, searchParams, query, brands = []) {
  const params = new URLSearchParams(searchParams.toString());
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  } else {
    params.delete("q");
  }

  params.delete("brand");
  brands.forEach((brand) => {
    if (brand) {
      params.append("brand", brand);
    }
  });

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

// Fire-and-forget: records what people actually search for so it can inform
// catalog/SEO priorities later. Never blocks navigation on the network call.
function logSearch({ query, brands, resultsCount }) {
  fetch("/api/search-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, brands, resultsCount }),
    keepalive: true,
  }).catch(() => {});
}

export default function ProductFilterForm({
  brandOptions = [],
  productCount,
  query,
  selectedBrands = [],
  totalCount,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const trimmedSearch = search.trim();
  const hasActiveSearch = Boolean(trimmedSearch);
  const hasActiveBrands = selectedBrands.length > 0;
  const hasActiveFilters = hasActiveSearch || hasActiveBrands;
  const selectedBrandSet = new Set(selectedBrands);
  const selectedBrandNames = brandOptions
    .filter((option) => selectedBrandSet.has(option.value))
    .map((option) => option.label);
  const brandButtonLabel = hasActiveBrands
    ? `${selectedBrands.length} selected`
    : "All brands";
  const trimmedBrandSearch = brandSearch.trim().toLowerCase();
  const filteredBrandOptions = trimmedBrandSearch
    ? brandOptions.filter((option) =>
        option.label.toLowerCase().includes(trimmedBrandSearch)
      )
    : brandOptions;

  // Search only fires on an explicit action (button/Enter) — never as-you-type —
  // so every logged query represents a real search intent, not a keystroke.
  const showSearchButton = trimmedSearch.length >= 2;
  const canSubmitSearch = trimmedSearch.length === 0 || trimmedSearch.length >= 2;

  const runSearch = () => {
    if (!canSubmitSearch) return;

    startTransition(() => {
      router.replace(
        getProductsUrl(pathname, searchParams, search, selectedBrands),
        { scroll: false }
      );
    });

    if (trimmedSearch) {
      logSearch({ query: trimmedSearch, brands: selectedBrands, resultsCount: productCount });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch();
  };

  const handleClear = () => {
    setSearch("");
  };

  const handleBrandToggle = (brand) => {
    const nextBrands = selectedBrandSet.has(brand)
      ? selectedBrands.filter((item) => item !== brand)
      : [...selectedBrands, brand];

    startTransition(() => {
      router.replace(getProductsUrl(pathname, searchParams, search, nextBrands), {
        scroll: false,
      });
    });
  };

  return (
    <form action="/products" onSubmit={handleSubmit} role="search">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="relative flex min-w-0 flex-1 items-center">
            <FiSearch className="pointer-events-none absolute left-4 text-base text-ink-soft dark:text-zinc-500" />
            <input
              aria-label="Search products"
              autoComplete="off"
              className="h-12 w-full rounded-full border border-line-light dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-10 pr-9 text-sm text-ink dark:text-zinc-100 shadow-sm outline-none transition placeholder:text-ink-soft dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-red/15"
              name="q"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, brands, applications..."
              type="search"
              value={search}
            />
            {search ? (
              <button
                aria-label="Clear search"
                className="absolute right-3 flex size-5 items-center justify-center rounded-full text-ink-soft transition hover:text-red dark:text-zinc-500"
                onClick={handleClear}
                type="button"
              >
                <FiX />
              </button>
            ) : null}
          </div>

          <button
            className={`shrink-0 overflow-hidden whitespace-nowrap rounded-full bg-red text-sm font-bold text-white transition-all duration-300 ease-out hover:bg-[#9f000d] disabled:cursor-not-allowed disabled:opacity-40 ${
              showSearchButton ? "h-12 max-w-[140px] px-6 opacity-100" : "h-12 max-w-0 px-0 opacity-0"
            }`}
            disabled={!showSearchButton}
            type="submit"
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-2 lg:justify-end">
          <div className="relative min-w-0 lg:w-64">
            <button
              aria-expanded={isBrandOpen}
              className="flex h-11 w-full items-center justify-between gap-3 rounded-full border border-line-light dark:border-zinc-800 bg-white dark:bg-zinc-800 px-4 text-left text-sm text-ink-soft dark:text-zinc-200 shadow-sm transition hover:border-red/30 focus:outline-none focus:ring-2 focus:ring-red/15"
              onClick={() =>
                setIsBrandOpen((isOpen) => {
                  if (isOpen) {
                    setBrandSearch("");
                  }
                  return !isOpen;
                })
              }
              type="button"
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-ink-soft dark:text-zinc-500">
                  Brand
                </span>
                <span className="block truncate font-semibold">{brandButtonLabel}</span>
              </span>
              <FiChevronDown
                className={`shrink-0 text-ink-soft transition ${isBrandOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isBrandOpen ? (
              <div className="absolute right-0 z-30 mt-2 w-full min-w-72 rounded-lg border border-line-light dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl shadow-zinc-900/10">
                <div className="relative mb-2">
                  <FiSearch className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-ink-soft dark:text-zinc-500" />
                  <input
                    aria-label="Search brands"
                    autoComplete="off"
                    autoFocus
                    className="h-9 w-full rounded-md border border-line-light dark:border-zinc-700 bg-[whitesmoke] dark:bg-zinc-800 pl-8 pr-3 text-sm text-ink dark:text-zinc-100 outline-none transition placeholder:text-ink-soft dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-red/15"
                    onChange={(event) => setBrandSearch(event.target.value)}
                    placeholder="Search brand..."
                    type="text"
                    value={brandSearch}
                  />
                </div>

                <div className="max-h-64 overflow-auto">
                  {filteredBrandOptions.length > 0 ? (
                    filteredBrandOptions.map((option) => (
                      <label
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-[whitesmoke] dark:hover:bg-zinc-800"
                        key={option.value}
                      >
                        <input
                          checked={selectedBrandSet.has(option.value)}
                          className="size-4 rounded border-zinc-300 text-red focus:ring-red"
                          name="brand"
                          onChange={() => handleBrandToggle(option.value)}
                          type="checkbox"
                          value={option.value}
                        />
                        <span className="min-w-0 flex-1 truncate text-ink-soft dark:text-zinc-200">
                          {option.label}
                        </span>
                        <span className="rounded bg-[whitesmoke] dark:bg-zinc-800 px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft dark:text-zinc-400">
                          {option.count}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="px-2 py-3 text-center text-sm text-ink-soft dark:text-zinc-500">
                      No brands match &ldquo;{brandSearch}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {hasActiveFilters ? (
            <Link
              className="inline-flex h-9 items-center rounded-full px-2.5 text-xs font-medium text-ink-soft dark:text-zinc-500 transition hover:text-red"
              href="/products"
            >
              Clear
            </Link>
          ) : null}

          <div className="shrink-0 rounded-full bg-red px-3 py-2 text-xs font-bold text-white">
            {isPending
              ? "Searching..."
              : `${productCount}${hasActiveFilters ? "" : `/${totalCount}`} results`}
          </div>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-soft dark:text-zinc-400">
          {hasActiveSearch ? (
            <span>
              Showing matches for{" "}
              <span className="font-semibold text-ink dark:text-zinc-200">
                {trimmedSearch}
              </span>
            </span>
          ) : null}
          {hasActiveBrands ? (
            <span>
              Brand: {" "}
              <span className="font-semibold text-ink dark:text-zinc-200">
                {selectedBrandNames.join(", ")}
              </span>
            </span>
          ) : null}
          <Link
            className="font-semibold text-red transition hover:text-[#9f000d]"
            href="/products"
          >
            Clear filters
          </Link>
        </div>
      ) : null}
    </form>
  );
}
