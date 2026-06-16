import Link from "next/link";

export const metadata = {
  title: "Thank You - Inkarp Instruments",
};

export default function ThankYou() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <section className="max-w-xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <span className="font-maxot rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs font-semibold uppercase text-zinc-800">
          Application Received
        </span>
        <h1 className="font-maxot mt-5 text-3xl text-[#BE0010]">
          Thank you for applying
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          Our team will review your profile and get in touch if your experience
          matches an open opportunity.
        </p>
        <Link
          className="mt-6 inline-flex rounded-lg bg-[#BE0010] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9a000d]"
          href="/careers"
        >
          Back to Careers
        </Link>
      </section>
    </main>
  );
}
