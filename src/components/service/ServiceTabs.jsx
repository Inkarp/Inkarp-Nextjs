"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import RecTag from "@/components/home/RecTag";

const services = [
  {
    id: 1,
    title: "Technical Services",
    intro:
      "Instruments, like research, demand expertise. Our technical service division provides troubleshooting, application support, and corrective maintenance when equipment requires immediate attention.",
    points: [
      "On-site support for quick issue resolution and minimal downtime",
      "Remote assistance for troubleshooting, diagnostics, and software updates",
      "Application support for method development, usage guidance, and optimization",
    ],
    note: "Our factory-trained engineers are certified by global manufacturers and equipped with advanced diagnostic tools.",
  },
  {
    id: 2,
    title: "Product Installation",
    intro:
      "Proper installation is the foundation for smooth operation. Our certified engineers follow global installation and commissioning protocols so labs can start with confidence.",
    points: [
      "Site readiness checks for electrical, water, gas, and environmental requirements",
      "Calibration and validation in compliance with GLP/GMP standards",
      "Hands-on user training for confident operation from day one",
    ],
    note: "Error-free installation helps protect uptime, accuracy, and long-term instrument reliability.",
  },
  {
    id: 3,
    title: "Preventive Maintenance",
    intro:
      "Preventive maintenance reduces surprise breakdowns and supports consistent performance in demanding laboratory environments.",
    points: [
      "Scheduled inspections covering performance, safety, and calibration",
      "Cleaning, lubrication, and fine-tuning to extend instrument lifespan",
      "Maintenance documentation to support audits and regulatory compliance",
    ],
    note: "Early identification of issues helps reduce repair costs and downtime.",
  },
  {
    id: 4,
    title: "Annual Maintenance Contracts",
    intro:
      "Our Annual Maintenance Contracts provide long-term reliability through flexible coverage options tailored to your lab's workload and risk profile.",
    points: [
      "Comprehensive AMC covering preventive maintenance, breakdowns, and parts",
      "Non-comprehensive AMC covering service visits and labor",
      "Priority response and faster turnaround times for AMC customers",
    ],
    note: "AMCs offer cost-effective protection for labs that cannot afford downtime.",
  },
  {
    id: 5,
    title: "Spares Support",
    intro:
      "Genuine spare parts are critical for maintaining instrument accuracy, warranty confidence, and long-term performance.",
    points: [
      "100% genuine spare parts sourced directly from principal manufacturers",
      "Quick availability through regional service centers across India",
      "Consumables and accessories support for uninterrupted workflows",
    ],
    note: "Using genuine spares protects warranties and safeguards instrument precision.",
  },
];

export default function ServiceTabs() {
  const [activeService, setActiveService] = useState(services[0]);

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" id="service-types" data-reveal>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag>Services We Provide</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Support paths for every instrument lifecycle.
            </h2>
          </div>
          <p className="max-w-[430px] text-sm leading-6 text-ink-soft">
            Choose a service area to see how our engineers support installation, uptime,
            compliance, maintenance, and spares availability.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="border border-line-light bg-parchment-alt p-2">
            <div className="grid gap-2">
              {services.map((service) => {
                const active = activeService.id === service.id;

                return (
                  <button
                    className={`flex items-center justify-between border px-4 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "border-red bg-red text-white"
                        : "border-line-light bg-white text-ink hover:border-red hover:text-red"
                    }`}
                    key={service.id}
                    onClick={() => setActiveService(service)}
                    type="button"
                  >
                    <span>{service.title}</span>
                    <span className={active ? "text-white/80" : "text-ink-soft"}>
                      {String(service.id).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <article className="relative border border-line-light bg-white p-6 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-[''] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red">
              {String(activeService.id).padStart(2, "0")} / Service Area
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {activeService.title}
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
              {activeService.intro}
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-ink-soft sm:grid-cols-3">
              {activeService.points.map((point) => (
                <li key={point} className="border border-line-light bg-parchment-alt p-4">
                  <FiCheckCircle className="mb-3 size-5 text-red" />
                  <span className="leading-6">{point}</span>
                </li>
              ))}
            </ul>

            {activeService.note ? (
              <p className="mt-6 border-l-2 border-red pl-4 text-sm font-semibold leading-6 text-ink">
                {activeService.note}
              </p>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
}