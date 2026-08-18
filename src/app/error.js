"use client";

import { useEffect } from"react";
import { MdOutlineErrorOutline } from"react-icons/md";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-6 text-ink">
      <div className="max-w-md border border-line-light bg-white p-8">
        <MdOutlineErrorOutline className="mb-4 text-4xl text-red" />
        <h1 className="text-2xl font-semibold text-ink">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          The page had a problem while loading. You can try again from here.
        </p>
        <button
          className="mt-6 border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}