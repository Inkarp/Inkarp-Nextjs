import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products/principals";

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

  return (
    <main className="bg-white">
      <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-maxot text-sm font-semibold uppercase text-[#BE0010]">
            {product.principalName}
          </p>
          <h1 className="font-maxot mt-4 max-w-4xl text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
            {product.overview}
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="font-maxot text-2xl font-bold text-zinc-950">
              Features
            </h2>
            <ul className="mt-5 grid gap-3 text-zinc-700">
              {(product.features ?? []).map((feature) => (
                <li
                  className="rounded-md border border-zinc-200 bg-white p-4"
                  key={feature}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-maxot text-2xl font-bold text-zinc-950">
              Technical Specs
            </h2>
            <dl className="mt-5 divide-y divide-zinc-200 rounded-md border border-zinc-200">
              {(product.technicalSpecs ?? []).map((spec) => (
                <div className="grid gap-1 p-4 sm:grid-cols-2" key={spec.label}>
                  <dt className="font-semibold text-zinc-950">{spec.label}</dt>
                  <dd className="text-zinc-600">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-maxot text-2xl font-bold text-zinc-950">
              Applications
            </h2>
            <ul className="mt-5 space-y-3 text-zinc-700">
              {(product.applications ?? []).map((application) => (
                <li key={application}>{application}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-maxot text-2xl font-bold text-zinc-950">
              Case Studies
            </h2>
            <div className="mt-5 space-y-4">
              {(product.caseStudies ?? []).map((caseStudy) => (
                <article
                  className="rounded-md border border-zinc-200 bg-white p-5"
                  key={caseStudy.title}
                >
                  <h3 className="font-semibold text-zinc-950">
                    {caseStudy.title}
                  </h3>
                  <p className="mt-2 leading-7 text-zinc-600">
                    {caseStudy.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
