import AwardsRecognition from "@/components/about/AwardsRecognition";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/awards");

export default function AwardsAndRecognitionsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/awards" />
      <PageBreadcrumbs path="/awards" />
      <AwardsRecognition />
    </>
  );
}
