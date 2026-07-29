"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getActiveCampaign } from "@/data/campaigns";

const ACCENT_CLASSES = {
  red: "bg-red text-parchment",
  teal: "bg-teal text-parchment",
};

export default function AnnouncementBar({ collapsed = false }) {
  const campaign = useMemo(() => getActiveCampaign(), []);

  if (!campaign) {
    return null;
  }

  const accentClass = ACCENT_CLASSES[campaign.accent] ?? ACCENT_CLASSES.red;
  const shown = !collapsed;

  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
        shown ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className={`${accentClass} animate-[hvc-fade_500ms_ease]`}>
        <div className="mx-auto flex max-w-[1480px] items-center justify-center gap-3 px-4 py-3 text-center text-sm font-semibold sm:px-6 sm:py-3.5 sm:text-base lg:px-8">
          <span aria-hidden="true" className="shrink-0 text-xl sm:text-2xl">
            {campaign.icon}
          </span>
          <p className="truncate">
            {campaign.title}
            <span className="hidden font-normal opacity-90 sm:inline">
              {" "}
              — {campaign.message}
            </span>
          </p>
          {campaign.cta ? (
            <Link
              className="hidden shrink-0 items-center gap-1 rounded-full border border-current/40 px-4 py-1.5 text-sm font-semibold transition hover:bg-white/10 sm:inline-flex"
              href={campaign.cta.href}
            >
              {campaign.cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
