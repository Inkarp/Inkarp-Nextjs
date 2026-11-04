"use client";

import { useEffect, useRef } from "react";
import diagramStyles from "@/components/products/sections/WorkflowDiagram.module.css";
import styles from "./FooterLabBench.module.css";

/**
 * The footer bench's moving light (FooterLabBench): every few seconds the
 * next instrument on screen lights its working part red (the drawings' own
 * "on" class; `data-bench-item` names the part) and its name. Only while the
 * bench is in view, and not with reduced motion; out of view, the drawings'
 * own animations pause too (`data-away`).
 */

const STEP_MS = 2600;

export default function BenchCycle({ children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let index = -1;
    let lit = null;

    const light = (item) => {
      if (lit) {
        lit.removeAttribute("data-active");
        lit.querySelectorAll(`.${diagramStyles.on}`).forEach((el) => el.classList.remove(diagramStyles.on));
      }
      lit = item;
      if (!item) return;
      item.setAttribute("data-active", "");
      item.querySelectorAll(`[data-part="${item.dataset.benchItem}"]`).forEach((el) => el.classList.add(diagramStyles.on));
    };

    const next = () => {
      const items = Array.from(root.querySelectorAll("[data-bench-item]")).filter((item) => item.offsetWidth);
      if (!items.length) return;
      index = (index + 1) % items.length;
      light(items[index]);
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const seen = new IntersectionObserver(([entry]) => {
      root.toggleAttribute("data-away", !entry.isIntersecting);
      if (entry.isIntersecting && !still.matches && !timer) {
        next();
        timer = window.setInterval(next, STEP_MS);
      } else if (!entry.isIntersecting) {
        stop();
      }
    });
    seen.observe(root);

    return () => {
      stop();
      seen.disconnect();
      light(null);
    };
  }, []);

  return (
    <div className={styles.bench} ref={rootRef}>
      {children}
    </div>
  );
}
