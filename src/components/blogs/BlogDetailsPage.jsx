"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiFolder,
  FiMessageCircle,
  FiTag,
  FiUser,
} from "react-icons/fi";
import {
  formatPostDate,
  getCategoryCounts,
  getAllTags,
  getRecentPosts,
} from "@/data/blogs";

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TextSection({ section }) {
  return (
    <div className="space-y-3">
      {section.heading ? (
        <h2 className="font-maxot text-xl font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
          {section.heading}
        </h2>
      ) : null}
      <div className="space-y-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
        {section.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function ImageSection({ section }) {
  return (
    <figure>
      <div className="relative h-56 overflow-hidden rounded-2xl bg-zinc-100 sm:h-72 dark:bg-zinc-800">
        <Image
          alt={section.caption || "Blog figure"}
          className="object-contain"
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          src={section.imageUrl}
        />
      </div>
      {section.caption ? (
        <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function TableSection({ section }) {
  return (
    <figure>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[480px] text-left text-sm">
          {section.columns ? (
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                {section.columns.map((column, index) => (
                  <th
                    className="whitespace-nowrap px-4 py-3 font-maxot font-semibold text-zinc-800 dark:text-zinc-200"
                    key={index}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {section.rows.map((row, rowIndex) => (
              <tr
                className="border-t border-zinc-200 dark:border-zinc-800"
                key={rowIndex}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    className="px-4 py-3 text-zinc-600 dark:text-zinc-400"
                    key={cellIndex}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {section.caption ? (
        <figcaption className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Section({ section, index }) {
  if (section.type === "image") {
    return <ImageSection section={section} />;
  }
  if (section.type === "table") {
    return <TableSection section={section} />;
  }
  return <TextSection section={section} />;
}

export default function BlogDetailsPage({ post }) {
  const recentPosts = getRecentPosts(post.slug, 4);
  const categoryCounts = getCategoryCounts();
  const tags = getAllTags();

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(230,57,70,0.08),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <span className="inline-flex rounded-full bg-[#E63946]/10 px-3 py-1 text-xs font-semibold uppercase text-[#E63946]">
            {post.category}
          </span>
          <h1 className="font-maxot mx-auto mt-4 max-w-3xl text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Link className="hover:text-[#E63946]" href="/">
              Home
            </Link>
            <span>/</span>
            <Link className="hover:text-[#E63946]" href="/blog">
              Blog
            </Link>
            <span>/</span>
            <span className="text-zinc-700 dark:text-zinc-300">{post.title}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          <article>
            <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
              <Image
                alt={post.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                src={post.image}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <FiUser className="size-4 text-[#E63946]" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <FiCalendar className="size-4 text-[#E63946]" />
                {formatPostDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <FiMessageCircle className="size-4 text-[#E63946]" />
                {post.comments.length} Comments
              </span>
            </div>

            <div className="mt-5 space-y-6">
              {post.sections.map((section, index) => (
                <Section index={index} key={index} section={section} />
              ))}
            </div>

            {post.tags?.length ? (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <span className="font-maxot flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  <FiTag className="size-4" />
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:border-[#E63946]/60 hover:text-[#E63946] dark:border-zinc-700 dark:text-zinc-300"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <h2 className="font-maxot text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {post.comments.length} Comments
              </h2>

              <div className="mt-5 space-y-6">
                {post.comments.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Be the first to comment on this article.
                  </p>
                ) : (
                  post.comments.map((comment) => (
                    <div className="flex gap-4" key={comment.id}>
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E63946]/10 text-sm font-semibold text-[#E63946]">
                        {initials(comment.name)}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-maxot text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {comment.name}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {formatPostDate(comment.date)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <h2 className="font-maxot text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Leave a Comment
              </h2>
              <form className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#E63946] dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="Your Name"
                  type="text"
                />
                <input
                  className="rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#E63946] dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="Your Email"
                  type="email"
                />
                <textarea
                  className="col-span-1 rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#E63946] sm:col-span-2 dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="Your Message"
                  rows={4}
                />
                <button
                  className="font-maxot col-span-1 w-fit rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#BE0010] sm:col-span-2"
                  type="button"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </article>

          <aside className="space-y-8">
            <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <h3 className="font-maxot mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Recent Posts
              </h3>
              <div className="space-y-4">
                {recentPosts.map((recent) => (
                  <Link
                    className="group flex items-center gap-3"
                    href={`/blog/${recent.slug}`}
                    key={recent.id}
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        alt={recent.title}
                        className="object-cover transition duration-300 group-hover:scale-110"
                        fill
                        sizes="64px"
                        src={recent.image}
                      />
                    </span>
                    <div>
                      <p className="font-maxot line-clamp-2 text-sm font-medium text-zinc-800 transition group-hover:text-[#E63946] dark:text-zinc-200">
                        {recent.title}
                      </p>
                      <span className="text-xs text-zinc-400">
                        {formatPostDate(recent.date)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <h3 className="font-maxot mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Categories
              </h3>
              <ul className="space-y-1">
                {categoryCounts.map(({ category, count }) => (
                  <li key={category}>
                    <Link
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-[#E63946]/10 hover:text-[#E63946] dark:text-zinc-300"
                      href={`/blog?category=${encodeURIComponent(category)}`}
                    >
                      <span className="flex items-center gap-2">
                        <FiFolder className="size-3.5" />
                        {category}
                      </span>
                      <span className="text-xs text-zinc-400">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <h3 className="font-maxot mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-[#E63946]/60 hover:bg-[#E63946]/10 hover:text-[#E63946] dark:border-zinc-700 dark:text-zinc-300"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
