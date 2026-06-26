import WebinarsPage from "@/components/webinars/WebinarsPage";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/webinars");

export default function Webinars() {
  return (
    <>
      <BreadcrumbJsonLd path="/webinars" />
      <PageBreadcrumbs path="/webinars" />
      <WebinarsPage />
    </>
  );
}
