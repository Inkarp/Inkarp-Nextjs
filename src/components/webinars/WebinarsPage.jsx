"use client";

import { useState } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { getDaysLeft, webinars } from "@/data/webinars";
import RegisterForm from "./RegisterForm";

const tabs = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past / On-Demand" },
];

export default function WebinarsPage() {
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  const handleCloseModal = () => {
    setSelectedWebinar(null);
    setShowRegister(false);
  };

  const visibleWebinars = webinars.filter((webinar) =>
    activeTab === "upcoming"
      ? getDaysLeft(webinar.date) > 0
      : getDaysLeft(webinar.date) === 0
  );

  return (
    <main className="overflow-hidden">
      {/* <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(230,57,70,0.08),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <span
            className="font-maxot inline-flex rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs font-semibold uppercase text-zinc-800 md:text-sm dark:bg-zinc-900 dark:text-zinc-100"
            data-reveal
          >
            Live & On-Demand
          </span>
          <h1
            className="font-maxot mt-4 text-3xl font-bold leading-tight text-[#E63946] sm:text-4xl"
            data-reveal
          >
            Expert-Led Webinars
          </h1>
          <p
            className="mx-auto mt-3 max-w-2xl text-base text-zinc-700 sm:text-lg dark:text-zinc-300"
            data-reveal
          >
            Stay informed on industry trends, best practices, and innovative
            solutions. Register for an upcoming session below.
          </p>
        </div>
      </section> */}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div
          className="mb-8 flex w-fit gap-1 rounded-full border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-900"
          data-reveal
        >
          {tabs.map((tab) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-[#E63946] text-white shadow"
                  : "text-zinc-600 hover:text-[#E63946] dark:text-zinc-300"
              }`}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {visibleWebinars.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No {activeTab === "upcoming" ? "upcoming" : "past"} webinars right
            now. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleWebinars.map((webinar) => {
              const daysLeft = getDaysLeft(webinar.date);

              return (
                <div
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                  data-reveal
                  key={webinar.id}
                >
                  <div className="relative flex h-36 items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-800">
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#BE0010] to-[#E63946]"
                    />
                    <Image
                      alt={`${webinar.title} principal logo`}
                      className="h-full w-full object-contain"
                      height={80}
                      src={webinar.img}
                      width={140}
                    />
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        daysLeft > 0
                          ? "bg-[#E63946] text-white"
                          : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {daysLeft > 0 ? `${daysLeft}d left` : "On-Demand"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {webinar.date1}
                    </p>
                    <h3 className="font-maxot line-clamp-2 text-base text-[#E63946]">
                      {webinar.title}
                    </h3>
                    <p className="line-clamp-3 flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {webinar.description}
                    </p>

                    <div className="mt-2 flex gap-3">
                      <button
                        className="flex-1 rounded-lg border border-[#E63946] px-3 py-2 text-sm font-medium text-[#E63946] transition hover:bg-[#E63946] hover:text-white"
                        onClick={() => setSelectedWebinar(webinar)}
                        type="button"
                      >
                        View Details
                      </button>
                      {daysLeft > 0 ? (
                        <button
                          className="font-maxot flex-1 rounded-lg bg-[#E63946] px-3 py-2 text-sm text-white transition hover:bg-[#BE0010]"
                          onClick={() => {
                            setSelectedWebinar(webinar);
                            setShowRegister(true);
                          }}
                          type="button"
                        >
                          Register
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedWebinar && !showRegister ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <button
              aria-label="Close webinar details"
              className="absolute right-4 top-4 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              onClick={handleCloseModal}
              type="button"
            >
              <FiX className="size-5" />
            </button>
            <div
              className="mb-3 text-base text-zinc-800 dark:text-zinc-200"
              dangerouslySetInnerHTML={{ __html: selectedWebinar.details }}
            />
            {getDaysLeft(selectedWebinar.date) > 0 ? (
              <div className="mt-6 text-center">
                <button
                  className="font-maxot rounded-lg bg-[#BE0010] px-6 py-2 text-sm text-white transition hover:bg-[#E63946]"
                  onClick={() => setShowRegister(true)}
                  type="button"
                >
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
