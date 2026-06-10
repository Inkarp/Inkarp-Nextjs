import {
  getPrincipalBySlug,
  getProductByPrincipalAndSlug,
} from "@/data/products/principals";

export async function GET(request, { params }) {
  const { slug = [] } = await params;
  const [principalSlug, productSlug] = slug;

  if (!principalSlug) {
    return Response.json(
      { success: false, message: "Product API path is missing" },
      { status: 400 }
    );
  }

  if (principalSlug && productSlug) {
    const product = getProductByPrincipalAndSlug(principalSlug, productSlug);

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      type: "product",
      data: product,
    });
  }

  const principal = getPrincipalBySlug(principalSlug);

  if (!principal) {
    return Response.json(
      { success: false, message: "Principal not found" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    type: "principal",
    data: principal,
  });
}
