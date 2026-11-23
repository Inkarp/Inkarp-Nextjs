"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaLinkedin } from "react-icons/fa";
import { useScrollFrame } from "./motion";
import styles from "./StoryPreview.module.css";

/**
 * B · one leader's words, pinned while they are read: every word starts pale
 * and turns to ink as the page scrolls, and the name arrives at the end. The
 * portrait is the leader's side of the wide photo. With reduced motion the
 * quote is simply shown.
 */
export default function LitQuote({ person, flip = false }) {
  const ref = useRef(null);
  const reduced = useScrollFrame(ref, (progress, element) => element.style.setProperty("--p", progress.toFixed(4)));
  const words = person.quote.split(" ");
  const position = person.side === "left" ? "object-left" : "object-right";

  return (
    <section className={reduced ? "" : "h-[210vh] lg:h-[240vh]"} ref={ref}>
      <div className={`${reduced ? "py-16" : "sticky top-0 h-screen"} flex items-center`}>
        <div className={`mx-auto grid w-full max-w-[1180px] items-center gap-8 px-4 sm:px-6 lg:gap-16 lg:px-8 ${flip ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:[&>*:first-child]:order-2" : "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"}`}>
          <div className="relative hidden aspect-square overflow-hidden bg-parchment-alt lg:block">
            <Image alt={`${person.author}, ${person.role}`} className={`object-cover ${position}`} fill sizes="460px" src={person.image} />
            <span aria-hidden="true" className={`${styles.litBar} absolute inset-x-0 bottom-0 h-1.5 bg-red`} />
          </div>

          <figure>
            <div className="mb-6 flex items-center gap-4 lg:hidden">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-parchment-alt">
                <Image alt="" className={`object-cover ${position}`} fill sizes="64px" src={person.image} />
              </span>
              <span>
                <span className="block text-lg font-semibold text-ink">{person.author}</span>
                <span className="block text-sm text-ink-soft">{person.role}</span>
              </span>
              <a
                aria-label={`${person.author} on LinkedIn`}
                className="ml-auto inline-flex size-10 items-center justify-center border border-line-light text-red"
                href={person.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaLinkedin aria-hidden="true" className="size-5" />
              </a>
            </div>
            <span aria-hidden="true" className="block font-display text-[72px] leading-[0.55] text-red sm:text-[96px]">&ldquo;</span>
            <blockquote className="mt-4 text-[19px] font-medium leading-[1.42] text-ink sm:text-[26px] lg:text-[29px]">
              {words.map((word, index) => (
                <span className={styles.litWord} key={`${word}-${index}`} style={{ "--w": (index / words.length).toFixed(4) }}>
                  {word}{" "}
                </span>
              ))}
            </blockquote>
            <figcaption className={`${styles.litFoot} mt-8 hidden items-center gap-5 border-t border-line-light pt-5 lg:flex`}>
              <span>
                <span className="block text-2xl font-semibold text-red">{person.author}</span>
                <span className="block text-sm text-ink-soft">{person.role}</span>
              </span>
              <a
                aria-label={`${person.author} on LinkedIn`}
                className="ml-auto inline-flex size-11 items-center justify-center border border-line-light text-red transition hover:border-red"
                href={person.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaLinkedin aria-hidden="true" className="size-5" />
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
