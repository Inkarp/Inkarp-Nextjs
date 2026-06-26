import CareersPage from "@/components/careers/CareersPage";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/careers");

export default async function Careers() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <>
      <BreadcrumbJsonLd path="/careers" />
      <PageBreadcrumbs path="/careers" />
      <CareersPage />
    </>
  );
}
