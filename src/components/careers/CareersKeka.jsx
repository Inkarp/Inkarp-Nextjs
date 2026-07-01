"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiMapPin,
  FiSearch,
  FiTag,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

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

  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.department).filter(Boolean))).sort(),
    [jobs]
  );

  const locationOptions = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.location).filter(Boolean))).sort(),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch = !query || (job.title || "").toLowerCase().includes(query);
      const matchesDepartment =
        departmentFilter === "All" || job.department === departmentFilter;
      const matchesLocation =
        locationFilter === "All" || job.location === locationFilter;

      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [jobs, searchTerm, departmentFilter, locationFilter]);

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
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
              <div className="relative w-full sm:max-w-md sm:flex-1">
                <FiSearch
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
                />
                <input
                  aria-label="Search job titles"
                  className="w-full rounded-full border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-800 focus:border-[#E63946] focus:outline-none"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by job title..."
                  type="text"
                  value={searchTerm}
                />
              </div>

              {departmentOptions.length > 0 ? (
                <select
                  aria-label="Filter by department"
                  className="w-full rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-800 focus:border-[#E63946] focus:outline-none sm:w-64"
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                  value={departmentFilter}
                >
                  <option value="All">All Departments</option>
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              ) : null}

              {locationOptions.length > 0 ? (
                <select
                  aria-label="Filter by location"
                  className="w-full rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-800 focus:border-[#E63946] focus:outline-none sm:w-80"
                  onChange={(event) => setLocationFilter(event.target.value)}
                  value={locationFilter}
                >
                  <option value="All">All Locations</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredJobs.map((job, index) => (
                  <JobCard job={job} key={`${job.title}-${index}`} />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-zinc-700">
                No roles match your filters. Try adjusting your search or filters.
              </div>
            )}

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
  const { title, location, type, department, url } = job || {};
  const shownLocation = location?.trim() || "Remote / Not specified";
  const shownType = type?.trim() || "Not specified";
  const shownDepartment = department?.trim();

  return (
    <article className="rounded-lg border border-zinc-200">
      <div className="flex flex-col justify-between gap-5 p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h3 className="font-maxot text-lg leading-snug text-zinc-950 sm:text-xl">
            {title || "Untitled role"}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-700 sm:text-sm">
            <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-zinc-200 bg-[#F5F5F5] px-2.5 py-1 leading-none">
              <FiMapPin aria-hidden="true" className="size-3.5 text-[#E63946]" />
              <span className="font-medium">{shownLocation}</span>
            </span>
            <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-zinc-200 bg-[#F5F5F5] px-2.5 py-1 leading-none">
              <FiBriefcase
                aria-hidden="true"
                className="size-3.5 text-[#E63946]"
              />
              <span className="font-medium">{shownType}</span>
            </span>
            {shownDepartment ? (
              <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-zinc-200 bg-[#F5F5F5] px-2.5 py-1 leading-none">
                <FiTag aria-hidden="true" className="size-3.5 text-[#E63946]" />
                <span className="font-medium">{shownDepartment}</span>
              </span>
            ) : null}
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
  const kekaCards = Array.from(rootEl.querySelectorAll(".kh-job-card"));
  const anchors = Array.from(rootEl.querySelectorAll("a[href]"));
  const cards = kekaCards.length ? kekaCards : groupByCard(anchors);
  const departmentByCard = mapDepartmentsByHeading(rootEl);
  const skipPatterns = /(keka\s*hire|powered\s*by|view\s+all\s+openings)/i;

  const jobs = cards
    .map((cardEl) => {
      const textAll = normalizeText(cardEl.innerText || cardEl.textContent || "");
      if (skipPatterns.test(textAll)) {
        return null;
      }

      let url =
        cardEl.getAttribute?.("href") ||
        cardEl.querySelector("a[href]")?.getAttribute?.("href") ||
        undefined;

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
      const department =
        extractDepartmentFromCard(cardEl, textAll) || departmentByCard.get(cardEl) || "";

      return {
        title: cleanup(title),
        location: cleanup(location)?.replace(/\s+/g, " "),
        type: cleanup(type)?.replace(/-/g, " ").toUpperCase(),
        department: cleanup(department),
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
  const titleEl = cardEl.querySelector(
    ".kh-job-title, h1, h2, h3, h4, .title, .job-title"
  );
  return titleEl ? titleEl.innerText || titleEl.textContent || "" : null;
}

function mapDepartmentsByHeading(rootEl) {
  const map = new Map();
  const headingSelector = 'h1[class*="kh-font-weight-600"], h2[class*="kh-font-weight-600"]';
  const cardSelector = '.kh-job-card, [class*="kh-job-card"]';
  const nodes = rootEl.querySelectorAll(`${headingSelector}, ${cardSelector}`);

  let currentDepartment = "";
  nodes.forEach((el) => {
    if (el.matches(headingSelector)) {
      const text = firstNonEmptyLine(
        normalizeText(el.innerText || el.textContent || "")
      ).replace(/\s*\d+\s*jobs?\s*$/i, "");
      if (text) {
        currentDepartment = text;
      }
      return;
    }

    map.set(el, currentDepartment);
  });

  return map;
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

function extractDepartmentFromCard(cardEl, textAll) {
  const text = (textAll || "").trim();
  const explicitDepartment = text.match(/Department\s*:\s*([^\n\r]+)/i);
  if (explicitDepartment?.[1]) {
    return explicitDepartment[1].trim();
  }

  const deptNode = cardEl.querySelector(
    '[data-department],[class*="department"],[class*="category"]'
  );

  if (deptNode) {
    const deptText = (deptNode.innerText || deptNode.textContent || "").trim();
    if (deptText) {
      return deptText.replace(/^\s*department[:\s]*/i, "").trim();
    }
  }

  return "";
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
