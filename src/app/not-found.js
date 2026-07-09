import Link from"next/link";
import { TbError404 } from"react-icons/tb";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-6 text-ink">
      <div className="max-w-md border border-line-light bg-white p-8 text-center">
        <TbError404 className="mx-auto mb-4 text-6xl text-red" />
        <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          className="mt-6 inline-flex border border-red bg-red px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-transparent hover:text-red"
          href="/"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}