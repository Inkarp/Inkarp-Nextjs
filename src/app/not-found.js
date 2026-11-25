import Link from"next/link";
import { LuFlaskConicalOff } from"react-icons/lu";
import EmptyStateIcon from"@/components/common/EmptyStateIcon";
import DexterFigure from "@/components/dexter/DexterFigure";
import NotFoundSuggestions from "@/components/dexter/NotFoundSuggestions";
import { DEXTER_PLACES } from "@/data/dexter";

export const metadata = {
  title: "Page not found - Inkarp Instruments",
  robots: { index: false, follow: true },
};

const primary = "inline-flex items-center bg-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a3000e]";
const secondary = "inline-flex items-center border border-line-light bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-red hover:text-red";

// Dexter's page-not-found: puzzled Dexter, the address that missed, the
// closest real pages and the main ways back in.
function DexterNotFound() {
  return (
    <main className="bg-white px-4 py-14 text-ink sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-[1000px] items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14">
        <div className="flex justify-center rounded-sm bg-parchment-alt px-8 pt-8 md:px-10">
          <DexterFigure decorative height={300} mood="puzzled" priority />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red">Page not found</p>
          <h1 className="mt-3 text-[34px] leading-[1.08] text-ink sm:text-[44px]">This page has moved, or it was never here.</h1>
          <NotFoundSuggestions />
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link className={primary} href="/products">
              Browse products
            </Link>
            <Link className={secondary} href="/workflows">
              Workflows
            </Link>
            <Link className={secondary} href="/contact">
              Contact us
            </Link>
            <Link className={secondary} href="/">
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function NotFound() {
  if (DEXTER_PLACES.notFound) return <DexterNotFound />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-6 text-ink">
      <div className="max-w-md border border-line-light bg-white p-8 text-center">
        <EmptyStateIcon icon={LuFlaskConicalOff} />
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
