import BlogsPage from"@/components/blogs/BlogsPage";
import PageBreadcrumbs, { BreadcrumbJsonLd } from"@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from"@/data/pageSeo";

export const metadata = buildPageMetadata("/blog");

// One list of every post with a search box; there are no category tabs, so an
// old /blog?category=... link simply shows the full list.
export default function Blogs() {
  return (
    <>
      <BreadcrumbJsonLd path="/blog" />
      <PageBreadcrumbs path="/blog" tone="neutral" />
      <BlogsPage />
    </>
  );
}
