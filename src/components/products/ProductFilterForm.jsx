"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

function getProductsUrl(pathname, searchParams, query) {
  const params = new URLSearchParams(searchParams.toString());
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  } else {
    params.delete("q");
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export default function ProductFilterForm({ productCount, query, totalCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query);
  const [isPending, startTransition] = useTransition();
  const trimmedSearch = search.trim();
  const hasActiveSearch = Boolean(trimmedSearch);

  useEffect(() => {
    const currentQuery = searchParams.get("q") ?? "";

    if (trimmedSearch === currentQuery) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      startTransition(() => {
        router.replace(getProductsUrl(pathname, searchParams, search), {
          scroll: false,
        });
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, search, searchParams, startTransition, trimmedSearch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    startTransition(() => {
      router.replace(getProductsUrl(pathname, searchParams, search), {
        scroll: false,
      });
    });
  };

  return (
    <form action="/products" onSubmit={handleSubmit} role="search">
      <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex min-w-0 flex-1 items-center">
          <FiSearch className="pointer-events-none absolute left-3 text-base text-zinc-400 dark:text-zinc-500" />
          <input
            aria-label="Search products"
            autoComplete="off"
            className="h-11 w-full rounded-lg bg-zinc-50 dark:bg-zinc-800 pl-9 pr-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#BE0010]/15"
            name="q"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product, principal, country, industry, application, tag..."
            type="search"
            value={search}
          />
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          {hasActiveSearch ? (
            <Link
              className="inline-flex h-9 items-center rounded-lg px-2.5 text-xs font-medium text-zinc-400 dark:text-zinc-500 transition hover:text-[#BE0010]"
              href="/products"
            >
              Clear
            </Link>
          ) : null}

          <div className="shrink-0 rounded-lg bg-[#BE0010] px-3 py-2 text-xs font-bold text-white">
            {isPending
              ? "Searching..."
              : `${productCount}${hasActiveSearch ? "" : `/${totalCount}`} results`}
          </div>
        </div>
      </div>

      {hasActiveSearch ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Showing matches for{" "}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{trimmedSearch}</span>
          </span>
          <Link
            className="font-semibold text-[#BE0010] transition hover:text-[#9f000d]"
            href="/products"
          >
            Clear search
          </Link>
        </div>
      ) : null}
    </form>
  );
}
