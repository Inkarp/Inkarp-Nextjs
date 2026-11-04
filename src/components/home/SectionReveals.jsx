"use client";

import { useEffect } from "react";

/**
 * The homepage's "section reveals" (HomeBody motion "reveals"): nothing
 * travels; each section has its own entrance as it comes into view, all in
 * SectionReveals.module.css (on <main>, `.reveals`). The hero's plays as the
 * page opens; the other sections wait out of sight from the first paint
 * (and show by themselves after a few seconds should this never run). This
 * only marks them: <main> `data-ready` once it is watching, each section
 * `data-in` as it comes into view (at once, for any already on screen), so
 * its entrance plays. Under the opening animation (LabIntro) everything
 * waits (<main> `data-wait`) and starts when that ends. Reduced motion: the
 * stylesheet plays nothing.
 */

// React tags each DOM node it has hydrated with an internal `__reactFiber$…`
// key; marking a node it has not hydrated yet makes React report a mismatch
// (as in ScrollAnimations), so the marking waits for that.
const isHydrated = (node) => Object.keys(node).some((key) => key.startsWith("__reactFiber$"));
const RETRY_MS = 200;
const MAX_RETRIES = 50;

export default function SectionReveals() {
  useEffect(() => {
    const body = document.body;
    const main = document.querySelector("main");
    if (!main) return undefined;

    let disposed = false;
    let retries = 0;
    let timer = 0;
    let observer = null;
    let marked = [];

    // Everything waits under the opening animation; the hero's entrance
    // replays when that ends (the stylesheet restarts it as `data-wait` goes)
    // and the sections start being watched.
    const introPlaying = () => body.dataset.labIntro === "playing";
    const watchIntro = () => {
      if (introPlaying()) main.dataset.wait = "";
      else delete main.dataset.wait;
      if (!introPlaying() && !observer && !timer) setup();
    };
    const watcher = new MutationObserver(watchIntro);
    watcher.observe(body, { attributeFilter: ["data-lab-intro"], attributes: true });

    function setup() {
      timer = 0;
      if (disposed || observer) return;
      const sections = Array.from(main.querySelectorAll(":scope > section")).filter(
        (section) => section.id !== "about" && section.querySelector("[data-rec-tag]"),
      );
      if ((!isHydrated(main) || sections.some((section) => !isHydrated(section))) && retries < MAX_RETRIES) {
        retries += 1;
        timer = window.setTimeout(setup, RETRY_MS);
        return;
      }
      if (introPlaying()) {
        main.dataset.wait = "";
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.dataset.in = "";
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -15% 0px", threshold: 0 },
      );
      sections.forEach((section) => observer.observe(section));
      marked = sections;
      main.dataset.ready = "";
    }
    // Past the current paint, so hydration has a frame to settle.
    const frame = window.requestAnimationFrame(() => {
      timer = window.setTimeout(setup, 0);
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      watcher.disconnect();
      observer?.disconnect();
      delete main.dataset.ready;
      delete main.dataset.wait;
      marked.forEach((section) => {
        delete section.dataset.in;
      });
    };
  }, []);

  return null;
}
