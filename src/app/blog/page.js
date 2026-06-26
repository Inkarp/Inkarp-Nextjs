import { Suspense } from "react";
import BlogsPage from "@/components/blogs/BlogsPage";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/blog");

export default function Blogs() {
  return (
    <>
      <BreadcrumbJsonLd path="/blog" />
      <PageBreadcrumbs path="/blog" />
      <Suspense fallback={null}>
        <BlogsPage />
      </Suspense>
    </>
  );
}
