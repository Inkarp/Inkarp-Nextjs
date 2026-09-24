"use client";

import { useState } from "react";
import Link from "next/link";
import { FiDownload, FiEdit3, FiMail, FiShare2 } from "react-icons/fi";
import { pushEvent } from "@/lib/analytics";

const ACTION_CLASS = "inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-ink";

export default function FinderReportActions({ sessionId }) {
  const [message, setMessage] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const share = async () => {
    const shareData = { title: "My Inkarp solution report", text: "Review this laboratory solution report from Inkarp.", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.href); setMessage("Report link copied"); }
    } catch { /* A cancelled share sheet is not an error. */ }
  };

  // Sends the visitor a link to this report, to any address (a colleague's too);
  // the address is also recorded as a lead.
  const sendReport = async (event) => {
    event.preventDefault();
    setSending(true);
    setMessage("");
    const response = await fetch(`/api/solution-finder/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "email-report", email }),
    }).catch(() => null);
    const data = await response?.json().catch(() => ({}));
    setSending(false);

    if (response?.ok) {
      setEmailOpen(false);
      setMessage(`Report sent to ${email.trim()}`);
      pushEvent("finder_report_emailed", { page: window.location.pathname });
    } else {
      setMessage(data?.message || "We could not send the email. Please try again shortly.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 print:hidden">
        <Link className={ACTION_CLASS} href="/solution-finder"><FiEdit3 /> Refine answers</Link>
        <button aria-expanded={emailOpen} className={ACTION_CLASS} onClick={() => setEmailOpen((open) => !open)} type="button"><FiMail /> Email me this report</button>
        <button className={ACTION_CLASS} onClick={share} type="button"><FiShare2 /> Share</button>
        <button className="inline-flex h-11 items-center gap-2 bg-white px-4 text-sm font-semibold text-ink transition hover:bg-red hover:text-white" onClick={() => window.print()} type="button"><FiDownload /> Save PDF</button>
      </div>
      {emailOpen ? (
        <form className="mt-3 max-w-md print:hidden" onSubmit={sendReport}>
          <div className="flex gap-2">
            <input aria-label="Email address" autoComplete="email" className="h-11 min-w-0 flex-1 border border-white/20 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/60" inputMode="email" onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required type="email" value={email} />
            <button className="h-11 shrink-0 bg-white px-4 text-sm font-semibold text-ink transition hover:bg-red hover:text-white disabled:opacity-60" disabled={sending} type="submit">{sending ? "Sending…" : "Send"}</button>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-white/55">We&apos;ll email you a link to this report.</p>
        </form>
      ) : null}
      {message ? <p className="mt-2 text-xs text-white/65" role="status">{message}</p> : null}
    </div>
  );
}
