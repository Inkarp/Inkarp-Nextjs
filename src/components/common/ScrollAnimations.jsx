"use client";

import { useEffect } from "react";

const revealSelector = [
  "[data-reveal]",
  "main section",
  'main article[data-scroll-reveal="true"]',
].join(",");

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

    const observeRevealItems = () => {
      const revealItems = Array.from(document.querySelectorAll(revealSelector))
        .filter((item) => !item.closest("header"))
        .filter((item) => !item.closest("footer"))
        .filter((item) => !item.closest("[data-scroll-skip]"));

      revealItems.forEach((item) => {
        if (observedItems.has(item) || item.dataset.scrollVisible === "true") {
          return;
        }

        item.dataset.scrollReveal = "true";
        observedItems.add(item);
        observer.observe(item);
      });
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
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
