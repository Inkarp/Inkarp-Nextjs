"use client";

import { useEffect } from "react";

const revealSelector = [
  "[data-reveal]",
  "main section",
  'main article[data-scroll-reveal="true"]',
].join(",");

// React tags each DOM node it has hydrated with an internal `__reactFiber$…`
// key. Hydration is time-sliced on heavy pages, so a section can still be raw
// server HTML when a sweep runs; adding attributes to it then makes React
// report a hydration mismatch. Such nodes are left for a later sweep.
const isHydrated = (node) => Object.keys(node).some((key) => key.startsWith("__reactFiber$"));
const RETRY_MS = 200;
const MAX_RETRIES = 50;

export default function ScrollAnimations() {
  useEffect(() => {
    const observedItems = new WeakSet();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.scrollVisible = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      }
    );

    let retryTimer = null;
    let retries = 0;

    const observeRevealItems = () => {
      const revealItems = Array.from(document.querySelectorAll(revealSelector))
        .filter((item) => !item.closest("header"))
        .filter((item) => !item.closest("footer"))
        .filter((item) => !item.closest("[data-scroll-skip]"));

      let waitingForHydration = false;
      revealItems.forEach((item) => {
        if (observedItems.has(item) || item.dataset.scrollVisible === "true") {
          return;
        }
        if (!isHydrated(item)) {
          waitingForHydration = true;
          return;
        }

        item.dataset.scrollReveal = "true";
        observedItems.add(item);
        observer.observe(item);
      });

      // Hydrating a node doesn't mutate the DOM, so the MutationObserver
      // below won't wake us for it - poll until every section is claimed.
      if (waitingForHydration && retryTimer === null && retries < MAX_RETRIES) {
        retries += 1;
        retryTimer = window.setTimeout(() => {
          retryTimer = null;
          observeRevealItems();
        }, RETRY_MS);
      }
    };

    // Defer the initial sweep past the current paint. Running this
    // synchronously in the effect can fire before React finishes hydrating
    // later sections of a heavy page (this component queries the whole
    // document, not just its own subtree), so the DOM it mutates can belong
    // to nodes React hasn't hydrated yet - producing a hydration mismatch
    // warning for attributes React never rendered itself. Two rAFs give
    // hydration a full frame to settle before we touch anything.
    let innerFrame = null;
    const outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(observeRevealItems);
    });

    const mutationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(observeRevealItems);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(outerFrame);
      if (innerFrame !== null) window.cancelAnimationFrame(innerFrame);
      if (retryTimer !== null) window.clearTimeout(retryTimer);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
