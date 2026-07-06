'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdEmail, MdLocalPhone, MdLocationPin } from 'react-icons/md';
import { branches, getScreenSize, phoneHref } from '@/data/branches';
import SectionHeader from './SectionHeader';

// `calm` renders the plain white/no-dark-mode look used on the contact page.
// Default (false) keeps the existing product-page appearance untouched.
export default function ServiceMap({ data, calm = false }) {
  const { title, description, eyebrow } = data ?? {};
  const [screenSize, setScreenSize] = useState('lg');
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedBranch = branches[selected];

  return (
    <section
      id="service"
      className={
        calm
          ? 'scroll-mt-16 border-b border-line-light bg-white px-4 py-14 sm:px-6 lg:px-8'
          : 'scroll-mt-16 border-b border-line-light bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950'
      }
    >
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="17"
          eyebrow={eyebrow ?? 'Service'}
          title={title ?? 'Inkarp service across India'}
          description={description}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* India map with all branch pins */}
          <div
            className={
              calm
                ? 'relative aspect-square w-full overflow-hidden rounded-2xl border border-line-light bg-white shadow-sm'
                : 'relative aspect-square w-full overflow-hidden rounded-2xl border border-line-light bg-parchment shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
            }
          >
            <div className="absolute inset-0">
              <Image
                alt="India service coverage map"
                className="h-full w-full object-contain"
                fill
                priority
                src="/assets/contact/IndiaMap.svg"
              />

              {branches.map((branch, i) => {
                const [top, left] = branch.position[screenSize];
                const isSelected = selected === i;

                return (
                  <div
                    key={branch.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left, top }}
                  >
                    <button
                      aria-label={`Show ${branch.name} branch details`}
                      onClick={() => setSelected(i)}
                      type="button"
                    >
                      <div className="relative z-[100] size-6">
                        {isSelected && (
                          <span className="absolute left-1/2 top-1/2 z-0 size-5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-red" />
                        )}
                        <MdLocationPin
                          className={`relative z-10 text-red drop-shadow transition-all ${
                            isSelected ? 'size-8' : 'size-6'
                          }`}
                        />
                      </div>
                      <span
                        className={`mt-1 block whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-semibold shadow transition ${
                          isSelected
                            ? 'border-red bg-red text-parchment'
                            : calm
                              ? 'border-line-light bg-white text-ink'
                              : 'border-line-light bg-parchment text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {branch.name}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Branch picker + detail */}
          <div className="flex flex-col gap-4">
            <div
              className={
                calm
                  ? 'rounded-2xl border border-line-light bg-white p-4 shadow-sm'
                  : 'rounded-2xl border border-line-light bg-parchment p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
              }
            >
              <div className="flex flex-wrap gap-2">
                {branches.map((branch, i) => (
                  <button
                    key={branch.name}
                    onClick={() => setSelected(i)}
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected === i
                        ? 'border-red bg-red/5 text-red'
                        : calm
                          ? 'border-line-light text-ink hover:border-red/40'
                          : 'border-line-light text-black hover:border-red/40 dark:border-zinc-700 dark:text-zinc-100'
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected branch detail */}
            <div
              className={
                calm
                  ? 'rounded-2xl border border-line-light bg-white p-5 shadow-sm'
                  : 'rounded-2xl border-2 border-red/30 bg-parchment p-5 shadow-sm dark:bg-zinc-900'
              }
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-red" />
                <h3 className={`font-maxot font-bold ${calm ? 'text-ink' : 'text-black dark:text-zinc-100'}`}>
                  {selectedBranch.name} branch
                </h3>
              </div>

              <div className={`mb-3 flex items-start gap-2 rounded-lg bg-[#fef2f2] p-3 ${calm ? '' : 'dark:bg-red-950/40'}`}>
                <MdLocationPin className="mt-0.5 size-4 shrink-0 text-red" />
                <p className={`text-xs leading-snug ${calm ? 'text-ink' : 'text-black dark:text-zinc-100'}`}>
                  {selectedBranch.address}
                </p>
              </div>

              <div className={`mb-2 flex items-start gap-2 rounded-lg bg-[#f5f5f5] p-3 ${calm ? '' : 'dark:bg-zinc-800'}`}>
                <MdLocalPhone className="mt-0.5 size-4 shrink-0 text-red" />
                <div className="flex flex-col gap-1">
                  {selectedBranch.phone.split(',').map((phone, phoneIndex) => (
                    <a
                      key={`${selectedBranch.name}-phone-${phoneIndex}`}
                      href={`tel:${phoneHref(phone)}`}
                      className={`text-xs font-medium underline hover:text-red ${calm ? 'text-ink' : 'text-black dark:text-zinc-100'}`}
                    >
                      {phone.trim()}
                    </a>
                  ))}
                </div>
              </div>

              <div className={`flex items-start gap-2 rounded-lg bg-[#f5f5f5] p-3 ${calm ? '' : 'dark:bg-zinc-800'}`}>
                <MdEmail className="mt-0.5 size-4 shrink-0 text-red" />
                <div className="flex flex-col gap-1">
                  {selectedBranch.email.split(',').map((email) => (
                    <a
                      key={`${selectedBranch.name}-${email}`}
                      href={`mailto:${email.trim()}`}
                      className={`text-xs font-medium underline hover:text-red ${calm ? 'text-ink' : 'text-black dark:text-zinc-100'}`}
                    >
                      {email.trim()}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={
                calm
                  ? 'rounded-2xl border border-line-light bg-white p-5 shadow-sm'
                  : 'rounded-2xl border border-line-light bg-parchment p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
              }
            >
              <p className={`font-semibold text-sm mb-1 ${calm ? 'text-ink' : 'text-black dark:text-zinc-100'}`}>
                Don&apos;t see your city?
              </p>
              <p className={`text-xs mb-3 ${calm ? 'text-ink-soft' : 'text-black dark:text-zinc-400'}`}>
                Inkarp covers all major cities and institutes across India. Contact us to confirm service availability in your location.
              </p>
              <a href="/contact" className="inline-flex items-center rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-parchment hover:bg-[#9f000d] transition">
                Contact Inkarp →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
