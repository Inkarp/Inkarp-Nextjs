'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { MdEmail, MdLocalPhone, MdLocationPin } from 'react-icons/md';
import { FiChevronDown } from 'react-icons/fi';
import { branches, getScreenSize, phoneHref } from '@/data/branches';
import RecTag from '@/components/home/RecTag';

const REGION_BY_CITY = {
  Delhi: 'North',
  Chandigarh: 'North',
  Mumbai: 'West',
  Ahmedabad: 'West',
  Pune: 'West',
  Vadodara: 'West',
  Bengaluru: 'South',
  Chennai: 'South',
  Thiruvananthapuram: 'South',
  Hyderabad: 'South',
  Visakhapatnam: 'South',
  Kolkata: 'East',
};

const REGIONS = ['All', 'North', 'South', 'East', 'West'];

export default function IndiaNetworkMap() {
  const [screenSize, setScreenSize] = useState('lg');
  const [region, setRegion] = useState('All');
  const [hovered, setHovered] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const regionCounts = useMemo(() => {
    const counts = {};
    branches.forEach((b) => {
      const r = REGION_BY_CITY[b.name] ?? 'Other';
      counts[r] = (counts[r] ?? 0) + 1;
    });
    return counts;
  }, []);

  const isDimmed = (branch) => region !== 'All' && REGION_BY_CITY[branch.name] !== region;

  const focusBranch = (i) => {
    setExpanded((e) => (e === i ? null : i));
    setHovered(null);
  };

  return (
    <section id="coverage-network" className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <RecTag>Live coverage</RecTag>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Inkarp&apos;s network across India
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              {branches.length} branches spanning {REGIONS.length - 1} regions. Hover a pin to preview a
              branch, or pick a region to narrow the network.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                aria-pressed={region === r}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  region === r
                    ? 'border-red bg-red text-white'
                    : 'border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-ink'
                }`}
              >
                {r}
                {r !== 'All' && <span className="ml-1 text-[10px] opacity-70">({regionCounts[r] ?? 0})</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Map card */}
          <div className="relative rounded-2xl border border-line-light bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="relative aspect-square w-full rounded-xl bg-parchment/60">
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <Image
                  alt="India network coverage map"
                  className="h-full w-full object-contain opacity-90"
                  fill
                  src="/assets/contact/IndiaMap.svg"
                />
              </div>

              {branches.map((branch, i) => {
                const [top, left] = branch.position[screenSize];
                const dimmed = isDimmed(branch);
                const active = hovered === i || expanded === i;

                return (
                  <button
                    key={branch.name}
                    type="button"
                    aria-label={`${branch.name} branch`}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered((h) => (h === i ? null : h))}
                    onClick={() => focusBranch(i)}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 outline-none transition-opacity duration-300 ${
                      dimmed ? 'opacity-20' : 'opacity-100'
                    }`}
                    style={{ left, top, zIndex: active ? 30 : 10 }}
                  >
                    <span className="relative flex size-6 items-center justify-center">
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red/30 motion-reduce:hidden"
                        style={{ animationDuration: '2.4s' }}
                      />
                      <span
                        className={`relative inline-flex rounded-full bg-red transition-all duration-200 ${
                          active ? 'size-4 ring-4 ring-red/20' : 'size-2.5'
                        }`}
                      />
                    </span>

                    {active && (
                      <span className="pointer-events-none absolute left-1/2 top-full z-40 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-ink bg-ink px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                        {branch.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['North', 'South', 'East', 'West'].map((r) => (
                <div key={r} className="rounded-lg border border-line-light bg-parchment px-3 py-2.5 text-center">
                  <div className="text-lg font-semibold text-ink">{regionCounts[r] ?? 0}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{r}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch list */}
          <div className="flex max-h-[560px] flex-col gap-2.5 overflow-y-auto pr-1">
            {branches.map((branch, i) => {
              const isOpen = expanded === i;
              const dimmed = isDimmed(branch);

              return (
                <div
                  key={branch.name}
                  className={`rounded-xl border bg-white transition-all duration-200 ${
                    isOpen ? 'border-red shadow-md' : 'border-line-light hover:border-red/30'
                  } ${dimmed ? 'opacity-40' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => focusBranch(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <MdLocationPin className="size-4 shrink-0 text-red" />
                      <span className="text-sm font-semibold text-ink">{branch.name}</span>
                      <span className="rounded-full border border-line-light bg-parchment-alt px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
                        {REGION_BY_CITY[branch.name] ?? '—'}
                      </span>
                    </span>
                    <FiChevronDown
                      className={`size-4 shrink-0 text-ink-soft transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-red' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="space-y-2.5 border-t border-line-light px-4 py-3.5">
                      <p className="text-xs leading-relaxed text-ink-soft">{branch.address}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {branch.phone.split(',').map((phone, pi) => (
                          <a
                            key={pi}
                            href={`tel:${phoneHref(phone)}`}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink underline decoration-line-light underline-offset-2 hover:text-red hover:decoration-red/40"
                          >
                            <MdLocalPhone className="size-3.5 text-red" /> {phone.trim()}
                          </a>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {branch.email.split(',').map((email) => (
                          <a
                            key={email}
                            href={`mailto:${email.trim()}`}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink underline decoration-line-light underline-offset-2 hover:text-red hover:decoration-red/40"
                          >
                            <MdEmail className="size-3.5 text-red" /> {email.trim()}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
