"use client";

import { useEffect, useRef } from "react";
import useQuoteBasket from "@/components/products/useQuoteBasket";
import { getBasket, mergeIntoBasket } from "@/lib/quoteBasket";

/**
 * Keeps a signed-in visitor's saved list in step with their account, so a basket
 * built on a phone is there on the office desktop. Mounted once in the layout;
 * renders nothing and does nothing at all for signed-out visitors.
 */
export default function BasketSync() {
  const basket = useQuoteBasket();
  const signedIn = useRef(false);
  const loaded = useRef(false);
  const saveTimer = useRef(null);

  // Pull the saved list once, and fold it into whatever is in this browser.
  useEffect(() => {
    let cancelled = false;

    fetch("/api/account/basket")
      .then((response) => (response.ok ? response.json() : Promise.reject(response)))
      .then((data) => {
        if (cancelled || !data?.signedIn) return;
        signedIn.current = true;
        if (Array.isArray(data.items) && data.items.length) mergeIntoBasket(data.items);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) loaded.current = true;
      });

    return () => {
      cancelled = true;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  // Push changes back, debounced so a burst of adds is one request.
  useEffect(() => {
    if (!loaded.current || !signedIn.current) return undefined;

    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      fetch("/api/account/basket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: getBasket() }),
      }).catch(() => {});
    }, 1200);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [basket]);

  return null;
}
