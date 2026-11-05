import { notFound } from "next/navigation";
import OrbitHero from "@/components/products/catalog/OrbitHero";
import ProductsCatalogBody from "@/components/products/catalog/ProductsCatalogBody";
import WallHero from "@/components/products/catalog/WallHero";
import PageBreadcrumbs from "@/components/common/PageBreadcrumbs";
import { getCatalogHeroData, getProductsCatalogData } from "@/lib/productsCatalogPage";

// The /products page with a new hero, for choosing one: /products-preview/wall
// and /products-preview/orbit. Everything under the hero is the live page's
// (search, filters, results). Not linked anywhere and kept out of search;
// /products itself is unchanged.
const HEROES = { wall: WallHero, orbit: OrbitHero };

export const metadata = {
  title: "Products page preview | Inkarp",
  description: "Preview of a new hero for the Inkarp products page.",
  robots: { index: false, follow: false },
};

export default async function ProductsHeroPreview({ params, searchParams }) {
  const { variant } = await params;
  const Hero = HEROES[variant];
  if (!Hero) notFound();

  const data = getProductsCatalogData(await searchParams);
  const hero = getCatalogHeroData(data.allProducts, data.brandOptions);

  return (
    <main className="min-h-screen bg-white text-ink" data-scroll-skip>
      <PageBreadcrumbs path="/products" />
      <Hero basePath={`/products-preview/${variant}`} hero={hero} />
      <ProductsCatalogBody {...data} />
    </main>
  );
}
