"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiArrowRight, FiCalendar, FiChevronLeft, FiChevronRight, FiUser } from "react-icons/fi";
import {
  categories,
  formatPostDate,
  getPostsByCategory,
} from "@/data/blogs";

function BlogCard({ post }) {
  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      href={`/blog/${post.slug}`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          alt={post.title}
          className="object-cover transition duration-500 ease-out group-hover:scale-110"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={post.image}
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#E63946] px-3 py-1 text-xs font-semibold uppercase text-white">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <FiUser className="size-3.5" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <FiCalendar className="size-3.5" />
            {formatPostDate(post.date)}
          </span>
        </div>

        <h3 className="font-maxot line-clamp-2 text-lg leading-snug text-zinc-900 transition group-hover:text-[#E63946] dark:text-zinc-100">
          {post.title}
        </h3>

        <p className="line-clamp-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
          {post.excerpt}
        </p>

        <span className="font-maxot mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#BE0010]">
          Read More
          <FiArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const scrollRef = useRef(null);

  const filteredPosts = useMemo(
    () => getPostsByCategory(activeCategory),
    [activeCategory]
  );

  const scrollByCard = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.querySelector("[data-card]");
    const cardWidth = card ? card.getBoundingClientRect().width + 24 : 320;
    container.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

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

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 pb-10" data-reveal>
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

        {filteredPosts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No posts in this category yet.
          </p>
        ) : (
          <div className="relative" data-reveal>
            <div
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              ref={scrollRef}
            >
              {filteredPosts.map((post) => (
                <div
                  className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[calc((100%-3rem)/3)]"
                  data-card
                  key={post.id}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            <button
              aria-label="Previous posts"
              className="absolute -left-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-md transition hover:border-[#E63946]/50 hover:text-[#E63946] sm:flex dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              onClick={() => scrollByCard(-1)}
              type="button"
            >
              <FiChevronLeft className="size-5" />
            </button>
            <button
              aria-label="Next posts"
              className="absolute -right-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-md transition hover:border-[#E63946]/50 hover:text-[#E63946] sm:flex dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              onClick={() => scrollByCard(1)}
              type="button"
            >
              <FiChevronRight className="size-5" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
