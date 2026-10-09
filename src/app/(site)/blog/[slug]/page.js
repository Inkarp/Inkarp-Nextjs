import { notFound } from"next/navigation";
import BlogDetailsPage from"@/components/blogs/BlogDetailsPage";
import { BreadcrumbJsonLd } from"@/components/common/PageBreadcrumbs";
import { getPostBySlug, posts } from"@/data/blogs";
import { buildDynamicMetadata, getCanonicalUrl, SITE_PUBLISHER, SITE_URL } from"@/data/pageSeo";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title:"Blog - Inkarp Instruments" };
  }

  return buildDynamicMetadata({
    path: `/blog/${post.slug}`,
    title: `${post.title} - Inkarp Instruments`,
    description: post.excerpt,
    keywords: post.tags?.join(", "),
    image: post.image,
    imageAlt: post.title,
  });
}

// Article details for search engines: headline, date, author and image.
function blogPostingJsonLd(post) {
  return {
    "@context":"https://schema.org",
    "@type":"BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(post.image ? { image: `${SITE_URL}${post.image}` } : {}),
    datePublished: post.date,
    author: { "@type":"Organization", name: post.author || SITE_PUBLISHER },
    publisher: { "@type":"Organization", name: SITE_PUBLISHER, url: SITE_URL },
    mainEntityOfPage: getCanonicalUrl(`/blog/${post.slug}`),
  };
}

export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { label:"Blog", href:"/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(post)) }}
        type="application/ld+json"
      />
      <BlogDetailsPage post={post} />
    </>
  );
}
