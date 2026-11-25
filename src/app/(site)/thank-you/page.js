import Link from"next/link";
import DexterFigure from "@/components/dexter/DexterFigure";
import { DEXTER_PLACES } from "@/data/dexter";
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

const thankYouContent = {
  contact: {
    label: "Enquiry Received",
    title: "Thank you for contacting us",
    message:
      "We have received your enquiry. Our team will review it and get back to you shortly.",
    href: "/contact",
    cta: "Back to Contact",
  },
  default: {
    label: "Application Received",
    title: "Thank you for applying",
    message:
      "Our team will review your profile and get in touch if your experience matches an open opportunity.",
    href: "/careers",
    cta: "Back to Careers",
  },
};

export default async function ThankYou({ searchParams }) {
  const params = await searchParams;
  const content = thankYouContent[params?.type] ?? thankYouContent.default;

  if (DEXTER_PLACES.thankYou) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-14 sm:py-20">
        <section className="grid w-full max-w-[920px] items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
          <div className="flex justify-center rounded-sm bg-parchment-alt px-8 pt-8 md:px-10">
            <DexterFigure decorative height={290} mood="celebrate" priority />
          </div>
          <div>
            <span className="border border-red/30 bg-parchment px-4 py-1 text-xs font-semibold uppercase text-ink">{content.label}</span>
            <h1 className="mt-5 text-3xl text-red sm:text-4xl">{content.title}</h1>
            <p className="mt-3 max-w-lg text-[15.5px] leading-7 text-ink-soft">{content.message}</p>
            <Link className="mt-6 inline-flex bg-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a3000e]" href={content.href}>
              {content.cta}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <section className="max-w-xl border border-line-light bg-parchment p-8 text-center">
        <span className="border border-red/30 bg-parchment px-4 py-1 text-xs font-semibold uppercase text-ink">
          {content.label}
        </span>
        <h1 className="mt-5 text-3xl text-red">
          {content.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          {content.message}
        </p>
        <Link
          className="mt-6 inline-flex bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          href={content.href}
        >
          {content.cta}
        </Link>
      </section>
    </main>
  );
}
