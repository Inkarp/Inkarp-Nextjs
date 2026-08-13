'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdEmail, MdLocalPhone, MdLocationPin } from 'react-icons/md';
import { branches, getScreenSize, phoneHref } from '@/data/branches';
import SectionHeader from './SectionHeader';

// `calm` renders the plain white/no-dark-mode look used on the contact page.
// Default (false) keeps the existing product-page appearance untouched.
export default function ServiceMap({ data, calm = false }) {
  const { title, description, eyebrow, supportAreas } = data ?? {};
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
          : 'scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-14 sm:px-6 lg:px-8'
      }
    >
      <div className="relative mx-auto max-w-[1180px]">
        <SectionHeader
          number="17"
          eyebrow={eyebrow ?? 'Service'}
          title={title ?? 'Inkarp service across India'}
          description={description}
        />

        {supportAreas?.length > 0 && (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {supportAreas.map((area) => (
              <div
                className={
                  calm
                    ? 'border border-line-light bg-white p-4'
                    : 'border border-line-light bg-parchment p-4'
                }
                key={area.title}
              >
                <p className={`text-sm font-semibold ${calm ? 'text-ink' : 'text-black'}`}>{area.title}</p>
                {area.description && (
                  <p className={`mt-1 text-xs leading-5 ${calm ? 'text-ink-soft' : 'text-black'}`}>{area.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* India map with all branch pins */}
          {/* Ratio matches IndiaMap.svg's 1847x2000 viewBox so the contained
              map fills the frame and pin percentages line up — a square frame
              letterboxed it and pushed every pin sideways. */}
          <div
            className={
              calm
                ? 'relative aspect-[1847/2000] w-full overflow-hidden border border-line-light bg-white'
                : 'relative aspect-[1847/2000] w-full overflow-hidden border border-line-light bg-parchment'
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
                          <span className="absolute left-1/2 top-1/2 z-0 size-5 -translate-x-1/2 -translate-y-1/2 animate-ping bg-red" />
                        )}
                        <MdLocationPin
                          className={`relative z-10 transition-all ${
                            isSelected ? 'size-8 text-red' : 'size-6 text-black'
                          }`}
                        />
                      </div>
                      <span
                        className={`mt-1 block whitespace-nowrap border px-2 py-0.5 text-[10px] font-semibold transition ${
                          isSelected
                            ? 'border-black bg-red text-white'
                            : calm
                              ? 'border-line-light bg-white text-ink'
                              : 'border-line-light bg-parchment text-black'
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
                  ? 'border border-line-light bg-white p-4'
                  : 'border border-line-light bg-parchment p-4'
              }
            >
              <div className="flex flex-wrap gap-2">
                {branches.map((branch, i) => (
                  <button
                    key={branch.name}
                    onClick={() => setSelected(i)}
                    type="button"
                    className={`border px-3 py-1.5 text-xs font-semibold transition ${
                      selected === i
                        ? 'border-black bg-red text-white'
                        : calm
                          ? 'border-line-light text-ink hover:border-red/40'
                          : 'border-line-light text-black hover:border-red/40'
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
                  ? 'border border-line-light bg-white p-5'
                  : 'border border-line-light bg-parchment p-5'
              }
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 bg-red" />
                <h3 className={`font-semibold tracking-tight ${calm ? 'text-ink' : 'text-ink'}`}>
                  {selectedBranch.name} branch
                </h3>
              </div>

              <div className={`mb-3 flex items-start gap-2 bg-parchment-alt p-3 ${calm ? '' : ''}`}>
                <MdLocationPin className="mt-0.5 size-4 shrink-0 text-red" />
                <p className={`text-xs leading-snug ${calm ? 'text-ink' : 'text-black'}`}>
                  {selectedBranch.address}
                </p>
              </div>

              <div className={`mb-2 flex items-start gap-2 bg-parchment-alt p-3 ${calm ? '' : ''}`}>
                <MdLocalPhone className="mt-0.5 size-4 shrink-0 text-red" />
                <div className="flex flex-col gap-1">
                  {selectedBranch.phone.split(',').map((phone, phoneIndex) => (
                    <a
                      key={`${selectedBranch.name}-phone-${phoneIndex}`}
                      href={`tel:${phoneHref(phone)}`}
                      className={`text-xs font-medium underline hover:text-red ${calm ? 'text-ink' : 'text-black'}`}
                    >
                      {phone.trim()}
                    </a>
                  ))}
                </div>
              </div>

              <div className={`flex items-start gap-2 bg-parchment-alt p-3 ${calm ? '' : ''}`}>
                <MdEmail className="mt-0.5 size-4 shrink-0 text-red" />
                <div className="flex flex-col gap-1">
                  {selectedBranch.email.split(',').map((email) => (
                    <a
                      key={`${selectedBranch.name}-${email}`}
                      href={`mailto:${email.trim()}`}
                      className={`text-xs font-medium underline hover:text-red ${calm ? 'text-ink' : 'text-black'}`}
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
                  ? 'border border-line-light bg-white p-5'
                  : 'border border-line-light bg-parchment p-5'
              }
            >
              <p className={`font-semibold text-sm mb-1 ${calm ? 'text-ink' : 'text-black'}`}>
                Don&apos;t see your city?
              </p>
              <p className={`text-xs mb-3 ${calm ? 'text-ink-soft' : 'text-black'}`}>
                Inkarp covers all major cities and institutes across India. Contact us to confirm service availability in your location.
              </p>
              <a href="/contact" className="inline-flex items-center bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-transparent hover:text-red transition">
                Contact Inkarp →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
