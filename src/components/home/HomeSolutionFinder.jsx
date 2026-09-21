"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiArrowRight, FiBriefcase, FiMail, FiMapPin, FiTarget, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import FinderOptionCombobox from "@/components/solution-finder/FinderOptionCombobox";

const AI_UNIVERSE_THEME = {
  prompt: "AI Lab Navigator",
  background: "bg-[radial-gradient(circle_at_12%_20%,rgba(168,85,247,.34),transparent_26%),radial-gradient(circle_at_88%_75%,rgba(236,72,153,.26),transparent_28%),linear-gradient(110deg,#100822_0%,#24114a_48%,#0d1938_100%)]",
  icon: "bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_0_24px_rgba(232,121,249,.28)]",
  button: "bg-[linear-gradient(110deg,#7c3aed,#c026d3_55%,#ec4899)] shadow-[0_10px_28px_rgba(192,38,211,.35)]",
  focus: "focus-within:ring-fuchsia-300/35",
};

export default function HomeSolutionFinder({ campaignEmbedded = false, siteWide = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const popupRef = useRef(null);
  const inlineFinderRef = useRef(null);
  const [institution, setInstitution] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [objective, setObjective] = useState("");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(true);
  const [presentation, setPresentation] = useState("dock");
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [addingInstitution, setAddingInstitution] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [isInlineFinderVisible, setIsInlineFinderVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [forceLauncher, setForceLauncher] = useState(false);
  const universeTheme = AI_UNIVERSE_THEME;
  const isResultsPage = pathname.startsWith("/solution-finder/results/");
  const isAnalysisPage = pathname === "/solution-finder/analyze";

  useEffect(() => {
    setGenerateError("");

    if (isResultsPage) {
      setVisible(false);
      setForceLauncher(true);
      setPresentation("dock");
      setPresentationOpen(false);
    } else {
      setVisible(true);
    }
  }, [isResultsPage, pathname]);

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
    const syncHeader = (event) => setHeaderVisible(event.detail?.visible !== false);
    setHeaderVisible(document.documentElement.dataset.headerVisible !== "false");
    window.addEventListener("inkarp:header-visibility", syncHeader);
    return () => window.removeEventListener("inkarp:header-visibility", syncHeader);
  }, []);

  useEffect(() => {
    let animationFrame;

    const openPresentation = () => {
      setVisible(true);
      setForceLauncher(false);
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
    if (!institution || !role || !objective || !/^\S+@\S+\.\S+$/.test(email)) return;
    setGenerateError("");
    try {
      window.sessionStorage.setItem("inkarp:solution-finder-payload", JSON.stringify({
        answers: { institution, role, objective, challenges: [], automation: "no-preference", timeline: "exploring", notes: "" },
        contactEmail: email.trim().toLowerCase(),
        sourcePage: window.location.pathname,
      }));
      router.push("/solution-finder/analyze");
    } catch (error) {
      setGenerateError(error.message || "Could not open the analysis page.");
    }
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
      setForceLauncher(true);
      window.setTimeout(() => setPresentation("dock"), 500);
      return;
    }
    setVisible(false);
  };

  const mobileLauncher = (
    <button
      className="fixed bottom-4 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[linear-gradient(110deg,#7c3aed,#c026d3_55%,#ec4899)] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(126,34,206,0.42)] ring-1 ring-white/20 print:hidden lg:hidden"
      onClick={() => router.push("/solution-finder")}
      type="button"
    >
      <HiSparkles className="animate-pulse" /> Find my lab solution
    </button>
  );

  const desktopLauncher = (
    <button
      className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[linear-gradient(110deg,#7c3aed,#c026d3_55%,#ec4899)] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(126,34,206,0.45)] ring-1 ring-white/25 transition hover:-translate-y-1 lg:inline-flex"
      onClick={() => window.dispatchEvent(new CustomEvent("inkarp:open-solution-finder"))}
      type="button"
    >
      <HiSparkles className="animate-pulse" /> Help me choose an instrument <FiArrowRight />
    </button>
  );

  if (!visible || isResultsPage || isAnalysisPage) {
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
    {presentation === "dock" && (forceLauncher || !isInlineFinderVisible) ? desktopLauncher : null}
    <div
      className={presentation === "modal"
        ? "contents"
        : siteWide
          ? `mx-auto hidden h-20 items-center bg-[radial-gradient(circle_at_15%_50%,rgba(168,85,247,.32),transparent_28%),linear-gradient(110deg,#100822,#24114a_52%,#0d1938)] px-[3%] transition-all duration-300 lg:flex ${!headerVisible ? "fixed inset-x-0 top-0 z-50 w-full shadow-[0_15px_45px_rgba(8,4,24,.3)]" : "relative z-40 w-screen"}`
        : campaignEmbedded
          ? "relative mx-auto hidden h-24 w-[94%] max-w-[1480px] items-center lg:flex"
          : "relative mx-auto hidden max-w-[1160px] pb-5 pt-10 lg:block"}
      ref={inlineFinderRef}
    >
    {(campaignEmbedded || siteWide) && presentation !== "modal" ? (
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
      <div className={`relative ${presentation === "modal" ? `w-full max-w-[1160px] origin-center rounded-[28px] border border-fuchsia-300/35 bg-[radial-gradient(circle_at_8%_20%,rgba(168,85,247,.3),transparent_28%),linear-gradient(110deg,rgba(16,8,34,.98),rgba(36,17,74,.98)_52%,rgba(13,25,56,.98))] p-3 text-white shadow-[0_28px_90px_rgba(8,4,24,.58),0_0_45px_rgba(192,38,211,.18)] backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${presentationOpen ? "scale-x-100 scale-y-100 opacity-100" : "scale-x-0 scale-y-75 opacity-0"}` : campaignEmbedded ? "w-full bg-transparent p-0" : "rounded-[28px] border border-fuchsia-300/35 bg-[linear-gradient(110deg,#100822,#24114a_52%,#0d1938)] p-3 text-white shadow-[0_24px_75px_rgba(8,4,24,.42)]"}`}>
        <button aria-label="Close solution finder" className={`absolute size-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur transition hover:bg-fuchsia-500 ${(campaignEmbedded || siteWide) && presentation !== "modal" ? "hidden" : "flex"} ${presentation === "modal" ? "right-2 top-2 z-10" : "-right-1 -top-9"}`} onClick={closePresentation} type="button"><FiX /></button>
        <span className={`${(campaignEmbedded || siteWide) && presentation !== "modal" ? "hidden" : "absolute -top-9 left-1 inline-flex"} items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg`}>
          <HiSparkles className="text-red-soft" /> AI-powered
        </span>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <span className="shrink-0 px-2 text-sm font-semibold text-white/75 lg:text-base">I work at</span>
          <div className="relative min-w-0 flex-1 lg:max-w-[270px]">
            <div className={`flex h-12 items-center rounded-full bg-white/15 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_6px_18px_rgba(8,4,24,.16)] backdrop-blur-md ring-1 ring-white/15 transition focus-within:bg-white/22 focus-within:ring-2 ${universeTheme.focus}`}>
              <FiMapPin className="mr-2 shrink-0 text-fuchsia-200" />
              <input aria-autocomplete="list" aria-controls="home-institution-results" aria-expanded={open && query.trim().length >= 2 && !institution} autoComplete="off" className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white caret-fuchsia-200 outline-none placeholder:font-medium placeholder:text-white/60" onChange={(event) => { setQuery(event.target.value); setInstitution(null); setResults([]); setOpen(true); }} onFocus={() => query.trim().length >= 2 && setOpen(true)} placeholder="Institution or company" role="combobox" value={query} />
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

          <span className="shrink-0 px-2 text-sm font-semibold text-white/65 lg:text-base">as a</span>
          <div className="min-w-0 flex-1 lg:max-w-[230px]"><FinderOptionCombobox dark icon={FiBriefcase} label="Your role" onChange={(selectedValue) => setRole(selectedValue)} placeholder="Search or add role" type="role" value={role} /></div>

          <span className="shrink-0 px-2 text-sm font-semibold text-white/65 lg:text-base">interested in</span>
          <div className="min-w-0 flex-1 lg:max-w-[240px]"><FinderOptionCombobox dark icon={FiTarget} label="Your interest" onChange={(selectedValue) => setObjective(selectedValue)} placeholder="Search or add interest" type="objective" value={objective} /></div>

          <div className={`flex h-12 min-w-0 flex-1 items-center rounded-full bg-white/15 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_6px_18px_rgba(8,4,24,.16)] ring-1 transition lg:max-w-[220px] ${email && !/^\S+@\S+\.\S+$/.test(email) ? "ring-rose-400/80" : "ring-white/15 focus-within:ring-2 focus-within:ring-fuchsia-300/70"}`}>
            <FiMail className="mr-2 shrink-0 text-fuchsia-200" />
            <input aria-label="Email address" autoComplete="email" className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white caret-fuchsia-200 outline-none placeholder:font-medium placeholder:text-white/60" inputMode="email" onChange={(event) => setEmail(event.target.value)} placeholder="Email address" type="email" value={email} />
          </div>

          <button className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-white transition duration-500 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 ${universeTheme.button}`} disabled={!institution || !role || !objective || !/^\S+@\S+\.\S+$/.test(email)} onClick={generate} title="By continuing, you agree that Inkarp may contact you about this request." type="button">
            <HiSparkles /> Find my solution <FiArrowRight />
          </button>
        </div>
        {generateError ? <p className="mt-2 px-3 text-xs font-semibold text-rose-200">{generateError}</p> : null}
      </div>
    </aside>
    </div>
    </>
  );
}
