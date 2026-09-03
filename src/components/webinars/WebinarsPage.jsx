"use client";

import { useState } from"react";
import Image from"next/image";
import { FiCalendar, FiClock, FiX } from"react-icons/fi";
import { getDaysLeft, getWebinarSortDate, webinars } from"@/data/webinars";
import RegisterForm from"./RegisterForm";

const tabs = [
  { key:"upcoming", label:"Upcoming" },
  { key:"past", label:"Past / On-Demand" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DEFAULT_ACCENT = {
  text: "#2563eb",
  tint: "#eff6ff",
  soft: "#f8fbff",
  border: "#bfdbfe",
};

const PRINCIPAL_ACCENTS = [
  {
    match: (webinar) => webinar.sourceLink?.includes("mt.com") || webinar.img?.includes("Metller"),
    text: "#15803d",
    tint: "#f0fdf4",
    soft: "#fbfffc",
    border: "#bbf7d0",
  },
  {
    match: (webinar) => webinar.sourceLink?.includes("chemspeed") || webinar.img?.includes("Chemspeed"),
    text: "#a16207",
    tint: "#fef9c3",
    soft: "#fffdf2",
    border: "#fde68a",
  },
  {
    match: (webinar) => webinar.img?.includes("waters") || webinar.sourceLink?.includes("on24.com"),
    text: "#2563eb",
    tint: "#eff6ff",
    soft: "#f8fbff",
    border: "#bfdbfe",
  },
];

function getShortDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`;
}

function getWebinarAccent(webinar) {
  return PRINCIPAL_ACCENTS.find((accent) => accent.match(webinar)) ?? DEFAULT_ACCENT;
}

export default function WebinarsPage() {
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  const handleCloseModal = () => {
    setSelectedWebinar(null);
    setShowRegister(false);
  };

  const visibleWebinars = webinars
    .filter((webinar) =>
      activeTab ==="upcoming"
        ? getDaysLeft(webinar) > 0
        : getDaysLeft(webinar) === 0
    )
    .sort((a, b) => getWebinarSortDate(a) - getWebinarSortDate(b));
  const nextWebinar = activeTab ==="upcoming" ? visibleWebinars[0] : null;
  const selectedAccent = selectedWebinar ? getWebinarAccent(selectedWebinar) : DEFAULT_ACCENT;

  return (
    <main className="overflow-hidden">
      {/* <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1180px] px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <span
            className="inline-flex border border-red/30 bg-white px-4 py-1 text-xs font-semibold uppercase text-ink-soft md:text-sm"
            data-reveal
          >
            Live & On-Demand
          </span>
          <h1
            className="mt-4 text-3xl font-bold leading-tight text-red sm:text-4xl"
            data-reveal
          >
            Expert-Led Webinars
          </h1>
          <p
            className="mx-auto mt-3 max-w-2xl text-base text-ink-soft sm:text-lg"
            data-reveal
          >
            Stay informed on industry trends, best practices, and innovative
            solutions. Register for an upcoming session below.
          </p>
        </div>
      </section> */}

      <section className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 border-b border-line-light pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-ink-soft">
              Webinars
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              September webinar agenda
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {visibleWebinars.length} {activeTab ==="upcoming" ?"upcoming sessions" :"past sessions"}
              {nextWebinar ? ` | Next: ${nextWebinar.date1}` : ""}
            </p>
          </div>

          <div
            className="flex w-fit gap-1 border border-line-light bg-parchment-alt p-1"
            data-reveal
          >
            {tabs.map((tab) => (
              <button
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.key
                    ?"bg-ink text-parchment"
                    :"text-ink-soft hover:bg-white hover:text-ink"
                }`}
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {visibleWebinars.length === 0 ? (
          <p className="border border-dashed border-line-light px-4 py-10 text-center text-sm text-ink-soft">
            No {activeTab ==="upcoming" ?"upcoming" :"past"} webinars right
            now. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {visibleWebinars.map((webinar) => {
              const daysLeft = getDaysLeft(webinar);
              const sortDate = getWebinarSortDate(webinar);
              const accent = getWebinarAccent(webinar);

              return (
                <div
                  className="group flex min-h-[190px] flex-col border bg-parchment p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5"
                  data-reveal
                  key={webinar.id}
                  style={{
                    background: `linear-gradient(180deg, ${accent.soft} 0%, #fffaf3 100%)`,
                    borderColor: accent.border,
                  }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="flex h-12 w-14 shrink-0 flex-col items-center justify-center border"
                        style={{
                          backgroundColor: accent.tint,
                          borderColor: accent.border,
                          color: accent.text,
                        }}
                      >
                        <span className="text-[10px] font-bold uppercase leading-none">
                          {getShortDate(sortDate).split(" ")[0]}
                        </span>
                        <span className="mt-1 text-lg font-black leading-none">
                          {getShortDate(sortDate).split(" ")[1]}
                        </span>
                      </span>
                      <Image
                        alt={`${webinar.title} principal logo`}
                        className="h-8 w-20 object-contain object-left"
                        height={40}
                        src={webinar.img}
                        width={96}
                      />
                    </div>
                    <span
                      className="shrink-0 border bg-white px-2 py-1 text-[11px] font-semibold"
                      style={{
                        borderColor: daysLeft > 0 ? accent.border : undefined,
                        color: daysLeft > 0 ? accent.text : undefined,
                      }}
                    >
                      {daysLeft > 0 ? `${daysLeft}d left` :"On-Demand"}
                    </span>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                    <FiClock aria-hidden="true" className="size-3.5" style={{ color: accent.text }} />
                    {webinar.date1}
                  </p>
                  <h3 className="mt-2 line-clamp-2 min-h-12 text-sm font-semibold leading-6" style={{ color: accent.text }}>
                    {webinar.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-xs leading-5 text-ink-soft">
                    {webinar.description}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex-1 border bg-white px-3 py-2 text-sm font-medium transition hover:brightness-[0.98]"
                      onClick={() => setSelectedWebinar(webinar)}
                      style={{ borderColor: accent.border, color: accent.text }}
                      type="button"
                    >
                      Details
                    </button>
                    {daysLeft > 0 ? (
                      <button
                        className="flex-1 border px-3 py-2 text-sm font-medium transition hover:brightness-[0.98]"
                        onClick={() => {
                          setSelectedWebinar(webinar);
                          setShowRegister(true);
                        }}
                        style={{
                          backgroundColor: accent.tint,
                          borderColor: accent.border,
                          color: accent.text,
                        }}
                        type="button"
                      >
                        Register
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedWebinar && !showRegister ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div
            className="webinar-detail-panel relative max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-parchment p-6"
            style={{
              "--webinar-accent": selectedAccent.text,
              "--webinar-accent-border": selectedAccent.border,
              "--webinar-accent-tint": selectedAccent.tint,
            }}
          >
            <style>
              {`
                .webinar-detail-panel [class*="text-[#E63946]"] {
                  color: var(--webinar-accent) !important;
                }
                .webinar-detail-panel [class*="bg-red-50"] {
                  background-color: var(--webinar-accent-tint) !important;
                }
                .webinar-detail-panel [class*="border-[#E63946]"] {
                  border-color: var(--webinar-accent-border) !important;
                }
              `}
            </style>
            <button
              aria-label="Close webinar details"
              className="absolute right-4 top-4 text-ink-soft hover:text-ink"
              onClick={handleCloseModal}
              type="button"
            >
              <FiX className="size-5" />
            </button>
            <div
              className="mb-3 text-base text-ink"
              dangerouslySetInnerHTML={{ __html: selectedWebinar.details }}
            />
            {getDaysLeft(selectedWebinar) > 0 ? (
              <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 border-t border-line-light bg-parchment/95 px-6 py-4 text-center backdrop-blur">
                <button
                  className="inline-flex items-center justify-center gap-2 border bg-white px-6 py-2 text-sm text-ink-soft transition hover:bg-parchment-alt"
                  onClick={() => setShowRegister(true)}
                  style={{ borderColor: selectedAccent.border, color: selectedAccent.text }}
                  type="button"
                >
                  <FiCalendar aria-hidden="true" />
                  Register Now
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {showRegister ? (
        <RegisterForm
          isOpen
          onClose={handleCloseModal}
          preselected={selectedWebinar}
        />
      ) : null}
    </main>
  );
}
