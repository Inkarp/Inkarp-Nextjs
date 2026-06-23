import { FiChevronRight } from "react-icons/fi";
import SectionHeading from "@/components/home/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Place your order",
    description:
      "Share the product or service you need — our team confirms availability, pricing, and timelines right away.",
  },
  {
    number: "02",
    title: "We schedule pickup",
    description:
      "For service and calibration requests, our logistics team arranges a pickup slot that works around your lab schedule.",
  },
  {
    number: "03",
    title: "Service & dispatch",
    description:
      "Certified engineers service the equipment, or your order is packed and dispatched from our nearest facility.",
  },
  {
    number: "04",
    title: "Delivered & verified",
    description:
      "Your equipment is delivered, installed, and verified on-site so it's ready to use the moment we leave.",
  },
];

function StepHexagon({ number }) {
  return (
    <span
      className="relative flex size-14 shrink-0 items-center justify-center bg-white font-maxot text-base font-bold text-[#BE0010] shadow-sm shadow-zinc-950/5 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)] dark:bg-zinc-900"
      aria-hidden="true"
    >
      {number}
    </span>
  );
}

export default function OrderServiceSteps() {
  return (
    <section className="relative overflow-hidden bg-[#fff3f4] px-4 py-14 sm:px-6 lg:px-8 lg:py-20 dark:bg-zinc-950">
      <SectionHeading
        eyebrow="Our Process"
        title="From order to delivery in four simple steps"
        description="Whether you're ordering new equipment or booking a service, here's how we get it to your lab — fast, tracked, and hassle-free."
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="hidden items-start gap-0 lg:flex">
          {steps.map((step, index) => (
            <div className="relative flex flex-1 flex-col" key={step.number}>
              <div className="relative flex items-center">
                <StepHexagon number={step.number} />
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-14 top-1/2 h-px w-[calc(100%-3.5rem)] -translate-y-1/2 border-t-2 border-dashed border-zinc-300 dark:border-zinc-700"
                  />
                ) : null}
              </div>

              <div className="mt-5 flex gap-3 pr-4">
                <FiChevronRight
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-2xl text-[#BE0010]"
                />
                <div>
                  <h3 className="font-maxot text-base font-bold text-zinc-950 dark:text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {steps.map((step) => (
            <div
              className="flex gap-3 rounded-xl border border-white/60 bg-white p-4 shadow-sm shadow-zinc-950/5 dark:border-zinc-800/60 dark:bg-zinc-900"
              key={step.number}
            >
              <StepHexagon number={step.number} />
              <div>
                <h3 className="font-maxot text-base font-bold text-zinc-950 dark:text-zinc-100">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
