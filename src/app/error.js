"use client";

import { useEffect } from "react";
import { MdOutlineErrorOutline } from "react-icons/md";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="max-w-md rounded-lg border border-red-400/20 bg-white/5 p-6">
        <MdOutlineErrorOutline className="mb-4 text-4xl text-red-300" />
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          The page had a problem while loading. You can try again from here.
        </p>
        <button
          className="mt-6 rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
