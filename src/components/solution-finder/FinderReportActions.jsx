"use client";

import { useState } from "react";
import Link from "next/link";
import { FiCheck, FiDownload, FiEdit3, FiSave, FiShare2 } from "react-icons/fi";

export default function FinderReportActions({ sessionId, initiallySaved = false }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [message, setMessage] = useState("");

  const save = async () => {
    setMessage("Saving…");
    const response = await fetch(`/api/solution-finder/${sessionId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save" }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) { setSaved(true); setMessage("Saved to your account"); }
    else if (data.signInRequired) setMessage("Sign in first to save this report");
    else setMessage("Could not save this report");
  };

  const share = async () => {
    const shareData = { title: "My Inkarp solution report", text: "Review this laboratory solution report from Inkarp.", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); setMessage("Report link copied"); }
    } catch { /* A cancelled share sheet is not an error. */ }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 print:hidden">
        <Link className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-ink" href="/solution-finder"><FiEdit3 /> Refine answers</Link>
        <button className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-ink" onClick={save} type="button">{saved ? <FiCheck /> : <FiSave />} {saved ? "Saved" : "Save report"}</button>
        <button className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-ink" onClick={share} type="button"><FiShare2 /> Share</button>
        <button className="inline-flex h-11 items-center gap-2 bg-white px-4 text-sm font-semibold text-ink transition hover:bg-red hover:text-white" onClick={() => window.print()} type="button"><FiDownload /> Save PDF</button>
      </div>
      {message ? <p className="mt-2 text-xs text-white/65">{message}</p> : null}
    </div>
  );
}
