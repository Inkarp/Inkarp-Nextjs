"use client";

import Image from "next/image";
import AddToQuoteButton from "./AddToQuoteButton";
import Link from "next/link";
import { useMemo, useState } from "react";
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

function ProductCard({ product }) {
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
          className="flex h-10 flex-1 items-center justify-center border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          href={productHref}
          prefetch={false}
        >
          View Details
        </Link>
        <AddToQuoteButton product={product} />
      </div>
    </article>
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
          className="mt-4 inline-flex border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
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
          <ProductCard key={`${product.principalSlug}-${product.slug}`} product={product} />
        ))}
      </div>

      {hasMoreProducts ? (
        <div className="mt-8 flex justify-center">
          <button
            className="border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            onClick={() =>
              setVisibleCount((count) => Math.min(count + LOAD_MORE_COUNT, products.length))
            }
            type="button"
          >
            Load more products
          </button>
        </div>
      ) : null}
    </>
  );
}
