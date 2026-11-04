"use client";

import { useEffect, useRef } from "react";
import styles from "./SampleLine.module.css";

/**
 * The homepage's "sample line" (HomeBody motion "line"): a red line that
 * flows down the page's left margin as it is read. It starts where Inkarp
 * does, at the 1985 badge (`data-line-origin`; on phones, where the badge
 * sits on the right, at the first section's tag instead), and runs past
 * every section's tag (RecTag, `data-rec-tag`): as the line reaches one, the
 * node there fills, a branch draws across to the tag and the tag's own
 * line lengthens. Its tip, a drop, sits a little below the middle of the
 * screen. On load the drop falls from the top of the screen onto the first
 * node (after the opening animation, LabIntro, if that is playing) and the
 * line pours down from there. Reduced motion: the line just follows the
 * scroll, with nothing falling or pulsing.
 *
 * A scroll frame reads nothing from the page: the nodes are measured up
 * front and again when the page's size changes, and a frame writes only two
 * transforms (and a node's state as the line passes it).
 */

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const easeOut = (t) => 1 - (1 - t) ** 3;
// The tip of the line sits this far down the screen.
const FOCUS = 0.6;
// The opening fall onto the first node and the pour down from it.
const FALL_MS = 700;
const POUR_MS = 900;

// How far the site's scroll reveal (ScrollAnimations) still has an element's
// section pushed down: the nodes are measured where they will come to rest.
function revealShift(node) {
  let shift = 0;
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (el.dataset.scrollReveal !== "true") continue;
    const { transform } = getComputedStyle(el);
    if (transform && transform !== "none") shift += new DOMMatrixReadOnly(transform).m42;
  }
  return shift;
}

export default function SampleLine() {
  const layerRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const headRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    const head = headRef.current;
    const drop = dropRef.current;
    if (!layer || !track || !fill || !head || !drop) return undefined;

    const body = document.body;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const introPlaying = () => body.dataset.labIntro === "playing";

    let disposed = false;
    let nodes = [];
    let lineX = 0;
    let layerTop = 0;
    let vh = window.innerHeight;
    let stale = true;
    let frame = 0;
    // Before the opening fall the line is held at the first node; during the
    // pour it runs from there to the scroll's tip.
    let phase = "waiting";
    let pourStart = 0;
    let lastHead = -1;

    function removeNode(node) {
      node.ring.remove();
      node.branch.remove();
      const dash = node.tag.firstElementChild;
      if (dash) {
        dash.style.transition = "";
        dash.style.width = "";
      }
    }

    const measure = () => {
      stale = false;
      vh = window.innerHeight;
      const box = layer.getBoundingClientRect();
      layerTop = box.top + window.scrollY;
      // Half-way across the page's left margin.
      lineX = -box.left / 2;
      const tags = Array.from(document.querySelectorAll("main section"), (section) => section.querySelector("[data-rec-tag]")).filter(
        (tag) => tag && tag.offsetWidth,
      );
      const origin = document.querySelector("main [data-line-origin]");
      const points = tags.map((tag) => {
        const rect = tag.getBoundingClientRect();
        return { tag, x: rect.left - box.left, y: rect.top + rect.height / 2 - box.top - revealShift(tag) };
      });
      // The first section starts from the badge when the badge leads the row.
      if (origin && points[0]) {
        const rect = origin.getBoundingClientRect();
        if (rect.left < points[0].tag.getBoundingClientRect().left) {
          points[0] = { tag: points[0].tag, x: rect.left - box.left, y: rect.top + rect.height / 2 - box.top - revealShift(origin) };
        }
      }
      points.sort((a, b) => a.y - b.y);

      // The same tags as before keep their nodes (and whether they were
      // reached); only where they sit is updated.
      const same = points.length === nodes.length && points.every((point, index) => point.tag === nodes[index].tag);
      if (!same) {
        nodes.forEach(removeNode);
        nodes = points.map((point, index) => {
          const ring = document.createElement("span");
          ring.className = index === points.length - 1 ? `${styles.node} ${styles.last}` : styles.node;
          const branch = document.createElement("span");
          branch.className = styles.branch;
          layer.append(branch, ring);
          return { tag: point.tag, ring, branch, reached: false };
        });
      }
      points.forEach((point, index) => {
        const node = nodes[index];
        node.y = point.y;
        node.ring.style.transform = `translate3d(${lineX}px, ${point.y}px, 0)`;
        node.branch.style.left = `${lineX}px`;
        node.branch.style.top = `${point.y}px`;
        node.branch.style.width = `${Math.max(0, point.x - lineX - 6)}px`;
      });
      if (nodes.length < 2) return;
      const top = nodes[0].y;
      const length = nodes[nodes.length - 1].y - top;
      for (const el of [track, fill]) {
        el.style.left = `${lineX}px`;
        el.style.top = `${top}px`;
        el.style.height = `${length}px`;
      }
      lastHead = -1;
    };

    // A reached node fills, its branch draws across, and the tag's own short
    // line lengthens to meet it.
    const setReached = (node, reached) => {
      if (node.reached === reached) return;
      node.reached = reached;
      node.ring.toggleAttribute("data-reached", reached);
      node.branch.toggleAttribute("data-reached", reached);
      const dash = node.tag.firstElementChild;
      if (dash) {
        dash.style.transition = "width 600ms cubic-bezier(0.2, 0.7, 0.3, 1) 200ms";
        dash.style.width = reached ? "38px" : "";
      }
    };

    const update = (now) => {
      frame = 0;
      if (stale) measure();
      if (nodes.length < 2) return;
      const top = nodes[0].y;
      const bottom = nodes[nodes.length - 1].y;
      const target = clamp(window.scrollY + vh * FOCUS - layerTop, top, bottom);

      let tip = top;
      if (phase === "pouring") {
        const k = clamp((now - pourStart) / POUR_MS, 0, 1);
        tip = top + (target - top) * easeOut(k);
        if (k < 1) request();
        else phase = "flowing";
      } else if (phase === "flowing") {
        tip = target;
      }

      if (Math.abs(tip - lastHead) > 0.1) {
        lastHead = tip;
        fill.style.transform = `scaleY(${((tip - top) / Math.max(bottom - top, 1)).toFixed(5)})`;
        head.style.transform = `translate3d(${lineX}px, ${tip.toFixed(1)}px, 0)`;
      }
      nodes.forEach((node, index) => setReached(node, phase !== "waiting" && (index === 0 || tip >= node.y - 1)));
    };

    function request() {
      if (!frame && !disposed) frame = window.requestAnimationFrame(update);
    }

    // The drop falls from the top of the screen onto the first node, then
    // the line pours down from it.
    const open = () => {
      layer.dataset.ready = "";
      if (still.matches || nodes.length < 2 || nodes[0].y + layerTop - window.scrollY > vh || nodes[0].y + layerTop < window.scrollY) {
        phase = "flowing";
        request();
        return;
      }
      const fallFrom = -(nodes[0].y + layerTop - window.scrollY) - 40;
      drop.animate(
        [
          { offset: 0, opacity: 1, transform: `translateY(${fallFrom}px) scaleY(1.3)`, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
          { offset: 0.82, opacity: 1, transform: "translateY(0) scale(1.25, 0.75)", easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
          { offset: 1, opacity: 1, transform: "none" },
        ],
        { duration: FALL_MS, fill: "backwards" },
      );
      window.setTimeout(() => {
        if (disposed) return;
        phase = "pouring";
        pourStart = performance.now();
        request();
      }, FALL_MS * 0.82);
    };

    const begin = () => {
      if (stale) measure();
      if (introPlaying()) return;
      open();
    };
    const watcher = new MutationObserver(() => {
      if (phase === "waiting" && !introPlaying()) open();
    });
    watcher.observe(body, { attributeFilter: ["data-lab-intro"], attributes: true });
    begin();

    const resized = new ResizeObserver(() => {
      measure();
      request();
    });
    resized.observe(body);
    const remeasure = () => {
      stale = true;
      request();
    };
    document.fonts?.ready.then(() => !disposed && remeasure());
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      watcher.disconnect();
      resized.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      drop.getAnimations().forEach((animation) => animation.cancel());
      nodes.forEach(removeNode);
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.layer} ref={layerRef}>
      <span className={styles.track} ref={trackRef} />
      <span className={styles.fill} ref={fillRef} />
      <span className={styles.head} ref={headRef}>
        <span className={styles.drop} ref={dropRef}>
          <svg fill="none" viewBox="0 0 16 20">
            <path d="M8 1C8 1 2 9 2 13a6 6 0 0 0 12 0C14 9 8 1 8 1Z" fill="url(#sample-line-drop)" />
            <path d="M5.2 12.6a3 3 0 0 0 1.6 3" stroke="#fff" strokeLinecap="round" strokeOpacity="0.75" strokeWidth="1.3" />
            <defs>
              <linearGradient id="sample-line-drop" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#ff4b55" />
                <stop offset="1" stopColor="#a3000d" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </span>
    </div>
  );
}
