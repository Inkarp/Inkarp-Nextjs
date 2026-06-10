import Link from "next/link";
import { TbError404 } from "react-icons/tb";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="max-w-md rounded-lg border border-white/10 bg-white/5 p-6 text-center">
        <TbError404 className="mx-auto mb-4 text-6xl text-cyan-300" />
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          className="mt-6 inline-flex rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200"
          href="/"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
