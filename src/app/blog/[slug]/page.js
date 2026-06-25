import { notFound } from "next/navigation";
import BlogDetailsPage from "@/components/blogs/BlogDetailsPage";
import { getPostBySlug, posts } from "@/data/blogs";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Blog - Inkarp Instruments" };
  }

  return {
    title: `${post.title} - Inkarp Instruments`,
    description: post.excerpt,
  };
}

export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailsPage post={post} />;
}
