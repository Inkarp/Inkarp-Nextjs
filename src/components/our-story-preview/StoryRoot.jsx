"use client";

import { useRef } from "react";
import { useRevealRoot } from "./motion";
import styles from "./StoryPreview.module.css";

/** Wraps a preview page so its [data-reveal] content rises in once. */
export default function StoryRoot({ children, className = "" }) {
  const ref = useRef(null);
  useRevealRoot(ref);
  return (
    <div className={`${styles.root} ${className}`} ref={ref}>
      {children}
    </div>
  );
}
