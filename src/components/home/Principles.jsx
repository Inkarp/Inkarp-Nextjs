import PrincipalsGlobe from "@/components/home/PrincipalsGlobe";
import { productPrincipals } from "@/data/products/principals";

/**
 * The globe only needs a name, a country and a slug per principal. Importing the
 * catalogue inside the client component pulled all 371 products' data into the
 * browser with it, so the list is trimmed here on the server instead.
 */
export default function Principles() {
  const principals = productPrincipals.map((principal) => ({
    principalName: principal.principalName,
    countryOfOrigin: principal.countryOfOrigin,
    slug: principal.slug,
  }));

  return <PrincipalsGlobe principals={principals} />;
}
