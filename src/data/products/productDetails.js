export const productDetails = [];

export function getProductDetailBySlug(productSlug) {
  return productDetails.find((product) => product.slug === productSlug);
}

export function getProductDetailByPrincipalAndSlug(principalSlug, productSlug) {
  return productDetails.find(
    (product) =>
      product.principalSlug === principalSlug && product.slug === productSlug
  );
}
