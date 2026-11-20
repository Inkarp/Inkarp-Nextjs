"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** True when the visitor asked for less motion. Server render assumes motion. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}

/** 0–1 progress of the page through a tall section: 0 at its top, 1 when its end reaches the bottom of the screen. */
export function sectionProgress(element) {
  const rect = element.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, -rect.top / travel));
}

/** Smoothstep easing, 0–1 in and out. */
export const ease = (t) => t * t * (3 - 2 * t);
