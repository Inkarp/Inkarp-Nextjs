import { FiArrowRight } from "react-icons/fi";
import RecTag from "@/components/home/RecTag";

// No response time here on purpose: none has been agreed yet, so the steps
// describe what happens, not how fast.
const STEPS = [
  {
    title: "Tell us what you need",
    text: "Send the form, call or WhatsApp us. Picking a department gets it to the right desk.",
  },
  {
    title: "We route it to the right team",
    text: "Sales, service, applications or accounts: your enquiry goes to the team that handles it.",
  },
  {
    title: "A specialist gets back to you",
    text: "Someone from that team contacts you by phone or email to take it forward, whether that's a quotation, a demo or a service visit.",
  },
];

export default function ContactSteps() {
  return (
    <section className="border-b border-line-light bg-white px-4 py-16 sm:px-6 lg:px-8" id="what-happens-next">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 max-w-2xl" data-reveal>
          <RecTag>How it works</RecTag>
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            What happens <em className="italic text-red">next</em>
          </h2>
        </div>

        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li className="relative border border-line-light bg-white p-6" key={step.title}>
              <span className="block text-4xl font-semibold tracking-tight text-red/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-snug text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>

        <a
          className="mt-8 inline-flex min-h-12 items-center gap-2 bg-red px-7 text-sm font-semibold text-white shadow-lg shadow-red/15 transition hover:bg-[#a3000e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
          href="#contact-form"
        >
          Send an enquiry
          <FiArrowRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
