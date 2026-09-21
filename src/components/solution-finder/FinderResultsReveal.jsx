"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiCpu, FiDatabase, FiLayers, FiZap } from "react-icons/fi";

const stages = [
  { Icon: FiDatabase, label: "Reading your requirements" },
  { Icon: FiLayers, label: "Matching verified products" },
  { Icon: FiCpu, label: "Preparing AI guidance" },
];

export default function FinderResultsReveal({ children, initialReady = false, sessionId }) {
  const [ready, setReady] = useState(initialReady);
  const [activeStage, setActiveStage] = useState(initialReady ? stages.length : 0);

  useEffect(() => {
    if (initialReady) return undefined;

    const controller = new AbortController();
    const startedAt = Date.now();
    const stageTimer = window.setInterval(() => {
      setActiveStage((current) => Math.min(current + 1, stages.length - 1));
    }, 900);

    fetch(`/api/solution-finder/${sessionId}/ai`, {
      method: "POST",
      signal: controller.signal,
    })
      .catch((error) => {
        if (error?.name !== "AbortError") return null;
        throw error;
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        const remaining = Math.max(0, 1800 - (Date.now() - startedAt));
        window.setTimeout(() => {
          setActiveStage(stages.length);
          setReady(true);
        }, remaining);
      });

    return () => {
      controller.abort();
      window.clearInterval(stageTimer);
    };
  }, [initialReady, sessionId]);

  if (ready) return children;

  return (
    <main className="solution-loading-screen flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-5 py-14 text-white" data-scroll-skip>
      <div aria-hidden="true" className="solution-loading-grid absolute inset-0" />
      <div className="relative z-10 w-full max-w-2xl text-center" role="status" aria-live="polite">
        <div className="solution-ai-loader mx-auto">
          <span className="solution-ai-loader-ring solution-ai-loader-ring-one" />
          <span className="solution-ai-loader-ring solution-ai-loader-ring-two" />
          <span className="solution-ai-loader-core"><FiCpu /></span>
        </div>
        <p className="mt-10 font-mono text-xs font-bold uppercase tracking-[0.28em] text-fuchsia-200"><FiZap className="mr-2 inline" /> Inkarp intelligence engine</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Building your product shortlist</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">Our AI is reviewing your laboratory needs against the verified Inkarp catalogue. Your matched products will appear together when the analysis is complete.</p>
        <div className="mx-auto mt-9 grid max-w-xl gap-2 text-left sm:grid-cols-3">
          {stages.map(({ Icon, label }, index) => {
            const complete = activeStage > index;
            const active = activeStage === index;
            return (
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold transition ${complete ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : active ? "border-fuchsia-300/40 bg-fuchsia-300/10 text-white" : "border-white/10 bg-white/[0.03] text-white/35"}`} key={label}>
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${active ? "solution-stage-pulse bg-fuchsia-400/20" : "bg-white/5"}`}>{complete ? <FiCheck /> : <Icon />}</span>
                {label}
              </div>
            );
          })}
        </div>
        <div className="mx-auto mt-7 h-1.5 max-w-xl overflow-hidden rounded-full bg-white/10"><span className="solution-loading-progress block h-full rounded-full" /></div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Please keep this page open</p>
      </div>
    </main>
  );
}
