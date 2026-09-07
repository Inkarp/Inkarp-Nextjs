"use client";

import { useEffect, useMemo, useState } from "react";
import CatalystArchive from "@/components/catalystcue/CatalystArchiveVariants";
import CatalystLatestIssue from "@/components/catalystcue/CatalystLatestIssue";
import CatalystModal from "@/components/catalystcue/CatalystModal";
import RecTag from "@/components/home/RecTag";
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

  return (
    <main className="relative bg-parchment">
      {/* The hero video lives in the page shell (magazine/page.js) so it can
          share one h-screen flex column with the page header. */}
      <section className="bg-parchment-alt py-12 sm:py-16" id="catalyst-archive">
        {/* 90% of the viewport, matching the header and video above. */}
        <div className="mx-auto grid w-[90%] gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-6">
            <CatalystLatestIssue issue={latestIssue} variant="aside" />
          </div>

          <div className="min-w-0 border border-line-light bg-white px-4 py-8 sm:px-6">
            <div className="mb-8">
              <RecTag>CATALYSTCue Archive</RecTag>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
                Browse All Issues
              </h2>
            </div>
            <CatalystArchive catalystCards={catalystCards} />
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
