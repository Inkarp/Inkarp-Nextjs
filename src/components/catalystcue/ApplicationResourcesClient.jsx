"use client";

import { useMemo, useState } from"react";
import {
  FiDownload,
  FiFileText,
  FiMail,
  FiSearch,
  FiShare2,
  FiX,
} from"react-icons/fi";
import { FaWhatsapp } from"react-icons/fa";
import { applicationResources, getIssueOptions, volumeOptions } from"@/data/applicationResources";

function ResourceCard({ resource }) {
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const absoluteUrl =
    typeof window !=="undefined"
      ? new URL(resource.url, window.location.origin).href
      : resource.url;

  const shareText = `Inkarp Application Resource: ${resource.title}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${absoluteUrl}`)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${absoluteUrl}`)}`;

  return (
    <article className="flex h-full flex-col overflow-hidden border border-line-light bg-parchment transition hover:border-red/40 hover:border-red/35">
      {/* PDF preview */}
      <div className="relative aspect-[205/270] w-full overflow-hidden border-b border-line-light bg-parchment-alt">
        {!previewLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-parchment-alt">
            <FiFileText className="h-8 w-8 text-red" />
            <div className="h-1.5 w-28 overflow-hidden bg-parchment-alt">
              <div className="h-full w-1/2 animate-pulse bg-red/50" />
            </div>
            <span className="text-xs font-medium text-ink-soft">Loading preview…</span>
          </div>
        )}
        <iframe
          className={`pointer-events-none h-full w-[calc(100%+16px)] max-w-none border-0 bg-parchment transition-opacity duration-300 ${
            previewLoaded ?"opacity-100" :"opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setPreviewLoaded(true)}
          scrolling="no"
          src={resource.previewUrl}
          tabIndex={-1}
          title={`${resource.title} preview`}
        />
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {resource.group}
        </p>
        <h2 className="text-base leading-snug text-ink">
          {resource.title}
        </h2>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <button
            aria-expanded={shareOpen}
            className="inline-flex items-center gap-2 bg-red px-3 py-2 text-sm font-semibold text-parchment transition hover:bg-transparent hover:text-red"
            onClick={() => setShareOpen((v) => !v)}
            type="button"
          >
            {shareOpen ? <FiX size={15} /> : <FiShare2 size={15} />}
            {shareOpen ?"Close" :"Share"}
          </button>
          <a
            className="inline-flex items-center gap-2 border border-line-light px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-red hover:text-red"
            download
            href={resource.url}
          >
            <FiDownload size={15} />
            Download
          </a>
        </div>

        {shareOpen && (
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              className="inline-flex items-center gap-2 border border-line-light px-3 py-2 text-sm font-semibold text-ink-soft transition hover:border-red hover:text-red"
              href={emailHref}
            >
              <FiMail size={15} />
              Email
            </a>
            <a
              className="inline-flex items-center gap-2 border border-green-500 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
              href={whatsappHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaWhatsapp size={15} />
              WhatsApp
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default function ApplicationResourcesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");

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

  return (
    <div className="min-h-screen bg-parchment">
      {/* Page header + filters */}
      <section className="border-b border-line-light bg-parchment-alt px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-red">
              CatalystCue
            </p>
            <h1 className="mt-2 text-3xl text-ink sm:text-4xl">
              Application Resources
            </h1>
            <p className="mt-3 text-base leading-7 text-ink-soft">
              Browse application notes and downloadable PDFs from Inkarp's application library.
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
          Showing {filtered.length} of {applicationResources.length} resources
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
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
