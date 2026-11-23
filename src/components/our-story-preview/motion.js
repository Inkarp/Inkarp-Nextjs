"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { sectionProgress, useReducedMotion } from "@/components/catalystcue/magazineMotion";

export { ease, sectionProgress, useReducedMotion } from "@/components/catalystcue/magazineMotion";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Reveal once: every [data-reveal] inside the root rises in the first time it
 * comes on screen. The server HTML shows everything. On mount, what is already
 * on screen is marked shown (data-in); only what is below is hidden, by
 * marking it data-wait, and each is shown as it arrives. Content that appears
 * later (a section remounted by a hot reload or re-render) is never marked, so
 * it can never be left hidden. The observer's top margin reaches far above the
 * screen, so content jumped past is still shown.
 */
export function useRevealRoot(rootRef) {
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          delete entry.target.dataset.wait;
          entry.target.dataset.in = "";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "100000px 0px -8% 0px" }
    );
    const line = window.innerHeight * 0.92;
    root.querySelectorAll("[data-reveal]").forEach((item) => {
      if (item.getBoundingClientRect().top < line) {
        item.dataset.in = "";
        return;
      }
      item.dataset.wait = "";
      observer.observe(item);
    });
    return () => {
      observer.disconnect();
      // Never leave anything hidden once nothing is watching it.
      root.querySelectorAll("[data-wait]").forEach((item) => delete item.dataset.wait);
    };
  }, [rootRef]);
}

/**
 * Calls onFrame(progress, element) once per animation frame while the page
 * scrolls, with progress 0–1 through a tall section (see sectionProgress).
 * Pass measure to use another progress function. Nothing runs with reduced
 * motion.
 */
export function useScrollFrame(ref, onFrame, measure = sectionProgress) {
  const reduced = useReducedMotion();
  const frameRef = useRef(onFrame);
  const measureRef = useRef(measure);
  useEffect(() => {
    frameRef.current = onFrame;
    measureRef.current = measure;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      frameRef.current(measureRef.current(element), element);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [ref, reduced]);

  return reduced;
}

/** 0 when the element's top reaches the bottom of the screen, 1 when its bottom leaves the top. */
export function passProgress(element) {
  const rect = element.getBoundingClientRect();
  const total = rect.height + window.innerHeight;
  return Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
}

/** Clamp to 0–1. */
export const clamp01 = (value) => Math.min(1, Math.max(0, value));
