"use client";

import { useEffect, useMemo, useState } from "react";
import CatalystArchiveSwitcher from "@/components/catalystcue/CatalystArchiveVariants";
import CatalystLatestIssue from "@/components/catalystcue/CatalystLatestIssue";
import CatalystModal from "@/components/catalystcue/CatalystModal";
import { catalystCards } from "@/data/catalystCue";

const MONTH_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function issueSortValue(card) {
  const [month = "", year = ""] = (card.Date || "").trim().split(/\s+/);
  const monthIndex = MONTH_ORDER.indexOf(month);
  const parsedYear = Number.parseInt(year, 10);

  if (monthIndex >= 0 && Number.isFinite(parsedYear)) {
    return parsedYear * 12 + monthIndex;
  }

  return Number(card.id) || 0;
}

function sortIssuesNewestFirst(cards) {
  return [...cards].sort(
    (a, b) => issueSortValue(b) - issueSortValue(a) || Number(b.id) - Number(a.id),
  );
}

export default function CatalystPage() {
  const [showCatalystModal, setShowCatalystModal] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowCatalystModal(true), 5000);

    return () => window.clearTimeout(timer);
  }, []);

  const latestIssue = useMemo(() => {
    return sortIssuesNewestFirst(catalystCards)[0];
  }, []);

  const archiveIssues = useMemo(() => {
    return catalystCards.filter((card) => card.slug !== latestIssue?.slug);
  }, [latestIssue]);

  return (
    <main className="relative bg-parchment">
      <div className="relative left-1/2 h-screen -translate-x-1/2 overflow-hidden">
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover object-center"
          loop
          muted
          playsInline
          src="/assets/catalyst/post-lauch-v2-i6.mp4"
        >
          <track kind="captions" />
        </video>
      </div>

      <section className="bg-parchment-alt px-5 py-12 sm:py-16" id="catalyst-archive">
        <div className="mx-auto grid max-w-[1530px] gap-10 xl:grid-cols-[468px_minmax(0,1fr)] xl:items-start">
          <div className="xl:sticky xl:top-24">
            <CatalystLatestIssue issue={latestIssue} variant="aside" />
          </div>

          <div className="min-w-0 border border-line-light bg-white px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red">
                CatalystCue Archive
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
                Browse Previous Issues
              </h2>
            </div>
            <CatalystArchiveSwitcher catalystCards={archiveIssues} />
          </div>
        </div>
      </section>

      {showCatalystModal ? (
        <div className="z-[10000]">
          <CatalystModal onClose={() => setShowCatalystModal(false)} />
        </div>
      ) : null}
    </main>
  );
}