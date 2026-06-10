import Link from "next/link";
import {
  getAllProducts,
  getProductFilterOptions,
  searchProducts,
} from "@/data/products/principals";
import ProductFilterForm from "@/components/products/ProductFilterForm";
import ProductSearchBox from "@/components/products/ProductSearchBox";

export const metadata = {
  title: "Products - Inkarp Instruments Pvt Ltd",
  description:
    "Search and filter Inkarp products by principal, country of origin, industry, application, group, and product details.",
};

function getParam(searchParams, key) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value ?? "";
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    q: getParam(params, "q"),
    principal: getParam(params, "principal"),
    country: getParam(params, "country"),
    industry: getParam(params, "industry"),
    application: getParam(params, "application"),
    group: getParam(params, "group"),
    details: getParam(params, "details") === "true",
  };
  const options = getProductFilterOptions();
  const allProducts = getAllProducts();
  const products = searchProducts(filters);

  return (
    <main className="bg-white">
      <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-maxot text-sm font-semibold uppercase text-[#BE0010]">
            Products
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-maxot text-4xl font-bold text-zinc-950 sm:text-5xl">
                Explore Inkarp products
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
                Search products by principal, country of origin, industry,
                application, product manager, and available product details.
              </p>
            </div>
            <p className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700">
              {products.length} products found
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3">
              <span className="font-maxot text-xl font-bold text-zinc-950">
                Search products
              </span>
              <ProductSearchBox
                defaultValue={filters.q}
                products={allProducts}
              />
            </div>
          </div>

          <ProductFilterForm filters={filters} options={options} />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {products.map((product) => (
              <article
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-[#BE0010]/40 hover:shadow-md"
                key={`${product.principalSlug}-${product.slug}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#BE0010]">
                      {product.principalName}
                    </p>
                    <h2 className="font-maxot mt-2 text-2xl font-bold text-zinc-950">
                      <Link
                        className="hover:text-[#BE0010]"
                        href={product.href}
                      >
                        {product.name}
                      </Link>
                    </h2>
                  </div>
                  <span className="rounded-md bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    {product.countryOfOrigin || "Country not listed"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-zinc-950">
                      Industry:
                    </span>{" "}
                    {product.industry}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-950">Group:</span>{" "}
                    {product.group || "Not grouped"}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-950">
                      Manager:
                    </span>{" "}
                    {product.productManager || "Not listed"}
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-950">
                      Details:
                    </span>{" "}
                    {product.hasDetails ? "Complete page available" : "Basic listing"}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-zinc-950">
                    Applications
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(product.applications ?? []).map((application) => (
                      <span
                        className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600"
                        key={application}
                      >
                        {application}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-[#BE0010]"
                    href={product.href}
                  >
                    View Product
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:border-[#BE0010] hover:text-[#BE0010]"
                    href={product.apiPath}
                  >
                    API Data
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-zinc-300 p-8 text-center">
              <h2 className="font-maxot text-2xl font-bold text-zinc-950">
                No products found
              </h2>
              <p className="mt-2 text-zinc-600">
                Try changing the search text or removing one of the filters.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
