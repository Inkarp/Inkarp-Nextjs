"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

function getProductsUrl(
  pathname,
  searchParams,
  query,
  brands = [],
  industries = [],
  applications = []
) {
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

  params.delete("industry");
  industries.forEach((industry) => {
    if (industry) {
      params.append("industry", industry);
    }
  });

  params.delete("application");
  applications.forEach((application) => {
    if (application) {
      params.append("application", application);
    }
  });

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

function logSearch({ query, brands, resultsCount }) {
  return fetch("/api/search-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, brands, resultsCount }),
    keepalive: true,
  }).catch(() => {});
}

function FilterDropdown({
  allLabel,
  isOpen,
  label,
  noMatchLabel,
  onClear,
  onOptionToggle,
  onSearchChange,
  onToggleOpen,
  options,
  searchPlaceholder,
  searchValue,
  selectedValues,
}) {
  const selectedSet = new Set(selectedValues);
  const buttonLabel = selectedValues.length ? `${selectedValues.length} selected` : allLabel;
  const trimmedSearch = searchValue.trim().toLowerCase();
  const filteredOptions = trimmedSearch
    ? options.filter((option) => option.label.toLowerCase().includes(trimmedSearch))
    : options;

  return (
    <div className="relative min-w-[min(100%,15rem)] flex-1">
      <button
        aria-expanded={isOpen}
        className="flex h-11 w-full items-center justify-between gap-3 border border-line-light bg-white px-4 text-left text-sm text-ink-soft transition hover:border-red focus:outline-none focus:ring-2 focus:ring-red/20"
        onClick={onToggleOpen}
        type="button"
      >
        <span className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-ink-soft">
            {label}
          </span>
          <span className="block truncate font-semibold">{buttonLabel}</span>
        </span>
        <FiChevronDown
          className={`shrink-0 text-ink-soft transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-30 mt-2 w-full min-w-72 border border-line-light bg-white p-2 shadow-xl shadow-zinc-900/10">
          {selectedValues.length > 0 ? (
            <div className="mb-2 flex items-center justify-between gap-3 border-b border-line-light pb-2">
              <span className="text-xs font-semibold text-ink-soft">
                {selectedValues.length} selected
              </span>
              <button
                className="text-xs font-semibold text-red transition hover:text-ink"
                onClick={onClear}
                type="button"
              >
                Clear
              </button>
            </div>
          ) : null}

          <div className="relative mb-2">
            <FiSearch className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-ink-soft" />
            <input
              aria-label={`Search ${label.toLowerCase()}`}
              autoComplete="off"
              autoFocus
              className="h-9 w-full border border-line-light bg-parchment-alt pl-8 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/70 focus:border-red focus:bg-white focus:ring-2 focus:ring-red/20"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              type="text"
              value={searchValue}
            />
          </div>

          <div className="max-h-64 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label
                  className="flex cursor-pointer items-center gap-2 px-2 py-2 text-sm transition hover:bg-parchment-alt"
                  key={option.value}
                >
                  <input
                    checked={selectedSet.has(option.value)}
                    className="size-4 border-line-light text-red focus:ring-red"
                    onChange={() => onOptionToggle(option.value)}
                    type="checkbox"
                    value={option.value}
                  />
                  <span className="min-w-0 flex-1 truncate text-ink-soft">{option.label}</span>
                  <span className="bg-parchment-alt px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft">
                    {option.count}
                  </span>
                </label>
              ))
            ) : (
              <p className="px-2 py-3 text-center text-sm text-ink-soft">{noMatchLabel}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ProductFilterForm({
  applicationOptions = [],
  brandOptions = [],
  industryOptions = [],
  productCount,
  query,
  selectedApplications = [],
  selectedBrands = [],
  selectedIndustries = [],
  totalCount,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [industrySearch, setIndustrySearch] = useState("");
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationSearch, setApplicationSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);
  const trimmedSearch = search.trim();
  // The search applied to the results (from the URL), not what is typed in the box.
  const appliedQuery = (query ?? "").trim();
  const hasActiveSearch = Boolean(appliedQuery);
  const hasActiveBrands = selectedBrands.length > 0;
  const hasActiveIndustries = selectedIndustries.length > 0;
  const hasActiveApplications = selectedApplications.length > 0;
  const hasActiveFilters =
    hasActiveSearch || hasActiveBrands || hasActiveIndustries || hasActiveApplications;
  const selectedBrandSet = new Set(selectedBrands);
  const selectedBrandNames = brandOptions
    .filter((option) => selectedBrandSet.has(option.value))
    .map((option) => option.label);
  const selectedIndustrySet = new Set(selectedIndustries);
  const selectedIndustryNames = industryOptions
    .filter((option) => selectedIndustrySet.has(option.value))
    .map((option) => option.label);
  const selectedApplicationSet = new Set(selectedApplications);
  const selectedApplicationNames = applicationOptions
    .filter((option) => selectedApplicationSet.has(option.value))
    .map((option) => option.label);
  const isLoading = isPending || isNavigating;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsNavigating(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [searchParams]);

  const showSearchButton = trimmedSearch.length >= 2;
  const canSubmitSearch = trimmedSearch.length === 0 || trimmedSearch.length >= 2;

  const runSearch = () => {
    if (!canSubmitSearch) return;

    setIsNavigating(true);

    if (trimmedSearch) {
      logSearch({ query: trimmedSearch, brands: selectedBrands, resultsCount: productCount });
    }

    startTransition(() => {
      router.replace(
        getProductsUrl(
          pathname,
          searchParams,
          search,
          selectedBrands,
          selectedIndustries,
          selectedApplications
        ),
        { scroll: false }
      );
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch();
  };

  const handleClear = () => {
    setSearch("");
    // Also drop the applied search, otherwise the results stay filtered.
    if (!appliedQuery) return;

    setIsNavigating(true);

    startTransition(() => {
      router.replace(
        getProductsUrl(
          pathname,
          searchParams,
          "",
          selectedBrands,
          selectedIndustries,
          selectedApplications
        ),
        { scroll: false }
      );
    });
  };

  const handleBrandToggle = (brand) => {
    const nextBrands = selectedBrandSet.has(brand)
      ? selectedBrands.filter((item) => item !== brand)
      : [...selectedBrands, brand];

    setIsNavigating(true);

    startTransition(() => {
      router.replace(
        getProductsUrl(
          pathname,
          searchParams,
          search,
          nextBrands,
          selectedIndustries,
          selectedApplications
        ),
        { scroll: false }
      );
    });
  };

  const handleIndustryToggle = (industry) => {
    const nextIndustries = selectedIndustrySet.has(industry)
      ? selectedIndustries.filter((item) => item !== industry)
      : [...selectedIndustries, industry];

    setIsNavigating(true);

    startTransition(() => {
      router.replace(
        getProductsUrl(
          pathname,
          searchParams,
          search,
          selectedBrands,
          nextIndustries,
          selectedApplications
        ),
        { scroll: false }
      );
    });
  };

  const handleApplicationToggle = (application) => {
    const nextApplications = selectedApplicationSet.has(application)
      ? selectedApplications.filter((item) => item !== application)
      : [...selectedApplications, application];

    setIsNavigating(true);

    startTransition(() => {
      router.replace(
        getProductsUrl(
          pathname,
          searchParams,
          search,
          selectedBrands,
          selectedIndustries,
          nextApplications
        ),
        { scroll: false }
      );
    });
  };

  const handleBrandClear = () => {
    setBrandSearch("");
    setIsNavigating(true);

    startTransition(() => {
      router.replace(
        getProductsUrl(
          pathname,
          searchParams,
          search,
          [],
          selectedIndustries,
          selectedApplications
        ),
        { scroll: false }
      );
    });
  };

  const handleIndustryClear = () => {
    setIndustrySearch("");
    setIsNavigating(true);

    startTransition(() => {
      router.replace(
        getProductsUrl(
          pathname,
          searchParams,
          search,
          selectedBrands,
          [],
          selectedApplications
        ),
        { scroll: false }
      );
    });
  };

  const handleApplicationClear = () => {
    setApplicationSearch("");
    setIsNavigating(true);

    startTransition(() => {
      router.replace(
        getProductsUrl(
          pathname,
          searchParams,
          search,
          selectedBrands,
          selectedIndustries,
          []
        ),
        { scroll: false }
      );
    });
  };

  return (
    <form action="/products" className="relative" onSubmit={handleSubmit} role="search">
      <div className="flex flex-col gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative flex min-w-0 flex-1 items-center">
            <FiSearch className="pointer-events-none absolute left-5 text-lg text-ink-soft" />
            <input
              aria-label="Search products"
              autoComplete="off"
              className="h-14 w-full border border-line-light bg-white pl-12 pr-11 text-base text-ink outline-none transition placeholder:text-ink-soft/70 focus:border-red focus:ring-2 focus:ring-red/20 lg:h-16"
              name="q"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, brands, applications..."
              type="text"
              value={search}
            />
            {search ? (
              <button
                aria-label="Clear search"
                className="absolute right-4 flex size-6 items-center justify-center text-ink-soft transition hover:text-red"
                onClick={handleClear}
                type="button"
              >
                <FiX />
              </button>
            ) : null}
          </div>

          <button
            className={`shrink-0 overflow-hidden whitespace-nowrap border border-red bg-red text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-transparent hover:text-red disabled:cursor-not-allowed disabled:opacity-40 lg:text-base ${
              showSearchButton ? "h-14 max-w-[180px] px-7 opacity-100 lg:h-16 lg:px-10" : "h-14 max-w-0 px-0 opacity-0 lg:h-16"
            }`}
            disabled={!showSearchButton}
            type="submit"
          >
            Search
          </button>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2">
          <FilterDropdown
            allLabel="All applications"
            isOpen={isApplicationOpen}
            label="Application"
            noMatchLabel={`No applications match "${applicationSearch}"`}
            onClear={handleApplicationClear}
            onOptionToggle={handleApplicationToggle}
            onSearchChange={setApplicationSearch}
            onToggleOpen={() =>
              setIsApplicationOpen((isOpen) => {
                if (isOpen) {
                  setApplicationSearch("");
                }
                return !isOpen;
              })
            }
            options={applicationOptions}
            searchPlaceholder="Search application..."
            searchValue={applicationSearch}
            selectedValues={selectedApplications}
          />

          <FilterDropdown
            allLabel="All industries"
            isOpen={isIndustryOpen}
            label="Industry"
            noMatchLabel={`No industries match "${industrySearch}"`}
            onClear={handleIndustryClear}
            onOptionToggle={handleIndustryToggle}
            onSearchChange={setIndustrySearch}
            onToggleOpen={() =>
              setIsIndustryOpen((isOpen) => {
                if (isOpen) {
                  setIndustrySearch("");
                }
                return !isOpen;
              })
            }
            options={industryOptions}
            searchPlaceholder="Search industry..."
            searchValue={industrySearch}
            selectedValues={selectedIndustries}
          />

          <FilterDropdown
            allLabel="All brands"
            isOpen={isBrandOpen}
            label="Brand"
            noMatchLabel={`No brands match "${brandSearch}"`}
            onClear={handleBrandClear}
            onOptionToggle={handleBrandToggle}
            onSearchChange={setBrandSearch}
            onToggleOpen={() =>
              setIsBrandOpen((isOpen) => {
                if (isOpen) {
                  setBrandSearch("");
                }
                return !isOpen;
              })
            }
            options={brandOptions}
            searchPlaceholder="Search brand..."
            searchValue={brandSearch}
            selectedValues={selectedBrands}
          />

          {hasActiveFilters ? (
            <Link
              className="inline-flex h-9 items-center px-2.5 text-xs font-medium text-ink-soft transition hover:text-red"
              href="/products"
              onClick={() => setIsNavigating(true)}
            >
              Clear
            </Link>
          ) : null}

          <div className="shrink-0 border border-red bg-red px-3 py-2 text-xs font-bold text-white">
            {isLoading
              ? "Loading..."
              : `${productCount}${hasActiveFilters ? "" : `/${totalCount}`} results`}
          </div>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          {hasActiveSearch ? (
            <span>
              Showing matches for{" "}
              <span className="font-semibold text-ink">
                {appliedQuery}
              </span>
            </span>
          ) : null}
          {hasActiveBrands ? (
            <span>
              Brand: {" "}
              <span className="font-semibold text-ink">
                {selectedBrandNames.join(", ")}
              </span>
            </span>
          ) : null}
          {hasActiveIndustries ? (
            <span>
              Industry: {" "}
              <span className="font-semibold text-ink">
                {selectedIndustryNames.join(", ")}
              </span>
            </span>
          ) : null}
          {hasActiveApplications ? (
            <span>
              Application: {" "}
              <span className="font-semibold text-ink">
                {selectedApplicationNames.join(", ")}
              </span>
            </span>
          ) : null}
          <Link
            className="font-semibold text-red transition hover:text-ink"
            href="/products"
            onClick={() => setIsNavigating(true)}
          >
            Clear filters
          </Link>
        </div>
      ) : null}

      {isLoading ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-[-13px] h-1 overflow-hidden bg-red/10" aria-live="polite">
          <span className="sr-only">Loading product results</span>
          <span className="block h-full w-1/3 animate-pulse bg-red" />
        </div>
      ) : null}
    </form>
  );
}
