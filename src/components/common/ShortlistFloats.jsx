"use client";

import CompareBasketFloat from "./CompareBasketFloat";
import QuoteBasketFloat from "./QuoteBasketFloat";

// Both widgets are self-contained (own state, own empty-basket bail-out) — this
// wrapper just gives them one shared bottom-left stack instead of two competing
// fixed-position corners, so Compare sits directly above My Quote and the gap
// between them collapses cleanly when only one has items.
export default function ShortlistFloats() {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-3" data-floating-widget>
      <CompareBasketFloat />
      <QuoteBasketFloat />
    </div>
  );
}
