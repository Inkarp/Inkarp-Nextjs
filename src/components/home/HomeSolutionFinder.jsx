"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiBriefcase, FiMapPin, FiTarget, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import FinderOptionCombobox from "@/components/solution-finder/FinderOptionCombobox";

export default function HomeSolutionFinder() {
  const router = useRouter();
  const popupRef = useRef(null);
  const [institution, setInstitution] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [objective, setObjective] = useState("");
  const [visible, setVisible] = useState(true);
  const [addingInstitution, setAddingInstitution] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (institution?.name === trimmed || trimmed.length < 2) return undefined;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      fetch(`/api/institutions/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(response))
        .then((data) => { setResults(data.results ?? []); setOpen(true); })
        .catch((error) => { if (error?.name !== "AbortError") setResults([]); })
        .finally(() => setSearching(false));
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [institution, query]);

  useEffect(() => {
    const closeResults = (event) => {
      if (!popupRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeResults);
    return () => document.removeEventListener("mousedown", closeResults);
  }, []);

  const generate = () => {
    const params = new URLSearchParams();
    if (institution) {
      params.set("institutionId", institution.id);
      params.set("institutionName", institution.name);
    }
    if (role) params.set("role", role);
    if (objective) params.set("objective", objective);
    router.push(`/solution-finder${params.size ? `?${params}` : ""}`);
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
      setOpen(false);
    }
  };

  if (!visible) {
    return (
      <button className="fixed bottom-4 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-red px-5 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] print:hidden" onClick={() => setVisible(true)} type="button">
        <HiSparkles className="animate-pulse" /> Find my lab solution
      </button>
    );
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-[1160px] print:hidden sm:bottom-5" ref={popupRef}>
      <div className="relative rounded-[28px] border-2 border-rose-300/80 bg-white/95 p-2 shadow-[0_24px_75px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-3">
        <button aria-label="Close solution finder" className="absolute -right-1 -top-9 flex size-8 items-center justify-center rounded-full bg-white text-ink shadow-lg transition hover:bg-red hover:text-white" onClick={() => setVisible(false)} type="button"><FiX /></button>
        <span className="absolute -top-9 left-1 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
          <HiSparkles className="text-red-soft" /> AI-powered
        </span>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <span className="shrink-0 px-3 text-sm font-semibold text-ink lg:text-base">I work at</span>

          <div className="relative min-w-0 flex-1 lg:max-w-[270px]">
            <div className="flex h-12 items-center rounded-full border border-line-light bg-white px-4 shadow-sm focus-within:border-red">
              <FiMapPin className="mr-2 shrink-0 text-red" />
              <input aria-autocomplete="list" aria-controls="home-institution-results" aria-expanded={open && query.trim().length >= 2 && !institution} autoComplete="off" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-ink-soft/65" onChange={(event) => { setQuery(event.target.value); setInstitution(null); setResults([]); setOpen(true); }} onFocus={() => query.trim().length >= 2 && setOpen(true)} placeholder="Institution or company" role="combobox" value={query} />
              {searching ? <span className="size-4 animate-spin rounded-full border-2 border-red/20 border-t-red" /> : null}
            </div>
            {open && !institution && query.trim().length >= 2 ? (
              <div className="absolute bottom-[calc(100%+10px)] left-0 z-50 max-h-64 w-full min-w-[300px] overflow-auto border border-line-light bg-white p-1 shadow-[0_18px_50px_rgba(15,23,42,0.2)]" id="home-institution-results" role="listbox">
                {results.length ? results.map((item) => (
                  <button aria-selected="false" className="block w-full px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-rose-50 hover:text-red" key={item.id} onClick={() => { setInstitution(item); setQuery(item.name); setOpen(false); }} role="option" type="button">{item.name}</button>
                )) : !searching ? <div className="p-2"><p className="px-2 py-2 text-sm text-ink-soft">No institution matches “{query.trim()}”.</p><button className="flex w-full items-center gap-2 border-t border-line-light px-2 py-3 text-left text-sm font-bold text-red hover:bg-rose-50" disabled={addingInstitution} onClick={addInstitution} type="button">{addingInstitution ? <span className="size-4 animate-spin rounded-full border-2 border-red/20 border-t-red" /> : null} Add “{query.trim()}” as a new institution</button></div> : null}
              </div>
            ) : null}
          </div>

          <span className="shrink-0 px-2 text-sm font-semibold text-ink lg:text-base">as a</span>
          <div className="min-w-0 flex-1 lg:max-w-[230px]"><FinderOptionCombobox icon={FiBriefcase} label="Your role" onChange={(selectedValue) => setRole(selectedValue)} placeholder="Search or add role" type="role" value={role} /></div>

          <span className="shrink-0 px-2 text-sm font-semibold text-ink lg:text-base">interested in</span>
          <div className="min-w-0 flex-1 lg:max-w-[240px]"><FinderOptionCombobox icon={FiTarget} label="Your interest" onChange={(selectedValue) => setObjective(selectedValue)} placeholder="Search or add interest" type="objective" value={objective} /></div>

          <button className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#be0010,#d71920_55%,#8f000c)] px-6 text-sm font-bold text-white shadow-[0_10px_25px_rgba(190,0,16,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 lg:px-7" disabled={!institution || !role || !objective} onClick={generate} type="button">
            <HiSparkles /> Find my solution <FiArrowRight />
          </button>
        </div>
      </div>
    </aside>
  );
}
