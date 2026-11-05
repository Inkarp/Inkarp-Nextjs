import ProductFilterForm from "@/components/products/ProductFilterForm";
import ProductResultsGrid from "@/components/products/ProductResultsGrid";
import StickyProductSearch from "@/components/products/StickyProductSearch";

/** Everything under the /products hero: the sticky search and filters, and the results. */
export default function ProductsCatalogBody({
  applicationOptions,
  brandOptions,
  filters,
  industryOptions,
  productCards,
  selectedApplications,
  selectedBrands,
  selectedIndustries,
  totalProducts,
}) {
  return (
    <>
        <StickyProductSearch>
          <ProductFilterForm
            key={`${filters.q}-${selectedBrands.join("|")}-${selectedIndustries.join("|")}-${selectedApplications.join("|")}`}
            applicationOptions={applicationOptions}
            brandOptions={brandOptions}
            industryOptions={industryOptions}
            productCount={productCards.length}
            query={filters.q}
            selectedApplications={selectedApplications}
            selectedBrands={selectedBrands}
            selectedIndustries={selectedIndustries}
            totalCount={totalProducts}
          />
        </StickyProductSearch>

        <section className="scroll-mt-32 bg-parchment-alt px-4 py-12 sm:px-6 lg:px-8" id="product-results">
          <div className="mx-auto max-w-[1180px]">
            <ProductResultsGrid
              key={`${filters.q}-${selectedBrands.join("|")}-${selectedIndustries.join("|")}-${selectedApplications.join("|")}`}
              // Picking a brand is a deliberate, narrow choice — show that
              // principal's full range at once rather than making the user page
              // through "Load more". Other filters keep the paged default.
              initialVisibleCount={selectedBrands.length ? productCards.length : undefined}
              products={productCards}
              query={filters.q}
            />
          </div>
        </section>
    </>
  );
}
