"use client";

import { useEffect, useMemo, useRef, useState } from"react";
import Image from"next/image";
import Link from"next/link";
import { useSearchParams } from"next/navigation";
import { FiArrowRight, FiCalendar, FiUser } from"react-icons/fi";
import {
  categories,
  formatPostDate,
  getPostsByCategory,
} from"@/data/blogs";

const PAGE_SIZE = 10;

function BlogCard({ post }) {
  // Most covers are catalogue product shots on a white background. Cropping
  // those with object-cover cuts the instrument off, so they are contained on a
  // tinted panel instead; editorial photos still fill the frame.
  const isProductShot = post.image?.includes("/productImages/");

  return (
    <Link
      className="group flex h-full flex-col overflow-hidden border border-line-light bg-parchment transition hover:-translate-y-1 hover:border-red/35"
      href={`/blog/${post.slug}`}
    >
      {/* No category badge — every post is Industry Insights, so the chip
          carried no information. Posts without a cover simply skip the frame. */}
      {post.image ? (
        <div
          className={`relative h-48 overflow-hidden border-b border-line-light ${
            isProductShot ? "bg-white" : ""
          }`}
        >
          {/* Inner wrapper does the insetting — `fill` resolves against the
              padding box, so padding on the parent would not move the image. */}
          <div className={`absolute ${isProductShot ? "inset-4" : "inset-0"}`}>
            <Image
              alt={post.title}
              className={`transition duration-500 ease-out group-hover:scale-105 ${
                isProductShot ? "object-contain" : "object-cover"
              }`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={post.image}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <FiUser className="size-3.5" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <FiCalendar className="size-3.5" />
            {formatPostDate(post.date)}
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg leading-snug text-ink transition group-hover:text-red">
          {post.title}
        </h3>

        <p className="line-clamp-2 flex-1 text-sm text-ink-soft">
          {post.excerpt}
        </p>

        <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-red">
          Read More
          <FiArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ||"All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [renderedCategory, setRenderedCategory] = useState(initialCategory);
  const loadMoreRef = useRef(null);

  const filteredPosts = useMemo(
    () => getPostsByCategory(activeCategory),
    [activeCategory]
  );

  if (activeCategory !== renderedCategory) {
    setRenderedCategory(activeCategory);
    setVisibleCount(PAGE_SIZE);
  }

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  useEffect(() => {
    if (!hasMore) return;
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => count + PAGE_SIZE);
        }
      },
      { rootMargin:"200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <main className="overflow-hidden">

      <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 pb-10" data-reveal>
          {categories.map((category) => (
            <button
              className={`px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ?"bg-red text-parchment"
                  :"border border-line-light text-ink-soft hover:border-red/60 hover:text-red"
              }`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <p className="border border-dashed border-line-light px-4 py-10 text-center text-sm text-ink-soft">
            No posts in this category yet.
          </p>
        ) : (
          <div data-reveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-10" ref={loadMoreRef}>
                <div className="size-8 animate-spin border-2 border-line-light border-t-red" />
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
