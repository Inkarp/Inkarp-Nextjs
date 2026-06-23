'use client';
import { useEffect, useRef, useState } from 'react';

export default function InPageNav({ links = [] }) {
  const [active, setActive] = useState(links[0]?.id ?? '');
  const navRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!links.length) return null;

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-0 overflow-x-auto scrollbar-none">
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors whitespace-nowrap ${
                active === id
                  ? 'border-[#BE0010] text-[#BE0010]'
                  : 'border-transparent text-black hover:text-black dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
