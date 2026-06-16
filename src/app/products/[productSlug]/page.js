import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiArrowRight, FiChevronRight, FiGlobe } from "react-icons/fi";
import { getAllProducts, getProductBySlug } from "@/data/products/principals";
import ProductActionButtons from "@/components/products/ProductActionButtons";
import ProductTabs from "@/components/products/ProductTabs";

export async function generateMetadata({ params }) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);

  if (!product) {
    return {
      title: "Product Not Found - Inkarp",
    };
  }

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

  if (!product) {
    notFound();
  }

  const relatedProducts = getAllProducts()
    .filter(
      (item) =>
        item.category === product.category && item.slug !== product.slug
    )
    .slice(0, 8);

  return (
    <main className="bg-white">
      <nav className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <Link className="transition hover:text-[#BE0010]" href="/">
            Home
          </Link>
          <FiChevronRight className="text-zinc-400" />
          <Link className="transition hover:text-[#BE0010]" href="/products">
            Products
          </Link>
          <FiChevronRight className="text-zinc-400" />
          <span className="truncate text-zinc-900">{product.name}</span>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#BE0010]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[#BE0010]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-1.5 shadow-sm">
              <Image
                alt={product.principalName}
                className="h-6 w-auto object-contain"
                height={24}
                src={product.principalImage}
                width={90}
              />
              {product.countryOfOrigin ? (
                <>
                  <span className="h-3 w-px bg-zinc-200" />
                  <span className="flex items-center gap-1 text-xs font-medium text-zinc-500">
                    <FiGlobe className="text-[#BE0010]" />
                    {product.countryOfOrigin}
                  </span>
                </>
              ) : null}
            </div>

            <h1 className="font-maxot relative mt-5 text-3xl leading-tight text-zinc-950 sm:text-4xl">
              <span className="absolute -left-4 top-1 hidden h-8 w-1.5 rounded-full bg-[#BE0010] sm:block" />
              {product.name}
            </h1>

            {product.industry ? (
              <p className="mt-2 inline-flex items-center rounded-full bg-[#BE0010]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#BE0010]">
                {product.industry}
              </p>
            ) : null}

            <div className="mt-8">
              <ProductActionButtons
                productName={product.name}
                productPath={product.href}
              />
            </div>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              {product.overview}
            </p>
          </div>

          <div className="relative rounded-2xl bg-gradient-to-br from-[#BE0010]/25 via-zinc-200 to-transparent p-[2px] shadow-xl shadow-zinc-900/5">
            <div className="aspect-square w-full overflow-hidden rounded-[calc(theme(borderRadius.2xl)-2px)] bg-white">
              {product.image ? (
                <Image
                  alt={product.name}
                  className="h-full w-full object-contain p-5 transition duration-500 hover:scale-105"
                  height={600}
                  src={product.image}
                  width={600}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                  Product image coming soon
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-maxot text-2xl font-bold text-zinc-950">
            Product Details
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Specifications, key features, applications and answers to common
            questions.
          </p>

          <div className="mt-6">
            <ProductTabs
              applications={product.applications}
              faqs={product.faqs}
              features={product.features}
              technicalSpecs={product.technicalSpecs}
            />
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-maxot text-2xl font-bold text-zinc-950">
              Related Products
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Explore alternative models and related solutions from other
              categories.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <article
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#BE0010]/40 hover:shadow-lg"
                  key={`${item.principalSlug}-${item.slug}`}
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
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="font-maxot mt-3 text-sm font-bold text-zinc-950">
                    {item.name}
                  </h3>
                  <Link
                    className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-950 text-xs font-semibold text-white transition hover:bg-[#BE0010]"
                    href={item.href}
                  >
                    View details
                    <FiArrowRight className="transition group-hover:translate-x-0.5" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
