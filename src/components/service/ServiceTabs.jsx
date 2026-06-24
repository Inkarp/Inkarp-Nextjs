"use client";

import { useState } from "react";

const services = [
  {
    id: 1,
    title: "Technical Services",
    intro:
      "Instruments, like research, demand expertise. Our technical service division provides advanced troubleshooting, application support, and corrective maintenance when equipment requires immediate attention.",
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
      "Proper installation is the foundation for the smooth operation of any scientific instrument. Our certified engineers follow global installation and commissioning protocols.",
    points: [
      "Site readiness checks for electrical, water, gas, and environmental requirements",
      "Calibration and validation in compliance with GLP/GMP standards",
      "Hands-on user training for confident operation from day one",
    ],
    note: "Error-free installation ensures maximum uptime and long-term instrument reliability.",
  },
  {
    id: 3,
    title: "Preventive Maintenance",
    intro:
      "Preventive maintenance is essential for avoiding unexpected breakdowns and ensuring consistent performance in laboratory environments.",
    points: [
      "Scheduled inspections covering performance, safety, and calibration",
      "Cleaning, lubrication, and fine-tuning to extend instrument lifespan",
      "Maintenance documentation to support audits and regulatory compliance",
    ],
    note: "Early identification of issues helps reduce repair costs and downtime.",
  },
  {
    id: 4,
    title: "Annual Maintenance Contracts (AMC)",
    intro:
      "Our Annual Maintenance Contracts are designed to provide long-term reliability with flexible coverage options tailored to your needs.",
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
      "Availability of genuine spare parts is critical for maintaining instrument accuracy and long-term performance.",
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
    <section className="mx-auto my-10 w-[95%]">
      <div className="rounded-2xl border border-zinc-200 bg-[#F5F5F5] p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <span className="font-maxot inline-block rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs uppercase sm:text-sm dark:bg-zinc-950 dark:text-zinc-100">
            Services We Provide
          </span>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-3 rounded-full bg-[#F5F5F5] p-2 dark:bg-zinc-900">
          {services.map((service) => (
            <button
              className={`font-maxot rounded-full border px-5 py-2 transition ${
                activeService.id === service.id
                  ? "border-[#BE0010] bg-[#BE0010] text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
              key={service.id}
              onClick={() => setActiveService(service)}
              type="button"
            >
              {service.title}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="font-maxot mb-3 text-xl text-[#E63946] sm:text-2xl">
            {activeService.title}
          </h3>

          <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-400">
            {activeService.intro}
          </p>

          <ul className="ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-400">
            {activeService.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          {activeService.note ? (
            <p className="font-maxot mt-4 font-medium text-zinc-800 dark:text-zinc-200">
              {activeService.note}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
