import Link from"next/link";
import { TbError404 } from"react-icons/tb";

export const metadata = {
  title: "Page not found - Inkarp Instruments",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-6 text-ink">
      <div className="max-w-md border border-line-light bg-white p-8 text-center">
        <TbError404 className="mx-auto mb-4 text-6xl text-red" />
        <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            className="inline-flex border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            href="/"
          >
            Go home
          </Link>
          <Link
            className="inline-flex border border-line-light px-5 py-2.5 text-sm font-semibold text-ink-soft transition hover:border-red/60 hover:text-red"
            href="/products"
          >
            Browse products
          </Link>
        </div>
      </div>
    </main>
  );
}