"use client";

import { useEffect } from "react";

const revealSelector = [
  "[data-reveal]",
  "main section",
  "main article",
  "main h1",
  "main h2",
  "main h3",
  "main p",
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
        .filter((item) => !item.closest("footer"));

      revealItems.forEach((item) => {
        if (observedItems.has(item) || item.dataset.scrollVisible === "true") {
          return;
        }

        item.dataset.scrollReveal = "true";
        observedItems.add(item);
        observer.observe(item);
      });
    };

    observeRevealItems();

    const mutationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(observeRevealItems);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
