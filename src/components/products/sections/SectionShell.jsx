'use client';

import RecTag from '@/components/home/RecTag';

export default function SectionShell({ id, eyebrow, title, description, bg = 'white', children, className = '' }) {
  const isAlt = bg === 'gray';

  return (
    <section
      id={id}
      className={`scroll-mt-16 px-4 py-16 sm:px-6 lg:px-8 ${isAlt ? 'bg-parchment-alt' : 'bg-white'} ${className}`}
    >
      <div className="mx-auto max-w-[1180px]">
        {(eyebrow || title || description) && (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              {eyebrow && <RecTag>{eyebrow}</RecTag>}
              {title && (
                <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
                  {title}
                </h2>
              )}
            </div>
            {description && (
              <p className="max-w-[430px] text-sm leading-6 text-ink-soft">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}