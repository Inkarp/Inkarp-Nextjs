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
