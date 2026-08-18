"use client";

import { useEffect, useMemo, useState } from"react";
import { FiX } from"react-icons/fi";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
}

export default function ProductMicrositeLayer({ links = [], productName }) {
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  const trackedLinks = useMemo(
    () => links.filter((link) => typeof link.id ==="string" && link.id.trim()),
    [links]
  );

  useEffect(() => {
    if (!trackedLinks.length) {
      return undefined;
    }

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

      const booking = document.getElementById("booking");
      const nearBooking =
        booking && window.scrollY + window.innerHeight > booking.offsetTop + 120;
      setShowStickyCta(nextProgress > 22 && !nearBooking);

    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [trackedLinks]);

  if (!trackedLinks.length) {
    return null;
  }

  const shouldShowSticky = showStickyCta && !stickyDismissed;

  return (
    <>
      {/* <nav
        aria-label="Product page progress"
        className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 border border-line-light bg-white p-2 -900/10 backdrop-blur lg:flex"
      >
        {trackedLinks.map((link) => (
          <button
            aria-label={`Jump to ${link.label}`}
            className={`size-3 transition ${
              active === link.id
                ?"bg-[#161616] ring-4 ring-[#161616]/15"
                :"bg-parchment-alt hover:bg-parchment-alt"
            }`}
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            title={link.label}
            type="button"
          />
        ))}
      </nav> */}

      <div
        className={`fixed inset-x-3 bottom-4 z-40 mx-auto max-w-3xl border border-line-light bg-parchment/95 p-3 backdrop-blur transition ${
          shouldShowSticky
            ?"translate-y-0 opacity-100"
            :"pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Need help configuring it?
            </p>
            <p className="text-sm font-semibold text-ink-soft">
              Book a demo for {productName ??"this product"}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-10 items-center justify-center border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              onClick={() => scrollToSection("booking")}
              type="button"
            >
              Book a demo
            </button>
            <button
              aria-label="Dismiss sticky product CTA"
              className="inline-flex size-10 items-center justify-center border border-line-light text-red transition hover:border-red"
              onClick={() => setStickyDismissed(true)}
              type="button"
            >
              <FiX />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
