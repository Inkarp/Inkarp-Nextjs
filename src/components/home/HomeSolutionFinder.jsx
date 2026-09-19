"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiBriefcase, FiMapPin, FiTarget, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import FinderOptionCombobox from "@/components/solution-finder/FinderOptionCombobox";

const AI_UNIVERSE_THEME = {
  prompt: "AI Lab Navigator",
  background: "bg-[radial-gradient(circle_at_12%_20%,rgba(168,85,247,.34),transparent_26%),radial-gradient(circle_at_88%_75%,rgba(236,72,153,.26),transparent_28%),linear-gradient(110deg,#100822_0%,#24114a_48%,#0d1938_100%)]",
  icon: "bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_0_24px_rgba(232,121,249,.28)]",
  button: "bg-[linear-gradient(110deg,#7c3aed,#c026d3_55%,#ec4899)] shadow-[0_10px_28px_rgba(192,38,211,.35)]",
  focus: "focus-within:ring-fuchsia-300/35",
};

export default function HomeSolutionFinder({ campaignEmbedded = false }) {
  const router = useRouter();
  const popupRef = useRef(null);
  const inlineFinderRef = useRef(null);
  const [institution, setInstitution] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [objective, setObjective] = useState("");
  const [visible, setVisible] = useState(true);
  const [presentation, setPresentation] = useState("dock");
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [addingInstitution, setAddingInstitution] = useState(false);
  const [isInlineFinderVisible, setIsInlineFinderVisible] = useState(true);
  const universeTheme = AI_UNIVERSE_THEME;

  useEffect(() => {
    const node = inlineFinderRef.current;
    if (!node || presentation !== "dock") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInlineFinderVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [presentation, visible]);

  useEffect(() => {
    let animationFrame;

    const openPresentation = () => {
      setVisible(true);
      setPresentation("modal");
      setPresentationOpen(false);
      animationFrame = window.requestAnimationFrame(() => setPresentationOpen(true));
    };

    window.addEventListener("inkarp:open-solution-finder", openPresentation);
    return () => {
      window.removeEventListener("inkarp:open-solution-finder", openPresentation);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (presentation !== "modal") return undefined;

    let closeTimer;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setPresentationOpen(false);
        closeTimer = window.setTimeout(() => setPresentation("dock"), 500);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [presentation]);

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

  const closePresentation = () => {
    if (presentation === "modal") {
      setPresentationOpen(false);
      window.setTimeout(() => setPresentation("dock"), 500);
      return;
    }
    setVisible(false);
  };

  const mobileLauncher = (
    <button
      className="fixed bottom-4 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-red px-5 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(190,0,16,0.35)] print:hidden lg:hidden"
      onClick={() => router.push("/solution-finder")}
      type="button"
    >
      <HiSparkles className="animate-pulse" /> Find my lab solution
    </button>
  );

  const desktopLauncher = (
    <button
      className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[linear-gradient(110deg,#8f000c,#be0010_55%,#e3232d)] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(190,0,16,0.38)] ring-1 ring-white/25 transition hover:-translate-y-1 lg:inline-flex"
      onClick={() => window.dispatchEvent(new CustomEvent("inkarp:open-solution-finder"))}
      type="button"
    >
      <HiSparkles className="animate-pulse" /> Help me choose an instrument <FiArrowRight />
    </button>
  );

  if (!visible) {
    return (
      <>
      {presentation === "dock" ? mobileLauncher : null}
        {presentation === "dock" ? desktopLauncher : null}
      </>
    );
  }

  return (
    <>
    {presentation === "dock" ? mobileLauncher : null}
    {presentation === "dock" && !isInlineFinderVisible ? desktopLauncher : null}
    <div
      className={presentation === "modal"
        ? "contents"
        : campaignEmbedded
          ? "relative mx-auto hidden h-24 w-[94%] max-w-[1480px] items-center lg:flex"
          : "relative mx-auto hidden max-w-[1160px] pb-5 pt-10 lg:block"}
      ref={inlineFinderRef}
    >
    {campaignEmbedded && presentation !== "modal" ? (
      <span aria-hidden="true" className={`pointer-events-none absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 transition-colors duration-700 ${universeTheme.background}`} />
    ) : null}
    <aside
      aria-label="Find the right laboratory instrument"
      aria-modal={presentation === "modal" ? "true" : undefined}
      className={presentation === "modal"
        ? `fixed inset-0 z-[70] flex items-center justify-center p-4 print:hidden transition-[background-color,backdrop-filter] duration-500 ${presentationOpen ? "bg-ink/45 backdrop-blur-sm" : "bg-transparent backdrop-blur-none"}`
        : "relative z-30 block print:hidden"}
      onClick={(event) => {
        if (presentation === "modal" && event.target === event.currentTarget) closePresentation();
      }}
      ref={popupRef}
      role={presentation === "modal" ? "dialog" : undefined}
    >
      <div className={`relative ${presentation === "modal" ? `w-full max-w-[1160px] origin-center rounded-[28px] border-2 border-rose-300/80 bg-white/95 p-3 shadow-[0_24px_75px_rgba(15,23,42,0.28)] backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${presentationOpen ? "scale-x-100 scale-y-100 opacity-100" : "scale-x-0 scale-y-75 opacity-0"}` : campaignEmbedded ? "w-full bg-transparent p-0" : "rounded-[28px] border-2 border-rose-300/80 bg-white/95 p-3 shadow-[0_24px_75px_rgba(15,23,42,0.18)] backdrop-blur-xl"}`}>
        <button aria-label="Close solution finder" className={`absolute size-8 items-center justify-center rounded-full bg-white text-ink shadow-lg transition hover:bg-red hover:text-white ${campaignEmbedded && presentation !== "modal" ? "hidden" : "flex"} ${presentation === "modal" ? "right-2 top-2 z-10" : "-right-1 -top-9"}`} onClick={closePresentation} type="button"><FiX /></button>
        <span className={`${campaignEmbedded && presentation !== "modal" ? "hidden" : "absolute -top-9 left-1 inline-flex"} items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg`}>
          <HiSparkles className="text-red-soft" /> AI-powered
        </span>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <span className={`shrink-0 px-3 text-sm font-semibold lg:text-base ${campaignEmbedded && presentation !== "modal" ? "inline-flex items-center gap-2 text-white" : "text-ink"}`}>
            {campaignEmbedded && presentation !== "modal" ? <><span className={`inline-flex size-8 items-center justify-center rounded-full transition-colors duration-500 ${universeTheme.icon}`}><HiSparkles className="motion-safe:animate-pulse" /></span><span>{universeTheme.prompt}</span></> : "I work at"}
          </span>

          <div className="relative min-w-0 flex-1 lg:max-w-[270px]">
            <div className={`flex h-12 items-center rounded-full px-4 transition ${campaignEmbedded && presentation !== "modal" ? `bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_6px_18px_rgba(8,4,24,.16)] backdrop-blur-md ring-1 ring-white/15 focus-within:bg-white/28 focus-within:ring-2 ${universeTheme.focus}` : "border border-line-light bg-white shadow-sm focus-within:border-red"}`}>
              <FiMapPin className={`mr-2 shrink-0 ${campaignEmbedded && presentation !== "modal" ? "text-fuchsia-200" : "text-red"}`} />
              <input aria-autocomplete="list" aria-controls="home-institution-results" aria-expanded={open && query.trim().length >= 2 && !institution} autoComplete="off" className={`min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none ${campaignEmbedded && presentation !== "modal" ? "text-white caret-fuchsia-200 placeholder:font-medium placeholder:text-white/65" : "text-ink placeholder:text-ink-soft/65"}`} onChange={(event) => { setQuery(event.target.value); setInstitution(null); setResults([]); setOpen(true); }} onFocus={() => query.trim().length >= 2 && setOpen(true)} placeholder="Institution or company" role="combobox" value={query} />
              {searching ? <span className="size-4 animate-spin rounded-full border-2 border-red/20 border-t-red" /> : null}
            </div>
            {open && !institution && query.trim().length >= 2 ? (
              <div className="absolute left-0 top-[calc(100%+10px)] z-50 max-h-64 w-full min-w-[300px] overflow-auto border border-line-light bg-white p-1 shadow-[0_18px_50px_rgba(15,23,42,0.2)]" id="home-institution-results" role="listbox">
                {results.length ? results.map((item) => (
                  <button aria-selected="false" className="block w-full px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-rose-50 hover:text-red" key={item.id} onClick={() => { setInstitution(item); setQuery(item.name); setOpen(false); }} role="option" type="button">{item.name}</button>
                )) : !searching ? <div className="p-2"><p className="px-2 py-2 text-sm text-ink-soft">No institution matches “{query.trim()}”.</p><button className="flex w-full items-center gap-2 border-t border-line-light px-2 py-3 text-left text-sm font-bold text-red hover:bg-rose-50" disabled={addingInstitution} onClick={addInstitution} type="button">{addingInstitution ? <span className="size-4 animate-spin rounded-full border-2 border-red/20 border-t-red" /> : null} Add “{query.trim()}” as a new institution</button></div> : null}
              </div>
            ) : null}
          </div>

          <span className={`shrink-0 px-2 text-sm font-semibold lg:text-base ${campaignEmbedded && presentation !== "modal" ? "text-white/65" : "text-ink"}`}>as a</span>
          <div className="min-w-0 flex-1 lg:max-w-[230px]"><FinderOptionCombobox dark={campaignEmbedded && presentation !== "modal"} icon={FiBriefcase} label="Your role" onChange={(selectedValue) => setRole(selectedValue)} placeholder="Search or add role" type="role" value={role} /></div>

          <span className={`shrink-0 px-2 text-sm font-semibold lg:text-base ${campaignEmbedded && presentation !== "modal" ? "text-white/65" : "text-ink"}`}>interested in</span>
          <div className="min-w-0 flex-1 lg:max-w-[240px]"><FinderOptionCombobox dark={campaignEmbedded && presentation !== "modal"} icon={FiTarget} label="Your interest" onChange={(selectedValue) => setObjective(selectedValue)} placeholder="Search or add interest" type="objective" value={objective} /></div>

          <button className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white transition duration-500 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 lg:px-7 ${campaignEmbedded && presentation !== "modal" ? universeTheme.button : "bg-[linear-gradient(110deg,#be0010,#d71920_55%,#8f000c)] shadow-[0_10px_25px_rgba(190,0,16,0.25)]"}`} disabled={!institution || !role || !objective} onClick={generate} type="button">
            <HiSparkles /> Find my solution <FiArrowRight />
          </button>
        </div>
      </div>
    </aside>
    </div>
    </>
  );
}
