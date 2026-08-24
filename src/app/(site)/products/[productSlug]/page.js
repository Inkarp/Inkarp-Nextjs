import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiArrowRight, FiCheck, FiChevronRight, FiGlobe, FiMail, FiShield } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import * as CountryFlagIcons from "country-flag-icons/react/3x2";
import RecTag from "@/components/home/RecTag";
import { getAllProducts, getProductBySlug } from "@/data/products/principals";
import { getCountryFlagCodes } from "@/data/products/countryFlags";
import { buildDynamicMetadata } from "@/data/pageSeo";
import UniversalProductPage from "@/components/products/UniversalProductPage";
import CustomerReviews from "@/components/products/sections/CustomerReviews";
import TechnicalSpecsTable from "@/components/products/TechnicalSpecsTable";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductImageZoom from "@/components/products/ProductImageZoom";

const PRODUCT_DISTRIBUTOR_NOTE = "Authorized Distributor & Service Provider in India";

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
  const servicePills = DEFAULT_PRODUCT_SERVICE_PILLS;
  const countryFlagCodes = getCountryFlagCodes(product.countryOfOrigin);
  // `overview` is a plain string on most products, but a { body: [...] } object
  // on the newer flat-schema Mettler Toledo pages — guard against both shapes.
  const overviewIsString = typeof product.overview === "string";
  const heroLead =
    product.longForm?.heroLead ??
    (overviewIsString ? product.overview : product.subhead) ??
    "";
  const ctaHref = isRichPage ? "#booking" : "/contact";
  const heroHookMatch = overviewIsString
    ? product.overview.match(/^(.*?)(?=\s+(?:The Hei-FLOW|The Heidolph)\b)/)
    : null;
  const heroHook = product.longForm?.heroHook ?? heroHookMatch?.[1]?.trim();
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
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[7.6fr_2.4fr] lg:items-center">
          <div>
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
                product.manufacturerUrl ? (
                  <a
                    href={product.manufacturerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View ${product.name} on the ${product.principalName} website`}
                    className="border border-line-light bg-parchment-alt px-3 py-2 text-xs font-semibold text-ink-soft"
                  >
                    {product.category}
                  </a>
                ) : (
                  <span className="border border-line-light bg-parchment-alt px-3 py-2 text-xs font-semibold text-ink-soft">
                    {product.category}
                  </span>
                )
              )}

              {product.countryOfOrigin && (
                <span className="inline-flex items-center gap-1.5 border border-line-light bg-parchment-alt px-3 py-2 text-xs font-semibold text-ink-soft">
                  {countryFlagCodes.length > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      {countryFlagCodes.map((code) => {
                        const FlagIcon = CountryFlagIcons[code];
                        return FlagIcon ? (
                          <FlagIcon key={code} className="h-3 w-4 shrink-0 rounded-[1px]" title={code} />
                        ) : null;
                      })}
                    </span>
                  ) : (
                    <FiGlobe className="h-3.5 w-3.5 text-red" />
                  )}
                  Made in {product.countryOfOrigin}
                </span>
              )}
            </div>

            <h1 className=" text-2xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-[32px] lg:text-[34px]">
              {product.name}
            </h1>
            <h2 className="mt-4 inline-flex items-center gap-2 rounded-full border border-red/30 bg-red/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red">
              <FiShield className="h-4 w-4 shrink-0" aria-hidden="true" />
              {PRODUCT_DISTRIBUTOR_NOTE}
            </h2>

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
            {showHeroHook ? (
              <p className="mt-5 text-lg font-normal leading-7 tracking-tight text-ink sm:text-xl">
                {heroHook}
              </p>
            ) : null}
            <p className="mt-5 text-sm leading-6 text-ink-soft sm:text-base">
              {heroLead}
            </p>
          </div>

          <div className="relative self-center border border-line-light bg-parchment-alt p-3.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            {product.images?.length > 0 ? (
              <ProductImageGallery ctaHref={ctaHref} images={product.images} productName={product.name} />
            ) : (
              <>
                <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden border border-line-light bg-white sm:min-h-[320px] lg:min-h-[260px]">
                  {product.image ? (
                    <Image
                      alt={product.imageAlt ?? product.name}
                      className="mx-auto max-h-[380px] w-full object-contain p-5 transition duration-500 hover:scale-105"
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
                  <ProductImageZoom alt={product.imageAlt ?? product.name} src={product.image} />
                </div>
                <ProductImageActions href={ctaHref} />
              </>
            )}
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

function ProductImageActions({ href }) {
  return (
    <div className="mt-4 space-y-2.5">
      <Link
        href={href}
        className="inline-flex h-12 w-full items-center justify-center border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
      >
        Request Quote
      </Link>
    </div>
  );
}

function LegacyProductContent({ product }) {
  const lf = product.longForm;
  const sections = lf?.sections ?? [];
  const rawApplications = product.processApplication ? [product.processApplication] : product.applications ?? [];
  const applications = rawApplications
    .map((application) => {
      if (application && typeof application === "object") {
        return application.title || application.name || application.label || application.description || "";
      }

      return application;
    })
    .filter(Boolean);

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

      {applications.length > 0 && (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <RecTag>Applications</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">Where this product fits.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((application) => (
                <div key={application} className="flex items-start gap-3 border border-line-light bg-parchment p-4">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center bg-red/8 text-red">
                    <FiCheck className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-semibold leading-6 text-ink">{application}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.map((section, i) => (
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

      {lf?.cta && (
        <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 border border-line-light bg-white p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <RecTag>{lf.cta.eyebrow}</RecTag>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">{lf.cta.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{lf.cta.description}</p>
            </div>
            <Link href={lf.cta.href ?? "/contact"} className="inline-flex items-center justify-center border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
              {lf.cta.label} <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
