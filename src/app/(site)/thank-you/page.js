import Link from"next/link";
import { getCanonicalUrl } from"@/data/pageSeo";

export const metadata = {
  title:"Thank You - Inkarp Instruments",
  alternates: {
    canonical: getCanonicalUrl("/thank-you"),
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYou() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <section className="max-w-xl border border-line-light bg-parchment p-8 text-center">
        <span className="border border-red/30 bg-parchment px-4 py-1 text-xs font-semibold uppercase text-ink">
          Application Received
        </span>
        <h1 className="mt-5 text-3xl text-red">
          Thank you for applying
        </h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          Our team will review your profile and get in touch if your experience
          matches an open opportunity.
        </p>
        <Link
          className="mt-6 inline-flex bg-red px-5 py-3 text-sm font-semibold text-parchment transition hover:bg-[#9a000d]"
          href="/careers"
        >
          Back to Careers
        </Link>
      </section>
    </main>
  );
}
