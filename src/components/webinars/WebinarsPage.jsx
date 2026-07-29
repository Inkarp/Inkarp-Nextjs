"use client";

import { useState } from"react";
import Image from"next/image";
import { FiX } from"react-icons/fi";
import { getDaysLeft, webinars } from"@/data/webinars";
import RegisterForm from"./RegisterForm";

const tabs = [
  { key:"upcoming", label:"Upcoming" },
  { key:"past", label:"Past / On-Demand" },
];

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
        ? getDaysLeft(webinar.date) > 0
        : getDaysLeft(webinar.date) === 0
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
        <div
          className="mb-8 flex w-fit gap-1 border border-line-light bg-parchment-alt p-1"
          data-reveal
        >
          {tabs.map((tab) => (
            <button
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ?"bg-red text-parchment"
                  :"text-ink-soft hover:text-red"
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
          <p className="border border-dashed border-line-light px-4 py-10 text-center text-sm text-ink-soft">
            No {activeTab ==="upcoming" ?"upcoming" :"past"} webinars right
            now. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleWebinars.map((webinar) => {
              const daysLeft = getDaysLeft(webinar.date);

              return (
                <div
                  className="group flex flex-col overflow-hidden border border-line-light bg-parchment transition hover:-translate-y-1 hover:border-red/35"
                  data-reveal
                  key={webinar.id}
                >
                  <div className="relative flex h-36 items-center justify-center bg-parchment-alt p-6">
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 bg-red"
                    />
                    <Image
                      alt={`${webinar.title} principal logo`}
                      className="h-full w-full object-contain"
                      height={80}
                      src={webinar.img}
                      width={140}
                    />
                    <span
                      className={`absolute right-3 top-3 px-3 py-1 text-xs font-semibold ${
                        daysLeft > 0
                          ?"bg-red text-parchment"
                          :"bg-parchment-alt text-ink-soft"
                      }`}
                    >
                      {daysLeft > 0 ? `${daysLeft}d left` :"On-Demand"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      {webinar.date1}
                    </p>
                    <h3 className="line-clamp-2 text-base text-red">
                      {webinar.title}
                    </h3>
                    <p className="line-clamp-3 flex-1 text-sm text-ink-soft">
                      {webinar.description}
                    </p>

                    <div className="mt-2 flex gap-3">
                      <button
                        className="flex-1 border border-red px-3 py-2 text-sm font-medium text-red transition hover:bg-red hover:text-parchment"
                        onClick={() => setSelectedWebinar(webinar)}
                        type="button"
                      >
                        View Details
                      </button>
                      {daysLeft > 0 ? (
                        <button
                          className="flex-1 bg-red px-3 py-2 text-sm text-parchment transition hover:bg-red"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-parchment p-6">
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
            {getDaysLeft(selectedWebinar.date) > 0 ? (
              <div className="mt-6 text-center">
                <button
                  className="bg-red px-6 py-2 text-sm text-parchment transition hover:bg-red"
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
