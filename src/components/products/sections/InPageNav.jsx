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
    <div className="sticky top-16 z-40 border-b border-line-light bg-parchment/95 backdrop-blur-sm">
      <div className="relative mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-0 overflow-x-auto scrollbar-none">
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors whitespace-nowrap ${
                active === id
                  ? 'border-red text-red'
                  : 'border-transparent text-black hover:text-black'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-parchment/95 to-transparent lg:hidden"
        />
      </div>
    </div>
  );
}
