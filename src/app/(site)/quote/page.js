import QuoteRequest from "@/components/products/QuoteRequest";
import RecTag from "@/components/home/RecTag";

export const metadata = {
  title: "Request a Quote | Inkarp",
  description:
    "Request pricing and availability for every product on your shortlist in one enquiry.",
  // The list lives in the visitor's own browser, so there is nothing to index.
  robots: { index: false, follow: true },
};

export default function QuotePage() {
  return (
    <main className="bg-white px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 max-w-2xl">
          <RecTag>Your quote</RecTag>
          <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Request a quote for your shortlist
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
            Everything you have added is listed below. Share your details once and an Inkarp
            specialist will come back with pricing and availability for all of them together.
          </p>
        </div>

        <QuoteRequest />
      </div>
    </main>
  );
}
