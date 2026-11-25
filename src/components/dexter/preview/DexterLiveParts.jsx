"use client";

import { useState } from "react";
import { FiRotateCcw } from "react-icons/fi";
import { DEXTER_MOODS, MOOD_KEYS, hasNewFace } from "@/data/dexter";
import { looksLikeEmail, suggestEmail } from "@/lib/dexter/emailTypo";
import DexterAvatar from "../DexterAvatar";
import DexterFigure from "../DexterFigure";

/** The eight moods; each card replays its motion on click. */
export function MoodBoard() {
  const [plays, setPlays] = useState({});
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {MOOD_KEYS.map((key) => (
        <li className="flex flex-col border border-line-light bg-white" key={key}>
          <div className="flex h-[210px] items-end justify-center overflow-hidden bg-parchment-alt pt-6">
            <DexterFigure height={180} key={plays[key] ?? 0} mood={key} />
          </div>
          <div className="flex flex-1 flex-col gap-1 p-3.5">
            <p className="flex items-center justify-between gap-2 text-[15px] font-semibold text-ink">
              {DEXTER_MOODS[key].label}
              {hasNewFace(key) ? <span className="bg-red px-1.5 py-0.5 text-[10.5px] font-semibold text-white">New face</span> : null}
            </p>
            <p className="text-[13.5px] leading-snug text-ink-soft">{DEXTER_MOODS[key].line}</p>
            <button
              className="mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-[13px] font-semibold text-red hover:underline"
              onClick={() => setPlays((current) => ({ ...current, [key]: (current[key] ?? 0) + 1 }))}
              type="button"
            >
              <FiRotateCcw aria-hidden="true" className="size-3.5" />
              Play again
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

const FIELD = "h-11 w-full border border-line-light bg-white px-3 text-[15px] text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/15";

/**
 * A form Dexter watches: listening while you type, worried at a mistake (and
 * offering the fix for a mistyped email), wow when it's complete, thinking
 * while it "sends", celebrating at the end. Preview only: nothing is sent.
 */
export function ReactionForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState(false);
  const [phase, setPhase] = useState("edit"); // edit | missing | sending | sent
  const fix = suggestEmail(values.email);
  const emailDone = values.email.includes("@");
  const complete = values.name.trim() && looksLikeEmail(values.email) && !fix && values.message.trim();

  let mood = "hello";
  let line = "Hi, I'm Dexter. I'll keep an eye on this form with you.";
  if (phase === "sending") [mood, line] = ["thinking", "Sending your enquiry…"];
  else if (phase === "sent") [mood, line] = ["celebrate", "Thank you. Inkarp will be in touch within 1 business day."];
  else if (fix) [mood, line] = ["worried", `That ends in ${values.email.split("@")[1]}. Did you mean ${fix.split("@")[1]}?`];
  else if (phase === "missing" && !complete) [mood, line] = ["worried", "Name, email and message are all needed before I can send this."];
  else if (emailDone && !looksLikeEmail(values.email) && !focused) [mood, line] = ["worried", "That email looks incomplete."];
  else if (complete) [mood, line] = ["wow", "That's everything I need."];
  else if (focused) [mood, line] = ["listening", "Go on, I'm following."];

  const update = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    if (phase !== "edit" && phase !== "missing") setPhase("edit");
  };

  const submit = (event) => {
    event.preventDefault();
    if (!complete) {
      setPhase("missing");
      return;
    }
    setPhase("sending");
    window.setTimeout(() => setPhase("sent"), 1400);
  };

  return (
    <form className="grid gap-3" noValidate onBlur={() => setFocused(false)} onFocus={() => setFocused(true)} onSubmit={submit}>
      <div aria-live="polite" className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border border-line-light border-l-[3px] border-l-red bg-white p-3">
        <DexterAvatar key={`${mood}-${phase}`} mood={mood} size={52} />
        <div>
          <p className="text-[14.5px] leading-snug text-ink">{line}</p>
          {fix ? (
            <button className="mt-1.5 text-[13px] font-semibold text-red hover:underline" onClick={() => setValues((current) => ({ ...current, email: fix }))} type="button">
              Use {fix}
            </button>
          ) : null}
        </div>
      </div>
      <label className="grid gap-1 text-[13px] font-medium text-ink-soft" htmlFor="dx-name">
        Name
        <input autoComplete="off" className={FIELD} id="dx-name" onChange={update("name")} value={values.name} />
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-ink-soft" htmlFor="dx-email">
        Email
        <input autoComplete="off" className={FIELD} id="dx-email" onChange={update("email")} placeholder="Try name@gmial.com" type="email" value={values.email} />
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-ink-soft" htmlFor="dx-message">
        Message
        <textarea className={`${FIELD} h-20 py-2`} id="dx-message" onChange={update("message")} value={values.message} />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button className="bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a3000e] disabled:opacity-60" disabled={phase === "sending"} type="submit">
          {phase === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        {phase === "sent" ? (
          <button className="text-sm font-semibold text-ink-soft hover:text-red" onClick={() => { setValues({ name: "", email: "", message: "" }); setPhase("edit"); }} type="button">
            Start again
          </button>
        ) : null}
        <span className="text-xs text-ink-soft">Preview only: nothing is sent.</span>
      </div>
    </form>
  );
}
