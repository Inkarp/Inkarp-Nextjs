"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowUpRight, FiChevronDown, FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { LuBriefcaseBusiness } from "react-icons/lu";
import EmptyStateIcon from "@/components/common/EmptyStateIcon";
import RecTag from "@/components/home/RecTag";

const KEKA_IDENTIFIER ="357ac919-3c5b-4878-922a-e01bc5fd29cd";
const KEKA_DOMAIN ="https://inkarpinstrument.keka.com/careers/";
const KEKA_SCRIPT_SRC = `https://inkarpinstrument.keka.com/careers/api/embedjobs/js/${KEKA_IDENTIFIER}`;

// Rows shown before "Show more": the full list runs past 30 roles.
const INITIAL_ROWS = 10;
const ALL = "All";

const pad = (value) => String(value).padStart(2, "0");

// Keka sends some departments in capitals ("SERVICES"); show them like the rest.
function displayDepartment(value) {
  const text = value?.trim() || "";
  if (text.length > 3 && text === text.toUpperCase()) {
    return text.charAt(0) + text.slice(1).toLowerCase();
  }
  return text;
}

export default function CareersKeka() {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState(ALL);
  const [locationFilter, setLocationFilter] = useState(ALL);
  const [showAll, setShowAll] = useState(false);

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

  // Search + location first, so each department chip can show how many of
  // those roles it holds.
  const searchedJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch = !query || (job.title ||"").toLowerCase().includes(query);
      const matchesLocation =
        locationFilter === ALL || job.location === locationFilter;

      return matchesSearch && matchesLocation;
    });
  }, [jobs, searchTerm, locationFilter]);

  const filteredJobs = useMemo(
    () =>
      departmentFilter === ALL
        ? searchedJobs
        : searchedJobs.filter((job) => job.department === departmentFilter),
    [searchedJobs, departmentFilter]
  );

  const departmentChips = useMemo(
    () => [
      { value: ALL, label: "All roles", count: searchedJobs.length },
      ...departmentOptions.map((department) => ({
        value: department,
        label: displayDepartment(department),
        count: searchedJobs.filter((job) => job.department === department).length,
      })),
    ],
    [departmentOptions, searchedJobs]
  );

  // Figures for the readout, straight from the live Keka list.
  const readouts = useMemo(() => {
    const cities = locationOptions.filter((location) => !/remote/i.test(location));
    return [
      { label: "Open roles", value: jobs.length },
      { label: "Cities", value: cities.length },
      { label: "Teams hiring", value: departmentOptions.length },
    ];
  }, [jobs.length, locationOptions, departmentOptions]);

  const listRef = useRef(null);
  const visibleJobs = showAll ? filteredJobs : filteredJobs.slice(0, INITIAL_ROWS);
  const hiddenCount = filteredJobs.length - visibleJobs.length;
  const isFiltered = Boolean(searchTerm.trim()) || departmentFilter !== ALL || locationFilter !== ALL;

  // Any filter change starts the list collapsed again.
  const updateSearch = (value) => {
    setSearchTerm(value);
    setShowAll(false);
  };
  const updateDepartment = (value) => {
    setDepartmentFilter(value);
    setShowAll(false);
  };
  const updateLocation = (value) => {
    setLocationFilter(value);
    setShowAll(false);
  };
  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter(ALL);
    setLocationFilter(ALL);
    setShowAll(false);
  };
  const collapse = () => {
    setShowAll(false);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ready = !loading && !loadError && jobs.length > 0;

  return (
    <section className="lab-pattern relative scroll-mt-20 bg-parchment-alt px-4 py-14 sm:px-6 lg:px-8 lg:py-20" id="open-roles">
      <div className="mx-auto max-w-[1180px]">
        {/* ── Heading + live readout ── */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <RecTag>Careers @ Inkarp</RecTag>
            <h2 className="max-w-[24ch] text-[28px] tracking-tight text-ink sm:text-4xl lg:text-[44px]">
              Let&apos;s Work Together
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
              Join a diverse, passionate team and do your best work - backed by a
              culture of growth.
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-soft">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-red motion-safe:animate-pulse" />
              Live openings
            </p>
            <dl className="grid grid-cols-3 bg-ink text-white">
              {readouts.map((readout, index) => (
                <div
                  className={`flex min-w-[104px] flex-col-reverse px-4 py-3.5 sm:min-w-[132px] sm:px-5 ${
                    index ? "border-l border-white/15" : ""
                  }`}
                  key={readout.label}
                >
                  <dt className="mt-2 text-[10.5px] uppercase leading-snug tracking-[0.1em] text-white/60">
                    {readout.label}
                  </dt>
                  <dd className="font-mono text-[26px] font-semibold leading-none tabular-nums sm:text-[34px]">
                    {ready ? pad(readout.value) : "--"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {loading && !loadError ? (
          <div aria-busy="true" className="mt-10">
            <span className="sr-only">Loading job listings</span>
            <div className="h-[110px] animate-pulse border border-line-light bg-parchment-alt/60" />
            <div className="mt-4 border-t-2 border-ink bg-white">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="flex items-center gap-4 border-b border-line-light px-3 py-5 sm:px-5" key={index}>
                  <div className="h-3 w-6 animate-pulse bg-line-light/70" />
                  <div className="flex-1">
                    <div className="h-4 w-2/5 animate-pulse bg-line-light/70" />
                    <div className="mt-2 h-3 w-1/5 animate-pulse bg-line-light/50" />
                  </div>
                  <div className="h-10 w-24 animate-pulse bg-line-light/50" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {loadError || (!loading && jobs.length === 0) ? (
          <div className="mt-10 border border-line-light bg-white px-6 py-12 text-center">
            <EmptyStateIcon icon={LuBriefcaseBusiness} />
            <p className="mx-auto max-w-md text-sm text-ink-soft">
              {loadError ||
                "We could not load the live openings here. You can view them all on our careers portal."}
            </p>
            <a
              className="mt-5 inline-flex h-11 items-center gap-2 border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              href={KEKA_DOMAIN}
              rel="noopener noreferrer"
              target="_blank"
            >
              View all openings
              <FiArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        ) : null}

        {ready ? (
          <>
            {/* ── Toolbar: search, location, department chips ── */}
            <div className="mt-10 border border-line-light bg-white">
              <div className="flex flex-col sm:flex-row">
                <div className="relative flex-1 border-b border-line-light transition-colors focus-within:bg-parchment-alt/60 sm:border-b-0 sm:border-r">
                  <FiSearch
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
                  />
                  <input
                    aria-label="Search job titles"
                    className="h-14 w-full bg-transparent pl-11 pr-11 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
                    onChange={(event) => updateSearch(event.target.value)}
                    placeholder="Search by job title, e.g. Sales, Service, Marketing"
                    type="search"
                    value={searchTerm}
                  />
                  {searchTerm ? (
                    <button
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-ink-soft transition hover:text-red"
                      onClick={() => updateSearch("")}
                      type="button"
                    >
                      <FiX aria-hidden="true" className="size-4" />
                    </button>
                  ) : null}
                </div>

                {locationOptions.length > 0 ? (
                  <div className="relative transition-colors focus-within:bg-parchment-alt/60 sm:w-72">
                    <FiMapPin
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-red"
                    />
                    <select
                      aria-label="Filter by location"
                      className="h-14 w-full cursor-pointer appearance-none bg-transparent pl-11 pr-10 text-sm text-ink focus:outline-none"
                      onChange={(event) => updateLocation(event.target.value)}
                      value={locationFilter}
                    >
                      <option value={ALL}>All locations</option>
                      {locationOptions.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
                    />
                  </div>
                ) : null}
              </div>

              {departmentOptions.length > 0 ? (
                <div
                  aria-label="Filter by team"
                  className="flex items-center gap-2 overflow-x-auto border-t border-line-light px-3 py-3 sm:px-4"
                  role="group"
                >
                  {departmentChips.map((chip) => {
                    const active = departmentFilter === chip.value;
                    return (
                      <button
                        aria-pressed={active}
                        className={`inline-flex h-9 shrink-0 items-center gap-2 border px-3.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          active
                            ? "border-ink bg-ink text-white"
                            : "border-line-light bg-white text-ink hover:border-ink/40"
                        }`}
                        disabled={!chip.count && !active}
                        key={chip.value}
                        onClick={() => updateDepartment(chip.value)}
                        type="button"
                      >
                        {chip.label}
                        <span className={`font-mono text-xs tabular-nums ${active ? "text-white/70" : "text-ink-soft"}`}>
                          {chip.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* ── Ledger ── */}
            <div className="mt-6 flex items-center justify-between gap-4" ref={listRef} style={{ scrollMarginTop: 112 }}>
              <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.12em] text-ink-soft">
                {filteredJobs.length
                  ? `Showing ${visibleJobs.length} of ${filteredJobs.length} ${filteredJobs.length === 1 ? "role" : "roles"}`
                  : "No roles match"}
              </p>
              {isFiltered ? (
                <button
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-red underline-offset-4 hover:underline"
                  onClick={clearFilters}
                  type="button"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            {filteredJobs.length > 0 ? (
              <div className="mt-3 border-x border-b border-t-2 border-x-line-light border-b-line-light border-t-ink bg-white">
                <div
                  aria-hidden="true"
                  className="hidden grid-cols-[2.75rem_minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_7.5rem] gap-x-4 border-b border-line-light px-5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft md:grid"
                >
                  <span>No.</span>
                  <span>Role</span>
                  <span>Team</span>
                  <span>Location</span>
                  <span />
                </div>
                <ol className={hiddenCount > 0 || showAll ? "" : "[&>li:last-child]:border-b-0"}>
                  {visibleJobs.map((job, index) => (
                    <JobRow job={job} key={`${job.title}-${job.url ||""}-${index}`} number={index + 1} />
                  ))}
                </ol>

                {hiddenCount > 0 || showAll ? (
                  <button
                    aria-expanded={showAll}
                    className="group flex w-full items-center justify-center gap-2 py-4 text-sm font-semibold text-ink transition hover:bg-parchment-alt hover:text-red"
                    onClick={showAll ? collapse : () => setShowAll(true)}
                    type="button"
                  >
                    {showAll ? "Show fewer roles" : `Show ${hiddenCount} more ${hiddenCount === 1 ? "role" : "roles"}`}
                    <FiChevronDown
                      aria-hidden="true"
                      className={`size-4 transition-transform ${showAll ? "rotate-180" : "group-hover:translate-y-0.5"}`}
                    />
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="mt-3 border-x border-b border-t-2 border-x-line-light border-b-line-light border-t-ink bg-white px-6 py-12 text-center">
                <EmptyStateIcon icon={LuBriefcaseBusiness} />
                <p className="text-sm text-ink-soft">No roles match your search. Try another title, team or location.</p>
                <button
                  className="mt-4 text-sm font-semibold text-red underline-offset-4 hover:underline"
                  onClick={clearFilters}
                  type="button"
                >
                  Clear filters
                </button>
              </div>
            )}

            <p className="mt-5 text-right text-sm text-ink-soft">
              Every opening is also listed on our{" "}
              <a
                className="inline-flex items-center gap-1 font-semibold text-red underline-offset-4 hover:underline"
                href={KEKA_DOMAIN}
                rel="noopener noreferrer"
                target="_blank"
              >
                Keka careers portal
                <FiArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </p>
          </>
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

function JobRow({ job, number }) {
  const { title, location, type, department, url } = job || {};
  const shownLocation = location?.trim() ||"Remote / Not specified";
  const shownType = type?.trim() ||"Not specified";
  const shownDepartment = displayDepartment(department);

  return (
    <li className="group relative border-b border-line-light transition-colors hover:bg-parchment-alt/70 focus-within:bg-parchment-alt/70">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-red transition-transform duration-300 group-focus-within:scale-y-100 group-hover:scale-y-100 motion-reduce:transition-none"
      />
      <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-3 px-3 py-4 sm:gap-x-4 sm:px-5 md:grid-cols-[2.75rem_minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_7.5rem] md:py-5">
        <span className="font-mono text-xs tabular-nums text-ink-soft">{pad(number)}</span>

        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-ink transition-colors group-hover:text-red sm:text-lg">
            {title ||"Untitled role"}
          </h3>
          <p className="mt-1 hidden font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft md:block">
            {shownType}
          </p>
          {/* Phones: one plain line instead of the Team / Location columns. */}
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-soft md:hidden">
            <span className="inline-flex items-center gap-1">
              <FiMapPin aria-hidden="true" className="size-3 text-red" />
              {shownLocation}
            </span>
            {shownDepartment ? <span aria-hidden="true">·</span> : null}
            {shownDepartment ? <span>{shownDepartment}</span> : null}
            <span aria-hidden="true">·</span>
            <span className="capitalize">{shownType.toLowerCase()}</span>
          </p>
        </div>

        <span className="hidden md:block">
          {shownDepartment ? (
            <span className="inline-flex border border-line-light bg-white px-2.5 py-1 text-xs font-medium text-ink">
              {shownDepartment}
            </span>
          ) : (
            <span className="text-xs text-ink-soft">-</span>
          )}
        </span>

        <span className="hidden min-w-0 items-center gap-1.5 text-sm text-ink md:flex">
          <FiMapPin aria-hidden="true" className="size-3.5 shrink-0 text-red" />
          <span className="truncate">{shownLocation}</span>
        </span>

        {/* The link covers the whole row (after:inset-0), so any part of it opens the role. */}
        <a
          aria-label={`Apply for ${title ??"this role"} (opens our Keka careers portal in a new tab)`}
          className="inline-flex size-10 items-center justify-center gap-1.5 border border-rose-200 bg-rose-50 text-sm font-semibold sm:w-auto sm:px-3.5 text-rose-700 transition after:absolute after:inset-0 after:content-[''] group-hover:border-red group-hover:bg-red group-hover:text-white md:justify-self-end"
          href={url || KEKA_DOMAIN}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="hidden sm:inline">Apply</span>
          <FiArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </a>
      </div>
    </li>
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
    .replace(/\u00A0/g, " ")
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
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanup(value) {
  if (!value) {
    return value;
  }

  return value.replace(/\s+/g, " ").replace(/[|]+/g, " ").trim();
}
