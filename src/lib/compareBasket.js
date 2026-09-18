// Shortlist of products a visitor wants to compare side by side.
//
// Mirrors quoteBasket.js's snapshot-in-localStorage approach, but capped at a
// small number of items — a comparison table stops being readable well before
// a quote basket does — and the compare page fetches full product detail
// (specs, applications) via each item's apiPath rather than storing it here.

const STORAGE_KEY = "ikp_compare_basket";
const CHANGE_EVENT = "compare-basket-change";
const MAX_ITEMS = 4;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

let cache = null;
const EMPTY = Object.freeze([]);

export function itemKey(product) {
  return `${product?.principalSlug ?? ""}:${product?.slug ?? ""}`;
}

function isFresh(item) {
  if (!item?.slug) return false;
  const added = Date.parse(item.addedAt ?? "");
  if (!Number.isFinite(added)) return true;
  return Date.now() - added < MAX_AGE_MS;
}

function readStorage() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const items = parsed.filter(isFresh).slice(0, MAX_ITEMS);
    return items.length ? items : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeStorage(items) {
  cache = items.length ? items : EMPTY;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Nothing persisted, but the in-memory cache still serves this session.
  }
  try {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // Older browsers without CustomEvent simply miss the live update.
  }
}

export function getCompareBasket() {
  if (cache === null) cache = readStorage();
  return cache;
}

export function getServerCompareBasket() {
  return EMPTY;
}

export function subscribe(onChange) {
  if (typeof window === "undefined") return () => {};
  const handleLocal = () => {
    cache = readStorage();
    onChange();
  };
  const handleCrossTab = (event) => {
    if (event.key === STORAGE_KEY) handleLocal();
  };
  window.addEventListener(CHANGE_EVENT, handleLocal);
  window.addEventListener("storage", handleCrossTab);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handleLocal);
    window.removeEventListener("storage", handleCrossTab);
  };
}

export function isCompareFull() {
  return getCompareBasket().length >= MAX_ITEMS;
}

/** Returns { items, added, reason } — `added` is false when the item was already in, the
 * list is full, or `product.category` doesn't match the category already in the basket
 * (comparisons are scoped to a single category at a time). */
export function addToCompare(product) {
  const key = itemKey(product);
  const current = getCompareBasket();
  if (current.some((item) => itemKey(item) === key)) {
    return { items: current, added: false, reason: "duplicate" };
  }
  if (current.length >= MAX_ITEMS) {
    return { items: current, added: false, reason: "full" };
  }
  const existingCategory = current.find((item) => item.category)?.category;
  if (existingCategory && product.category && product.category !== existingCategory) {
    return { items: current, added: false, reason: "category" };
  }

  const item = {
    slug: product.slug,
    principalSlug: product.principalSlug ?? "",
    principalName: product.principalName ?? "",
    name: product.name,
    image: product.image ?? "",
    imageAlt: product.imageAlt ?? product.name,
    category: product.category ?? "",
    apiPath: product.apiPath ?? `/api/products/${product.principalSlug ?? ""}/${product.slug ?? ""}`,
    addedAt: new Date().toISOString(),
  };

  const next = [...current, item];
  writeStorage(next);
  return { items: next, added: true };
}

export function removeFromCompare(key) {
  const current = getCompareBasket();
  const next = current.filter((item) => itemKey(item) !== key);
  if (next.length === current.length) return current;
  writeStorage(next);
  return next;
}

export function toggleCompare(product) {
  const key = itemKey(product);
  const current = getCompareBasket();
  if (current.some((item) => itemKey(item) === key)) {
    return { items: removeFromCompare(key), added: false };
  }
  return addToCompare(product);
}

export function clearCompare() {
  writeStorage([]);
  return EMPTY;
}

export const COMPARE_LIMIT = MAX_ITEMS;
