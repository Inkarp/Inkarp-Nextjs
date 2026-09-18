"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiCpu, FiHelpCircle } from "react-icons/fi";

export default function FinderAiAdvisor({ fallbackGuidance, initialGuidance = null, sessionId }) {
  const [guidance, setGuidance] = useState(initialGuidance);
  const [status, setStatus] = useState(initialGuidance ? "ready" : "loading");

  useEffect(() => {
    if (guidance) return undefined;
    const controller = new AbortController();
    fetch(`/api/solution-finder/${sessionId}/ai`, { method: "POST", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "AI guidance is unavailable.");
        setGuidance(data.guidance);
        setStatus("ready");
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setGuidance(fallbackGuidance);
        setStatus("ready");
      });
    return () => controller.abort();
  }, [fallbackGuidance, guidance, sessionId]);

  if (status === "loading") {
    return <section className="mt-7 border border-red/15 bg-white p-6"><div className="flex items-center gap-3"><span className="size-5 animate-spin rounded-full border-2 border-red/20 border-t-red" /><div><p className="font-semibold text-ink">Preparing AI guidance</p><p className="mt-1 text-sm text-ink-soft">Reviewing the verified shortlist against your priorities…</p></div></div></section>;
  }
  return (
    <section className="mt-7 overflow-hidden border border-red/20 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4 bg-[#111] px-5 py-4 text-white"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-red"><FiCpu /></span><div><h2 className="font-semibold">AI-assisted recommendation brief</h2><p className="text-xs text-white/55">Grounded only in the verified shortlist below</p></div></div><span className="hidden rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/65 sm:block">Specialist confirmation required</span></div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.8fr] lg:p-7">
        <div><p className="text-sm leading-7 text-ink-soft">{guidance.summary}</p>{guidance.priorities?.length ? <div className="mt-5 grid gap-2 sm:grid-cols-2">{guidance.priorities.map((item) => <p className="flex gap-2 border border-line-light bg-parchment-alt p-3 text-xs leading-5 text-ink" key={item}><FiCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />{item}</p>)}</div> : null}</div>
        <div className="border border-line-light bg-parchment-alt p-5"><h3 className="flex items-center gap-2 text-sm font-semibold"><FiHelpCircle className="text-red" /> Questions to confirm</h3><ol className="mt-3 space-y-3">{guidance.questions?.map((question, index) => <li className="flex gap-3 text-xs leading-5 text-ink-soft" key={question}><span className="font-mono font-bold text-red">0{index + 1}</span>{question}</li>)}</ol><p className="mt-5 border-t border-line-light pt-4 text-xs font-semibold leading-5 text-ink">{guidance.nextStep}</p></div>
      </div>
    </section>
  );
}
