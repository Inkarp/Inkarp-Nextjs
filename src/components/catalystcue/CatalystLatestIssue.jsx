"use client";

import Image from "next/image";
import Link from "next/link";

function formatVolumeLabel(volume = "") {
  return volume.replace("-", "");
}

export default function CatalystLatestIssue({ issue, variant = "wide" }) {
  if (!issue) {
    return null;
  }

  const displayTitle = issue.themeTitle || issue.metaTitle || issue.title;
  const imageAlt = issue.altText || issue.subTitle;

  if (variant === "aside") {
    return (
      <article className="overflow-hidden border border-red bg-white">
        {/* Cover is not clickable — reading happens via the button below. */}
        <div className="relative aspect-[468/620] w-full overflow-hidden bg-[#1A2D51]">
          <Image
            alt={imageAlt}
            className="object-contain p-3"
            fill
            priority
            sizes="(min-width: 1024px) 340px, calc(100vw - 40px)"
            src={issue.image}
          />
          <span className="absolute left-4 top-4 bg-red px-4 py-2 text-sm font-bold uppercase tracking-wide text-parchment">
            Latest Issue
          </span>
        </div>

        <div className="border-t border-line-light bg-white p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-red">
            {formatVolumeLabel(issue.Volume)} / {issue.subTitle}
          </p>
          <h1 className="mt-3 text-xl font-semibold leading-8 text-ink">
            {displayTitle}
          </h1>
          <p className="mt-3 text-sm text-ink-soft">{issue.Date}</p>
          <Link
            className="mt-5 inline-flex h-11 items-center justify-center border border-red bg-red px-5 text-sm font-bold text-parchment transition hover:bg-transparent hover:text-red"
            href={`/magazine/${encodeURIComponent(issue.slug)}`}
          >
            Read Latest Issue
          </Link>
        </div>
      </article>
    );
  }

  return (
    <section className="bg-parchment-alt px-5 py-12 sm:py-16">
      <div className="mx-auto grid max-w-[1180px] overflow-hidden border border-line-light bg-white lg:grid-cols-[0.9fr_1.1fr]">
        <Link
          aria-label={`Read ${issue.title}`}
          className="group relative min-h-[460px] overflow-hidden bg-[#1A2D51] sm:min-h-[560px] lg:min-h-[640px]"
          href={`/magazine/${encodeURIComponent(issue.slug)}`}
        >
          <Image
            alt={imageAlt}
            className="object-contain p-3 transition duration-700 group-hover:scale-[1.02]"
            fill
            priority
            sizes="(min-width: 1024px) 44vw, 100vw"
            src={issue.image}
          />
        </Link>

        <div className="flex flex-col justify-center bg-white p-6 sm:p-10 lg:p-12">
          <div className="w-fit bg-red px-4 py-2 text-sm font-bold uppercase text-parchment">
            Latest Issue
          </div>
          <h1 className="mt-4 text-xl leading-tight">
            {displayTitle}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-ink-soft">
            <span className="border border-line-light bg-parchment px-3 py-1.5">
              {formatVolumeLabel(issue.Volume)}
            </span>
            <span className="border border-line-light bg-parchment px-3 py-1.5">
              {issue.subTitle}
            </span>
            <span className="border border-line-light bg-parchment px-3 py-1.5">
              {issue.Date}
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft">
            {issue.metaDescription || "Explore the newest CATALYSTCue issue from Inkarp, featuring scientific workflows, laboratory insights, and application-focused innovations."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              className="inline-flex h-12 items-center justify-center border border-red bg-red px-6 text-sm font-bold text-parchment transition hover:bg-transparent hover:text-red"
              href={`/magazine/${encodeURIComponent(issue.slug)}`}
            >
              Read Latest Issue
            </Link>
            <a
              className="inline-flex h-12 items-center justify-center border border-line-light bg-parchment px-6 text-sm font-bold text-ink transition hover:border-red hover:text-red"
              href="#catalyst-archive"
            >
              Browse Archive
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}