"use client";

import Link from "next/link";
import { useState } from "react";
import { FiCalendar, FiMinimize2, FiMonitor, FiUsers, FiX } from "react-icons/fi";

export default function PromoPopup() {
  const [state, setState] = useState("collapsed");

  if (state === "dismissed") {
    return null;
  }

  if (state === "expanded") {
    return (
      <div className="fixed left-4 top-1/2 z-50 w-[min(22rem,calc(100vw-2rem))] -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-zinc-900/15">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#BE0010]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#BE0010]">
            <FiMonitor />
            Live webinar
          </span>

          <div className="flex items-center gap-1">
            <button
              aria-label="Minimize webinar popup"
              className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
              onClick={() => setState("collapsed")}
              type="button"
            >
              <FiMinimize2 />
            </button>
            <button
              aria-label="Close webinar popup"
              className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
              onClick={() => setState("dismissed")}
              type="button"
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-[#BE0010]/15 bg-zinc-950 text-white">
          <div className="border-b border-white/10 bg-[#BE0010] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
            Expert Session
          </div>
          <div className="p-4">
            <p className="font-maxot text-xl leading-tight">
              Modern Lab Workflows
            </p>
            <p className="mt-1 text-sm leading-6 text-white/75">
              Practical ideas for productivity, accuracy, and better scientific
              instrument selection.
            </p>
          </div>
        </div>

        <h3 className="font-maxot mt-4 text-lg font-bold text-zinc-950">
          Join our upcoming scientific webinar
        </h3>
        <p className="mt-1 text-sm leading-6 text-zinc-500">
          Explore application-focused approaches for research, QC, and scale-up
          teams, followed by a live discussion with Inkarp specialists.
        </p>

        <div className="mt-4 space-y-2 text-sm text-zinc-700">
          <p className="flex items-center gap-2">
            <FiCalendar className="shrink-0 text-[#BE0010]" />
            Date and time shared after registration
          </p>
          <p className="flex items-center gap-2">
            <FiUsers className="shrink-0 text-[#BE0010]" />
            Includes live Q&amp;A with product experts
          </p>
        </div>

        <Link
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#BE0010] text-sm font-semibold text-white transition hover:bg-[#9f000d]"
          href="/contact-us?interest=webinar"
        >
          Register for Webinar
        </Link>
      </div>
    );
  }

  return (
    <div
      className="fixed left-2 top-1/2 z-50 flex -translate-y-1/2 cursor-pointer items-center gap-2 rounded-full border border-l-0 border-[#BE0010]/30 bg-white px-3 py-3 shadow-lg shadow-zinc-900/10 transition hover:border-[#BE0010] hover:shadow-xl"
      onClick={() => setState("expanded")}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setState("expanded");
        }
      }}
      role="button"
      tabIndex={0}
    >
      <FiMonitor className="text-[#BE0010]" />
      <span className=" font-maxot text-sm font-semibold tracking-wide text-zinc-800">
        Register for Webinar
      </span>
      <button
        aria-label="Dismiss webinar popup"
        className="rounded-full p-0.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
        onClick={(event) => {
          event.stopPropagation();
          setState("dismissed");
        }}
        type="button"
      >
        <FiX />
      </button>
    </div>
  );
}
