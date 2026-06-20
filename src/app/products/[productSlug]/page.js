import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FiChevronRight, FiMail, FiArrowRight, FiGlobe } from 'react-icons/fi';
import { getAllProducts, getProductBySlug } from '@/data/products/principals';
import UniversalProductPage from '@/components/products/UniversalProductPage';
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

  return (
    <main className="bg-white">
      {/* Breadcrumb */}
      <nav className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <Link className="inline-flex size-8 items-center justify-center rounded-full border border-[#BE0010]/15 bg-[#fff3f4] text-[#BE0010] transition hover:border-[#BE0010]/35 hover:bg-white" href="/"><FaHome /></Link>
          <FiChevronRight className="text-zinc-400" />
          <Link className="transition hover:text-[#BE0010]" href="/products">Products</Link>
          <FiChevronRight className="text-zinc-400" />
          <span className="truncate text-zinc-900">{product.name}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#BE0010]/15 bg-[#fff3f4] px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* Left */}
          <div>
            {/* Pill badges row */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {/* Principal logo pill â€” white background */}
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1.5">
                <Image
                  alt={product.principalName}
                  className="h-5 w-auto object-contain"
                  height={20}
                  src={product.principalImage}
                  width={80}
                />
              </div>

              {/* Category pill â€” red */}
              {product.category && (
                <span className="inline-flex items-center rounded-full bg-[#BE0010] px-3 py-1.5 text-xs font-semibold text-white">
                  {product.category}
                </span>
              )}

              {/* Country pill â€” dark gray */}
              {product.countryOfOrigin && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BE0010]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#BE0010]">
                  <FiGlobe className="h-3.5 w-3.5" />
                  Made in {product.countryOfOrigin}
                </span>
              )}
            </div>

           <div className="flex flex-col gap-1">
            <h1 className="font-maxot text-3xl leading-tight text-zinc-950 drop-shadow-[0_16px_36px_rgba(190,0,16,0.12)] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

             {/* Distributor note â€” from JSON, omitted if not set */}
            {product.distributorNote && (
              <p className="mt-3 text-lg font-medium text-[#BE0010]">
                {product.distributorNote}
              </p>
            )}
            </div>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
              {product.longForm?.heroLead ?? product.overview}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={isRichPage ? "#booking" : "/contact-us"}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#BE0010] px-6 text-sm font-semibold text-white transition hover:bg-[#9f000d]"
              >
                Request Quote
              </Link>
              <Link
                href={isRichPage ? "#booking" : "/contact-us"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#BE0010]/25 bg-white px-6 text-sm font-semibold text-[#BE0010] transition hover:border-[#BE0010]/40 hover:bg-[#BE0010]/5"
              >
                <FiMail className="h-4 w-4" />
                Enquiry Now
              </Link>
            </div>
          </div>

          {/* Right: product image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[#BE0010]/15 bg-white shadow-2xl shadow-[#BE0010]/15">
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
                <div className="flex aspect-square w-full items-center justify-center text-sm text-zinc-400">
                  Product image coming soon
                </div>
              )}
            </div>
            {/* Caption */}
            <p className="mt-2 text-center text-xs text-zinc-500">
              {product.principalName} {product.name} Â· hand-lift &amp; motor-lift options
            </p>
          </div>

        </div>
      </section>

      {/* â”€â”€ Rich universal page sections OR legacy longForm â”€â”€ */}
      <div id="product-details">
        {isRichPage ? (
          <UniversalProductPage product={product} />
        ) : (
          <LegacyProductContent product={product} />
        )}
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-maxot text-2xl font-bold text-zinc-950">Related Products</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <article
                  key={`${item.principalSlug}-${item.slug}`}
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#BE0010]/40 hover:shadow-lg"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-50">
                    {item.image ? (
                      <Image
                        alt={item.name}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                        height={300}
                        src={item.image}
                        width={300}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">No image</div>
                    )}
                  </div>
                  <h3 className="font-maxot mt-3 text-sm font-bold text-zinc-950">{item.name}</h3>
                  <Link
                    className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#BE0010]/20 bg-[#fff3f4] text-xs font-semibold text-[#BE0010] transition hover:border-[#BE0010]/40 hover:bg-white"
                    href={item.href}
                  >
                    View details <FiArrowRight />
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

/* â”€â”€ Legacy layout for products without rich sections â”€â”€ */
function LegacyProductContent({ product }) {
  const lf = product.longForm;
  if (!lf) return null;

  return (
    <>
      {product.technicalSpecs?.length > 0 && (
        <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Specifications</p>
            <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Technical specifications</h2>
            <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <dl className="divide-y divide-zinc-100">
                {product.technicalSpecs.map((row) => (
                  <div key={row.label} className="grid gap-2 px-5 py-3 text-sm sm:grid-cols-[0.38fr_0.62fr]">
                    <dt className="font-semibold text-zinc-500">{row.label}</dt>
                    <dd className="text-zinc-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {lf.sections?.map((section, i) => (
        <section key={section.title} className={`px-4 py-14 sm:px-6 lg:px-8 ${i % 2 === 1 ? 'bg-zinc-50' : 'bg-white'}`}>
          <div className="mx-auto max-w-7xl">
            {section.eyebrow && (
              <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">{section.eyebrow}</p>
            )}
            <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">{section.title}</h2>
            {section.description && (
              <p className="mt-3 mb-7 max-w-3xl text-sm leading-7 text-zinc-500">{section.description}</p>
            )}
            {section.body?.map((p, pi) => (
              <p key={pi} className="mb-4 max-w-4xl text-sm leading-7 text-zinc-600">{p}</p>
            ))}
            {section.cards?.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.cards.map((c) => (
                  <div key={c.title} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <h3 className="font-maxot text-base text-zinc-950">{c.title}</h3>
                    {c.description && <p className="mt-2 text-sm leading-6 text-zinc-600">{c.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {lf.cta && (
        <section className="bg-[#fff3f4] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl border border-[#BE0010]/15 bg-white p-6 shadow-xl shadow-[#BE0010]/10 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">{lf.cta.eyebrow}</p>
              <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">{lf.cta.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{lf.cta.description}</p>
            </div>
            <Link
              href={lf.cta.href ?? '/contact-us'}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#BE0010] px-6 text-sm font-semibold text-white transition hover:bg-[#9f000d]"
            >
              {lf.cta.label} <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
