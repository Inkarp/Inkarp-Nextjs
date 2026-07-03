"use client";

import Image from "next/image";
import Link from "next/link";

function formatVolumeLabel(volume = "") {
  return volume.replace("-", " ");
}

export default function CatalystLatestIssue({ issue }) {
  if (!issue) {
    return null;
  }

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-md border border-line-light bg-parchment shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        <Link
          aria-label={`Read ${issue.title}`}
          className="group relative min-h-[460px] overflow-hidden bg-[#1A2D51] sm:min-h-[560px] lg:min-h-[640px]"
          href={`/magazine/${encodeURIComponent(issue.slug)}`}
        >
          <Image
            alt={issue.subTitle}
            className="object-cover transition duration-700 group-hover:scale-105"
            fill
            priority
            sizes="(min-width: 1024px) 44vw, 100vw"
            src={issue.image}
          />
        </Link>

        <div className="flex flex-col justify-center bg-[#f8fafc] p-6 sm:p-10 lg:p-12">
          <div className="w-fit rounded-md bg-red px-4 py-2 text-sm font-bold uppercase text-parchment shadow-lg">
            Latest Issue
          </div>
          <h1 className="font-maxot mt-4 text-xl leading-tight ">
            {issue.metaTitle || issue.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-ink-soft">
            <span className="rounded-md border border-line-light bg-parchment px-3 py-1.5">
              {formatVolumeLabel(issue.Volume)}
            </span>
            <span className="rounded-md border border-line-light bg-parchment px-3 py-1.5">
              {issue.subTitle}
            </span>
            <span className="rounded-md border border-line-light bg-parchment px-3 py-1.5">
              {issue.Date}
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft">
            {issue.metaDescription ||
              "Explore the newest CatalystCue issue from Inkarp, featuring scientific workflows, laboratory insights, and application-focused innovations."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md bg-red px-6 text-sm font-bold text-parchment transition hover:bg-[#9f000d]"
              href={`/magazine/${encodeURIComponent(issue.slug)}`}
            >
              Read Latest Issue
            </Link>
            <a
              className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-300 bg-parchment px-6 text-sm font-bold text-ink transition hover:border-red hover:text-red"
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
