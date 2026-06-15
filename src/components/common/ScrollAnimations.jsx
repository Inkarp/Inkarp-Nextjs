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
    const revealItems = Array.from(document.querySelectorAll(revealSelector))
      .filter((item) => !item.closest("header"))
      .filter((item) => !item.closest("footer"));

    revealItems.forEach((item) => {
      item.dataset.scrollReveal = "true";
    });

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

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return null;
}
