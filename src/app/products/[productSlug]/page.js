import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FiChevronRight, FiMail, FiArrowRight, FiGlobe } from 'react-icons/fi';
import { getAllProducts, getProductBySlug } from '@/data/products/principals';
import UniversalProductPage from '@/components/products/UniversalProductPage';
import CustomerReviews from '@/components/products/sections/CustomerReviews';
import { FaHome } from 'react-icons/fa';

export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) return { title: 'Product Not Found - Inkarp' };
  return {
    title: product.metaTitle ?? `${product.name} - Inkarp`,
    description:
      product.metaDescription ??
      `Explore ${product.name} from ${product.principalName}.`,
    keywords: product.metaKeywords,
  };
}

export default async function ProductPage({ params }) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) notFound();

  const relatedProducts = getAllProducts()
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  /* Decide rendering mode:
     - richPage: product has the new rich section JSON keys (inPageNav, simulator, etc.)
     - fallback: old products that only have longForm */
  const isRichPage = !!(product.inPageNav || product.simulator || product.quiz);

  const faqJsonLd = product.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  return (
    <main className="bg-parchment dark:bg-zinc-950">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* Breadcrumb */}
      <nav className="border-b border-line-light dark:border-zinc-800 bg-parchment-alt dark:bg-zinc-900 px-4 py-3 text-sm text-ink-soft dark:text-zinc-400 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <Link className="inline-flex size-8 items-center justify-center rounded-full border border-line-light dark:border-zinc-700 bg-parchment-alt dark:bg-zinc-800 text-ink-soft dark:text-zinc-400 transition hover:border-red/35 hover:text-red" href="/"><FaHome className="text-red" /></Link>
          <FiChevronRight className="text-red" />
          <Link className="transition hover:text-red" href="/products">Products</Link>
          <FiChevronRight className="text-red" />
          <span className="truncate text-ink dark:text-zinc-100">{product.name}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line-light bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* Left */}
          <div>
            {/* Pill badges row */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {/* Principal logo pill */}
              <div className="inline-flex items-center rounded-full border border-line-light dark:border-zinc-700 bg-parchment dark:bg-white px-3 py-1.5">
                {product.principalImage ? (
                  <Image
                    alt={product.principalName}
                    className="h-5 w-auto object-contain"
                    height={20}
                    src={product.principalImage}
                    width={80}
                  />
                ) : (
                  <span className="max-w-[180px] truncate text-xs font-semibold text-ink-soft dark:text-zinc-200">
                    {product.principalName}
                  </span>
                )}
              </div>

              {/* Category pill */}
              {product.category && (
                <span className="inline-flex items-center rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-parchment dark:bg-zinc-800">
                  {product.category}
                </span>
              )}

              {/* Country pill */}
              {product.countryOfOrigin && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line-light dark:border-zinc-700 bg-parchment dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-ink-soft dark:text-zinc-300">
                  <FiGlobe className="h-3.5 w-3.5 text-red" />
                  Made in {product.countryOfOrigin}
                </span>
              )}
            </div>

           <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink dark:text-zinc-100 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

             {/* Distributor note from JSON, omitted if not set */}
            {product.distributorNote && (
              <h2 className="mt-3 text-lg font-medium text-red">
                {product.distributorNote}
              </h2>
            )}

            {/* Service pills from JSON, omitted if not set */}
            {product.servicePills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.servicePills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center rounded-full border border-[#BE0010] px-3 py-1 text-xs font-semibold text-[#BE0010]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}
            </div>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft dark:text-zinc-400">
              {product.longForm?.heroLead ?? product.overview}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={isRichPage ? "#booking" : "/contact"}
                className="inline-flex h-11 items-center justify-center rounded-full bg-red px-6 text-sm font-semibold text-parchment transition hover:bg-[#9f000d]"
              >
                Request Quote
              </Link>
              <Link
                href={isRichPage ? "#booking" : "/contact"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-light bg-white dark:border-zinc-700 dark:bg-zinc-900 px-6 text-sm font-semibold text-ink dark:text-zinc-100 transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                <FiMail className="h-4 w-4 text-red" />
                Enquiry Now
              </Link>
            </div>
          </div>

          {/* Right: product image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-line-light dark:border-zinc-700 bg-parchment dark:bg-zinc-900 shadow-lg">
              {/* Dr Dexter, standing fully inside the frame on the left, aligned to the image height */}
              <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-2/5">
                <Image
                  alt="Dr Dexter"
                  className="object-contain object-bottom"
                  fill
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 200px, 150px"
                  src="/dexter.png"
                />
              </div>

              {product.image ? (
                <Image
                  alt={product.name}
                  className="h-full w-full object-contain p-6 transition duration-500 hover:scale-105"
                  height={600}
                  src={product.image}
                  width={600}
                  priority
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center text-sm text-ink-soft dark:text-zinc-500">
                  Product image coming soon
                </div>
              )}
            </div>
            {/* Caption */}
            <p className="mt-2 text-center text-xs text-ink-soft dark:text-zinc-400">
              {product.imageAlt ?? `${product.principalName} ${product.name}`}
            </p>
          </div>

        </div>
      </section>

      {/* Rich universal page sections OR legacy longForm */}
      <div id="product-details">
        {isRichPage ? (
          <UniversalProductPage product={product} />
        ) : (
          <LegacyProductContent product={product} />
        )}
      </div>

      {/* Customer reviews */}
      <CustomerReviews reviews={product.reviews} />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-line-light dark:border-zinc-800 bg-parchment-alt dark:bg-zinc-950 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-zinc-100">Related Products</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <article
                  key={`${item.principalSlug}-${item.slug}`}
                  className="group flex flex-col rounded-xl border border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 p-4 shadow-sm transition hover:-translate-y-1 hover:border-red/40 hover:shadow-lg"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-parchment-alt dark:bg-zinc-800">
                    {item.image ? (
                      <Image
                        alt={item.name}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                        height={300}
                        src={item.image}
                        width={300}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-ink-soft dark:text-zinc-500">No image</div>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold tracking-tight text-ink dark:text-zinc-100">{item.name}</h3>
                  <Link
                    className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line-light dark:border-zinc-700 bg-parchment-alt dark:bg-zinc-800 text-xs font-semibold text-ink dark:text-zinc-100 transition hover:border-red/40 hover:text-red"
                    href={item.href}
                  >
                    View details <FiArrowRight className="text-red" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* Legacy layout for products without rich sections */
function LegacyProductContent({ product }) {
  const lf = product.longForm;
  if (!lf) return null;

  return (
    <>
      {product.technicalSpecs?.length > 0 && (
        <section className="border-b border-line-light dark:border-zinc-800 bg-parchment-alt dark:bg-zinc-950 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-red">Specifications</p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-ink dark:text-zinc-100 sm:text-3xl">Technical specifications</h2>
            <div className="mt-6 overflow-hidden rounded-xl border border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 shadow-sm">
              <dl className="divide-y divide-line-light dark:divide-zinc-800">
                {product.technicalSpecs.map((row) => (
                  <div key={row.label} className="grid gap-2 px-5 py-3 text-sm sm:grid-cols-[0.38fr_0.62fr]">
                    <dt className="font-semibold text-ink-soft dark:text-zinc-400">{row.label}</dt>
                    <dd className="text-ink dark:text-zinc-100">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {lf.sections?.map((section, i) => (
        <section key={section.title} className={`px-4 py-14 sm:px-6 lg:px-8 ${i % 2 === 1 ? 'bg-parchment-alt dark:bg-zinc-950' : 'bg-parchment dark:bg-zinc-900'}`}>
          <div className="mx-auto max-w-7xl">
            {section.eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-widest text-red">{section.eyebrow}</p>
            )}
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-ink dark:text-zinc-100 sm:text-3xl">{section.title}</h2>
            {section.description && (
              <p className="mt-3 mb-7 max-w-3xl text-sm leading-7 text-ink-soft dark:text-zinc-400">{section.description}</p>
            )}
            {section.body?.map((p, pi) => (
              <p key={pi} className="mb-4 max-w-4xl text-sm leading-7 text-ink-soft dark:text-zinc-400">{p}</p>
            ))}
            {section.cards?.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.cards.map((c) => (
                  <div key={c.title} className="rounded-xl border border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 p-5 shadow-sm">
                    <h3 className="text-base font-semibold tracking-tight text-ink dark:text-zinc-100">{c.title}</h3>
                    {c.description && <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-zinc-400">{c.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {lf.cta && (
        <section className="bg-parchment-alt dark:bg-zinc-900 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl border border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-950 p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red">{lf.cta.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-ink dark:text-zinc-100 sm:text-3xl">{lf.cta.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft dark:text-zinc-400">{lf.cta.description}</p>
            </div>
            <Link
              href={lf.cta.href ?? '/contact'}
              className="inline-flex h-12 items-center justify-center rounded-full bg-red px-6 text-sm font-semibold text-parchment transition hover:bg-[#9f000d]"
            >
              {lf.cta.label} <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
