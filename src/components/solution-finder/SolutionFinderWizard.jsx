"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft, FiArrowRight, FiBriefcase, FiCheck,
  FiCpu, FiMapPin, FiSearch, FiSliders, FiTarget, FiX,
} from "react-icons/fi";
import {
  finderChallenges, finderIndustries, finderObjectives, finderRoles, finderTimelines,
} from "@/data/solutionFinder";

const STEPS = [
  { label: "Institution", icon: FiMapPin },
  { label: "Your work", icon: FiBriefcase },
  { label: "Goal", icon: FiTarget },
  { label: "Priorities", icon: FiSliders },
];

const AUTOMATION_OPTIONS = [
  { value: "no-preference", label: "No preference" },
  { value: "manual", label: "Manual" },
  { value: "semi-automated", label: "Semi-automated" },
  { value: "automated", label: "Automated / unattended" },
];

function CompactChoiceGrid({ label, onChange, options, value }) {
  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-wider text-ink-soft">{label}</legend>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              aria-pressed={selected}
              className={`relative flex min-h-12 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition sm:text-sm ${selected ? "border-red bg-rose-50 text-red shadow-[0_0_0_2px_rgba(190,0,16,0.06)]" : "border-line-light bg-white text-ink hover:border-red/40 hover:bg-rose-50/40"}`}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span>{option.label}</span>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-red bg-red text-white" : "border-zinc-300 text-transparent"}`}>
                <FiCheck className="text-xs" />
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function OptionGrid({ options, value, onChange, columns = "md:grid-cols-2" }) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            className={`group relative min-h-20 border p-4 text-left transition-all hover:-translate-y-0.5 ${selected
              ? "border-red bg-red text-white shadow-[0_12px_28px_rgba(190,0,16,0.16)]"
              : "border-line-light bg-white text-ink hover:border-red/50"}`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <span className="block pr-7 text-sm font-semibold">{option.label}</span>
            {option.description ? (
              <span className={`mt-1 block text-xs leading-5 ${selected ? "text-white/75" : "text-ink-soft"}`}>
                {option.description}
              </span>
            ) : null}
            <span className={`absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border ${selected ? "border-white bg-white text-red" : "border-line-light text-transparent"}`}>
              <FiCheck aria-hidden="true" className="text-xs" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function InstitutionSearch({ value, onChange }) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (value && trimmed === value.name) return undefined;
    if (trimmed.length < 2) return undefined;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(`/api/institutions/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(response))
        .then((data) => { setResults(data.results ?? []); setOpen(true); })
        .catch((error) => { if (error?.name !== "AbortError") setResults([]); })
        .finally(() => setLoading(false));
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, value]);

  useEffect(() => {
    const close = (event) => { if (!boxRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const submitRequest = async () => {
    const name = requestName.trim();
    if (name.length < 3) return;
    setRequestStatus("saving");
    const response = await fetch("/api/institutions/request", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }),
    });
    setRequestStatus(response.ok ? "saved" : "failed");
  };

  return (
    <div ref={boxRef} className="relative">
      <label className="text-xs font-bold uppercase tracking-[0.18em] text-ink-soft" htmlFor="institution-search">
        Search your institution or company
      </label>
      <div className={`mt-3 flex min-h-16 items-center border bg-white px-4 transition ${value ? "border-emerald-300 ring-4 ring-emerald-50" : "border-line-light focus-within:border-red focus-within:ring-4 focus-within:ring-rose-50"}`}>
        <FiSearch className="mr-3 shrink-0 text-xl text-red" />
        <input
          aria-autocomplete="list"
          aria-controls="institution-results"
          aria-expanded={open && query.trim().length >= 2 && !value}
          autoComplete="off"
          className="h-14 min-w-0 flex-1 bg-transparent text-base font-medium text-ink outline-none placeholder:text-ink-soft/55 sm:text-lg"
          id="institution-search"
          onChange={(event) => { setQuery(event.target.value); setResults([]); onChange(null); setOpen(true); }}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Start typing — e.g. IIT, CSIR, Biocon..."
          role="combobox"
          value={query}
        />
        {value ? <FiCheck className="text-xl text-emerald-600" /> : loading ? <span className="size-5 animate-spin rounded-full border-2 border-red/20 border-t-red" /> : null}
        {query ? (
          <button aria-label="Clear institution" className="ml-2 text-ink-soft hover:text-red" onClick={() => { setQuery(""); setResults([]); onChange(null); }} type="button"><FiX /></button>
        ) : null}
      </div>

      {open && query.trim().length >= 2 && !value ? (
        <div className="absolute inset-x-0 z-30 mt-2 overflow-hidden border border-line-light bg-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]" id="institution-results" role="listbox">
          {results.length ? results.map((institution) => (
            <button
              aria-selected="false"
              className="flex w-full items-center gap-3 border-b border-line-light px-4 py-3 text-left text-sm font-medium text-ink transition last:border-b-0 hover:bg-rose-50 hover:text-red"
              key={institution.id}
              onClick={() => { onChange(institution); setQuery(institution.name); setOpen(false); }}
              role="option"
              type="button"
            >
              <span className="flex size-8 shrink-0 items-center justify-center bg-parchment-alt text-red"><FiMapPin /></span>
              {institution.name}
            </button>
          )) : !loading ? (
            <div className="p-4">
              <p className="text-sm font-semibold text-ink">No approved institution found</p>
              {requestStatus === "saved" ? (
                <p className="mt-2 text-sm text-emerald-700">Thank you. It has been sent for review.</p>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input className="h-10 min-w-0 flex-1 border border-line-light px-3 text-sm outline-none focus:border-red" onChange={(e) => setRequestName(e.target.value)} placeholder="Full official name" value={requestName} />
                  <button className="bg-ink px-4 text-xs font-semibold text-white hover:bg-red" disabled={requestStatus === "saving"} onClick={submitRequest} type="button">Request</button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-ink-soft">Suggestions display institution names only. Internal identifiers and organisation details are never exposed.</p>
    </div>
  );
}

// Steps whose required fields already arrived pre-filled (from the home page
// widget, or a shared link) are skipped on arrival instead of re-presenting
// answers the visitor already gave — only genuinely unanswered steps stop them.
function firstIncompleteStep(initialAnswers) {
  const validity = [
    Boolean(initialAnswers.institution),
    Boolean(initialAnswers.role && initialAnswers.industry),
    Boolean(initialAnswers.objective),
    false,
  ];
  const index = validity.findIndex((isValid) => !isValid);
  return index === -1 ? STEPS.length - 1 : index;
}

export default function SolutionFinderWizard({ initialAnswers = {} }) {
  const router = useRouter();
  const [step, setStep] = useState(() => firstIncompleteStep(initialAnswers));
  const [answers, setAnswers] = useState({
    institution: initialAnswers.institution ?? null,
    role: initialAnswers.role ?? "",
    industry: initialAnswers.industry ?? "",
    objective: initialAnswers.objective ?? "",
    challenges: [],
    automation: "no-preference", timeline: "exploring", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const valid = [Boolean(answers.institution), Boolean(answers.role && answers.industry), Boolean(answers.objective), true][step];
  const set = (key, value) => setAnswers((current) => ({ ...current, [key]: value }));
  const toggleChallenge = (value) => setAnswers((current) => ({
    ...current,
    challenges: current.challenges.includes(value)
      ? current.challenges.filter((item) => item !== value)
      : [...current.challenges, value].slice(-4),
  }));

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const response = await fetch("/api/solution-finder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, sourcePage: window.location.pathname }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not generate recommendations.");
      router.push(data.resultUrl);
    } catch (submitError) {
      setError(submitError.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="solution-wizard overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.96] shadow-[0_35px_120px_rgba(0,0,0,0.55),0_0_80px_rgba(37,211,255,0.06)] backdrop-blur-xl">
      <div className="h-1.5 bg-[linear-gradient(90deg,#be0010,#ff375f_38%,#42d9ff_72%,#725cff)]" />
      <div className="grid border-b border-line-light bg-parchment-alt sm:grid-cols-4">
        {STEPS.map((item, index) => {
          const Icon = item.icon;
          const active = index === step;
          const complete = index < step;
          return (
            <button className={`flex items-center gap-3 border-b border-line-light px-4 py-4 text-left transition last:border-0 sm:border-b-0 sm:border-r ${active ? "bg-white text-red" : complete ? "text-ink" : "text-ink-soft"}`} disabled={index > step} key={item.label} onClick={() => index < step && setStep(index)} type="button">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${active ? "bg-red text-white" : complete ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200"}`}>{complete ? <FiCheck /> : <Icon />}</span>
              <span><span className="block text-[10px] font-bold uppercase tracking-wider">Step {index + 1}</span><span className="block text-sm font-semibold">{item.label}</span></span>
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-8 lg:p-10">
        {step === 0 ? (
          <div><p className="mb-6 max-w-2xl text-sm leading-6 text-ink-soft">Choose an approved organisation so recommendations can reflect its sector and location. You can replace our starter directory when your institution database is ready.</p><InstitutionSearch onChange={(value) => set("institution", value)} value={answers.institution} /></div>
        ) : null}
        {step === 1 ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <div><h2 className="mb-4 text-lg font-semibold text-ink">What best describes your role?</h2><OptionGrid columns="sm:grid-cols-2" onChange={(value) => set("role", value)} options={finderRoles} value={answers.role} /></div>
            <div><h2 className="mb-4 text-lg font-semibold text-ink">Which sector should we optimise for?</h2><OptionGrid columns="sm:grid-cols-2" onChange={(value) => set("industry", value)} options={finderIndustries} value={answers.industry} /></div>
          </div>
        ) : null}
        {step === 2 ? (
          <div><h2 className="mb-2 text-lg font-semibold text-ink">What outcome are you working toward?</h2><p className="mb-5 text-sm text-ink-soft">Choose the closest starting point. The results will include a complete workflow, not just one instrument.</p><OptionGrid columns="md:grid-cols-2 xl:grid-cols-3" onChange={(value) => set("objective", value)} options={finderObjectives} value={answers.objective} /></div>
        ) : null}
        {step === 3 ? (
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div><h2 className="text-lg font-semibold text-ink">What should the solution improve?</h2><p className="mb-4 mt-1 text-sm text-ink-soft">Select up to four. This makes the ranking and explanation more specific.</p><div className="grid gap-2 sm:grid-cols-2">{finderChallenges.map((option) => { const selected = answers.challenges.includes(option.value); return <button className={`flex items-center justify-between border px-4 py-3 text-left text-sm font-semibold transition ${selected ? "border-red bg-rose-50 text-red" : "border-line-light text-ink hover:border-red/40"}`} key={option.value} onClick={() => toggleChallenge(option.value)} type="button"><span>{option.label}</span><span className={`flex size-5 items-center justify-center rounded-full border ${selected ? "border-red bg-red text-white" : "border-line-light"}`}>{selected ? <FiCheck className="text-xs" /> : null}</span></button>; })}</div></div>
            <div className="space-y-6 rounded-xl border border-line-light bg-parchment-alt p-4 sm:p-5">
              <CompactChoiceGrid label="Automation preference" onChange={(value) => set("automation", value)} options={AUTOMATION_OPTIONS} value={answers.automation} />
              <CompactChoiceGrid label="Purchase timeline" onChange={(value) => set("timeline", value)} options={finderTimelines} value={answers.timeline} />
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-ink-soft">Anything else? (optional)</span><textarea className="mt-3 min-h-28 w-full resize-y rounded-lg border border-line-light bg-white p-3 text-sm outline-none transition focus:border-red focus:ring-4 focus:ring-rose-50" maxLength={600} onChange={(e) => set("notes", e.target.value)} placeholder="Sample type, capacity, standards, existing equipment..." value={answers.notes} /></label>
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-6 border border-red/20 bg-rose-50 px-4 py-3 text-sm font-medium text-red">{error}</p> : null}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line-light pt-6">
          <button className={`inline-flex h-11 items-center gap-2 px-2 text-sm font-semibold text-ink-soft hover:text-red ${step === 0 ? "invisible" : ""}`} onClick={() => setStep((value) => value - 1)} type="button"><FiArrowLeft /> Back</button>
          <span className="hidden text-xs text-ink-soft sm:block">Recommendations are guidance; final specifications are confirmed by an Inkarp specialist.</span>
          {step < STEPS.length - 1 ? (
            <button className="inline-flex h-12 items-center gap-2 bg-red px-6 text-sm font-bold text-white transition hover:bg-[#9f000d] disabled:cursor-not-allowed disabled:opacity-35" disabled={!valid} onClick={() => setStep((value) => value + 1)} type="button">Continue <FiArrowRight /></button>
          ) : (
            <button className="inline-flex h-12 items-center gap-2 bg-red px-6 text-sm font-bold text-white transition hover:bg-[#9f000d] disabled:opacity-50" disabled={submitting} onClick={submit} type="button">{submitting ? <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Building your report</> : <><FiCpu /> Generate recommendations</>}</button>
          )}
        </div>
      </div>
    </div>
  );
}
