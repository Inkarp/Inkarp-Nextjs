'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import RecTag from '@/components/home/RecTag';
import { HOW_TO_FIND_STEPS, VIEW_TABS } from './catalogCopy';
import styles from './CatalogHero.module.css';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A real count, counted up from 0 the first time it comes into view. */
export function CountUp({ value, duration = 1400 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return undefined;
    let frame = 0;
    let start = 0;
    const tick = (time) => {
      if (!start) start = time;
      const progress = Math.min(1, (time - start) / duration);
      el.textContent = String(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      el.textContent = '0';
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return <span ref={ref}>{value}</span>;
}

/** Products, brands and categories in the catalogue. */
export function HeroStats({ totals, className = '' }) {
  const items = [
    { value: totals.products, label: 'Products' },
    { value: totals.brands, label: 'Principal brands' },
    { value: totals.categories, label: 'Categories' },
  ];

  return (
    <dl className={`grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-4 ${className}`}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="sr-only">{item.label}</dt>
          <dd className="text-3xl font-semibold tabular-nums tracking-tight text-ink">
            <CountUp value={item.value} />
          </dd>
          <dd className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** By Product / By Workflow as one control: the red highlight slides to the one you point at. */
export function ViewToggle({ className = '' }) {
  return (
    <div className={`${styles.toggle} ${className}`}>
      <span aria-hidden="true" className={styles.togglePill} />
      {VIEW_TABS.map((tab) => (
        <Link
          aria-current={tab.active ? 'page' : undefined}
          className={`${styles.toggleLink} ${tab.active ? styles.toggleActive : ''}`}
          href={tab.href}
          key={tab.href}
        >
          <tab.Icon aria-hidden="true" className="h-4 w-4" />
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

/** The four ways to find an instrument, lit one after another. */
export function StepsRow({ className = '' }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % HOW_TO_FIND_STEPS.length), 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <ol className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {HOW_TO_FIND_STEPS.map((step, index) => (
        <li
          className={`relative border bg-white p-4 transition-colors duration-500 ${
            index === active ? `${styles.stepActive} border-red/40` : 'border-line-light'
          }`}
          key={step.num}
        >
          <span aria-hidden="true" className={styles.stepBar} key={index === active ? `on-${active}` : 'off'} />
          <span className={`text-lg font-semibold leading-none transition-colors duration-500 ${index === active ? 'text-red' : 'text-ink-soft/60'}`}>
            {step.num}
          </span>
          <p className="mt-2 text-sm font-semibold text-ink">{step.title}</p>
          <p className="mt-1 text-sm leading-snug text-ink-soft">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}

/** The hero heading and intro, shared by the previews, rising in line by line. */
export function HeroIntro({ centered = false }) {
  return (
    <>
      <div className={styles.rise} style={{ '--rise-delay': '0ms' }}>
        <RecTag>Scientific Instruments</RecTag>
      </div>
      <h1
        className={`${styles.rise} text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl`}
        style={{ '--rise-delay': '90ms' }}
      >
        Products and solutions for
        <em className="italic text-red"> every lab workflow.</em>
      </h1>
      <p
        className={`${styles.rise} my-5 max-w-[560px] text-base leading-relaxed text-ink-soft sm:text-lg ${centered ? 'mx-auto' : ''}`}
        style={{ '--rise-delay': '180ms' }}
      >
        Find the right instrument by product category, application, industry, or
        principal brand. Built for scientists, lab managers, and procurement teams who
        need clear choices quickly.
      </p>
    </>
  );
}
