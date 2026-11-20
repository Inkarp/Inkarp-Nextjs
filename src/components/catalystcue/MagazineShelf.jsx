"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useReducedMotion } from "./magazineMotion";
import styles from "./MagazineShelf.module.css";

// A volume runs to six issues (Volumes 1 and 2 did), so a shelf has six places.
const SLOTS_PER_SHELF = 6;
const pad = (value) => String(value).padStart(2, "0");

/**
 * The CATALYSTCue archive as a library shelf, full width: one shelf per volume,
 * newest volume on top, each with a large spine label. Covers stand on the
 * shelf in issue order with a tag hanging below; hovering pulls a cover off the
 * shelf and clicking opens the issue. When a shelf scrolls into view its rail
 * draws in and the covers drop onto it one by one. Search plus volume and year
 * chips narrow the shelves. `onRequestCopy` opens the physical-copy form.
 */
export default function MagazineShelf({ issues, onRequestCopy }) {
  const [query, setQuery] = useState("");
  const [volume, setVolume] = useState(0);
  const [year, setYear] = useState(0);
  const reduced = useReducedMotion();
  const listRef = useRef(null);

  const volumes = useMemo(() => [...new Set(issues.map((issue) => issue.volume))].sort((a, b) => b - a), [issues]);
  const years = useMemo(() => [...new Set(issues.map((issue) => issue.year))].sort((a, b) => b - a), [issues]);

  const filtering = Boolean(query.trim() || volume || year);
  const matches = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return issues.filter((issue) => {
      if (volume && issue.volume !== volume) return false;
      if (year && issue.year !== year) return false;
      const hay = `${issue.theme} ${issue.label} ${issue.date} volume ${issue.volume} issue ${issue.issue}`.toLowerCase();
      return words.every((word) => hay.includes(word));
    });
  }, [issues, query, volume, year]);

  const shelves = useMemo(
    () =>
      volumes
        .map((number) => {
          const onShelf = matches.filter((issue) => issue.volume === number).sort((a, b) => a.issue - b.issue);
          const all = issues.filter((issue) => issue.volume === number).sort((a, b) => a.issue - b.issue);
          return { number, onShelf, first: all[0], last: all[all.length - 1] };
        })
        .filter((shelf) => shelf.onShelf.length),
    [issues, matches, volumes]
  );

  // Each shelf fills once, the first time it comes into view.
  useEffect(() => {
    const list = listRef.current;
    if (!list || reduced || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.in = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    list.querySelectorAll("[data-shelf]:not([data-in])").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [reduced, shelves]);

  function clear() {
    setQuery("");
    setVolume(0);
    setYear(0);
  }

  return (
    <section aria-labelledby="archive-title" className={styles.section} data-scroll-skip id="catalyst-archive">
      <div className={styles.wrap}>
        <header className={styles.head}>
          <div>
            <p className={styles.kicker}>CATALYSTCue archive</p>
            <h2 className={styles.title} id="archive-title">
              Browse all issues
            </h2>
            <p className={styles.sub}>
              {issues.length} issues in {volumes.length} volumes, {issues[issues.length - 1].date} to {issues[0].date}.
            </p>
          </div>
          <button className={styles.copy} onClick={onRequestCopy} type="button">
            Request a physical copy
          </button>
        </header>

        <div className={styles.tools}>
          <label className={styles.search}>
            <FiSearch aria-hidden="true" />
            <span className="sr-only">Search issues</span>
            <input onChange={(event) => setQuery(event.target.value)} placeholder="Search by theme, month or year" type="search" value={query} />
          </label>
          <div aria-label="Volume" className={styles.chips} role="group">
            <button aria-pressed={volume === 0} className={styles.chip} onClick={() => setVolume(0)} type="button">
              All volumes
            </button>
            {volumes.map((number) => (
              <button aria-pressed={volume === number} className={styles.chip} key={number} onClick={() => setVolume(number)} type="button">
                Volume {pad(number)}
              </button>
            ))}
          </div>
          <div aria-label="Year" className={styles.chips} role="group">
            <button aria-pressed={year === 0} className={styles.chip} onClick={() => setYear(0)} type="button">
              All years
            </button>
            {years.map((value) => (
              <button aria-pressed={year === value} className={styles.chip} key={value} onClick={() => setYear(value)} type="button">
                {value}
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className={styles.count}>
          {filtering ? `${matches.length} of ${issues.length} issues` : `${issues.length} issues`}
          {filtering ? (
            <button className={styles.clear} onClick={clear} type="button">
              <FiX aria-hidden="true" /> Clear
            </button>
          ) : null}
        </p>

        <div className={styles.shelves} ref={listRef}>
          {shelves.length ? (
            shelves.map((shelf) => (
              <div className={styles.shelf} data-shelf key={shelf.number}>
                <div className={styles.spine}>
                  <span className={styles.spineWord}>Volume</span>
                  <span aria-hidden="true" className={styles.spineNumber}>{pad(shelf.number)}</span>
                  <span className="sr-only">Volume {pad(shelf.number)}</span>
                  <span className={styles.spineDates}>
                    {shelf.first.monthShort} {shelf.first.year}
                    {shelf.last.id !== shelf.first.id ? ` – ${shelf.last.monthShort} ${shelf.last.year}` : ""}
                  </span>
                </div>

                <div className={styles.rack}>
                  <ul className={styles.row}>
                    {shelf.onShelf.map((issue, index) => (
                      <li className={styles.slot} key={issue.id} style={{ "--i": index }}>
                        <Link aria-label={`Read ${issue.label}, ${issue.date}: ${issue.theme}`} className={styles.book} href={issue.href}>
                          <span className={styles.cover}>
                            <Image alt="" className="object-cover" fill sizes="(min-width: 1024px) 180px, (min-width: 640px) 22vw, 40vw" src={issue.cover} />
                          </span>
                          <span aria-hidden="true" className={styles.ledge} />
                          <span aria-hidden="true" className={styles.tag}>
                            <span className={styles.tagLine}>Issue {pad(issue.issue)} · {issue.monthShort} {issue.year}</span>
                            <span className={styles.tagTheme}>{issue.theme}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                    {!filtering
                      ? Array.from({ length: Math.max(0, SLOTS_PER_SHELF - shelf.onShelf.length) }, (_, index) => (
                          <li aria-hidden="true" className={`${styles.slot} ${styles.empty}`} key={`empty-${index}`} style={{ "--i": shelf.onShelf.length + index }}>
                            <span className={styles.ghost} />
                            <span className={styles.ledge} />
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.none}>
              <p>No issue matches {query.trim() ? `“${query.trim()}”` : "these filters"}.</p>
              <button className={styles.clear} onClick={clear} type="button">
                <FiX aria-hidden="true" /> Clear the search and filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
