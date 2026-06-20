"use client";

import { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ProductMicrositeLayer({ links = [], productName }) {
  const [active, setActive] = useState(links[0]?.id ?? "");
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  const trackedLinks = useMemo(
    () => links.filter((link) => typeof link.id === "string" && link.id.trim()),
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

      const marker = window.scrollY + 130;
      let current = trackedLinks[0]?.id ?? "";
      trackedLinks.forEach((link) => {
        const section = document.getElementById(link.id);
        if (section && section.offsetTop <= marker) {
          current = link.id;
        }
      });
      setActive(current);
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
      <nav
        aria-label="Product page progress"
        className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 rounded-full border border-zinc-200 bg-white/90 p-2 shadow-lg shadow-zinc-900/10 backdrop-blur lg:flex"
      >
        {trackedLinks.map((link) => (
          <button
            aria-label={`Jump to ${link.label}`}
            className={`size-3 rounded-full transition ${
              active === link.id
                ? "bg-[#BE0010] ring-4 ring-[#BE0010]/15"
                : "bg-zinc-300 hover:bg-zinc-500"
            }`}
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            title={link.label}
            type="button"
          />
        ))}
      </nav>

      <div
        className={`fixed inset-x-3 bottom-4 z-40 mx-auto max-w-3xl rounded-md border border-zinc-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.18)] backdrop-blur transition ${
          shouldShowSticky
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#BE0010]">
              Need help configuring it?
            </p>
            <p className="text-sm font-semibold text-zinc-950">
              Book a demo for {productName ?? "this product"}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#BE0010] px-4 text-sm font-semibold text-white transition hover:bg-[#9f000d]"
              onClick={() => scrollToSection("booking")}
              type="button"
            >
              Book a demo
            </button>
            <button
              aria-label="Dismiss sticky product CTA"
              className="inline-flex size-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition hover:border-[#BE0010] hover:text-[#BE0010]"
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
