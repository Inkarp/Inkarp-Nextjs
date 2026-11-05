"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiImage } from "react-icons/fi";
import FlaskDock from "./FlaskDock";
import RecTag from "./RecTag";
import { events, featuredEvent, formatEventDate, getEventStatus, stallStatus, upcomingStallEvent } from "@/data/events";
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

const FEATURED_EVENT_COUNT = 2;
// The stalls lead the row: the show Inkarp exhibits at next (PMEC India 2026,
// its stall render on the events banner's deep blue) and the one before
// (analytica Lab India 2026, with its stall photo). Their status follows each
// show's own opening and close.
const STALL_EVENTS = [
  {
    ...upcomingStallEvent,
    panelClassName: "bg-[radial-gradient(120%_90%_at_50%_100%,#1d4968_0%,#0b3150_45%,#001e36_100%)]",
    imageClassName: "object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.45)]",
  },
  ...(upcomingStallEvent.title === `${featuredEvent.name} ${featuredEvent.edition}`
    ? []
    : [
        {
          id: "analytica-lab-india-2026-stall",
          title: `${featuredEvent.name} ${featuredEvent.edition}`,
          description: featuredEvent.summary,
          dateLabel: featuredEvent.dateLabel,
          image: "/assets/events/analytica-2026.webp",
          startsAt: featuredEvent.startsAt,
          endsAt: featuredEvent.endsAt,
        },
      ]),
];

// The stalls first, then the soonest upcoming/ongoing, then the most recently
// completed, topped up to FEATURED_EVENT_COUNT — so the row always fills.
function pickFeaturedEvents() {
  const withStatus = events.map((event) => ({ ...event, status: getEventStatus(event) }));

  const upcoming = withStatus
    .filter((event) => event.status !== "past")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const completed = withStatus
    .filter((event) => event.status === "past")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return [...STALL_EVENTS.map((event) => ({ ...event, status: stallStatus(event) })), ...upcoming, ...completed].slice(
    0,
    FEATURED_EVENT_COUNT,
  );
}

function EventCard({ event, highlight }) {
  return (
    <Link
      href="/events"
      className={`group flex flex-col overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg ${
        highlight ? "border-red" : "border-line-light"
      }`}
    >
      <div className={`relative aspect-[4/3] overflow-hidden border-b border-line-light ${event.panelClassName ?? "bg-parchment-alt"}`}>
        <SafeImage src={event.image} alt={event.title ?? "Inkarp event"} sizes="280px" className={event.imageClassName ?? "object-cover"} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[event.status]}`}
        >
          {statusLabels[event.status]}
        </span>
        <p className="text-xs text-ink-soft">{event.dateLabel ?? formatEventDate(event)}</p>
        <h4 className="text-base font-semibold text-ink">{event.title ?? "Inkarp at this event"}</h4>
        {event.description ? (
          <p className="line-clamp-2 flex-1 text-sm text-ink-soft">{event.description}</p>
        ) : (
          <span className="flex-1" />
        )}
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
        <p className="text-xs text-ink-soft">{formatPostDate(post.date)}</p>
        <h4 className="line-clamp-1 text-sm font-semibold text-ink">{post.title}</h4>
        <p className="line-clamp-1 text-xs text-ink-soft">{post.excerpt}</p>
        <span className="text-xs font-semibold text-red">Know more →</span>
      </div>
    </Link>
  );
}

// `flask`: a landing spot left of the heading for the homepage's
// travelling sample (FlaskJourney), on wide screens.
export default function HomeEventsInsights({ flask = false }) {
  const featuredEvents = pickFeaturedEvents();
  const recentPosts = getRecentPosts(undefined, 3);

  return (
    <section className="bg-white py-[78px]" id="events-insights" data-reveal>
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className={flask ? "mb-10 lg:flex lg:items-center lg:gap-6" : "mb-10"}>
          {flask ? <FlaskDock className="hidden shrink-0 lg:block" stop={4} /> : null}
          <div>
            <RecTag>What&apos;s Happening</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Events &amp; insights
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink-soft">
              Highlights from our recent events and the latest thinking from our team.
            </p>
          </div>
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
              <h3 className="text-lg font-semibold text-ink">From the blogs</h3>
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
