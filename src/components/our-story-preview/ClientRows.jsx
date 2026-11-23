"use client";

import Image from "next/image";
import { useRef } from "react";
import { passProgress, useScrollFrame } from "./motion";

/** C · three rows of client logos that slide sideways, in turn opposite ways, as the page scrolls past. */
export default function ClientRows({ logos }) {
  const ref = useRef(null);
  useScrollFrame(ref, (progress, element) => element.style.setProperty("--s", progress.toFixed(4)), passProgress);
  const size = Math.ceil(logos.length / 3);
  const rows = [0, 1, 2].map((row) => logos.slice(row * size, row * size + size));

  return (
    <div className="mt-12 grid gap-5 border-y border-line-light py-8" ref={ref}>
      {rows.map((row, index) => (
        <div
          className="flex w-max items-center gap-12 will-change-transform"
          key={index}
          style={{ transform: index % 2 ? "translateX(calc(-24% + var(--s, 0.5) * 24%))" : "translateX(calc(var(--s, 0.5) * -24%))" }}
        >
          {[...row, ...row, ...row].map((logo, logoIndex) => (
            <div className="relative h-16 w-36 shrink-0 sm:h-20 sm:w-44" key={`${logo.alt}-${logoIndex}`}>
              <Image alt={logoIndex < row.length ? logo.alt : ""} className="object-contain" fill sizes="176px" src={logo.src} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
