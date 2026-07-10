"use client";

import { useState } from"react";
import Image from"next/image";
import Link from"next/link";
import {
  FiCalendar,
  FiFolder,
  FiMessageCircle,
  FiTag,
  FiUser,
} from"react-icons/fi";
import {
  formatPostDate,
  getCategoryCounts,
  getAllTags,
  getRecentPosts,
} from"@/data/blogs";

function initials(name) {
  return name
    .split("")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TextSection({ section }) {
  return (
    <div className="space-y-3">
      {section.heading ? (
        <h2 className="text-xl font-semibold leading-snug text-ink">
          {section.heading}
        </h2>
      ) : null}
      <div className="space-y-4 text-base leading-7 text-ink-soft">
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
      <div className="relative h-56 overflow-hidden bg-parchment-alt sm:h-72">
        <Image
          alt={section.caption ||"Blog figure"}
          className="object-contain"
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          src={section.imageUrl}
        />
      </div>
      {section.caption ? (
        <figcaption className="mt-2 text-center text-sm text-ink-soft">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function TableSection({ section }) {
  return (
    <figure>
      <div className="overflow-x-auto border border-line-light">
        <table className="w-full min-w-[480px] text-left text-sm">
          {section.columns ? (
            <thead className="bg-parchment-alt">
              <tr>
                {section.columns.map((column, index) => (
                  <th
                    className="whitespace-nowrap px-4 py-3  font-semibold text-ink"
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
                className="border-t border-line-light"
                key={rowIndex}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    className="px-4 py-3 text-ink-soft"
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
        <figcaption className="mt-2 text-sm text-ink-soft">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function FaqSection({ section }) {
  return (
    <div className="space-y-3">
      {section.heading ? (
        <h2 className="text-xl font-semibold leading-snug text-ink">
          {section.heading}
        </h2>
      ) : null}
      <div className="space-y-2">
        {section.content.map((item, index) => (
          <details
            className="group border border-line-light px-4 py-3"
            key={index}
          >
            <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
              {item.q}
            </summary>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

function Section({ section, index }) {
  if (section.type ==="image") {
    return <ImageSection section={section} />;
  }
  if (section.type ==="table") {
    return <TableSection section={section} />;
  }
  if (section.type ==="faq") {
    return <FaqSection section={section} />;
  }
  return <TextSection section={section} />;
}

export default function BlogDetailsPage({ post }) {
  const [commentForm, setCommentForm] = useState({ name:"", email:"", message:"" });
  const [commentStatus, setCommentStatus] = useState({ type:"", message:"" });
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setCommentForm((current) => ({ ...current, [name]: value }));
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setCommentStatus({ type:"", message:"" });
    setIsCommentSubmitting(true);

    try {
      const response = await fetch("/api/forms", {
        body: JSON.stringify({
          formType:"blog-comment",
          ...commentForm,
          postTitle: post.title,
          postSlug: post.slug,
          pageUrl: window.location.href,
          referrer: document.referrer ||"",
        }),
        headers: { "Content-Type":"application/json" },
        method:"POST",
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setCommentStatus({ type:"success", message:"Comment submitted successfully." });
        setCommentForm({ name:"", email:"", message:"" });
      } else {
        setCommentStatus({
          type:"error",
          message: data?.message ||"Could not submit your comment. Please try again.",
        });
      }
    } catch {
      setCommentStatus({ type:"error", message:"Could not submit your comment. Please try again." });
    } finally {
      setIsCommentSubmitting(false);
    }
  };
  const recentPosts = getRecentPosts(post.slug, 4);
  const categoryCounts = getCategoryCounts();
  const tags = getAllTags();

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1180px] px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <span className="inline-flex bg-red/10 px-3 py-1 text-xs font-semibold uppercase text-red">
            {post.category}
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-soft">
            <Link className="hover:text-red" href="/">
              Home
            </Link>
            <span>/</span>
            <Link className="hover:text-red" href="/blog">
              Blog
            </Link>
            <span>/</span>
            <span className="text-ink-soft">{post.title}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          <article>
            <div className="relative h-64 overflow-hidden sm:h-80">
              <Image
                alt={post.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                src={post.image}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5">
                <FiUser className="size-4 text-red" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <FiCalendar className="size-4 text-red" />
                {formatPostDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <FiMessageCircle className="size-4 text-red" />
                {post.comments.length} Comments
              </span>
            </div>

            <div className="mt-5 space-y-6">
              {post.sections.map((section, index) => (
                <Section index={index} key={index} section={section} />
              ))}
            </div>

            {post.tags?.length ? (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line-light pt-6">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <FiTag className="size-4" />
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    className="border border-line-light px-3 py-1 text-xs font-medium text-ink-soft transition hover:border-red/60 hover:text-red"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-10 border-t border-line-light pt-8">
              <h2 className="text-xl font-semibold text-ink">
                {post.comments.length} Comments
              </h2>

              <div className="mt-5 space-y-6">
                {post.comments.length === 0 ? (
                  <p className="text-sm text-ink-soft">
                    Be the first to comment on this article.
                  </p>
                ) : (
                  post.comments.map((comment) => (
                    <div className="flex gap-4" key={comment.id}>
                      <span className="flex size-11 shrink-0 items-center justify-center bg-red/10 text-sm font-semibold text-red">
                        {initials(comment.name)}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-ink">
                            {comment.name}
                          </span>
                          <span className="text-xs text-ink-soft">
                            {formatPostDate(comment.date)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-soft">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-10 border-t border-line-light pt-8">
              <h2 className="text-xl font-semibold text-ink">
                Leave a Comment
              </h2>
              <form className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleCommentSubmit}>
                <input
                  className="border border-line-light px-4 py-3 text-sm outline-none transition focus:border-red"
                  name="name"
                  onChange={handleCommentChange}
                  placeholder="Your Name"
                  required
                  type="text"
                  value={commentForm.name}
                />
                <input
                  className="border border-line-light px-4 py-3 text-sm outline-none transition focus:border-red"
                  name="email"
                  onChange={handleCommentChange}
                  placeholder="Your Email"
                  required
                  type="email"
                  value={commentForm.email}
                />
                <textarea
                  className="col-span-1 border border-line-light px-4 py-3 text-sm outline-none transition focus:border-red sm:col-span-2"
                  name="message"
                  onChange={handleCommentChange}
                  placeholder="Your Message"
                  required
                  rows={4}
                  value={commentForm.message}
                />
                {commentStatus.message ? (
                  <div
                    className={`col-span-1 border px-4 py-3 text-sm sm:col-span-2 ${
                      commentStatus.type ==="success"
                        ?"border-green-200 bg-green-50 text-green-700"
                        :"border-red/20 bg-red/5 text-red"
                    }`}
                  >
                    {commentStatus.message}
                  </div>
                ) : null}
                <button
                  className="col-span-1 w-fit bg-red px-6 py-3 text-sm font-semibold text-parchment transition hover:bg-red disabled:opacity-70 sm:col-span-2"
                  disabled={isCommentSubmitting}
                  type="submit"
                >
                  {isCommentSubmitting ?"Posting..." :"Post Comment"}
                </button>
              </form>
            </div>
          </article>

          <aside className="space-y-8">
            <div className="border border-line-light p-5">
              <h3 className="mb-4 text-base font-semibold text-ink">
                Recent Posts
              </h3>
              <div className="space-y-4">
                {recentPosts.map((recent) => (
                  <Link
                    className="group flex items-center gap-3"
                    href={`/blog/${recent.slug}`}
                    key={recent.id}
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden">
                      <Image
                        alt={recent.title}
                        className="object-cover transition duration-300 group-hover:scale-110"
                        fill
                        sizes="64px"
                        src={recent.image}
                      />
                    </span>
                    <div>
                      <p className="line-clamp-2 text-sm font-medium text-ink transition group-hover:text-red">
                        {recent.title}
                      </p>
                      <span className="text-xs text-ink-soft">
                        {formatPostDate(recent.date)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border border-line-light p-5">
              <h3 className="mb-4 text-base font-semibold text-ink">
                Categories
              </h3>
              <ul className="space-y-1">
                {categoryCounts.map(({ category, count }) => (
                  <li key={category}>
                    <Link
                      className="flex items-center justify-between px-3 py-2 text-sm text-ink-soft transition hover:bg-red/10 hover:text-red"
                      href={`/blog?category=${encodeURIComponent(category)}`}
                    >
                      <span className="flex items-center gap-2">
                        <FiFolder className="size-3.5" />
                        {category}
                      </span>
                      <span className="text-xs text-ink-soft">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-line-light p-5">
              <h3 className="mb-4 text-base font-semibold text-ink">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    className="border border-line-light px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-red/60 hover:bg-red/10 hover:text-red"
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
