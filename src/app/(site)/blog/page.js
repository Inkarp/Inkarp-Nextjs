import BlogsPage from"@/components/blogs/BlogsPage";
import PageBreadcrumbs, { BreadcrumbJsonLd } from"@/components/common/PageBreadcrumbs";
import { categories } from"@/data/blogs";
import { buildPageMetadata } from"@/data/pageSeo";

export const metadata = buildPageMetadata("/blog");

// The category comes from the URL on the server (blog posts link to
// /blog?category=...), so the post list is in the HTML search engines read
// instead of appearing only after the browser runs the page.
export default async function Blogs({ searchParams }) {
  const { category } = await searchParams;
  const initialCategory = categories.includes(category) ? category :"All";

  return (
    <>
      <BreadcrumbJsonLd path="/blog" />
      <PageBreadcrumbs path="/blog" />
      <BlogsPage initialCategory={initialCategory} />
    </>
  );
}
