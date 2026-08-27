// Generic GA4/GTM dataLayer event push, shared by anything that isn't the
// ecommerce funnel already covered by pushBasketEvent() in quoteBasket.js.
// Events sit inert in the dataLayer until Tag Manager loads, so tracking
// works from the day the container goes live with no code change here.

export function pushEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    // No GTM container in dev, so log here to confirm events actually fire —
    // silent in production so it never spams a real visitor's console.
    if (process.env.NODE_ENV !== "production") {
      console.log("[analytics]", name, params);
    }
  } catch {
    // Analytics must never break the UI.
  }
}
