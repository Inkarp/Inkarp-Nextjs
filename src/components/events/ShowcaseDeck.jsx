"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { LuFlaskConical } from "react-icons/lu";
import styles from "./StallShowcase.module.css";

/**
 * A deck of product cards piled on top of each other: the top card in full,
 * the next few peeking out behind it at an angle. The arrow buttons (or a
 * sideways swipe on a touch screen) move through it: "next" flicks the top
 * card off to the side and sends it to the back, "previous" brings the last
 * one back to the top. `side` fans the pile away from the stall ("left"
 * mirrors it). Used by StallShowcase.
 */

// How many cards show behind the top one, and how long the flick takes.
const DEPTH = 3;
const FLICK_MS = 340;
// Each card behind the top one: its angle (the left deck mirrors these).
const TILTS = [0, 3, -2.5, 4];

// A brand logo gets more room around it; a product photo a soft shadow.
function imageClass(product) {
  if (product.logo) return "object-contain p-10";
  return "object-contain p-3 drop-shadow-[0_8px_12px_rgba(0,0,0,0.14)]";
}

function DeckCard({ product, isTop }) {
  const body = (
    <>
      <span className={styles.deckImage}>
        {product.image ? (
          <Image
            alt=""
            className={imageClass(product)}
            draggable={false}
            fill
            loading="eager"
            sizes="300px"
            src={product.image}
          />
        ) : (
          <LuFlaskConical aria-hidden="true" className="size-12 text-[#9aa3ad]" />
        )}
      </span>
      <span className={styles.deckBody}>
        {product.brand ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/75">{product.brand}</span>
        ) : null}
        <span className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug">{product.name}</span>
        {product.href ? (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
            View product
            <span className="grid size-4 place-items-center rounded-full bg-red">
              <FiArrowUpRight aria-hidden="true" className="size-3" />
            </span>
          </span>
        ) : null}
      </span>
    </>
  );

  return product.href ? (
    <Link className={styles.deckCard} draggable={false} href={product.href} tabIndex={isTop ? undefined : -1}>
      {body}
    </Link>
  ) : (
    <div className={styles.deckCard}>{body}</div>
  );
}

export default function ShowcaseDeck({ products, side = "right", label = "Products on show" }) {
  const count = products.length;
  const mirror = side === "left" ? -1 : 1;
  const [index, setIndex] = useState(0);
  // The card being flicked away (it flies out before joining the back).
  const [flicked, setFlicked] = useState(null);
  const timer = useRef(0);
  const swipe = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const go = (step) => {
    if (count < 2) return;
    if (step > 0) {
      setFlicked(index);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setFlicked(null), FLICK_MS);
    }
    setIndex((current) => (current + step + count) % count);
  };

  // A sideways swipe moves the deck; a swipe is not also a click on the card.
  const onPointerDown = (event) => {
    swipe.current = { x: event.clientX, y: event.clientY, moved: false };
  };
  const onPointerUp = (event) => {
    const start = swipe.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      start.moved = true;
      go(dx < 0 ? 1 : -1);
    }
  };
  const onClickCapture = (event) => {
    if (swipe.current?.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
    swipe.current = null;
  };

  const place = (i) => {
    if (i === flicked) {
      return { transform: `translate(${mirror * 115}%, -4%) rotate(${mirror * 16}deg)`, opacity: 0, zIndex: count + 1 };
    }
    const order = (i - index + count) % count;
    const depth = Math.min(order, DEPTH);
    return {
      transform: `translate(${mirror * depth * 10}px, ${depth * 9}px) rotate(${mirror * TILTS[depth]}deg) scale(${1 - depth * 0.04})`,
      opacity: order > DEPTH ? 0 : 1,
      zIndex: count - order,
    };
  };

  return (
    <div aria-label={label} aria-roledescription="carousel" className="mx-auto w-full max-w-[300px]" role="region">
      <div
        className={styles.deck}
        onClickCapture={onClickCapture}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {products.map((product, i) => {
          const isTop = i === index;
          return (
            <div
              aria-hidden={isTop ? undefined : "true"}
              className={styles.deckSlot}
              key={product.name}
              style={place(i)}
            >
              <DeckCard isTop={isTop} product={product} />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button aria-label="Previous product" className={styles.deckButton} onClick={() => go(-1)} type="button">
          <FiArrowLeft aria-hidden="true" className="size-4" />
        </button>
        <p aria-live="polite" className="min-w-[64px] text-center font-mono text-xs tabular-nums text-[#001e36]/60">
          <span className="sr-only">{products[index]?.name}, </span>
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
        <button aria-label="Next product" className={styles.deckButton} onClick={() => go(1)} type="button">
          <FiArrowRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
