// Ring buffer of products a visitor has opened, most-recent first.
//
// The catalog spans hundreds of products across many principals, and a buyer
// researching a lab setup rarely finishes comparing in one sitting. This
// mirrors quoteBasket.js's localStorage + broadcast pattern so every mounted
// component reads the same list and stays in step across tabs.

const STORAGE_KEY = "ikp_recently_viewed";
const CHANGE_EVENT = "recently-viewed-change";
const MAX_ITEMS = 8;

let cache = null;
const EMPTY = Object.freeze([]);

function itemKey(item) {
  return `${item?.principalSlug ?? ""}:${item?.slug ?? ""}`;
}

function readStorage() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const items = parsed.filter((item) => item?.slug).slice(0, MAX_ITEMS);
    return items.length ? items : EMPTY;
  } catch {
    // Private mode, blocked storage, corrupt JSON — an empty list is fine.
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

export function getRecentlyViewed() {
  if (cache === null) cache = readStorage();
  return cache;
}

export function getServerRecentlyViewed() {
  return EMPTY;
}

export function subscribe(onChange) {
  if (typeof window === "undefined") return () => {};
  const handleLocal = () => {
    cache = readStorage();
    onChange();
  };
  // `storage` fires in the *other* tabs, keeping a second window in sync.
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

export function recordView(product) {
  if (!product?.slug) return;
  const key = itemKey(product);
  const current = getRecentlyViewed();
  const item = {
    slug: product.slug,
    principalSlug: product.principalSlug ?? "",
    principalName: product.principalName ?? "",
    name: product.name,
    image: product.image ?? "",
  };

  const next = [item, ...current.filter((existing) => itemKey(existing) !== key)].slice(0, MAX_ITEMS);
  writeStorage(next);
}
