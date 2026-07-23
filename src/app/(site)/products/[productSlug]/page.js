import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiArrowRight, FiCheck, FiChevronRight, FiGlobe, FiMail, FiShield } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import RecTag from "@/components/home/RecTag";
import { getAllProducts, getProductBySlug } from "@/data/products/principals";
import { buildDynamicMetadata } from "@/data/pageSeo";
import UniversalProductPage from "@/components/products/UniversalProductPage";
import CustomerReviews from "@/components/products/sections/CustomerReviews";
import TechnicalSpecsTable from "@/components/products/TechnicalSpecsTable";

const PRODUCT_DISTRIBUTOR_NOTE = "Authorized Distributor and Service Provider in India";

const DEFAULT_PRODUCT_SERVICE_PILLS = [
  "Installation",
  "Training",
  "AMC",
  "Application support",
  "HQ Support",
];
export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) return { title: "Product Not Found - Inkarp" };
  return buildDynamicMetadata({
    path: `/products/${product.slug}`,
    title: product.metaTitle ?? `${product.name} - Inkarp`,
    description:
      product.metaDescription ??
      `Explore ${product.name} from ${product.principalName}.`,
    keywords: product.metaKeywords,
  });
}

export default async function ProductPage({ params }) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) notFound();

  const relatedProducts = getAllProducts()
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  const isRichPage = !!(product.inPageNav || product.simulator || product.quiz);
  const servicePills = [...new Set([...DEFAULT_PRODUCT_SERVICE_PILLS, ...(product.servicePills ?? [])])];
  const heroLead = product.longForm?.heroLead ?? product.overview;
  const heroHookMatch = product.overview?.match(/^(.*?)(?=\s+(?:The Hei-FLOW|The Heidolph)\b)/);
  const heroHook = heroHookMatch?.[1]?.trim();
  const showHeroHook = Boolean(heroHook && heroLead && !heroLead.startsWith(heroHook));

  const faqJsonLd = product.faqs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  return (
    <main className="bg-white text-ink" data-product-page data-scroll-skip>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <nav className="border-y border-line-light bg-parchment-alt px-4 py-3 text-sm text-ink-soft sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] items-center gap-2">
          <Link className="inline-flex size-8 items-center justify-center border border-line-light bg-white text-red transition hover:border-red" href="/">
            <FaHome />
          </Link>
          <FiChevronRight className="text-red" />
          <Link className="transition hover:text-red" href="/products">Products</Link>
          <FiChevronRight className="text-red" />
          <span className="truncate text-ink">{product.name}</span>
        </div>
      </nav>

      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <RecTag>{product.principalName}</RecTag>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              {product.principalImage ? (
                <div className="inline-flex items-center border border-line-light bg-white px-3 py-2">
                  <Image
                    alt={product.principalName}
                    className="h-5 w-auto object-contain"
                    height={20}
                    src={product.principalImage}
                    width={80}
                  />
                </div>
              ) : null}

              {product.category && (
                <span className="border border-line-light bg-parchment-alt px-3 py-2 text-xs font-semibold text-ink-soft">
                  {product.category}
                </span>
              )}

              {product.countryOfOrigin && (
                <span className="inline-flex items-center gap-1.5 border border-line-light bg-parchment-alt px-3 py-2 text-xs font-semibold text-ink-soft">
                  <FiGlobe className="h-3.5 w-3.5 text-red" />
                  Made in {product.countryOfOrigin}
                </span>
              )}
            </div>

            <h1 className=" text-2xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-[32px] lg:text-[34px]">
              {product.name}
            </h1>
            {showHeroHook ? (
              <p className="mt-4 max-w-xl text-xl font-semibold leading-8 tracking-tight text-ink sm:text-2xl">
                {heroHook}
              </p>
            ) : null}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-red/30 bg-red/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red">
              <FiShield className="h-4 w-4 shrink-0" />
              {PRODUCT_DISTRIBUTOR_NOTE}
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {servicePills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red/30 bg-red/5 px-3.5 py-1.5 text-xs font-semibold text-red"
                >
                  <FiCheck className="h-3 w-3 shrink-0" />
                  {pill}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
              {heroLead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                href={isRichPage ? "#booking" : "/contact"}
                className="inline-flex items-center border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
              >
                Request Quote
              </Link>
              <Link
                href={isRichPage ? "#booking" : "/contact"}
                className="inline-flex items-center gap-2 border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                <FiMail className="h-4 w-4 text-red" />
                Enquiry Now
              </Link>
            </div>
          </div>

          <div className="relative self-center border border-line-light bg-parchment-alt p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden border border-line-light bg-white sm:min-h-[420px] lg:min-h-[500px]">
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
                  alt={product.imageAlt ?? product.name}
                  className="mx-auto max-h-[520px] w-full object-contain p-6 transition duration-500 hover:scale-105"
                  height={600}
                  src={product.image}
                  width={600}
                  priority
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center text-sm text-ink-soft">
                  Product image coming soon
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
              <span>Fig. 01 - Product Overview</span>
              <span>{product.imageAlt ?? `${product.principalName} ${product.name}`}</span>
            </div>
          </div>
        </div>
      </section>

      <div id="product-details">
        {isRichPage ? <UniversalProductPage product={product} /> : <LegacyProductContent product={product} />}
      </div>

      <CustomerReviews reviews={product.reviews} />

      {relatedProducts.length > 0 && (
        <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <RecTag>Related Products</RecTag>
                <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
                  More from this product family.
                </h2>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <article key={`${item.principalSlug}-${item.slug}`} className="group flex flex-col border border-line-light bg-white p-4 transition hover:border-red/50">
                  <div className="aspect-square w-full overflow-hidden border border-line-light bg-parchment-alt">
                    {item.image ? (
                      <Image
                        alt={item.name}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        height={300}
                        src={item.image}
                        width={300}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-ink-soft">No image</div>
                    )}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold tracking-tight text-ink">{item.name}</h3>
                  <Link className="mt-auto inline-flex items-center justify-center gap-1.5 border border-line-light bg-white px-4 py-2.5 text-xs font-semibold text-ink transition hover:border-red hover:text-red" href={item.href}>
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

function LegacyProductContent({ product }) {
  const lf = product.longForm;
  if (!lf) return null;

  return (
    <>
      {product.technicalSpecs?.length > 0 && (
        <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <RecTag>Specifications</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">Technical specifications.</h2>
            <div className="mt-8">
              <TechnicalSpecsTable
                note="Confirm final specifications, accessories, and configuration with Inkarp before ordering."
                specs={product.technicalSpecs}
              />
            </div>
          </div>
        </section>
      )}

      {lf.sections?.map((section, i) => (
        <section key={section.title} className={`px-4 py-16 sm:px-6 lg:px-8 ${i % 2 === 1 ? "bg-parchment-alt" : "bg-white"}`}>
          <div className="mx-auto max-w-[1180px]">
            {section.eyebrow && <RecTag>{section.eyebrow}</RecTag>}
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">{section.title}</h2>
            {section.description && <p className="mt-3 mb-7 max-w-3xl text-sm leading-7 text-ink-soft">{section.description}</p>}
            {section.body?.map((p, pi) => <p key={pi} className="mb-4 max-w-4xl text-sm leading-7 text-ink-soft">{p}</p>)}
            {section.cards?.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.cards.map((c) => (
                  <div key={c.title} className="border border-line-light bg-white p-5">
                    <h3 className="text-base font-semibold tracking-tight text-ink">{c.title}</h3>
                    {c.description && <p className="mt-2 text-sm leading-6 text-ink-soft">{c.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {lf.cta && (
        <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 border border-line-light bg-white p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <RecTag>{lf.cta.eyebrow}</RecTag>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">{lf.cta.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{lf.cta.description}</p>
            </div>
            <Link href={lf.cta.href ?? "/contact"} className="inline-flex items-center justify-center border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red">
              {lf.cta.label} <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
