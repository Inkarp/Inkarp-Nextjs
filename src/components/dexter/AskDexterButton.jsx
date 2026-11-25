"use client";

import { FiMessageCircle } from "react-icons/fi";

/**
 * Opens the Ask Dexter chat with a question already asked. The chat
 * (FloatingChatbot) listens for the "dexter:ask" event and marks it handled;
 * where the chat isn't on the page, the visitor goes to the contact page.
 * `place` says which spot on the site asked, for analytics.
 */
export default function AskDexterButton({ question, place, children = "Ask Dexter", variant = "solid", className = "" }) {
  const look =
    variant === "link"
      ? "text-red underline-offset-4 hover:underline"
      : variant === "outline"
        ? "border border-line-light bg-white px-3.5 py-2 text-ink hover:border-red hover:text-red"
        : "bg-red px-3.5 py-2 text-white hover:bg-[#a3000e]";

  return (
    <button
      className={`inline-flex items-center gap-2 text-sm font-semibold transition ${look} ${className}`}
      onClick={() => {
        const detail = { question, place, handled: false };
        window.dispatchEvent(new CustomEvent("dexter:ask", { detail }));
        if (!detail.handled) window.location.assign("/contact");
      }}
      type="button"
    >
      <FiMessageCircle aria-hidden="true" className="size-4" />
      {children}
    </button>
  );
}
