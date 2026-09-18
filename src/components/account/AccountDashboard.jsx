"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiFileText, FiLogOut, FiTarget, FiTrash2 } from "react-icons/fi";
import useQuoteBasket from "@/components/products/useQuoteBasket";
import { itemKey, removeFromBasket } from "@/lib/quoteBasket";

const PROFILE_FIELDS = [
  { key: "name", label: "Name", autoComplete: "name" },
  { key: "company", label: "Company / Institute", autoComplete: "organization" },
  { key: "phone", label: "Phone", autoComplete: "tel" },
  { key: "city", label: "City", autoComplete: "address-level2" },
];

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AccountDashboard() {
  const basket = useQuoteBasket();
  const [quotes, setQuotes] = useState([]);
  const [profile, setProfile] = useState({});
  const [solutionReports, setSolutionReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedNote, setSavedNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/profile")
      .then((response) => (response.ok ? response.json() : Promise.reject(response)))
      .then((data) => {
        if (cancelled) return;
        setQuotes(data.quotes ?? []);
        setSolutionReports(data.solutionReports ?? []);
        setProfile(data.user ?? {});
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setSavedNote("");
    try {
      const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      setSavedNote(response.ok ? "Saved." : "Could not save. Try again.");
    } catch {
      setSavedNote("Could not save. Try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const signOut = async () => {
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    window.location.href = "/";
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
      <div className="flex flex-col gap-8">
        <section className="border border-line-light bg-parchment p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Saved solution reports</h2>
            <Link className="inline-flex items-center gap-2 text-xs font-semibold text-red hover:underline" href="/solution-finder">Build a new report <FiArrowUpRight /></Link>
          </div>
          {solutionReports.length ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {solutionReports.map((report) => (
                <li className="border border-line-light bg-white p-4" key={report.sessionId}>
                  <div className="flex gap-3"><span className="flex size-9 shrink-0 items-center justify-center bg-rose-50 text-red"><FiTarget /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{report.institution?.name}</p><p className="mt-1 text-xs text-ink-soft">{report.labels?.objective}</p></div></div>
                  <div className="mt-4 flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-wide text-ink-soft">{formatDate(report.updatedAt)}</span><Link className="text-xs font-semibold text-red hover:underline" href={`/solution-finder/results/${report.sessionId}`}>Open report</Link></div>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm leading-6 text-ink-soft">Saved personalised product and workflow reports will appear here.</p>}
        </section>

        {/* Saved list */}
        <section className="border border-line-light bg-parchment p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              {basket.length === 1 ? "1 product saved" : `${basket.length} products saved`}
            </h2>
            {basket.length ? (
              <Link
                className="inline-flex items-center gap-2 border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                href="/quote"
              >
                Request a quote
              </Link>
            ) : null}
          </div>

          {basket.length ? (
            <ul className="divide-y divide-line-light border-y border-line-light">
              {basket.map((item) => {
                const key = itemKey(item);
                return (
                  <li className="flex items-center gap-3 py-3" key={key}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-line-light bg-white">
                      {item.image ? (
                        <Image
                          alt={item.imageAlt ?? item.name}
                          className="h-full w-full object-contain p-1"
                          height={48}
                          src={item.image}
                          width={48}
                        />
                      ) : (
                        <FiFileText aria-hidden className="text-ink-soft" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        className="text-sm font-semibold leading-snug text-ink transition hover:text-red"
                        href={`/products/${item.slug}`}
                      >
                        {item.name}
                      </Link>
                      {item.principalName ? (
                        <p className="mt-0.5 text-xs text-ink-soft">{item.principalName}</p>
                      ) : null}
                    </div>
                    <button
                      aria-label={`Remove ${item.name}`}
                      className="inline-flex size-9 shrink-0 items-center justify-center text-ink-soft transition hover:text-red"
                      onClick={() => removeFromBasket(key)}
                      type="button"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-ink-soft">
              Nothing saved yet. Add products from the{" "}
              <Link className="font-semibold text-red hover:underline" href="/products">
                catalogue
              </Link>{" "}
              and they will wait for you here — on any device you sign in from.
            </p>
          )}
        </section>

        {/* Quote history */}
        <section className="border border-line-light bg-parchment p-6">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Your quote requests</h2>

          {loading ? (
            <p className="text-sm text-ink-soft">Loading…</p>
          ) : quotes.length ? (
            <ul className="divide-y divide-line-light border-y border-line-light">
              {quotes.map((quote, index) => {
                const items = Array.isArray(quote.items) ? quote.items : [];
                const count = quote.productCount ?? items.length ?? (quote.productName ? 1 : 0);
                return (
                  <li className="py-4" key={quote.reference ?? index}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-mono text-xs font-semibold text-ink">
                        {quote.reference ?? "Quote request"}
                      </p>
                      <p className="text-xs text-ink-soft">{formatDate(quote.submittedAt)}</p>
                    </div>
                    <p className="mt-1 text-sm text-ink">
                      {count === 1 ? "1 product" : `${count} products`}
                    </p>
                    {items.length ? (
                      <ul className="mt-2 space-y-1">
                        {items.slice(0, 4).map((item, itemIndex) => (
                          <li className="text-xs text-ink-soft" key={item.slug ?? itemIndex}>
                            <Link className="transition hover:text-red" href={`/products/${item.slug}`}>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                        {items.length > 4 ? (
                          <li className="text-xs text-ink-soft">+{items.length - 4} more</li>
                        ) : null}
                      </ul>
                    ) : quote.productName ? (
                      <p className="mt-2 text-xs text-ink-soft">{quote.productName}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-ink-soft">
              No quote requests yet. Anything you send through the site will be listed here with its
              reference number.
            </p>
          )}
        </section>
      </div>

      {/* Profile */}
      <aside className="border border-line-light bg-parchment p-6">
        <h2 className="mb-1 text-lg font-semibold tracking-tight text-ink">Your details</h2>
        <p className="mb-4 text-xs leading-5 text-ink-soft">
          Saved here so quote forms fill themselves in next time.
        </p>

        <form className="flex flex-col gap-3" onSubmit={saveProfile}>
          {PROFILE_FIELDS.map((field) => (
            <div key={field.key}>
              <label
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black"
                htmlFor={`profile-${field.key}`}
              >
                {field.label}
              </label>
              <input
                autoComplete={field.autoComplete}
                className="w-full border border-line-light bg-parchment-alt px-3 py-2 text-sm text-black transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                id={`profile-${field.key}`}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, [field.key]: event.target.value }))
                }
                value={profile[field.key] ?? ""}
              />
            </div>
          ))}

          <button
            className="mt-1 border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
            disabled={savingProfile}
            type="submit"
          >
            {savingProfile ? "Saving…" : "Save details"}
          </button>
          {savedNote ? (
            <p aria-live="polite" className="text-[11px] font-semibold text-ink-soft">{savedNote}</p>
          ) : null}
        </form>

        <button
          className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-ink-soft transition hover:text-red"
          onClick={signOut}
          type="button"
        >
          <FiLogOut aria-hidden /> Sign out
        </button>
      </aside>
    </div>
  );
}
