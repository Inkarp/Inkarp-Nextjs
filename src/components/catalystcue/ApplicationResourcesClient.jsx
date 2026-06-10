"use client";

import { useMemo, useState } from "react";
import {
  FiDownload,
  FiFileText,
  FiMail,
  FiSearch,
  FiShare2,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { applicationResources, getIssueOptions, volumeOptions } from "@/data/applicationResources";

function ResourceCard({ resource }) {
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const absoluteUrl =
    typeof window !== "undefined"
      ? new URL(resource.url, window.location.origin).href
      : resource.url;

  const shareText = `Inkarp Application Resource: ${resource.title}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${absoluteUrl}`)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${absoluteUrl}`)}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-[#BE0010]/40 hover:shadow-md">
      {/* PDF preview */}
      <div className="relative aspect-[205/270] w-full overflow-hidden border-b border-zinc-100 bg-zinc-50">
        {!previewLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-50">
            <FiFileText className="h-8 w-8 text-[#BE0010]" />
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-[#BE0010]/50" />
            </div>
            <span className="text-xs font-medium text-zinc-400">Loading preview…</span>
          </div>
        )}
        <iframe
          className={`pointer-events-none h-full w-[calc(100%+16px)] max-w-none border-0 bg-white transition-opacity duration-300 ${
            previewLoaded ? "opacity-100" : "opacity-0"
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
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          {resource.group}
        </p>
        <h2 className="font-maxot text-base leading-snug text-zinc-900">
          {resource.title}
        </h2>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <button
            aria-expanded={shareOpen}
            className="inline-flex items-center gap-2 rounded-lg bg-[#BE0010] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#9a000d]"
            onClick={() => setShareOpen((v) => !v)}
            type="button"
          >
            {shareOpen ? <FiX size={15} /> : <FiShare2 size={15} />}
            {shareOpen ? "Close" : "Share"}
          </button>
          <a
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-[#BE0010] hover:text-[#BE0010]"
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
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-[#BE0010] hover:text-[#BE0010]"
              href={emailHref}
            >
              <FiMail size={15} />
              Email
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-lg border border-green-500 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
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
    <div className="min-h-screen bg-white">
      {/* Page header + filters */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">
              CatalystCue
            </p>
            <h1 className="font-maxot mt-2 text-3xl text-zinc-900 sm:text-4xl">
              Application Resources
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Browse application notes and downloadable PDFs from Inkarp's application library.
            </p>
          </div>

          {/* Search + filters */}
          <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-[#BE0010] focus:ring-2 focus:ring-[#BE0010]/20"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources…"
                type="search"
                value={searchTerm}
              />
            </div>

            <select
              aria-label="Filter by volume"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#BE0010] focus:ring-2 focus:ring-[#BE0010]/20"
              onChange={(e) => {
                setSelectedVolume(e.target.value);
                setSelectedIssue("");
              }}
              value={selectedVolume}
            >
              <option value="">All Volumes</option>
              {volumeOptions.map((v) => (
                <option key={v} value={v}>
                  {v.replace("-", " ")}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by issue"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#BE0010] focus:ring-2 focus:ring-[#BE0010]/20"
              onChange={(e) => setSelectedIssue(e.target.value)}
              value={selectedIssue}
            >
              <option value="">All Issues</option>
              {issueOptions.map((i) => (
                <option key={i} value={i}>
                  {i.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-zinc-500">
          Showing {filtered.length} of {applicationResources.length} resources
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
            <FiFileText className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
            <p className="text-sm text-zinc-500">
              No resources match your search.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
