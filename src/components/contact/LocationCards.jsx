'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdEmail, MdLocalPhone, MdLocationPin } from 'react-icons/md';
import { branches, getScreenSize, phoneHref } from '@/data/branches';
import RecTag from '@/components/home/RecTag';

export default function LocationCards({ data }) {
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
      className="scroll-mt-16 border-b border-line-light bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 max-w-2xl">
          <RecTag>{eyebrow ?? 'Service'}</RecTag>
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {title ?? 'Inkarp service across India'}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* India map with all branch pins */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line-light bg-white shadow-sm">
            <div className="absolute inset-0 p-4 sm:p-6">
              <div className="relative h-full w-full">
                <Image
                  alt="India service coverage map"
                  className="h-full w-full object-contain opacity-95"
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
                        aria-pressed={isSelected}
                        onClick={() => setSelected(i)}
                        type="button"
                        className="group flex flex-col items-center outline-none"
                      >
                        <div className="relative z-[100] size-8">
                          {isSelected && (
                            <span className="absolute left-1/2 top-1/2 z-0 size-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-red/60 motion-reduce:hidden" />
                          )}
                          <MdLocationPin
                            className={`relative z-10 text-red drop-shadow-sm transition-all duration-200 group-hover:scale-110 ${
                              isSelected ? 'size-10' : 'size-8 opacity-80'
                            }`}
                          />
                        </div>
                        <span
                          className={`mt-1 block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-semibold shadow-sm transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-red/40 ${
                            isSelected
                              ? 'border-red bg-red text-white'
                              : 'border-line-light bg-white text-ink group-hover:border-red/40'
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
          </div>

          {/* Branch picker + detail */}
          <div className="flex flex-col gap-4">
            {/* Picker chips */}
            <div className="rounded-2xl border border-line-light bg-white p-4 shadow-sm">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                Select a branch
              </p>
              <div className="flex flex-wrap gap-2">
                {branches.map((branch, i) => (
                  <button
                    key={branch.name}
                    onClick={() => setSelected(i)}
                    type="button"
                    aria-pressed={selected === i}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red/40 ${
                      selected === i
                        ? 'border-red bg-red text-white shadow-sm'
                        : 'border-line-light bg-white text-ink hover:border-red/40 hover:text-red'
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected branch detail */}
            <div
              key={selectedBranch.name}
              className="rounded-2xl border border-line-light bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red/40 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-red" />
                </span>
                <h3 className="text-base font-semibold text-ink">
                  {selectedBranch.name} branch
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 rounded-xl bg-[#faf7f5] p-3.5">
                  <MdLocationPin className="mt-0.5 size-4 shrink-0 text-red" />
                  <p className="text-xs leading-relaxed text-ink">
                    {selectedBranch.address}
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-[#faf7f5] p-3.5">
                  <MdLocalPhone className="mt-0.5 size-4 shrink-0 text-red" />
                  <div className="flex flex-col gap-1.5">
                    {selectedBranch.phone.split(',').map((phone, phoneIndex) => (
                      <a
                        key={`${selectedBranch.name}-phone-${phoneIndex}`}
                        href={`tel:${phoneHref(phone)}`}
                        className="text-xs font-medium text-ink underline decoration-line-light underline-offset-2 transition-colors hover:text-red hover:decoration-red/40"
                      >
                        {phone.trim()}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-[#faf7f5] p-3.5">
                  <MdEmail className="mt-0.5 size-4 shrink-0 text-red" />
                  <div className="flex flex-col gap-1.5">
                    {selectedBranch.email.split(',').map((email) => (
                      <a
                        key={`${selectedBranch.name}-${email}`}
                        href={`mailto:${email.trim()}`}
                        className="text-xs font-medium text-ink underline decoration-line-light underline-offset-2 transition-colors hover:text-red hover:decoration-red/40"
                      >
                        {email.trim()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-line-light bg-white p-5 shadow-sm">
              <p className="mb-1 text-sm font-semibold text-ink">
                Don&apos;t see your city?
              </p>
              <p className="mb-4 text-xs leading-relaxed text-ink-soft">
                Inkarp covers all major cities and institutes across India.
                Contact us to confirm service availability in your location.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#9f000d] focus-visible:ring-2 focus-visible:ring-red/40"
              >
                Contact Inkarp
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}