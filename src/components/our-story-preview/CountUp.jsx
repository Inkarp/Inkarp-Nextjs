"use client";

import { useEffect, useRef } from "react";

/**
 * A figure that counts to its value the first time it comes on screen. The
 * server HTML holds the real value; it only counts when it starts off screen.
 */
export default function CountUp({ value, from = 0, duration = 1500, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (node.getBoundingClientRect().top < window.innerHeight) return undefined;

    let frame = 0;
    node.textContent = String(from);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          node.textContent = String(Math.round(from + (value - from) * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = String(value);
    };
  }, [value, from, duration]);

  return (
    <span className={`tabular-nums ${className}`} ref={ref}>
      {value}
    </span>
  );
}
