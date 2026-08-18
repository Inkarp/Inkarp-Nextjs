"use client";

import { useEffect, useMemo, useRef, useState } from"react";
import {
  FiArrowRight,
  FiBriefcase,
  FiMapPin,
  FiSearch,
  FiTag,
} from"react-icons/fi";
import RecTag from"@/components/home/RecTag";

const KEKA_IDENTIFIER ="357ac919-3c5b-4878-922a-e01bc5fd29cd";
const KEKA_DOMAIN ="https://inkarpinstrument.keka.com/careers/";
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
      containerRef.current.innerHTML ="";
    }

    window.khConfig = {
      identifier: KEKA_IDENTIFIER,
      domain: KEKA_DOMAIN,
      targetContainer:"#khembedjobs",
    };

    const readJobs = () => {
      if (!containerRef.current) return false;
      const parsed = parseJobsFromContainer(containerRef.current);
      if (!parsed.length) return false;
      setJobs(parsed);
      setLoading(false);
      return true;
    };

    // Watch the embed target before the script runs, otherwise a fast embed can
    // populate it before the observer attaches and the list never appears.
    observerRef.current = new MutationObserver(readJobs);
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
      readJobs();
    }

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

    // Re-check periodically, then give up rather than spinning forever - on a
    // slow or blocked mobile connection the embed may never populate.
    const poll = window.setInterval(() => {
      if (readJobs()) window.clearInterval(poll);
    }, 1200);
    const giveUp = window.setTimeout(() => {
      window.clearInterval(poll);
      if (!readJobs()) setLoading(false);
    }, 12000);

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(giveUp);

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
      const matchesSearch = !query || (job.title ||"").toLowerCase().includes(query);
      const matchesDepartment =
        departmentFilter ==="All" || job.department === departmentFilter;
      const matchesLocation =
        locationFilter ==="All" || job.location === locationFilter;

      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [jobs, searchTerm, departmentFilter, locationFilter]);

  return (
    <section className="relative mx-auto px-4 py-10 sm:px-6 md:px-10 lg:px-20">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-0">
        <RecTag>Careers @ Inkarp</RecTag>
        <h2 className="max-w-[24ch] text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
          Let&apos;s Work Together
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
          Join a diverse, passionate team and do your best work - backed by a
          culture of growth.
        </p>
      </div>

      <div className="mt-6 p-2 sm:p-6">
        {loading && !loadError ? (
          <div aria-busy="true" className="mx-auto max-w-[1180px]">
            <span className="sr-only">Loading job listings</span>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <div className="h-11 w-full animate-pulse bg-line-light/60 sm:max-w-md" />
              <div className="h-11 w-full animate-pulse bg-line-light/60 sm:max-w-[12rem]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="border border-line-light bg-white p-4 sm:p-6" key={index}>
                  <div className="h-5 w-3/4 animate-pulse bg-line-light/60" />
                  <div className="mt-3 flex gap-2">
                    <div className="h-6 w-24 animate-pulse bg-line-light/50" />
                    <div className="h-6 w-20 animate-pulse bg-line-light/50" />
                  </div>
                  <div className="mt-5 h-9 w-28 animate-pulse bg-line-light/50" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {loadError ? (
          <div className="py-10 text-center text-sm text-red">
            {loadError}
          </div>
        ) : null}

        {!loading && !loadError && jobs.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-ink-soft">
              We could not load the live openings here. You can view them all on our
              careers portal.
            </p>
            <a
              className="mt-4 inline-flex items-center gap-2 border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              href={KEKA_DOMAIN}
              rel="noopener noreferrer"
              target="_blank"
            >
              View all openings
              <FiArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        ) : null}

        {!loading && jobs.length > 0 ? (
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-6 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
              <div className="relative w-full sm:max-w-md sm:flex-1">
                <FiSearch
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
                />
                <input
                  aria-label="Search job titles"
                  className="w-full border border-line-light bg-white py-3 pl-11 pr-4 text-sm text-ink-soft focus:border-red focus:outline-none"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by job title..."
                  type="text"
                  value={searchTerm}
                />
              </div>

              {departmentOptions.length > 0 ? (
                <select
                  aria-label="Filter by department"
                  className="w-full border border-line-light bg-white px-4 py-2.5 text-sm text-ink-soft focus:border-red focus:outline-none sm:w-64"
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
                  className="w-full border border-line-light bg-white px-4 py-2.5 text-sm text-ink-soft focus:border-red focus:outline-none sm:w-80"
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
              <div className="py-10 text-center text-sm text-ink-soft">
                No roles match your filters. Try adjusting your search or filters.
              </div>
            )}

            <div className="mt-8 text-center">
              <a
                className="inline-flex items-center gap-2 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700"
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
  const shownLocation = location?.trim() ||"Remote / Not specified";
  const shownType = type?.trim() ||"Not specified";
  const shownDepartment = department?.trim();

  return (
    <article className="border border-line-light">
      <div className="flex flex-col justify-between gap-5 p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h3 className="text-lg font-semibold leading-snug text-ink sm:text-xl">
            {title ||"Untitled role"}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft sm:text-sm">
            <span className="inline-flex min-h-7 items-center gap-1 border border-line-light bg-parchment-alt px-2.5 py-1 leading-none">
              <FiMapPin aria-hidden="true" className="size-3.5 text-red" />
              <span className="font-medium">{shownLocation}</span>
            </span>
            <span className="inline-flex min-h-7 items-center gap-1 border border-line-light bg-parchment-alt px-2.5 py-1 leading-none">
              <FiBriefcase
                aria-hidden="true"
                className="size-3.5 text-red"
              />
              <span className="font-medium">{shownType}</span>
            </span>
            {shownDepartment ? (
              <span className="inline-flex min-h-7 items-center gap-1 border border-line-light bg-parchment-alt px-2.5 py-1 leading-none">
                <FiTag aria-hidden="true" className="size-3.5 text-red" />
                <span className="font-medium">{shownDepartment}</span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="shrink-0">
          <a
            aria-label={`Apply for ${title ??"this role"}`}
            className="inline-flex items-center gap-2 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:opacity-95"
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
      const textAll = normalizeText(cardEl.innerText || cardEl.textContent ||"");
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
      const title = labeledTitle || headingTitle || firstNonEmptyLine(textAll) ||"";

      if (!title || skipPatterns.test(title)) {
        return null;
      }

      const location = cleanupLocation(extractLocationFromCard(cardEl, textAll));
      const type = extractTypeFromCard(cardEl, textAll);
      const department =
        extractDepartmentFromCard(cardEl, textAll) || departmentByCard.get(cardEl) ||"";

      return {
        title: cleanup(title),
        location: cleanup(location)?.replace(/\s+/g,""),
        type: cleanup(type)?.replace(/-/g,"").toUpperCase(),
        department: cleanup(department),
        url,
      };
    })
    .filter(Boolean);

  const seen = new Set();
  const uniqueJobs = [];
  for (const job of jobs) {
    const key = `${job.title}::${job.url ||""}`;
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
      const className = (element.className ||"").toString().toLowerCase();
      const isCardLike =
        className.includes("card") ||
        className.includes("job") ||
        className.includes("listing") ||
        element.tagName ==="LI" ||
        element.tagName ==="ARTICLE" ||
        element.tagName ==="DIV";

      if (isCardLike && element !== document.body) {
        if ((element.children?.length || 0) > 0 && (element.innerText ||"").length > 0) {
          cards.add(element);
          break;
        }
      }
    }
  });

  return Array.from(cards);
}

function extractTitle(cardEl) {
  const titleEl = cardEl.querySelector(".kh-job-title, h1, h2, h3, h4, .title, .job-title"
  );
  return titleEl ? titleEl.innerText || titleEl.textContent ||"" : null;
}

function mapDepartmentsByHeading(rootEl) {
  const map = new Map();
  const headingSelector = 'h1[class*="kh-font-weight-600"], h2[class*="kh-font-weight-600"]';
  const cardSelector = '.kh-job-card, [class*="kh-job-card"]';
  const nodes = rootEl.querySelectorAll(`${headingSelector}, ${cardSelector}`);

  let currentDepartment ="";
  nodes.forEach((el) => {
    if (el.matches(headingSelector)) {
      const text = firstNonEmptyLine(
        normalizeText(el.innerText || el.textContent ||"")
      ).replace(/\s*\d+\s*jobs?\s*$/i,"");
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
  return (text ||"")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)[0] ||"";
}

function extractLocationFromCard(cardEl, textAll) {
  const text = (textAll ||"").trim();
  const explicitLocation = text.match(/Location:\s*([^\n\r]+)/i);
  if (explicitLocation?.[1]) {
    return explicitLocation[1].trim();
  }

  const locNode = cardEl.querySelector(
    '[data-location],[class*="location"],[class*="loc"],[class*="job-location"]'
  );

  if (locNode) {
    const locText = (locNode.innerText || locNode.textContent ||"").trim();
    if (locText) {
      return locText.replace(/^\s*location[:\s]*/i,"").trim();
    }
  }

  const tokens = ["Remote","Pan India","India","Chandigarh","Bhopal","Bengaluru","Bangalore","Hyderabad","Chennai","Pune","Mumbai","Delhi","Noida","Gurugram","Gurgaon","Kolkata","Jaipur","Ahmedabad","Indore","Kochi","Cochin","Vadodara","Surat","Vizag","Visakhapatnam",
  ];
  const lowerText = text.toLowerCase();

  return (
    tokens.find((token) => lowerText.includes(token.toLowerCase())) ||""
  );
}

function extractDepartmentFromCard(cardEl, textAll) {
  const text = (textAll ||"").trim();
  const explicitDepartment = text.match(/Department\s*:\s*([^\n\r]+)/i);
  if (explicitDepartment?.[1]) {
    return explicitDepartment[1].trim();
  }

  const deptNode = cardEl.querySelector(
    '[data-department],[class*="department"],[class*="category"]'
  );

  if (deptNode) {
    const deptText = (deptNode.innerText || deptNode.textContent ||"").trim();
    if (deptText) {
      return deptText.replace(/^\s*department[:\s]*/i,"").trim();
    }
  }

  return"";
}

function extractTypeFromCard(cardEl, textAll) {
  const text = (textAll ||"").toLowerCase();
  const textMatch = text.match(
    /\b(full[-\s]?time|part[-\s]?time|internship|contract)\b/i
  );
  if (textMatch?.[0]) {
    return textMatch[0];
  }

  const typeNode = cardEl.querySelector('[class*="type"],[class*="employment"]');
  return typeNode
    ? typeNode.innerText || typeNode.textContent ||""
    :"";
}

function normalizeText(value) {
  return (value ||"")
    .replace(/\u00A0/g,"")
    .replace(/[ \t]+\n/g,"\n")
    .replace(/\n{3,}/g,"\n\n")
    .trim();
}

function matchLabel(text, regex) {
  const match = (text ||"").match(regex);
  return match?.[1]?.trim() ||"";
}

function cleanupLocation(value) {
  if (!value) {
    return value;
  }

  return value
    .replace(/^(?:remote\s*\/\s*)?location[:\s-]*/i,"")
    .replace(/\s{2,}/g,"")
    .trim();
}

function cleanup(value) {
  if (!value) {
    return value;
  }

  return value.replace(/\s+/g,"").replace(/[|]+/g,"").trim();
}
