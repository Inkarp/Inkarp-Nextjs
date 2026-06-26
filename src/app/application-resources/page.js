import ApplicationResourcesClient from "@/components/catalystcue/ApplicationResourcesClient";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/application-resources");

export default function ApplicationResourcesPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/application-resources" />
      <PageBreadcrumbs path="/application-resources" />
      <ApplicationResourcesClient />
    </>
  );
}
