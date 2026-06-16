import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaGem } from "react-icons/fa";
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
          <Link className="hover:text-[#BE0010]" href="/">
            Home
          </Link>
          <span>/</span>
          <Link className="hover:text-[#BE0010]" href="/products">
            Products
          </Link>
          <span>/</span>
          <span className="text-zinc-900">{product.name}</span>
        </div>
      </nav>

      <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="aspect-square w-full overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {product.image ? (
              <Image
                alt={product.name}
                className="h-full w-full object-contain"
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

          <div>
            <p className="font-maxot text-sm font-semibold uppercase text-[#BE0010]">
              {product.principalName}
            </p>
            <h1 className="font-maxot mt-4 text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              {product.overview}
            </p>

            <div className="mt-8">
              <ProductActionButtons
                productName={product.name}
                productPath={product.href}
              />
            </div>

            {/* <div className="mt-8 flex items-center gap-3 rounded-lg border border-[#BE0010]/30 bg-[#BE0010]/5 p-4">
              <FaGem className="shrink-0 text-xl text-[#BE0010]" />
              <p className="text-sm font-semibold text-zinc-900">
                Be Our Exclusive Partner!
              </p>
            </div> */}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductTabs
            applications={product.applications}
            faqs={product.faqs}
            features={product.features}
            technicalSpecs={product.technicalSpecs}
          />
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
                  className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                  key={`${item.principalSlug}-${item.slug}`}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-50">
                    {item.image ? (
                      <Image
                        alt={item.name}
                        className="h-full w-full object-contain"
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
                    className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-zinc-950 text-xs font-semibold text-white transition hover:bg-[#BE0010]"
                    href={item.href}
                  >
                    View details
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
