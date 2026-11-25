"use client";

import { useEffect, useRef, useState } from "react";
import { DEXTER_PLACES } from "@/data/dexter";
import { looksLikeEmail, suggestEmail } from "@/lib/dexter/emailTypo";
import DexterAvatar from "./DexterAvatar";

const LINES = {
  hello: "I'll keep an eye on this form with you.",
  listening: "Go on, I'm following.",
  wow: "That's everything I need.",
  thinking: "Sending…",
  celebrate: "Sent. Thank you!",
};

// A required field is done when it has a value; a radio group when any option is picked.
const isFilled = (field, form) => {
  if (field.type === "radio") return [...form.querySelectorAll(`input[type="radio"][name="${CSS.escape(field.name)}"]`)].some((option) => option.checked);
  if (field.type === "checkbox") return field.checked;
  return String(field.value ?? "").trim() !== "";
};

/**
 * Dexter beside a form's send button. He watches the form he sits in:
 * listening while it's being filled, worried at a mistyped email (offering the
 * fix) or an error, "wow" once every required field is filled, thinking
 * while it sends, celebrating when it's sent. The form passes its own
 * sending / sent / error state; everything else is read from the page. A
 * form that checks its own fields (no `required` attributes) passes
 * `complete` instead.
 */
export default function DexterFormBuddy({ sending = false, sent = false, error = "", complete: completeFromForm, className = "" }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);
  const [complete, setComplete] = useState(false);
  const [fix, setFix] = useState(null);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return undefined;
    const read = () => {
      const email = form.querySelector('input[type="email"]');
      const fixed = email?.value ? suggestEmail(email.value) : null;
      setFix(fixed ? { email: fixed, typed: email.value.split("@")[1], wanted: fixed.split("@")[1] } : null);
      const required = [...form.querySelectorAll("[required]")].filter((field) => !field.disabled);
      setComplete(required.length > 0 && required.every((field) => isFilled(field, form)) && (!email?.value || looksLikeEmail(email.value)));
    };
    const onFocusIn = () => setFocused(true);
    const onFocusOut = (event) => {
      if (!form.contains(event.relatedTarget)) setFocused(false);
    };
    form.addEventListener("input", read);
    form.addEventListener("change", read);
    form.addEventListener("focusin", onFocusIn);
    form.addEventListener("focusout", onFocusOut);
    return () => {
      form.removeEventListener("input", read);
      form.removeEventListener("change", read);
      form.removeEventListener("focusin", onFocusIn);
      form.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Put the suggested email into the field, the way typing would, so the form's own state updates.
  const applyFix = () => {
    const email = ref.current?.closest("form")?.querySelector('input[type="email"]');
    if (!email || !fix) return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(email, fix.email);
    email.dispatchEvent(new Event("input", { bubbles: true }));
    email.focus();
  };

  if (!DEXTER_PLACES.forms) return <span hidden ref={ref} />;

  let mood = "hello";
  let line = LINES.hello;
  if (sent) [mood, line] = ["celebrate", LINES.celebrate];
  else if (sending) [mood, line] = ["thinking", LINES.thinking];
  else if (error) [mood, line] = ["worried", error];
  else if (fix) [mood, line] = ["worried", `That email ends in ${fix.typed}. Did you mean ${fix.wanted}?`];
  else if (completeFromForm ?? complete) [mood, line] = ["wow", LINES.wow];
  else if (focused) [mood, line] = ["listening", LINES.listening];

  return (
    <div aria-live="polite" className={`flex items-center gap-3 ${className}`} ref={ref}>
      <DexterAvatar key={mood} mood={mood} size={44} />
      <p className="min-w-0 text-[13.5px] leading-snug text-ink-soft">
        {line}
        {fix && !sending && !sent && !error ? (
          <button className="ml-1.5 font-semibold text-red hover:underline" onClick={applyFix} type="button">
            Use {fix.email}
          </button>
        ) : null}
      </p>
    </div>
  );
}
