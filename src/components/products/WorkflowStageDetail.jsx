import Image from 'next/image';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import AddToQuoteButton from './AddToQuoteButton';

/**
 * One workflow stage: each challenge, the solution to it, and cards for the
 * instruments that address it. Products present in the catalogue link to their
 * page; ones named in the source document but not yet built render greyed out.
 *
 * Each challenge is a native <details>, so every one is in the page HTML for
 * search engines and find-in-page, and several can be open at once. The named
 * group keeps the open state from triggering the product cards' own hover group.
 */
export default function WorkflowStageDetail({ challenges = [], industry }) {
  if (!challenges.length) return null;

  return (
    <div className="mt-9">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {`Top ${challenges.length} challenges & solutions`}
      </p>

      <div className="mt-4 space-y-3">
        {challenges.map((c, i) => {
          const brands = [...new Set(c.products.map((p) => p.principal).filter(Boolean))];

          return (
            <details className="group/challenge border border-line-light bg-white" key={i} open={i === 0}>
              <summary className="flex w-full cursor-pointer list-none items-center gap-4 px-5 py-4 text-left transition hover:bg-parchment-alt [&::-webkit-details-marker]:hidden">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white transition group-open/challenge:bg-red">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 text-[17px] font-semibold leading-snug text-ink">
                  {c.challenge}
                </span>
                <FiChevronDown
                  aria-hidden="true"
                  className="shrink-0 text-red transition-transform group-open/challenge:rotate-180"
                />
              </summary>

              <div className="border-t border-line-light px-5 pb-6 pt-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-teal">
                  Solution
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink">{c.solution}</p>

                {c.products.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                        Supported instruments
                      </p>
                      <span className="rounded-full bg-parchment-alt px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                        {brands.length === 1 ? '1 brand' : `${brands.length} brands`}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {c.products.map((p) => (
                        <ProductCard key={p.slug ?? p.name} product={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-ink-soft">
        Not sure which instrument fits?{' '}
        <Link className="font-semibold text-red hover:underline" href="/contact">
          Talk to an {industry.toLowerCase()} specialist
        </Link>
        .
      </p>
    </div>
  );
}

function ProductCard({ product }) {
  const { image, imageAlt, country, name, principal, principalImage, slug } = product;


  const body = (
    <>
      <div className="flex items-center justify-center border border-line-light bg-parchment-alt p-2">
        {image ? (
          <Image
            alt={imageAlt ?? name}
            className="h-24 w-full object-contain"
            height={120}
            loading="lazy"
            sizes="(min-width: 1024px) 220px, (min-width: 640px) 40vw, 80vw"
            src={image}
            width={180}
          />
        ) : (
          <span className="flex h-24 items-center text-[11px] text-ink-soft">
            Image coming soon
          </span>
        )}
      </div>

      <h4
        className={`mt-3 text-[15px] font-semibold leading-snug ${
          slug ? 'text-ink transition-colors group-hover:text-red' : 'text-ink-soft'
        }`}
      >
        {name}
      </h4>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {principalImage ? (
          <span className="inline-flex items-center border border-line-light bg-white px-2 py-1">
            <Image
              alt={principal ?? 'Brand'}
              className="h-4 w-auto object-contain"
              height={16}
              src={principalImage}
              width={56}
            />
          </span>
        ) : principal ? (
          <span className="border border-line-light bg-white px-2 py-1 text-[11px] text-ink-soft">
            {principal}
          </span>
        ) : null}

        {country ? (
          <span className="border border-line-light bg-white px-2 py-1 text-[11px] text-ink-soft">
            {country}
          </span>
        ) : null}
      </div>

      {slug ? null : (
        <span className="mt-3 inline-flex w-fit items-center gap-1.5 border border-dashed border-line-light px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          Not listed yet
        </span>
      )}
    </>
  );

  if (!slug) {
    return (
      <div
        className="flex flex-col border border-dashed border-line-light bg-white p-4"
        title={`${name} — not yet listed on the site`}
      >
        {body}
      </div>
    );
  }

  return (
    <article className="group flex flex-col border border-line-light bg-white p-4 transition hover:-translate-y-0.5 hover:border-red/50">
      <Link
        className="flex flex-1 flex-col"
        href={`/products/${slug}`}
        title={principal ? `${name} — ${principal}` : name}
      >
        {body}
      </Link>

      <div className="mt-3 flex gap-2">
        <Link
          className="flex h-9 flex-1 items-center justify-center border border-rose-200 bg-rose-50 text-[11px] font-semibold uppercase tracking-wide text-rose-700 transition hover:bg-rose-100"
          href={`/products/${slug}`}
        >
          View product
        </Link>
        <AddToQuoteButton
          product={{
            slug,
            principalSlug: product.principalSlug ?? '',
            principalName: principal ?? '',
            name,
            image: image ?? '',
            imageAlt: imageAlt ?? name,
            countryOfOrigin: country ?? '',
          }}
        />
      </div>
    </article>
  );
}
