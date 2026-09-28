// The open product page's "compare within this category" candidates, handed to
// the sitewide Compare pill. The pill lives in the layout, so it can't take them
// as props - the product page registers them here and clears them on leave.

let current = null;
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

export function getCompareSiblings() {
  return current;
}

export function getServerCompareSiblings() {
  return null;
}

export function subscribeCompareSiblings(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `{ product, category, items }` - `product` is the page's own product. */
export function setCompareSiblings(next) {
  current = next;
  notify();
}

/** Only clears the page's own entry, so a late cleanup can't wipe the next page's. */
export function clearCompareSiblings(slug) {
  if (current?.product?.slug !== slug) return;
  current = null;
  notify();
}
