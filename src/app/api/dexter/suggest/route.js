import sitemap from "@/app/sitemap";
import { posts } from "@/data/blogs";
import { getAllProducts } from "@/data/products/principals";
import { closestPages } from "@/lib/dexter/didYouMean";

// Dexter's "did you mean" for the page-not-found screen: the real pages (every
// address in the sitemap) closest to the one that wasn't found.

const prettify = (segment) =>
  decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

let candidates = null;

async function getCandidates() {
  if (candidates) return candidates;
  const titles = new Map();
  getAllProducts().forEach((product) => titles.set(`/products/${product.slug}`, product.name));
  posts.forEach((post) => titles.set(`/blog/${post.slug}`, post.title));

  const entries = await sitemap();
  candidates = entries
    .map((entry) => {
      const path = new URL(entry.url).pathname.replace(/\/$/, "") || "/";
      const last = path.split("/").filter(Boolean).pop() ?? "";
      return { href: path, title: titles.get(path) ?? (last ? prettify(last) : "Home") };
    })
    .filter((page) => page.href !== "/");
  return candidates;
}

export async function GET(request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!path || path.length > 300) return Response.json({ pages: [] });
  const pages = closestPages(path, await getCandidates(), 3).map(({ href, title }) => ({ href, title }));
  return Response.json({ pages });
}
