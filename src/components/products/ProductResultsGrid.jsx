"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiCode, FiX } from "react-icons/fi";
import PrincipalLogo from "@/components/products/PrincipalLogo";
import SearchNoResultsForm from "@/components/products/SearchNoResultsForm";

const INITIAL_VISIBLE_PRODUCTS = 24;
const LOAD_MORE_COUNT = 24;
const MAX_VISIBLE_PILLS = 3;

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function getTagText(tag) {
  if (tag && typeof tag === "object") {
    return tag.title || tag.name || tag.label || tag.description || "";
  }

  return tag;
}

function formatTag(tag) {
  return String(getTagText(tag))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getIndustryPills(product) {
  const structuredTags = uniqueValues([
    ...(product.industryTags ?? []),
    ...(product.workflowTags ?? []),
    ...(product.problemSolutionTags ?? []),
  ])
    .map(formatTag)
    .filter(Boolean);

  if (structuredTags.length) {
    return structuredTags;
  }

  const industries = product.applicationsExplorer?.industries;
  if (industries?.length) {
    return industries.map((industry) => getTagText(industry)).filter(Boolean);
  }

  return (product.applications ?? []).map(formatTag).filter(Boolean);
}

function getProductHref(product) {
  return product.href || `/products/${product.slug}`;
}

function ProductCard({ product, onViewApi }) {
  const productHref = getProductHref(product);
  const pills = getIndustryPills(product);
  const visiblePills = pills.slice(0, MAX_VISIBLE_PILLS);
  const extraPillCount = pills.length - visiblePills.length;

  return (
    <article
      className="group flex min-h-full flex-col border border-line-light bg-white p-4 transition hover:border-red/50"
      key={`${product.principalSlug}-${product.slug}`}
    >
      <Link
        aria-label={`View ${product.name}`}
        className="mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden border border-line-light bg-parchment-alt"
        href={productHref}
        prefetch={false}
      >
        {product.image ? (
          <Image
            alt={product.imageAlt ?? product.name}
            className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
            height={240}
            loading="lazy"
            sizes="(min-width: 1280px) 260px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            src={product.image}
            width={320}
          />
        ) : (
          <PrincipalLogo
            className="h-10 w-32 object-center text-center text-xs font-semibold uppercase tracking-wide text-red"
            principalName={product.principalName}
            principalSlug={product.principalSlug}
          />
        )}
      </Link>

      <div className="flex items-start justify-between gap-2">
        <PrincipalLogo
          className="h-5 w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-red"
          principalName={product.principalName}
          principalSlug={product.principalSlug}
        />
        <span className="shrink-0 border border-line-light bg-parchment-alt px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
          {product.countryOfOrigin || "-"}
        </span>
      </div>

      <h2 className="mt-3 text-base font-semibold leading-snug tracking-tight text-ink">
        <Link className="transition group-hover:text-red" href={productHref} prefetch={false}>
          {product.name}
        </Link>
      </h2>

      <p className="mt-1 text-[11px] text-ink-soft">{product.industry}</p>

      {visiblePills.length ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {visiblePills.map((pill, index) => (
            <span
              className="max-w-[110px] truncate rounded-full border border-line-light bg-parchment-alt px-2 py-0.5 text-[10px] leading-4 text-ink-soft"
              key={`${product.principalSlug}-${product.slug}-pill-${index}`}
              title={pill}
            >
              {pill}
            </span>
          ))}
          {extraPillCount > 0 ? (
            <span className="rounded-full border border-line-light bg-parchment-alt px-2 py-0.5 text-[10px] leading-4 text-ink-soft">
              +{extraPillCount}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex gap-2 pt-4">
        <Link
          className="flex h-10 flex-1 items-center justify-center border border-red bg-red text-xs font-semibold text-white transition hover:bg-transparent hover:text-red"
          href={productHref}
          prefetch={false}
        >
          View Details
        </Link>
        {product.apiPath ? (
          <button
            aria-label={`View raw API data for ${product.name}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-line-light bg-white text-ink-soft transition hover:border-red hover:text-red"
            onClick={() => onViewApi(product)}
            title="View backend product data"
            type="button"
          >
            <FiCode className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </article>
  );
}

function ProductApiModal({ product, onClose }) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    let cancelled = false;

    fetch(product.apiPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setState({ status: "loaded", data: json, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ status: "error", data: null, error: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [product.apiPath]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col border border-line-light bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line-light px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">{product.name}</p>
            <p className="font-mono text-[11px] text-ink-soft">{product.apiPath}</p>
          </div>
          <button
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-line-light text-ink-soft transition hover:border-red hover:text-red"
            onClick={onClose}
            type="button"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-auto p-4">
          {state.status === "loading" ? (
            <p className="text-sm text-ink-soft">Loading product data...</p>
          ) : null}
          {state.status === "error" ? (
            <p className="text-sm text-red">Failed to load: {state.error}</p>
          ) : null}
          {state.status === "loaded" ? (
            <pre className="whitespace-pre-wrap break-words bg-parchment-alt p-3 text-[11px] leading-5 text-ink">
              {JSON.stringify(state.data, null, 2)}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ProductResultsGrid({
  products,
  emptyHref = "/products",
  emptyLinkLabel = "Clear search",
  initialVisibleCount = INITIAL_VISIBLE_PRODUCTS,
  query = "",
}) {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [apiModalProduct, setApiModalProduct] = useState(null);


  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );
  const hasMoreProducts = visibleCount < products.length;

  if (!products.length) {
    return (
      <div className="mt-4 border border-dashed border-line-light bg-white p-5 text-center sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">No products found</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Try another product, principal, country, industry, application, or tag.
        </p>
        <Link
          className="mt-4 inline-flex border border-red bg-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red"
          href={emptyHref}
        >
          {emptyLinkLabel}
        </Link>
        <SearchNoResultsForm
          className="mx-auto mt-6 max-w-3xl"
          query={query}
          source="Products page no-result search"
        />
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-soft">
        <span>
          Showing <span className="font-semibold text-ink">{visibleProducts.length}</span> of{" "}
          <span className="font-semibold text-ink">{products.length}</span> products
        </span>
        {hasMoreProducts ? (
          <span className="font-mono uppercase tracking-wide">More products load on demand</span>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={`${product.principalSlug}-${product.slug}`}
            onViewApi={setApiModalProduct}
            product={product}
          />
        ))}
      </div>

      {hasMoreProducts ? (
        <div className="mt-8 flex justify-center">
          <button
            className="border border-red bg-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red"
            onClick={() =>
              setVisibleCount((count) => Math.min(count + LOAD_MORE_COUNT, products.length))
            }
            type="button"
          >
            Load more products
          </button>
        </div>
      ) : null}

      {apiModalProduct ? (
        <ProductApiModal
          key={apiModalProduct.apiPath}
          onClose={() => setApiModalProduct(null)}
          product={apiModalProduct}
        />
      ) : null}
    </>
  );
}
