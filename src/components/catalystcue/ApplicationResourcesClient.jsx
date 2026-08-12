"use client";

import { useEffect, useMemo, useRef, useState } from"react";
import { FiDownload, FiFileText, FiMail, FiSearch } from"react-icons/fi";
import { FaWhatsapp } from"react-icons/fa";
import { applicationResources, getIssueOptions, volumeOptions } from"@/data/applicationResources";
import { SITE_URL } from"@/data/pageSeo";

// How long to wait before treating a preview as failed. Embedded PDFs can be
// slow, but an indefinite spinner is worse than an honest fallback.
const PREVIEW_TIMEOUT_MS = 20000;

// Renders the PDF preview, but only once the card is near the viewport. There
// are 68 resources totalling ~61MB — mounting every iframe up front made the
// page download the entire library at once. `loading="lazy"` alone is not
// enough: the browser still creates the frame and often fetches it eagerly.
function PdfPreview({ resource }) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [state, setState] = useState("idle"); // idle | loading | ready | failed

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return undefined;

    setState("loading");
    const timer = window.setTimeout(() => {
      setState((current) => (current === "loading" ? "failed" : current));
    }, PREVIEW_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [shouldLoad]);

  const isReady = state === "ready";

  return (
    <div
      className="relative aspect-[205/270] w-full overflow-hidden border-b border-line-light bg-parchment-alt"
      ref={containerRef}
    >
      {!isReady ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-parchment-alt px-4 text-center">
          <FiFileText className="h-8 w-8 text-red" />

          {state === "failed" ? (
            <span className="text-xs font-medium text-ink-soft">
              Preview unavailable — use Download to open the PDF.
            </span>
          ) : (
            <>
              {/* Track is line-light so it is visible against the panel, and the
                  fill sweeps rather than pulsing, so the wait reads as progress. */}
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-line-light">
                <div className="h-full w-1/3 rounded-full bg-red animate-[hvc-progress-sweep_1.2s_ease-in-out_infinite]" />
              </div>
              <span className="text-xs font-medium text-ink-soft">
                Loading preview…
              </span>
            </>
          )}
        </div>
      ) : null}

      {shouldLoad && state !== "failed" ? (
        <iframe
          className={`pointer-events-none h-full w-[calc(100%+16px)] max-w-none border-0 bg-parchment transition-opacity duration-300 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onError={() => setState("failed")}
          onLoad={() => setState("ready")}
          scrolling="no"
          src={resource.previewUrl}
          tabIndex={-1}
          title={`${resource.title} preview`}
        />
      ) : null}
    </div>
  );
}

// Copied on every shared application note so the team is looped in.
const SHARE_CC = "info@inkarp.co.in";

// Red corner ticks — the same drafting-mark motif used on the footer chips.
function CornerTicks() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-1px] top-[-1px] h-2 w-2 border-l border-t border-red"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-1px] right-[-1px] h-2 w-2 border-b border-r border-red"
      />
    </>
  );
}

function ResourceCard({ resource }) {
  // Built from SITE_URL rather than window.location so the server and client
  // render the same href — deriving it from `window` produced a hydration
  // mismatch (relative on the server, absolute on the client).
  const absoluteUrl = `${SITE_URL}${resource.url}`;

  const shareText = `Inkarp Application Resource: ${resource.title}`;
  const shareBody = `${shareText}\n\n${absoluteUrl}`;

  // Opens Gmail's compose window in a new tab, the same way the WhatsApp link
  // opens WhatsApp Web. A plain `mailto:` was unreliable here — it hands off to
  // whatever desktop mail app Windows has registered, and does nothing at all
  // when none is set. `to` is left empty so the sender addresses it themselves,
  // with Inkarp on cc.
  const emailHref = `https://mail.google.com/mail/?view=cm&fs=1&cc=${encodeURIComponent(
    SHARE_CC
  )}&su=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareBody)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${absoluteUrl}`)}`;

  return (
    <article className="flex h-full flex-col overflow-hidden border border-line-light bg-parchment transition hover:border-red/40 hover:border-red/35">
      {/* PDF preview */}
      <PdfPreview resource={resource} />

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {resource.group}
        </p>
        <h2 className="text-base leading-snug text-ink">
          {resource.title}
        </h2>

        {/* Actions — share is now two direct icon chips (same treatment as the
            footer socials) instead of a toggle that hid them behind a click. */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <a
            className="inline-flex items-center gap-2 bg-red px-3 py-2 text-sm font-semibold text-parchment transition hover:bg-transparent hover:text-red"
            download
            href={resource.url}
          >
            <FiDownload size={15} />
            Download
          </a>

          <span aria-hidden="true" className="h-6 w-px bg-line-light" />

          <a
            aria-label={`Email this resource, copying ${SHARE_CC}`}
            className="group relative inline-flex size-9 items-center justify-center border border-line-light bg-parchment text-ink-soft transition hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
            href={emailHref}
            rel="noopener noreferrer"
            target="_blank"
            title={`Email this resource — opens Gmail with ${SHARE_CC} on cc`}
          >
            <CornerTicks />
            <FiMail size={15} />
          </a>

          <a
            aria-label="Share this resource on WhatsApp"
            className="group relative inline-flex size-9 items-center justify-center border border-line-light bg-parchment text-ink-soft transition hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
            href={whatsappHref}
            rel="noopener noreferrer"
            target="_blank"
            title="Share this resource on WhatsApp"
          >
            <CornerTicks />
            <FaWhatsapp size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}

// Only this many cards render up front; the rest come in on demand. With 68
// resources, rendering everything mounted 68 preview slots at once.
const PAGE_SIZE = 12;

export default function ApplicationResourcesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const issueOptions = useMemo(
    () => getIssueOptions(selectedVolume),
    [selectedVolume]
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return applicationResources.filter(
      (r) =>
        (!q || `${r.title} ${r.group}`.toLowerCase().includes(q)) &&
        (!selectedVolume || r.volume === selectedVolume) &&
        (!selectedIssue || r.issue === selectedIssue)
    );
  }, [searchTerm, selectedVolume, selectedIssue]);

  // Any filter change starts the list over from the first page.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedVolume, selectedIssue]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  return (
    <div className="min-h-screen bg-parchment">
      {/* Page header + filters */}
      <section className="border-b border-line-light bg-parchment-alt px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-red">
              CATALYSTCue
            </p>
            <h1 className="mt-2 text-3xl text-ink sm:text-4xl">
              Application Resources
            </h1>
            <p className="mt-3 text-base leading-7 text-ink-soft">
              Browse application notes and downloadable PDFs from Inkarp&apos;s application library.
            </p>
          </div>

          {/* Search + filters */}
          <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                className="w-full border border-line-light bg-parchment py-3 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-red focus:ring-2 focus:ring-red/20"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources…"
                type="search"
                value={searchTerm}
              />
            </div>

            <select
              aria-label="Filter by volume"
              className="w-full border border-line-light bg-parchment px-4 py-3 text-sm text-ink outline-none transition focus:border-red focus:ring-2 focus:ring-red/20"
              onChange={(e) => {
                setSelectedVolume(e.target.value);
                setSelectedIssue("");
              }}
              value={selectedVolume}
            >
              <option value="">All Volumes</option>
              {volumeOptions.map((v) => (
                <option key={v} value={v}>
                  {v.replace("-","")}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by issue"
              className="w-full border border-line-light bg-parchment px-4 py-3 text-sm text-ink outline-none transition focus:border-red focus:ring-2 focus:ring-red/20"
              onChange={(e) => setSelectedIssue(e.target.value)}
              value={selectedIssue}
            >
              <option value="">All Issues</option>
              {issueOptions.map((i) => (
                <option key={i} value={i}>
                  {i.replace("-","")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-ink-soft">
          Showing {visible.length} of {filtered.length} resources
          {filtered.length !== applicationResources.length
            ? ` (filtered from ${applicationResources.length})`
            : ""}
        </p>

        {filtered.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {remaining > 0 ? (
              <div className="mt-10 flex justify-center">
                <button
                  className="inline-flex items-center gap-2 border border-red bg-red px-8 py-3 text-sm font-semibold text-parchment transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  type="button"
                >
                  Load {Math.min(remaining, PAGE_SIZE)} more
                  <span aria-hidden="true">↓</span>
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="border border-dashed border-line-light bg-parchment-alt p-12 text-center">
            <FiFileText className="mx-auto mb-3 h-8 w-8 text-ink-soft" />
            <p className="text-sm text-ink-soft">
              No resources match your search.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
