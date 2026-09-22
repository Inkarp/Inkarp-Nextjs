"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCpu, FiDatabase, FiLayers, FiSearch, FiZap } from "react-icons/fi";

const stages = [
  { Icon: FiSearch, label: "Understanding your requirement" },
  { Icon: FiDatabase, label: "Searching the verified catalogue" },
  { Icon: FiLayers, label: "Ranking suitable products" },
  { Icon: FiCpu, label: "Preparing your AI report" },
];

// A brand-new institution (added via "Add as a new institution") has no known
// industry yet, so the API can reject the request even though everything else
// here was already answered. Carry the already-known fields back to the full
// wizard via its searchParams pre-fill support instead of discarding them —
// the visitor then only has to pick an industry on Step 2, not start over.
function buildResumeUrl(rawPayload) {
  try {
    const answers = JSON.parse(rawPayload)?.answers ?? {};
    const params = new URLSearchParams();
    if (answers.institution?.id) params.set("institutionId", answers.institution.id);
    if (answers.institution?.name) params.set("institutionName", answers.institution.name);
    if (answers.role) params.set("role", answers.role);
    if (answers.objective) params.set("objective", answers.objective);
    const query = params.toString();
    return query ? `/solution-finder?${query}` : "/solution-finder";
  } catch {
    return "/solution-finder";
  }
}

export default function FinderAnalysisPage() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState("");
  const [resumeUrl, setResumeUrl] = useState("/solution-finder");

  useEffect(() => {
    const rawPayload = window.sessionStorage.getItem("inkarp:solution-finder-payload");
    if (!rawPayload) {
      setError("Your finder details were not available. Please return and try again.");
      return undefined;
    }
    setResumeUrl(buildResumeUrl(rawPayload));

    const controller = new AbortController();
    const stageTimer = window.setInterval(() => {
      setActiveStage((current) => Math.min(current + 1, stages.length - 1));
    }, 850);

    fetch("/api/solution-finder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawPayload,
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Could not build your recommendations.");
        window.sessionStorage.removeItem("inkarp:solution-finder-payload");
        setActiveStage(stages.length);
        router.replace(data.resultUrl);
      })
      .catch((requestError) => {
        if (requestError?.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => window.clearInterval(stageTimer));

    return () => {
      controller.abort();
      window.clearInterval(stageTimer);
    };
  }, [router]);

  const currentIndex = Math.min(activeStage, stages.length - 1);
  const { Icon: ActiveIcon, label: activeLabel } = stages[currentIndex];
  const progressPercent = Math.min(12 + (activeStage / stages.length) * 88, 100);

  return (
    <main className="solution-loading-screen flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-5 py-16 text-white" data-scroll-skip>
      <div aria-hidden="true" className="solution-loading-grid absolute inset-0" />
      <div aria-hidden="true" className="absolute left-[12%] top-[18%] size-72 rounded-full bg-fuchsia-600/20 blur-[100px]" />
      <div aria-hidden="true" className="absolute bottom-[10%] right-[10%] size-80 rounded-full bg-cyan-500/15 blur-[110px]" />
      <section className="relative z-10 w-full max-w-xl rounded-[32px] border border-fuchsia-300/25 bg-[#100822]/80 px-6 py-10 text-center shadow-[0_35px_110px_rgba(0,0,0,.55),0_0_70px_rgba(192,38,211,.16)] backdrop-blur-xl sm:px-10 sm:py-12" role="status" aria-live="polite">
        <div className="solution-ai-loader mx-auto">
          <span className="solution-ai-loader-ring solution-ai-loader-ring-one" />
          <span className="solution-ai-loader-ring solution-ai-loader-ring-two" />
          <span className="solution-ai-loader-core"><FiCpu /></span>
        </div>
        <p className="mt-9 font-mono text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-200"><FiZap className="mr-2 inline" /> AI analysis in progress</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Finding the right solution for you</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-white/65">Please keep this page open while we prepare your shortlist.</p>

        {error ? (
          <div className="mx-auto mt-8 max-w-sm rounded-xl border border-rose-300/30 bg-rose-400/10 p-5">
            <p className="font-semibold text-rose-100">{error}</p>
            <button className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#24114a]" onClick={() => router.push(resumeUrl)} type="button">Continue in the full form</button>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-9 h-2 max-w-sm overflow-hidden rounded-full bg-white/10 ring-1 ring-white/5">
              <span className="solution-loading-progress block h-full rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mx-auto mt-4 flex min-h-6 max-w-sm animate-[hvc-fade_400ms_ease] items-center justify-center gap-2 text-sm font-semibold text-white/75" key={currentIndex}>
              <span className="solution-stage-pulse flex size-7 shrink-0 items-center justify-center rounded-full bg-fuchsia-400/20 text-fuchsia-200"><ActiveIcon /></span>
              {activeLabel}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
