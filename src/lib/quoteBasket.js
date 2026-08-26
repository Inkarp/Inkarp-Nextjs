// Shortlist of products a visitor wants quoted together.
//
// Buyers rarely need one instrument — an evaporator usually comes with a
// chiller and a pump. Without a basket each product means re-typing the same
// buyer details, so most people send one enquiry and drop the rest. This keeps
// the shortlist in localStorage and lets every mounted component read the same
// list through a snapshot, so the badge, the tray and each button stay in step.

const STORAGE_KEY = "ikp_quote_basket";
const CHANGE_EVENT = "quote-basket-change";
const MAX_ITEMS = 20;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

// useSyncExternalStore compares snapshots by reference, so the parsed list is
// cached and only rebuilt when something actually writes.
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
    // Private mode, blocked storage, corrupt JSON — an empty basket is fine.
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

export function getBasket() {
  if (cache === null) cache = readStorage();
  return cache;
}

export function getServerBasket() {
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

/**
 * GA4 ecommerce events, pushed whether or not a container is installed yet.
 * They sit inert in the dataLayer until Tag Manager loads, so the funnel works
 * from the day the container goes live with no code change here.
 */
export function pushBasketEvent(event, items) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ecommerce: {
        items: (Array.isArray(items) ? items : [items]).filter(Boolean).map((item, index) => ({
          item_id: item.slug,
          item_name: item.name,
          item_brand: item.principalName ?? item.principalSlug,
          index,
        })),
      },
    });
  } catch {
    // Analytics must never break the basket.
  }
}

export function addToBasket(product) {
  const key = itemKey(product);
  const current = getBasket();
  if (current.some((item) => itemKey(item) === key)) return current;

  const item = {
    slug: product.slug,
    principalSlug: product.principalSlug ?? "",
    principalName: product.principalName ?? "",
    name: product.name,
    image: product.image ?? "",
    imageAlt: product.imageAlt ?? product.name,
    countryOfOrigin: product.countryOfOrigin ?? "",
    addedAt: new Date().toISOString(),
  };

  const next = [...current, item].slice(-MAX_ITEMS);
  writeStorage(next);
  pushBasketEvent("add_to_cart", item);
  return next;
}

export function removeFromBasket(key) {
  const current = getBasket();
  const removed = current.find((item) => itemKey(item) === key);
  const next = current.filter((item) => itemKey(item) !== key);
  if (next.length === current.length) return current;
  writeStorage(next);
  if (removed) pushBasketEvent("remove_from_cart", removed);
  return next;
}

export function clearBasket() {
  const current = getBasket();
  if (current.length) pushBasketEvent("remove_from_cart", current);
  writeStorage([]);
  return EMPTY;
}

/**
 * Folds a saved list into the current one without losing either side. Used when
 * a visitor signs in on a device that already has products shortlisted.
 */
export function mergeIntoBasket(incoming) {
  const current = getBasket();
  const seen = new Set(current.map(itemKey));
  const added = (Array.isArray(incoming) ? incoming : []).filter(
    (item) => item?.slug && !seen.has(itemKey(item))
  );
  if (!added.length) return current;

  const next = [...current, ...added].slice(-MAX_ITEMS);
  writeStorage(next);
  return next;
}

export const BASKET_LIMIT = MAX_ITEMS;
