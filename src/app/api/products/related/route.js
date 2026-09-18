import { getAllProducts } from "@/data/products/principals";

// Same-category product lookup, shared by the product page's "Compare with
// similar products" picker and the /compare page's "Add another product"
// picker — both need siblings in one category, never the whole catalog.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return Response.json(
      { success: false, message: "category is required" },
      { status: 400 }
    );
  }

  const exclude = new Set(
    (searchParams.get("exclude") ?? "").split(",").filter(Boolean)
  );

  const data = getAllProducts()
    .filter(
      (product) =>
        product.category === category &&
        !exclude.has(`${product.principalSlug}:${product.slug}`)
    )
    .map((product) => ({
      slug: product.slug,
      principalSlug: product.principalSlug,
      principalName: product.principalName,
      name: product.name,
      image: product.image,
      imageAlt: product.imageAlt,
      category: product.category,
      apiPath: product.apiPath,
    }));

  return Response.json({ success: true, count: data.length, data });
}
