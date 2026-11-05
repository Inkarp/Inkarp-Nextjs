import OrbitHero from "@/components/products/catalog/OrbitHero";
import ProductsCatalogBody from "@/components/products/catalog/ProductsCatalogBody";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";
import { getCatalogHeroData, getProductsCatalogData } from "@/lib/productsCatalogPage";

export const metadata = buildPageMetadata("/products");

export default async function ProductsPage({ searchParams }) {
  const data = getProductsCatalogData(await searchParams);
  // The hero: every brand's logo on turning rings around the catalogue count
  // (chosen from the /products-preview pages, 5 Nov 2026).
  const hero = getCatalogHeroData(data.allProducts, data.brandOptions);

  return (
    <main className="min-h-screen bg-white text-ink" data-scroll-skip>
      <BreadcrumbJsonLd path="/products" />
      <PageBreadcrumbs path="/products" />
      <OrbitHero basePath="/products" hero={hero} />
      <ProductsCatalogBody {...data} />
    </main>
  );
}
