import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import RecTag from "@/components/home/RecTag";
import { CONTACT_FAQS } from "@/data/contactFaqs";

// Native <details>, so the answers open without any client JS. Item styling
// follows the product page FAQ (FAQSection).
export default function ContactFaq() {
  return (
    <section className="border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8" id="faq">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 max-w-2xl" data-reveal>
          <RecTag>FAQ</RecTag>
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Common <em className="italic text-red">questions</em>
          </h2>
        </div>

        <div className="space-y-2">
          {CONTACT_FAQS.map((faq) => (
            <details className="group border border-line-light bg-white transition open:border-red/40" key={faq.question}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red/40 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold text-ink sm:text-base">{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center bg-parchment-alt text-sm font-bold text-ink transition group-open:bg-red group-open:text-white"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">-</span>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-7 text-ink-soft">
                <p>{faq.answer}</p>
                {faq.link ? (
                  <Link
                    className="mt-2 inline-flex items-center gap-1.5 font-semibold text-red underline-offset-2 hover:underline"
                    href={faq.link.href}
                  >
                    {faq.link.label}
                    <FiArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                ) : null}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border border-line-light bg-white p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-ink">Have a question not listed here?</p>
            <p className="mt-0.5 text-xs text-ink-soft">Send it to us and the right team will pick it up.</p>
          </div>
          <a
            className="inline-flex shrink-0 items-center gap-2 bg-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a3000e]"
            href="#contact-form"
          >
            Ask Inkarp
            <FiArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
