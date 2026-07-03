"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiImage } from "react-icons/fi";
import RecTag from "./RecTag";
import { events, formatDateRange, getEventStatus } from "@/data/events";
import { formatPostDate, getRecentPosts } from "@/data/blogs";

function SafeImage({ src, alt, sizes, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex h-full w-full items-center justify-center text-ink-soft/40">
        <FiImage className="h-6 w-6" aria-hidden="true" />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

const statusStyles = {
  upcoming: "bg-red/10 text-red",
  ongoing: "bg-teal/10 text-teal",
  past: "bg-zinc-200 text-ink-soft",
};

const statusLabels = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  past: "Completed",
};

function pickFeaturedEvents() {
  const withStatus = events.map((event) => ({ ...event, status: getEventStatus(event) }));

  const nextUpcoming = withStatus
    .filter((event) => event.status !== "past")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const lastCompleted = withStatus
    .filter((event) => event.status === "past")
    .sort((a, b) => new Date(b.endDate || b.startDate) - new Date(a.endDate || a.startDate))[0];

  return [nextUpcoming, lastCompleted].filter(Boolean);
}

function EventCard({ event, highlight }) {
  return (
    <Link
      href="/events"
      className={`group flex flex-col overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg ${
        highlight ? "border-red" : "border-line-light"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line-light bg-parchment-alt">
        <SafeImage src={event.image} alt={event.title} sizes="280px" className="object-cover" />
        <span className="absolute bottom-3 left-3 flex h-9 w-20 items-center justify-center rounded-md bg-white/90 p-1.5 shadow-sm backdrop-blur">
          <span className="relative h-full w-full">
            <SafeImage src={event.logo} alt="" sizes="80px" className="object-contain" />
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[event.status]}`}
        >
          {statusLabels[event.status]}
        </span>
        <p className="text-xs text-ink-soft">
          {event.city} · {formatDateRange(event)}
        </p>
        <h4 className="text-base font-semibold text-ink">{event.title}</h4>
        <p className="line-clamp-2 flex-1 text-sm text-ink-soft">{event.description}</p>
        <span className="text-sm font-semibold text-red">Know more →</span>
      </div>
    </Link>
  );
}

function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-xl border border-line-light bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-parchment-alt">
        <SafeImage src={post.image} alt={post.title} sizes="120px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 py-1">
        <span className="inline-flex w-fit items-center rounded-full bg-red/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red">
          {post.category}
        </span>
        <p className="text-xs text-ink-soft">{formatPostDate(post.date)}</p>
        <h4 className="line-clamp-1 text-sm font-semibold text-ink">{post.title}</h4>
        <p className="line-clamp-1 text-xs text-ink-soft">{post.excerpt}</p>
        <span className="text-xs font-semibold text-red">Know more →</span>
      </div>
    </Link>
  );
}

export default function HomeEventsInsights() {
  const featuredEvents = pickFeaturedEvents();
  const recentPosts = getRecentPosts(undefined, 2);

  return (
    <section className="bg-white py-[78px]" id="events-insights" data-reveal>
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-10">
          <RecTag>What&apos;s Happening</RecTag>
          <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
            Events &amp; insights
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ink-soft">
            Where you can meet us next, and the latest thinking from our team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-ink">Events</h3>
              <Link href="/events" className="text-sm font-semibold text-red">
                View all events →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {featuredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} highlight={index === 0} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-ink">From the blog</h3>
              <Link href="/blog" className="text-sm font-semibold text-red">
                View all posts →
              </Link>
            </div>
            <div className="space-y-5">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
