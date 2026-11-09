import ClassicCatalogHero from "@/components/products/catalog/ClassicCatalogHero";
import ProductsCatalogBody from "@/components/products/catalog/ProductsCatalogBody";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";
import { getProductsCatalogData } from "@/lib/productsCatalogPage";

export const metadata = buildPageMetadata("/products");

export default async function ProductsPage({ searchParams }) {
  const data = getProductsCatalogData(await searchParams);

  return (
    <main className="min-h-screen bg-white text-ink" data-scroll-skip>
      <BreadcrumbJsonLd path="/products" />
      <PageBreadcrumbs path="/products" />
      {/* The original hero, back on 9 Nov 2026 in place of the turning
          brand-logo rings (OrbitHero, still at /products-preview/orbit). */}
      <ClassicCatalogHero brandCount={data.brandOptions.length} totalProducts={data.totalProducts} />
      <ProductsCatalogBody {...data} />
    </main>
  );
}
