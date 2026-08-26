"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FiCheckCircle, FiMail } from "react-icons/fi";

const ERRORS = {
  expired: "That link has expired or was already used. Request a new one below.",
  invalid: "That sign-in link was not valid. Request a new one below.",
  unavailable: "Sign-in is unavailable right now. Please try again shortly.",
};

function SignInFormInner() {
  const params = useSearchParams();
  const linkError = ERRORS[params.get("error")] ?? "";

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        setError(result?.message || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="mt-8 border border-line-light bg-parchment p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center bg-emerald-100">
          <FiCheckCircle aria-hidden className="size-7 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-ink">Check your email</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-soft">
          We sent a sign-in link to <span className="font-semibold text-ink">{email}</span>. It
          works once and expires in 15 minutes.
        </p>
        <button
          className="mt-5 text-xs font-semibold text-ink-soft underline transition hover:text-red"
          onClick={() => setSent(false)}
          type="button"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form className="mt-8 border border-line-light bg-parchment p-6" noValidate onSubmit={submit}>
      {linkError ? (
        <p className="mb-4 border border-red/20 bg-red/5 px-4 py-3 text-xs font-semibold text-red">
          {linkError}
        </p>
      ) : null}

      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black" htmlFor="signin-email">
        Email address
      </label>
      <input
        autoComplete="email"
        className="w-full border border-line-light bg-parchment-alt px-3 py-2.5 text-sm text-black transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        id="signin-email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="name@company.com"
        required
        type="email"
        value={email}
      />

      {error ? (
        <p aria-live="polite" className="mt-3 text-[11px] font-semibold text-red">{error}</p>
      ) : null}

      <button
        className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-rose-200 bg-rose-50 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={sending || !email.trim()}
        type="submit"
      >
        <FiMail aria-hidden />
        {sending ? "Sending..." : "Email me a sign-in link"}
      </button>

      <p className="mt-4 text-[11px] leading-5 text-ink-soft">
        We use your activity on this site to help our team support you better. You can ask us to
        delete your account and data at any time.
      </p>
    </form>
  );
}

export default function SignInForm() {
  // useSearchParams needs a Suspense boundary during prerender.
  return (
    <Suspense fallback={<div className="mt-8 h-64 border border-line-light bg-parchment" />}>
      <SignInFormInner />
    </Suspense>
  );
}
