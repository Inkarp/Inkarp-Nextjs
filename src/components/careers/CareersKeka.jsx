"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiMapPin,
} from "react-icons/fi";

const KEKA_IDENTIFIER = "357ac919-3c5b-4878-922a-e01bc5fd29cd";
const KEKA_DOMAIN = "https://inkarpinstrument.keka.com/careers/";
const KEKA_SCRIPT_SRC = `https://inkarpinstrument.keka.com/careers/api/embedjobs/js/${KEKA_IDENTIFIER}`;

export default function CareersKeka() {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    window.khConfig = {
      identifier: KEKA_IDENTIFIER,
      domain: KEKA_DOMAIN,
      targetContainer: "#khembedjobs",
    };

    const existing = document.querySelector(`script[src="${KEKA_SCRIPT_SRC}"]`);
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.src = KEKA_SCRIPT_SRC;
    script.defer = true;
    script.onload = () => setLoadError("");
    script.onerror = () => {
      setLoadError("Failed to load job listings. Please try again later.");
      setLoading(false);
    };
    document.head.appendChild(script);

    observerRef.current = new MutationObserver(() => {
      if (!containerRef.current) {
        return;
      }

      const parsed = parseJobsFromContainer(containerRef.current);
      if (parsed.length) {
        setJobs(parsed);
        setLoading(false);
      }
    });

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const currentScript = document.querySelector(
        `script[src="${KEKA_SCRIPT_SRC}"]`
      );
      if (currentScript) {
        currentScript.remove();
      }
    };
  }, []);

  return (
    <section className="relative mx-auto py-10 md:px-10 lg:px-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.08),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.08),transparent)]" />

      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <span className="font-maxot rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs uppercase text-zinc-950 sm:text-sm">
          Careers @ INKARP
        </span>
        <h2 className="font-maxot text-xl leading-tight text-[#E63946] sm:text-2xl">
          Let&apos;s Work Together
        </h2>
        <p className="max-w-2xl text-sm text-zinc-800 sm:text-base">
          Join a diverse, passionate team and do your best work - backed by a
          culture of growth.
        </p>
      </div>

      <div className="mt-6 rounded-lg p-2 sm:p-6">
        {loading && !loadError ? (
          <div className="py-10 text-center text-sm text-zinc-700">
            Loading job listings...
          </div>
        ) : null}

        {loadError ? (
          <div className="py-10 text-center text-sm text-red-600">
            {loadError}
          </div>
        ) : null}

        {!loading && !loadError && jobs.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-700">
            No openings currently. Please check back soon.
          </div>
        ) : null}

        {!loading && jobs.length > 0 ? (
          <div className="mx-auto max-w-5xl">
            {jobs.map((job, index) => (
              <JobCard job={job} key={`${job.title}-${index}`} />
            ))}

            <div className="mt-8 text-center">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#BE0010] to-[#E63946] px-5 py-2.5 text-sm font-semibold text-white shadow"
                href={KEKA_DOMAIN}
                rel="noopener noreferrer"
                target="_blank"
              >
                View all openings
                <FiArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="hidden"
        id="khembedjobs"
        ref={containerRef}
      />
    </section>
  );
}

function JobCard({ job }) {
  const { title, location, type, url } = job || {};
  const shownLocation = location?.trim() || "Remote / Not specified";
  const shownType = type?.trim() || "Not specified";

  return (
    <article className="mt-4 rounded-lg border border-zinc-200">
      <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="min-w-0">
          <h3 className="font-maxot mb-1 text-lg sm:text-xl">
            {title || "Untitled role"}
          </h3>

          <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-700 sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-[#F5F5F5] px-2.5 py-1">
              <FiMapPin aria-hidden="true" className="size-3.5 text-[#E63946]" />
              <span className="font-medium">{shownLocation}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-[#F5F5F5] px-2.5 py-1">
              <FiBriefcase
                aria-hidden="true"
                className="size-3.5 text-[#E63946]"
              />
              <span className="font-medium">{shownType}</span>
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <a
            aria-label={`Apply for ${title ?? "this role"}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#BE0010] to-[#E63946] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
            href={url || KEKA_DOMAIN}
            rel="noopener noreferrer"
            target="_blank"
          >
            Apply
            <FiArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

function parseJobsFromContainer(rootEl) {
  const anchors = Array.from(rootEl.querySelectorAll("a[href]"));
  const cards = groupByCard(anchors);
  const skipPatterns = /(keka\s*hire|powered\s*by|view\s+all\s+openings)/i;

  const jobs = cards
    .map((cardEl) => {
      const textAll = normalizeText(cardEl.innerText || cardEl.textContent || "");
      if (skipPatterns.test(textAll)) {
        return null;
      }

      let url =
        cardEl.querySelector("a[href]")?.getAttribute?.("href") || undefined;

      if (url && !/careers\/(job|jobs|opening|apply|details)/i.test(url)) {
        url = undefined;
      }

      const labeledTitle = matchLabel(textAll, /job\s*title\s*:\s*(.+?)(?:\n|$)/i);
      const headingTitle = extractTitle(cardEl);
      const title = labeledTitle || headingTitle || firstNonEmptyLine(textAll) || "";

      if (!title || skipPatterns.test(title)) {
        return null;
      }

      const location = cleanupLocation(extractLocationFromCard(cardEl, textAll));
      const type = extractTypeFromCard(cardEl, textAll);

      return {
        title: cleanup(title),
        location: cleanup(location)?.replace(/\s+/g, " "),
        type: cleanup(type)?.replace(/-/g, " ").toUpperCase(),
        url,
      };
    })
    .filter(Boolean);

  const seen = new Set();
  const uniqueJobs = [];
  for (const job of jobs) {
    const key = `${job.title}::${job.url || ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }

  return uniqueJobs;
}

function groupByCard(anchors) {
  const cards = new Set();
  anchors.forEach((anchor) => {
    let element = anchor;
    for (let i = 0; i < 6 && element && element.parentElement; i += 1) {
      element = element.parentElement;
      const className = (element.className || "").toString().toLowerCase();
      const isCardLike =
        className.includes("card") ||
        className.includes("job") ||
        className.includes("listing") ||
        element.tagName === "LI" ||
        element.tagName === "ARTICLE" ||
        element.tagName === "DIV";

      if (isCardLike && element !== document.body) {
        if ((element.children?.length || 0) > 0 && (element.innerText || "").length > 0) {
          cards.add(element);
          break;
        }
      }
    }
  });

  return Array.from(cards);
}

function extractTitle(cardEl) {
  const titleEl = cardEl.querySelector("h1, h2, h3, h4, .title, .job-title");
  return titleEl ? titleEl.innerText || titleEl.textContent || "" : null;
}

function firstNonEmptyLine(text) {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)[0] || "";
}

function extractLocationFromCard(cardEl, textAll) {
  const text = (textAll || "").trim();
  const explicitLocation = text.match(/Location:\s*([^\n\r]+)/i);
  if (explicitLocation?.[1]) {
    return explicitLocation[1].trim();
  }

  const locNode = cardEl.querySelector(
    '[data-location],[class*="location"],[class*="loc"],[class*="job-location"]'
  );

  if (locNode) {
    const locText = (locNode.innerText || locNode.textContent || "").trim();
    if (locText) {
      return locText.replace(/^\s*location[:\s]*/i, "").trim();
    }
  }

  const tokens = [
    "Remote",
    "Pan India",
    "India",
    "Chandigarh",
    "Bhopal",
    "Bengaluru",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Mumbai",
    "Delhi",
    "Noida",
    "Gurugram",
    "Gurgaon",
    "Kolkata",
    "Jaipur",
    "Ahmedabad",
    "Indore",
    "Kochi",
    "Cochin",
    "Vadodara",
    "Surat",
    "Vizag",
    "Visakhapatnam",
  ];
  const lowerText = text.toLowerCase();

  return (
    tokens.find((token) => lowerText.includes(token.toLowerCase())) || ""
  );
}

function extractTypeFromCard(cardEl, textAll) {
  const text = (textAll || "").toLowerCase();
  const textMatch = text.match(
    /\b(full[-\s]?time|part[-\s]?time|internship|contract)\b/i
  );
  if (textMatch?.[0]) {
    return textMatch[0];
  }

  const typeNode = cardEl.querySelector('[class*="type"],[class*="employment"]');
  return typeNode
    ? typeNode.innerText || typeNode.textContent || ""
    : "";
}

function normalizeText(value) {
  return (value || "")
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function matchLabel(text, regex) {
  const match = (text || "").match(regex);
  return match?.[1]?.trim() || "";
}

function cleanupLocation(value) {
  if (!value) {
    return value;
  }

  return value
    .replace(/^(?:remote\s*\/\s*)?location[:\s-]*/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanup(value) {
  if (!value) {
    return value;
  }

  return value.replace(/\s+/g, " ").replace(/[|]+/g, " ").trim();
}
