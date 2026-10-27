"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import { formatPostDate, posts, toParagraphs } from "@/data/blogs";
import { collectTracking } from "@/lib/browserTracking";
import SubmitButton from "@/components/common/SubmitButton";

const RELATED_COUNT = 3;

function isProductImage(src) {
  return src?.includes("/productImages/");
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Posts about the same instrument (same cover photo) or sharing topic tags come
// first; the newest posts fill any remaining places.
function getRelatedPosts(post, limit = RELATED_COUNT) {
  const ownTags = new Set((post.tags ?? []).map((tag) => tag.toLowerCase()));
  return posts
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({
      other,
      score:
        (post.image && other.image === post.image ? 3 : 0) +
        (other.tags ?? []).filter((tag) => ownTags.has(tag.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.other.date) - new Date(a.other.date))
    .slice(0, limit)
    .map(({ other }) => other);
}

function TextSection({ section, title }) {
  // A line that only repeats the post title (the H1 above) is left out.
  const paragraphs = toParagraphs(section.content).filter((paragraph) => paragraph !== title);
  if (!paragraphs.length && !section.heading) {
    return null;
  }
  return (
    <div className="space-y-4">
      {section.heading ? (
        <h2 className="pt-4 text-2xl font-semibold leading-snug tracking-tight text-slate-950">
          {section.heading}
        </h2>
      ) : null}
      <div className="space-y-5 text-[17px] leading-8 text-slate-700">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function ImageSection({ section }) {
  // Never render an empty frame for a figure with no image.
  if (!section.imageUrl) {
    return null;
  }

  return (
    <figure className="py-2">
      <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-white sm:h-80">
        <div className="absolute inset-3 sm:inset-5">
          <Image
            alt={section.caption || "Blog figure"}
            className="object-contain"
            fill
            sizes="(min-width: 768px) 880px, 100vw"
            src={section.imageUrl}
          />
        </div>
      </div>
      {section.caption ? (
        <figcaption className="mt-3 text-center text-sm leading-6 text-slate-500">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Tables imported from the old site lost their merged cells: a top header such as
// "Pipettes" sat over two columns ("Volume (mL)", "Relative % Error"), and a label
// like "Step" spanned two header rows. Rebuild that layout from the cell counts:
// the widest row sets the column count, the top headers share the columns, and a
// first row of headings becomes a second header row.
function tableLayout(section) {
  const columns = section.columns ?? [];
  const rows = section.rows ?? [];
  const width = Math.max(columns.length, ...rows.map((row) => row.length));
  if (!columns.length || (columns.length === width && rows.every((row) => row.length === width))) {
    return { width, top: columns.map((label) => ({ label })), sub: null, body: rows };
  }
  const first = rows[0] ?? [];
  // "Step" over two header rows: the first row of headings is one cell short.
  const labelSpansRows = columns.length > 1 && first.length === width - 1;
  const hasFigure = (row) => row.some((cell) => /\d/.test(cell));
  const firstIsHeading = labelSpansRows || (first.length === width && !hasFigure(first) && rows.slice(1).some(hasFigure));
  const spread = (labels, span) => {
    const base = Math.max(1, Math.floor(span / labels.length));
    return labels.map((label, index) => ({
      label,
      colSpan: index === labels.length - 1 ? span - base * (labels.length - 1) : base,
    }));
  };
  const top =
    columns.length > 1 && (labelSpansRows || columns[0] === "")
      ? [{ label: columns[0], rowSpan: labelSpansRows ? 2 : undefined }, ...spread(columns.slice(1), width - 1)]
      : spread(columns, width);
  return { width, top, sub: firstIsHeading ? first : null, body: firstIsHeading ? rows.slice(1) : rows };
}

// Line breaks inside a cell are kept, but blank lines between them are not.
const cellText = (value) => String(value ?? "").replace(/\n\s*\n+/g, "\n").trim();

function TableSection({ section }) {
  const { width, top, sub, body } = tableLayout(section);
  return (
    <figure className="py-2">
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
        <table className="w-full min-w-[480px] text-left text-sm">
          {top.length ? (
            <thead className="bg-slate-50">
              <tr>
                {top.map((cell, index) => (
                  <th
                    className="whitespace-pre-line px-5 py-3.5 align-bottom font-semibold text-slate-900"
                    colSpan={cell.colSpan}
                    key={index}
                    rowSpan={cell.rowSpan}
                  >
                    {cellText(cell.label)}
                  </th>
                ))}
              </tr>
              {sub ? (
                <tr className="border-t border-slate-200/70">
                  {sub.map((cell, index) => (
                    <th className="whitespace-pre-line px-5 py-3 font-semibold text-slate-700" key={index}>
                      {cellText(cell)}
                    </th>
                  ))}
                </tr>
              ) : null}
            </thead>
          ) : null}
          <tbody>
            {body.map((row, rowIndex) => (
              <tr className="border-t border-slate-100" key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    className="whitespace-pre-line px-5 py-3.5 text-slate-600"
                    // A short row's last cell runs to the edge of the table.
                    colSpan={cellIndex === row.length - 1 && row.length < width ? width - row.length + 1 : undefined}
                    key={cellIndex}
                  >
                    {cellText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {section.caption ? (
        <figcaption className="mt-3 text-center text-sm leading-6 text-slate-500">{section.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function FaqSection({ section }) {
  return (
    <div className="space-y-4">
      {section.heading ? (
        <h2 className="pt-4 text-2xl font-semibold leading-snug tracking-tight text-slate-950">
          {section.heading}
        </h2>
      ) : null}
      <div className="space-y-3">
        {section.content.map((item, index) => (
          <details className="group rounded-2xl border border-slate-200/80 bg-white px-5 py-4" key={index}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-slate-900">
              {item.q}
              <FiChevronDown className="size-4 shrink-0 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-[15px] leading-7 text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function Section({ section, title }) {
  if (section.type === "image") {
    return <ImageSection section={section} />;
  }
  if (section.type === "table") {
    return <TableSection section={section} />;
  }
  if (section.type === "faq") {
    return <FaqSection section={section} />;
  }
  return <TextSection section={section} title={title} />;
}

// A related post, styled like the blog listing cards: one "Read article" button
// is the only way in.
function RelatedCard({ post }) {
  const productShot = isProductImage(post.image);
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-36px_rgba(15,23,42,0.55)]">
      {post.image ? (
        <div className={`relative h-28 ${productShot ? "bg-gradient-to-br from-slate-50 via-white to-slate-100" : "bg-slate-100"}`}>
          <div className={`absolute ${productShot ? "inset-3" : "inset-0"}`}>
            <Image
              alt={post.title}
              className={productShot ? "object-contain" : "object-cover"}
              fill
              sizes="(min-width: 1280px) 280px, (min-width: 640px) 33vw, 100vw"
              src={post.image}
            />
          </div>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{post.title}</h3>
        <Link
          className="group mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          href={`/blog/${post.slug}`}
        >
          Read article <FiArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export default function BlogDetailsPage({ post }) {
  const [commentForm, setCommentForm] = useState({ name: "", email: "", message: "" });
  const [commentStatus, setCommentStatus] = useState({ type: "", message: "" });
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setCommentForm((current) => ({ ...current, [name]: value }));
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setCommentStatus({ type: "", message: "" });
    setIsCommentSubmitting(true);

    try {
      const response = await fetch("/api/forms", {
        body: JSON.stringify({
          formType: "blog-comment",
          ...commentForm,
          postTitle: post.title,
          postSlug: post.slug,
          ...collectTracking(),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setCommentStatus({ type: "success", message: "Comment submitted successfully." });
        setCommentForm({ name: "", email: "", message: "" });
      } else {
        setCommentStatus({
          type: "error",
          message: data?.message || "Could not submit your comment. Please try again.",
        });
      }
    } catch {
      setCommentStatus({ type: "error", message: "Could not submit your comment. Please try again." });
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const relatedPosts = getRelatedPosts(post);
  const visibleSections = post.sections.filter(
    (section, index) =>
      !(index === 0 && section.type === "image" && section.imageUrl === post.image)
  );
  const coverIsProductImage = isProductImage(post.image);
  const inputClass =
    "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/10";

  return (
    <main className="overflow-hidden bg-[#f7f8fa]">
      <header className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_70%_at_50%_0%,rgba(15,23,42,0.06),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-12 text-center sm:px-6 lg:pt-16">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <Link className="transition hover:text-slate-950" href="/">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link className="transition hover:text-slate-950" href="/blog">
              Blog
            </Link>
          </nav>
          <h1 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
            {post.title}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[1360px] px-4 pb-20 sm:px-6 lg:px-8">
        {/* The article and the related-posts column sit centred together on wide
            screens; below that, related posts follow the article. */}
        <div className="xl:grid xl:grid-cols-[minmax(0,880px)_280px] xl:justify-center xl:gap-12">
          <article className="mx-auto w-full min-w-0 max-w-[880px]">
            {/* Posts without a cover image skip it rather than rendering an empty frame. */}
            {post.image ? (
              <div
                className={`relative aspect-[2/1] overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)] ${
                  coverIsProductImage ? "bg-gradient-to-br from-slate-50 via-white to-slate-100" : "bg-slate-100"
                }`}
              >
                <div className={`absolute ${coverIsProductImage ? "inset-8 sm:inset-12" : "inset-0"}`}>
                  <Image
                    alt={post.title}
                    className={coverIsProductImage ? "object-contain" : "object-cover"}
                    fill
                    priority
                    sizes="(min-width: 768px) 880px, 100vw"
                    src={post.image}
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-8 space-y-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
              {visibleSections.map((section, index) => (
                <Section key={index} section={section} title={post.title} />
              ))}
            </div>

            <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Comments{post.comments.length ? ` (${post.comments.length})` : ""}
              </h2>

              <div className="mt-5 space-y-6">
                {post.comments.length === 0 ? (
                  <p className="text-sm text-slate-500">Be the first to comment on this article.</p>
                ) : (
                  post.comments.map((comment) => (
                    <div className="flex gap-4" key={comment.id}>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {initials(comment.name)}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{comment.name}</span>
                          <span className="text-xs text-slate-500">{formatPostDate(comment.date)}</span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 border-t border-slate-100 pt-8">
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">Leave a Comment</h3>
                <form className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleCommentSubmit}>
                  <input
                    className={inputClass}
                    name="name"
                    onChange={handleCommentChange}
                    placeholder="Your Name"
                    required
                    type="text"
                    value={commentForm.name}
                  />
                  <input
                    className={inputClass}
                    name="email"
                    onChange={handleCommentChange}
                    placeholder="Your Email"
                    required
                    type="email"
                    value={commentForm.email}
                  />
                  <textarea
                    className={`${inputClass} col-span-1 sm:col-span-2`}
                    name="message"
                    onChange={handleCommentChange}
                    placeholder="Your Message"
                    required
                    rows={4}
                    value={commentForm.message}
                  />
                  {commentStatus.message ? (
                    <div
                      className={`col-span-1 rounded-xl border px-4 py-3 text-sm sm:col-span-2 ${
                        commentStatus.type === "success"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-amber-200 bg-amber-50 text-amber-800"
                      }`}
                    >
                      {commentStatus.message}
                    </div>
                  ) : null}
                  <SubmitButton
                    className="submit-trace-neutral col-span-1 w-fit rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-70 sm:col-span-2"
                    doneLabel="Comment posted"
                    sending={isCommentSubmitting}
                    sendingLabel="Posting..."
                    succeeded={commentStatus.type === "success"}
                  >
                    Post Comment
                  </SubmitButton>
                </form>
              </div>
            </section>
          </article>

          {relatedPosts.length ? (
            <aside aria-labelledby="related-blogs" className="mx-auto mt-14 w-full max-w-[880px] xl:mt-0 xl:max-w-none">
              <div className="xl:sticky xl:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Keep reading</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950" id="related-blogs">
                  Related blogs
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
                  {relatedPosts.map((related) => (
                    <RelatedCard key={related.id} post={related} />
                  ))}
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
