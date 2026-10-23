import { verifyDownloadToken } from "@/lib/catalogueDownload";
import { getProductBySlug } from "@/data/products/principals";
import { getProductCatalogue } from "@/data/productCatalogues";

export const runtime = "nodejs";

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  let verified;
  try {
    verified = verifyDownloadToken(token);
  } catch (error) {
    console.error("[catalogue/download]", error.message);
    return Response.json({ success: false, message: "Catalogue downloads are not configured." }, { status: 503 });
  }
  if (!verified) {
    return Response.json({ success: false, message: "This download link is invalid or has expired." }, { status: 401 });
  }

  const product = getProductBySlug(verified.productSlug);
  const catalogue = getProductCatalogue(product);
  if (!catalogue) {
    return Response.json({ success: false, message: "No catalogue is available for this product." }, { status: 404 });
  }

  return Response.redirect(new URL(catalogue.downloadUrl, request.url), 302);
}
