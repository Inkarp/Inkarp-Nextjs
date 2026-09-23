"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiArrowRight, FiBriefcase, FiMail, FiMapPin, FiTarget, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import FinderOptionCombobox from "@/components/solution-finder/FinderOptionCombobox";
import { pushEvent } from "@/lib/analytics";
import { finderPlacement, finderPrefillForPath } from "@/lib/finderPlacement";

const PAYLOAD_KEY = "inkarp:solution-finder-payload";
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const GRADIENT = "bg-[linear-gradient(110deg,#7c3aed,#c026d3_55%,#ec4899)]";
const UNIVERSE_BACKGROUND = "bg-[radial-gradient(circle_at_12%_20%,rgba(168,85,247,.34),transparent_26%),radial-gradient(circle_at_88%_75%,rgba(236,72,153,.26),transparent_28%),linear-gradient(110deg,#100822_0%,#24114a_48%,#0d1938_100%)]";
const FIELD_SHELL = "flex h-12 items-center rounded-full bg-white/15 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_6px_18px_rgba(8,4,24,.16)] ring-1 ring-white/15 backdrop-blur-md transition focus-within:bg-white/22 focus-within:ring-2 focus-within:ring-fuchsia-300/70";
const INPUT_CLASS = "min-w-0 flex-1 bg-transparent text-sm font-semibold text-white caret-fuchsia-200 outline-none placeholder:font-medium placeholder:text-white/60";
const FIELD_NAMES = { institution: "institution", objective: "interest", role: "role" };

/** Which form of the prompt this visitor actually sees, for analytics. */
function visiblePrompt(placement) {
  if (placement !== "stripe" || window.innerWidth < 1024) return "launcher";
  return window.innerWidth >= 1280 ? "stripe" : "stripe-compact";
}

function missingFields({ email, institution, objective, role }) {
  const missing = [];
  if (!institution) missing.push("institution");
  if (!role.value) missing.push("role");
  if (!objective?.value) missing.push("objective");
  if (!EMAIL_PATTERN.test(email.trim())) missing.push("email");
  return missing;
}

/** e.g. "Choose your role and interest, and enter your email to continue." */
function missingMessage(missing, { email, typedInstitution }) {
  const names = missing.filter((field) => field !== "email").map((field) => FIELD_NAMES[field]);
  const parts = [];
  if (names.length === 1 && missing.includes("institution") && typedInstitution) {
    parts.push("pick your institution from the list (or add it as new)");
  } else if (names.length) {
    parts.push(`choose your ${names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]}`);
  }
  if (missing.includes("email")) parts.push(email.trim() ? "check your email address" : "enter your email");
  const sentence = parts.join(names.length > 1 ? ", and " : " and ");
  return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)} to continue.`;
}

function openFinderDialog(detail) {
  window.dispatchEvent(new CustomEvent("inkarp:open-solution-finder", { detail }));
}

/**
 * The site-wide Solution Finder: a campaign stripe under the header on discovery
 * pages, a floating pill elsewhere, and a dialog either of them (or a product
 * page's prompt) can open. `finderPlacement` decides which page gets what.
 */
export default function HomeSolutionFinder() {
  const router = useRouter();
  const pathname = usePathname();
  const placement = finderPlacement(pathname);
  // Deliberately not dismissible: the finder is how visitors get to the right
  // products, so it stays on every page it belongs to.
  const showStripe = placement === "stripe";
  const showLauncher = placement !== "none";

  const stripeRef = useRef(null);
  const institutionRef = useRef(null);
  const startedRef = useRef(false);
  const [institution, setInstitution] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [addingInstitution, setAddingInstitution] = useState(false);
  const [role, setRole] = useState({ label: "", value: "" });
  const [objective, setObjective] = useState(null);
  const [objectiveKey, setObjectiveKey] = useState(0);
  const [email, setEmail] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [dialog, setDialog] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [stripeInView, setStripeInView] = useState(true);
  const [prefillPath, setPrefillPath] = useState(null);

  // A workflow stage or blog post pre-selects the matching interest until the
  // visitor picks one themselves. Adjusted during render rather than in an
  // effect, so the field never renders empty first.
  if (pathname !== prefillPath) {
    setPrefillPath(pathname);
    setAttempted(false);
    setGenerateError("");
    if (!objective || objective.prefilled) {
      const prefill = finderPrefillForPath(pathname);
      setObjective(prefill ? { ...prefill, prefilled: true } : null);
      setObjectiveKey((key) => key + 1);
    }
  }

  // The pill stands in for the stripe once the stripe scrolls out of view.
  useEffect(() => {
    const node = stripeRef.current;
    if (!showStripe || !node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setStripeInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [showStripe]);

  useEffect(() => {
    startedRef.current = false;
    if (placement === "none") return;
    pushEvent("finder_prompt_view", { page: pathname, prompt: visiblePrompt(placement) });
  }, [pathname, placement]);

  useEffect(() => {
    let frame;
    const openDialog = (event) => {
      const source = event.detail?.source ?? "launcher";
      const prefill = event.detail?.objective;
      if (prefill?.value) {
        setObjective((current) => (current && !current.prefilled ? current : { ...prefill, prefilled: true }));
        setObjectiveKey((key) => key + 1);
      }
      setDialog({ source });
      setDialogVisible(false);
      frame = window.requestAnimationFrame(() => setDialogVisible(true));
      pushEvent("finder_open", { page: window.location.pathname, source });
    };

    window.addEventListener("inkarp:open-solution-finder", openDialog);
    return () => {
      window.removeEventListener("inkarp:open-solution-finder", openDialog);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!dialog) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setDialogVisible(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [dialog]);

  // Unmount the dialog once its closing transition has played.
  useEffect(() => {
    if (!dialog || dialogVisible) return undefined;
    const timer = window.setTimeout(() => setDialog(null), 400);
    return () => window.clearTimeout(timer);
  }, [dialog, dialogVisible]);

  useEffect(() => {
    const trimmed = query.trim();
    if (institution?.name === trimmed || trimmed.length < 2) return undefined;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      fetch(`/api/institutions/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(response))
        .then((data) => { setResults(data.results ?? []); setResultsOpen(true); })
        .catch((error) => { if (error?.name !== "AbortError") setResults([]); })
        .finally(() => setSearching(false));
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [institution, query]);

  useEffect(() => {
    const closeResults = (event) => {
      if (!institutionRef.current?.contains(event.target)) setResultsOpen(false);
    };
    document.addEventListener("mousedown", closeResults);
    return () => document.removeEventListener("mousedown", closeResults);
  }, []);

  const markStarted = (source) => {
    if (startedRef.current) return;
    startedRef.current = true;
    pushEvent("finder_start", { page: pathname, source });
  };

  const openFromLauncher = () => {
    // Phones get the full-page wizard; the dialog is built for desktop.
    if (window.matchMedia("(min-width: 1024px)").matches) {
      openFinderDialog({ source: "launcher" });
      return;
    }
    pushEvent("finder_open", { page: pathname, source: "launcher" });
    router.push("/solution-finder");
  };

  const generate = (event, source) => {
    const missing = missingFields({ email, institution, objective, role });
    if (missing.length) {
      setAttempted(true);
      pushEvent("finder_blocked", { missing: missing.join(","), page: pathname, source });
      event.currentTarget
        .closest("[data-finder-form]")
        ?.querySelector(`[data-field="${missing[0]}"] input`)
        ?.focus();
      return;
    }

    setGenerateError("");
    try {
      window.sessionStorage.setItem(PAYLOAD_KEY, JSON.stringify({
        answers: {
          institution, role: role.value, objective: objective.value,
          challenges: [], automation: "no-preference", timeline: "exploring", notes: "",
        },
        contactEmail: email.trim().toLowerCase(),
        placement: source,
        sourcePage: window.location.pathname,
      }));
    } catch (error) {
      setGenerateError(error.message || "Could not open the analysis page.");
      return;
    }
    pushEvent("finder_submit", { page: pathname, source });
    setDialog(null);
    router.push("/solution-finder/analyze");
  };

  const addInstitution = async () => {
    const name = query.trim();
    if (name.length < 3) return;
    setAddingInstitution(true);
    const response = await fetch("/api/institutions/request", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }),
    });
    const data = await response.json().catch(() => ({}));
    setAddingInstitution(false);
    if (response.ok && data.institution) {
      setInstitution(data.institution);
      setQuery(data.institution.name);
      setResultsOpen(false);
    }
  };

  /**
   * One set of fields, laid out either as a single sentence-style row (the
   * stripe, 1280px and up) or as a labelled grid (the dialog). Only one of the
   * two is ever mounted, so the fields share state without duplicating it.
   */
  const renderForm = (layout, source) => {
    const inline = layout === "row";
    const missing = attempted ? missingFields({ email, institution, objective, role }) : [];
    const message = generateError || (missing.length ? missingMessage(missing, { email, typedInstitution: query.trim() }) : "");
    const flagged = (field) => (missing.includes(field) ? "rounded-full ring-2 ring-rose-400/90" : "");
    const showResults = resultsOpen && !institution && query.trim().length >= 2;

    // Sentence connectors on the wide stripe, plain labels in the dialog.
    const label = (rowText, gridText) => (inline
      ? <span className="hidden shrink-0 px-1 text-base font-semibold text-white/70 min-[1440px]:inline">{rowText}</span>
      : <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/60">{gridText}</span>);

    const consent = (
      <p className={`px-1 text-[11px] leading-4 ${inline ? "mt-1 truncate text-center" : ""} ${message ? "font-semibold text-rose-200" : "text-white/55"}`} role={message ? "alert" : undefined}>
        {message || (
          <>
            By continuing, you agree Inkarp may contact you about this request.{" "}
            <Link className="underline underline-offset-2 transition hover:text-white" href="/privacy-policy">Privacy policy</Link>
          </>
        )}
      </p>
    );

    const submit = (
      <button
        className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(192,38,211,.35)] transition hover:-translate-y-0.5 ${GRADIENT}`}
        onClick={(event) => generate(event, source)}
        type="button"
      >
        <HiSparkles /> Find my solution <FiArrowRight />
      </button>
    );

    return (
      <div data-finder-form onFocusCapture={() => markStarted(source)}>
        <div className={inline ? "flex min-w-0 items-center justify-center gap-2" : "grid gap-4 sm:grid-cols-2"}>
          <div className={inline ? "contents" : "min-w-0"}>
            {label("I work at", "I work at")}
            <div className={`relative min-w-0 ${inline ? "max-w-[300px] flex-1" : ""} ${flagged("institution")}`} data-field="institution" ref={institutionRef}>
              <div className={FIELD_SHELL}>
                <FiMapPin className="mr-2 shrink-0 text-fuchsia-200" />
                <input
                  aria-autocomplete="list"
                  aria-controls="finder-institution-results"
                  aria-expanded={showResults}
                  aria-label="Your institution or company"
                  autoComplete="off"
                  className={INPUT_CLASS}
                  onChange={(event) => { setQuery(event.target.value); setInstitution(null); setResults([]); setResultsOpen(true); }}
                  onFocus={() => query.trim().length >= 2 && setResultsOpen(true)}
                  placeholder="Institution or company"
                  role="combobox"
                  value={query}
                />
                {searching ? <span className="size-4 animate-spin rounded-full border-2 border-red/20 border-t-red" /> : null}
              </div>
              {showResults ? (
                <div className="absolute left-0 top-[calc(100%+10px)] z-50 max-h-64 w-full min-w-[300px] overflow-auto border border-line-light bg-white p-1 shadow-[0_18px_50px_rgba(15,23,42,0.2)]" id="finder-institution-results" role="listbox">
                  {results.length ? results.map((item) => (
                    <button aria-selected="false" className="block w-full px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-rose-50 hover:text-red" key={item.id} onClick={() => { setInstitution(item); setQuery(item.name); setResultsOpen(false); }} role="option" type="button">{item.name}</button>
                  )) : !searching ? (
                    <div className="p-2">
                      <p className="px-2 py-2 text-sm text-ink-soft">No institution matches “{query.trim()}”.</p>
                      <button className="flex w-full items-center gap-2 border-t border-line-light px-2 py-3 text-left text-sm font-bold text-red hover:bg-rose-50" disabled={addingInstitution} onClick={addInstitution} type="button">
                        {addingInstitution ? <span className="size-4 animate-spin rounded-full border-2 border-red/20 border-t-red" /> : null} Add “{query.trim()}” as a new institution
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className={inline ? "contents" : "min-w-0"}>
            {label("as a", "My role")}
            <div className={`min-w-0 ${inline ? "max-w-[250px] flex-1" : ""} ${flagged("role")}`} data-field="role">
              <FinderOptionCombobox dark icon={FiBriefcase} initialLabel={role.label} label="Your role" onChange={(value, option) => setRole({ label: option?.label ?? "", value })} placeholder="Search or add role" type="role" value={role.value} />
            </div>
          </div>

          <div className={inline ? "contents" : "min-w-0"}>
            {label("interested in", "Interested in")}
            <div className={`min-w-0 ${inline ? "max-w-[260px] flex-1" : ""} ${flagged("objective")}`} data-field="objective">
              <FinderOptionCombobox dark icon={FiTarget} initialLabel={objective?.label ?? ""} key={objectiveKey} label="Your interest" onChange={(value, option) => setObjective({ label: option?.label ?? "", prefilled: false, value })} placeholder="Search or add interest" type="objective" value={objective?.value ?? ""} />
            </div>
          </div>

          <div className={inline ? "contents" : "min-w-0"}>
            {inline ? null : label("", "Email")}
            <div className={`min-w-0 ${inline ? "max-w-[250px] flex-1" : ""} ${flagged("email")}`} data-field="email">
              <div className={FIELD_SHELL}>
                <FiMail className="mr-2 shrink-0 text-fuchsia-200" />
                <input aria-label="Email address" aria-required="true" autoComplete="email" className={INPUT_CLASS} inputMode="email" onChange={(event) => setEmail(event.target.value)} placeholder="Email address" type="email" value={email} />
              </div>
            </div>
          </div>

          {inline ? submit : null}
        </div>

        {inline ? consent : (
          <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="sm:max-w-sm">{consent}</div>
            {submit}
          </div>
        )}
      </div>
    );
  };

  const stripe = showStripe ? (
    <div className={`relative z-40 hidden w-full px-[3%] print:hidden lg:block ${UNIVERSE_BACKGROUND}`} data-finder-stripe ref={stripeRef}>
      {/* 1024–1279px: four fields cannot share one line, so offer the same form in the dialog. */}
      <div className="flex items-center gap-4 py-3 xl:hidden">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_0_24px_rgba(232,121,249,.28)]"><HiSparkles /></span>
        <p className="min-w-0 flex-1 text-sm text-white/70">
          <span className="font-semibold text-white">Not sure which instrument fits your lab?</span> Answer four quick questions and get a matched shortlist.
        </p>
        <button
          className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(192,38,211,.35)] transition hover:-translate-y-0.5 ${GRADIENT}`}
          onClick={() => openFinderDialog({ source: "stripe-compact" })}
          type="button"
        >
          Get a recommendation <FiArrowRight />
        </button>
      </div>

      {/* 1280px and up: the whole form in one row; sentence labels join in from 1440px. */}
      <div className="hidden min-h-[84px] py-2 xl:block">
        {dialog ? null : renderForm("row", "stripe")}
      </div>
    </div>
  ) : null;

  const launcher = showLauncher && !dialog ? (
    <button
      className={`fixed bottom-4 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(126,34,206,0.42)] ring-1 ring-white/20 print:hidden ${GRADIENT} ${placement === "launcher" || !stripeInView ? "" : "lg:hidden"}`}
      data-finder-launcher
      data-floating-widget
      onClick={openFromLauncher}
      type="button"
    >
      <HiSparkles className="animate-pulse" />
      <span className="lg:hidden">Find my lab solution</span>
      <span className="hidden lg:inline">Help me choose an instrument</span>
      <FiArrowRight className="hidden lg:inline" />
    </button>
  ) : null;

  const finderDialog = dialog ? (
    <div
      aria-labelledby="finder-dialog-title"
      aria-modal="true"
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-[background-color,backdrop-filter] duration-500 print:hidden ${dialogVisible ? "bg-ink/45 backdrop-blur-sm" : "bg-transparent"}`}
      onClick={(event) => { if (event.target === event.currentTarget) setDialogVisible(false); }}
      role="dialog"
    >
      <div className={`relative max-h-[calc(100dvh-2rem)] w-full max-w-[720px] overflow-y-auto rounded-[28px] border border-fuchsia-300/35 p-6 text-white shadow-[0_28px_90px_rgba(8,4,24,.58),0_0_45px_rgba(192,38,211,.18)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-8 lg:overflow-visible ${UNIVERSE_BACKGROUND} ${dialogVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <button aria-label="Close" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-fuchsia-500" onClick={() => setDialogVisible(false)} type="button"><FiX /></button>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-fuchsia-200"><HiSparkles /> AI-powered</p>
        <h2 className="mt-2 pr-10 text-2xl font-semibold tracking-tight" id="finder-dialog-title">Find the right instrument for your lab</h2>
        <p className="mt-1 text-sm leading-6 text-white/65">Four quick answers. We&apos;ll match a shortlist of instruments and a complete workflow.</p>
        <div className="mt-6">{renderForm("grid", dialog.source)}</div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {stripe}
      {launcher}
      {finderDialog}
    </>
  );
}
