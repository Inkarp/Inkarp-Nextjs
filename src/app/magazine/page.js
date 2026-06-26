import CatalystPage from "@/components/catalystcue/CatalystPage";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/magazine");

export default function CatalystCue() {
  return (
    <>
      <BreadcrumbJsonLd path="/magazine" />
      <PageBreadcrumbs path="/magazine" />
      <CatalystPage />
    </>
  );
}
