"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiArrowRight, FiBarChart2, FiPlus, FiX } from "react-icons/fi";
import RecTag from "@/components/home/RecTag";
import RequestQuoteButton from "./RequestQuoteButton";
import AddToQuoteButton from "./AddToQuoteButton";
import useCompareBasket from "./useCompareBasket";
import { clearCompare, COMPARE_LIMIT, itemKey, removeFromCompare } from "@/lib/compareBasket";

const HEADER_REQUEST_QUOTE_CLASS =
  "inline-flex h-9 flex-1 items-center justify-center gap-1 border border-rose-200 bg-rose-50 px-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100";

const OVERVIEW_FIELDS = [
  { key: "category", label: "Category" },
  { key: "countryOfOrigin", label: "Country of origin" },
  { key: "authorizedRegion", label: "Authorized region" },
  { key: "applications", label: "Applications" },
];

function toText(value) {
  if (value && typeof value === "object") {
    return value.title || value.name || value.label || value.description || "";
  }
  return value;
}

function isEmptyValue(value) {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function valuesEqual(values) {
  const defined = values.filter((value) => !isEmptyValue(value));
  if (defined.length < 2) return true;
  const serialized = defined.map((value) =>
    Array.isArray(value) ? value.slice().sort().join("|") : String(value)
  );
  return serialized.every((value) => value === serialized[0]);
}

/** Fetches full product detail (specs, applications) for each basket item via its apiPath, keyed by itemKey. */
function useProductDetails(basket) {
  const [entries, setEntries] = useState({});
  const fetchedKeys = useRef(new Set());

  useEffect(() => {
    let cancelled = false;
    const currentKeys = new Set(basket.map(itemKey));

    basket.forEach((item) => {
      const key = itemKey(item);
      if (fetchedKeys.current.has(key)) return;
      fetchedKeys.current.add(key);

      setEntries((current) => ({ ...current, [key]: { status: "loading" } }));

      fetch(item.apiPath)
        .then((res) => res.json())
        .then((json) => {
          if (cancelled) return;
          if (!json?.success || !json?.data) throw new Error("Product not found");
          setEntries((current) => ({ ...current, [key]: { status: "ready", product: json.data } }));
        })
        .catch(() => {
          if (cancelled) return;
          setEntries((current) => ({ ...current, [key]: { status: "error" } }));
        });
    });

    // Forget removed items so a later re-add fetches fresh instead of reusing a stale entry.
    // The stale entry itself is left in `entries` — harmless, since columns only ever read
    // keys still present in the basket — rather than pruned here with another setState call.
    [...fetchedKeys.current].forEach((key) => {
      if (!currentKeys.has(key)) fetchedKeys.current.delete(key);
    });

    return () => {
      cancelled = true;
    };
  }, [basket]);

  return entries;
}

function buildOverviewRows(columns) {
  return OVERVIEW_FIELDS.map((field) => {
    const values = {};
    columns.forEach((col) => {
      if (col.status !== "ready" || !col.product) return;
      const raw = col.product[field.key];
      values[col.key] = field.key === "applications" && Array.isArray(raw)
        ? raw.map(toText).filter(Boolean)
        : raw;
    });
    return { label: field.label, values };
  }).filter((row) => Object.values(row.values).some((value) => !isEmptyValue(value)));
}

function buildSpecRows(columns) {
  const order = [];
  const seen = new Set();
  columns.forEach((col) => {
    if (col.status !== "ready") return;
    (col.product?.technicalSpecs ?? []).forEach((spec) => {
      if (!seen.has(spec.label)) {
        seen.add(spec.label);
        order.push(spec.label);
      }
    });
  });

  return order.map((label) => {
    const values = {};
    columns.forEach((col) => {
      if (col.status !== "ready") return;
      const spec = (col.product?.technicalSpecs ?? []).find((item) => item.label === label);
      if (spec) values[col.key] = spec.value;
    });
    return { label, values };
  });
}

function renderValue(value) {
  if (isEmptyValue(value)) {
    return <span className="text-ink-soft/40">—</span>;
  }
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-1">
        {value.map((entry) => (
          <li className="flex items-start gap-1.5" key={entry}>
            <span className="mt-1.5 size-1 shrink-0 bg-red" />
            <span>{entry}</span>
          </li>
        ))}
      </ul>
    );
  }
  return value;
}

function ProductColumnHeader({ col }) {
  const remove = () => removeFromCompare(col.key);

  if (col.status === "loading") {
    return (
      <div className="animate-pulse space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-16 w-16 bg-white/10" />
          <div className="size-7 bg-white/10" />
        </div>
        <div className="h-3 w-2/3 bg-white/10" />
        <div className="h-4 w-full bg-white/10" />
        <div className="h-9 w-full bg-white/10" />
      </div>
    );
  }

  if (col.status === "error" || !col.product) {
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-16 items-center justify-center border border-white/15 text-white/40">
            <FiAlertTriangle />
          </span>
          <button
            aria-label="Remove from comparison"
            className="flex size-7 shrink-0 items-center justify-center border border-white/20 text-white/70 transition hover:border-white hover:text-white"
            onClick={remove}
            type="button"
          >
            <FiX className="text-sm" />
          </button>
        </div>
        <p className="text-xs font-semibold leading-5 text-white/70">
          Couldn&apos;t load {col.item.name}
        </p>
      </div>
    );
  }

  const { product } = col;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/15 bg-white">
          {product.image ? (
            <Image
              alt={product.imageAlt ?? product.name}
              className="h-full w-full object-contain p-1.5"
              height={64}
              src={product.image}
              width={64}
            />
          ) : null}
        </div>
        <button
          aria-label={`Remove ${product.name} from comparison`}
          className="flex size-7 shrink-0 items-center justify-center border border-white/20 text-white/70 transition hover:border-white hover:text-white"
          onClick={remove}
          type="button"
        >
          <FiX className="text-sm" />
        </button>
      </div>

      <div>
        {product.principalName ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
            {product.principalName}
          </p>
        ) : null}
        <Link
          className="mt-1 block text-sm font-semibold leading-5 text-white transition hover:text-white/80"
          href={`/products/${product.slug}`}
        >
          {product.name}
        </Link>
      </div>

      <div className="flex gap-1.5">
        <RequestQuoteButton className={HEADER_REQUEST_QUOTE_CLASS} href="/contact" product={product} />
        <AddToQuoteButton product={product} variant="card" />
      </div>

      <Link
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/60 transition hover:text-white"
        href={`/products/${product.slug}`}
      >
        View full details <FiArrowRight className="text-xs" />
      </Link>
    </div>
  );
}

function SectionRow({ label, span }) {
  return (
    <tr>
      <td className="bg-parchment-alt px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft" colSpan={span}>
        {label}
      </td>
    </tr>
  );
}

function SpecRow({ row, columns, highlightDiffs, canAddMore }) {
  const values = columns.map((col) => row.values[col.key]);
  const anyLoading = columns.some((col) => col.status === "loading");
  const differs = highlightDiffs && !anyLoading && !valuesEqual(values);

  return (
    <tr className={`group transition ${differs ? "bg-red/[0.025]" : "bg-white hover:bg-parchment-alt/60"}`}>
      <th
        className={`sticky left-0 z-10 px-5 py-3.5 text-left align-top text-xs font-semibold leading-5 text-ink ${
          differs ? "bg-[#fdf4f4]" : "bg-white group-hover:bg-parchment-alt/60"
        }`}
        scope="row"
      >
        <span className="flex items-center gap-2">
          {row.label}
          {differs ? (
            <span aria-hidden="true" className="inline-flex size-1.5 shrink-0 rounded-full bg-red" title="Values differ" />
          ) : null}
        </span>
      </th>
      {columns.map((col) => (
        <td className="border-l border-line-light px-5 py-3.5 align-top text-xs leading-5 text-ink-soft" key={col.key}>
          {col.status === "loading" ? (
            <span className="inline-block h-3 w-16 animate-pulse bg-line-light/60" />
          ) : col.status === "error" ? (
            <span className="text-ink-soft/40">—</span>
          ) : (
            renderValue(row.values[col.key])
          )}
        </td>
      ))}
      {canAddMore ? <td className="border-l border-dashed border-line-light" /> : null}
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl border border-dashed border-line-light bg-parchment p-10 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center bg-ink/5 text-ink">
        <FiBarChart2 className="text-2xl" />
      </div>
      <h1 className="text-lg font-semibold tracking-tight text-ink">Nothing to compare yet</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
        Add two or more products to your comparison from the &quot;Compare&quot; button on any product page, then come back here to see them side by side.
      </p>
      <Link
        className="mt-6 inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
        href="/products"
      >
        Browse products
      </Link>
    </div>
  );
}

export default function CompareView() {
  const basket = useCompareBasket();
  const entries = useProductDetails(basket);
  const [highlightDiffs, setHighlightDiffs] = useState(true);

  if (!basket.length) {
    return <EmptyState />;
  }

  const columns = basket.map((item) => {
    const key = itemKey(item);
    const entry = entries[key];
    return {
      key,
      item,
      status: entry?.status ?? "loading",
      product: entry?.product,
    };
  });

  const canAddMore = basket.length < COMPARE_LIMIT;
  const overviewRows = buildOverviewRows(columns);
  const specRows = buildSpecRows(columns);
  const span = columns.length + 1 + (canAddMore ? 1 : 0);
  const label = basket.length === 1 ? "1 product" : `${basket.length} products`;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <RecTag>Compare</RecTag>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Compare products side by side
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
            Specifications, applications and coverage for everything on your shortlist, lined up so you
            can see the differences at a glance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink-soft">
            <input
              checked={highlightDiffs}
              className="size-4 accent-red"
              onChange={(event) => setHighlightDiffs(event.target.checked)}
              type="checkbox"
            />
            Highlight differences
          </label>
          <button
            className="text-xs font-semibold text-ink-soft transition hover:text-red"
            onClick={clearCompare}
            type="button"
          >
            Clear all
          </button>
        </div>
      </div>

      {basket.length === 1 ? (
        <p className="mb-6 border border-dashed border-line-light bg-parchment-alt px-4 py-3 text-sm text-ink-soft">
          Add at least one more product to see a full comparison.{" "}
          <Link className="font-semibold text-red hover:underline" href="/products">
            Browse products
          </Link>
          .
        </p>
      ) : null}

      <div className="overflow-x-auto border border-line-light bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="sr-only">Product comparison table</caption>
          <thead>
            <tr className="bg-[linear-gradient(135deg,#161616_0%,#242424_62%,#be0010_100%)]">
              <th
                className="sticky left-0 z-10 w-[180px] min-w-[180px] bg-[#161616] px-5 py-5 align-bottom text-xs font-bold uppercase tracking-[0.18em] text-white/70"
                scope="col"
              >
                <span className="inline-flex items-center gap-2 text-white">
                  <FiBarChart2 aria-hidden="true" /> Comparing {label}
                </span>
              </th>
              {columns.map((col) => (
                <th className="min-w-[240px] border-l border-white/10 px-5 py-5 align-top" key={col.key} scope="col">
                  <ProductColumnHeader col={col} />
                </th>
              ))}
              {canAddMore ? (
                <th className="min-w-[200px] border-l border-dashed border-white/20 px-5 py-5 align-middle" scope="col">
                  <Link
                    className="flex h-full flex-col items-center justify-center gap-2 text-center text-xs font-semibold text-white/70 transition hover:text-white"
                    href="/products"
                  >
                    <span className="inline-flex size-9 items-center justify-center rounded-full border border-white/30">
                      <FiPlus />
                    </span>
                    Add another product
                  </Link>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {overviewRows.length > 0 ? <SectionRow label="Overview" span={span} /> : null}
            {overviewRows.map((row) => (
              <SpecRow canAddMore={canAddMore} columns={columns} highlightDiffs={highlightDiffs} key={row.label} row={row} />
            ))}
            {specRows.length > 0 ? (
              <>
                <SectionRow label="Technical specifications" span={span} />
                {specRows.map((row) => (
                  <SpecRow canAddMore={canAddMore} columns={columns} highlightDiffs={highlightDiffs} key={row.label} row={row} />
                ))}
              </>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
