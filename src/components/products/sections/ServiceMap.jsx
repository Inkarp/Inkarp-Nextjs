'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdEmail, MdLocalPhone, MdLocationPin } from 'react-icons/md';
import { branches, getScreenSize, phoneHref } from '@/data/branches';
import SectionHeader from './SectionHeader';

export default function ServiceMap({ data }) {
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
    <section id="service" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="17"
          eyebrow={eyebrow ?? 'Service'}
          title={title ?? 'Inkarp service across India'}
          description={description}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* India map with all branch pins */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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
                          <span className="absolute left-1/2 top-1/2 z-0 size-5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#BE0010]" />
                        )}
                        <MdLocationPin
                          className={`relative z-10 text-[#BE0010] drop-shadow transition-all ${
                            isSelected ? 'size-8' : 'size-6'
                          }`}
                        />
                      </div>
                      <span
                        className={`mt-1 block whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-semibold shadow transition ${
                          isSelected
                            ? 'border-[#BE0010] bg-[#BE0010] text-white'
                            : 'border-zinc-200 bg-white text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'
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
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap gap-2">
                {branches.map((branch, i) => (
                  <button
                    key={branch.name}
                    onClick={() => setSelected(i)}
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected === i
                        ? 'border-[#BE0010] bg-[#BE0010]/5 text-[#BE0010]'
                        : 'border-zinc-200 text-black hover:border-[#BE0010]/40 dark:border-zinc-700 dark:text-zinc-100'
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected branch detail */}
            <div className="rounded-2xl border-2 border-[#BE0010]/30 bg-white p-5 shadow-sm dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-[#BE0010]" />
                <h3 className="font-maxot font-bold text-black dark:text-zinc-100">{selectedBranch.name} branch</h3>
              </div>

              <div className="mb-3 flex items-start gap-2 rounded-lg bg-[#fef2f2] p-3 dark:bg-red-950/40">
                <MdLocationPin className="mt-0.5 size-4 shrink-0 text-[#BE0010]" />
                <p className="text-xs leading-snug text-black dark:text-zinc-100">{selectedBranch.address}</p>
              </div>

              <div className="mb-2 flex items-start gap-2 rounded-lg bg-[#f5f5f5] p-3 dark:bg-zinc-800">
                <MdLocalPhone className="mt-0.5 size-4 shrink-0 text-[#BE0010]" />
                <div className="flex flex-col gap-1">
                  {selectedBranch.phone.split(',').map((phone, phoneIndex) => (
                    <a
                      key={`${selectedBranch.name}-phone-${phoneIndex}`}
                      href={`tel:${phoneHref(phone)}`}
                      className="text-xs font-medium text-black underline hover:text-[#BE0010] dark:text-zinc-100"
                    >
                      {phone.trim()}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-[#f5f5f5] p-3 dark:bg-zinc-800">
                <MdEmail className="mt-0.5 size-4 shrink-0 text-[#BE0010]" />
                <div className="flex flex-col gap-1">
                  {selectedBranch.email.split(',').map((email) => (
                    <a
                      key={`${selectedBranch.name}-${email}`}
                      href={`mailto:${email.trim()}`}
                      className="text-xs font-medium text-black underline hover:text-[#BE0010] dark:text-zinc-100"
                    >
                      {email.trim()}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="font-semibold text-sm text-black mb-1 dark:text-zinc-100">Don&apos;t see your city?</p>
              <p className="text-xs text-black mb-3 dark:text-zinc-400">Inkarp covers all major cities and institutes across India. Contact us to confirm service availability in your location.</p>
              <a href="/contact-us" className="inline-flex items-center rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
                Contact Inkarp →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
