"use client";

import { useEffect, useState } from "react";
import RailUtilityDock from "./RailUtilityDock";
import styles from "./LeftRail.module.css";

export default function LeftRail() {
  const [mounted, setMounted] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  // RailUtilityDock reads localStorage on mount, so it must never render during
  // SSR — gate it behind a plain client-only mount check to avoid a hydration
  // mismatch.
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return undefined;
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div className={`${styles.shell} ${nearFooter ? styles.shellHidden : ""}`}>
      <div className={styles.inner}>
        <RailUtilityDock />
      </div>
    </div>
  );
}
