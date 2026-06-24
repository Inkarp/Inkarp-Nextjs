"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FiArrowRight, FiCalendar, FiClock, FiX } from "react-icons/fi";
import {
  categories,
  formatPostDate,
  getFeaturedPost,
  getPostsByCategory,
} from "@/data/blogs";

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);

  const featuredPost = getFeaturedPost();
  const gridPosts = useMemo(() => {
    const filtered = getPostsByCategory(activeCategory);
    return filtered.filter((post) => post.id !== featuredPost.id);
  }, [activeCategory, featuredPost.id]);

  const showFeatured =
    activeCategory === "All" || activeCategory === featuredPost.category;

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(230,57,70,0.08),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <span
            className="font-maxot inline-flex rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs font-semibold uppercase text-zinc-800 md:text-sm dark:bg-zinc-900 dark:text-zinc-100"
            data-reveal
          >
            From the Lab
          </span>
          <h1
            className="font-maxot mt-4 text-3xl font-bold leading-tight text-[#E63946] sm:text-4xl"
            data-reveal
          >
            Inkarp Blog
          </h1>
          <p
            className="mx-auto mt-3 max-w-2xl text-base text-zinc-700 sm:text-lg dark:text-zinc-300"
            data-reveal
          >
            Application notes, industry insights, and updates from our team —
            written for the people running the instruments.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex flex-wrap justify-center gap-2 pb-8"
          data-reveal
        >
          {categories.map((category) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-[#E63946] text-white shadow"
                  : "border border-zinc-200 text-zinc-600 hover:border-[#E63946]/60 hover:text-[#E63946] dark:border-zinc-700 dark:text-zinc-300"
              }`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        {showFeatured ? (
          <button
            className="group mb-10 grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white text-left shadow-sm transition hover:shadow-xl md:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-900"
            data-reveal
            onClick={() => setSelectedPost(featuredPost)}
            type="button"
          >
            <div className="relative h-56 md:h-full">
              <Image
                alt={featuredPost.title}
                className="object-cover transition duration-300 group-hover:scale-105"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                src={featuredPost.image}
              />
              <span className="absolute left-4 top-4 rounded-full bg-[#E63946] px-3 py-1 text-xs font-semibold uppercase text-white">
                Featured
              </span>
            </div>

            <div className="flex flex-col gap-3 p-6 sm:p-8">
              <span className="inline-flex w-fit rounded-full bg-[#E63946]/10 px-3 py-1 text-xs font-semibold uppercase text-[#E63946]">
                {featuredPost.category}
              </span>
              <h2 className="font-maxot text-xl leading-snug text-zinc-900 group-hover:text-[#E63946] sm:text-2xl dark:text-zinc-100">
                {featuredPost.title}
              </h2>
              <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                {featuredPost.excerpt}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="size-3.5" />
                  {formatPostDate(featuredPost.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock className="size-3.5" />
                  {featuredPost.readTime}
                </span>
              </div>
              <span className="font-maxot mt-2 inline-flex items-center gap-2 text-sm text-[#E63946]">
                Read article
                <FiArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </button>
        ) : null}

        {gridPosts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No posts in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <button
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                data-reveal
                key={post.id}
                onClick={() => setSelectedPost(post)}
                type="button"
              >
                <div className="relative h-44">
                  <Image
                    alt={post.title}
                    className="object-cover transition duration-300 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={post.image}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="inline-flex w-fit rounded-full bg-[#E63946]/10 px-3 py-1 text-xs font-semibold uppercase text-[#E63946]">
                    {post.category}
                  </span>
                  <h3 className="font-maxot line-clamp-2 text-base text-zinc-900 group-hover:text-[#E63946] dark:text-zinc-100">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                  <div className="mt-1 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="size-3.5" />
                      {formatPostDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock className="size-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedPost ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg dark:bg-zinc-900">
            <button
              aria-label="Close article"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-1.5 text-zinc-600 hover:text-black dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:text-white"
              onClick={() => setSelectedPost(null)}
              type="button"
            >
              <FiX className="size-5" />
            </button>

            <div className="relative h-56">
              <Image
                alt={selectedPost.title}
                className="object-cover"
                fill
                sizes="100vw"
                src={selectedPost.image}
              />
            </div>

            <div className="p-6 sm:p-8">
              <span className="inline-flex w-fit rounded-full bg-[#E63946]/10 px-3 py-1 text-xs font-semibold uppercase text-[#E63946]">
                {selectedPost.category}
              </span>
              <h2 className="font-maxot mt-3 text-xl leading-snug text-zinc-900 sm:text-2xl dark:text-zinc-100">
                {selectedPost.title}
              </h2>
              <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <span>{selectedPost.author}</span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="size-3.5" />
                  {formatPostDate(selectedPost.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock className="size-3.5" />
                  {selectedPost.readTime}
                </span>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {selectedPost.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
