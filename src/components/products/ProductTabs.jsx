"use client";

import { useState } from "react";

const TABS = ["Specifications", "Key Features", "Applications", "FAQs", "Blog"];

export default function ProductTabs({ technicalSpecs, features, applications, faqs }) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-zinc-200">
        {TABS.map((tab) => (
          <button
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab
                ? "border-[#BE0010] text-[#BE0010]"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "Specifications" ? (
          <dl className="divide-y divide-zinc-200 rounded-md border border-zinc-200">
            {(technicalSpecs ?? []).map((spec) => (
              <div className="grid gap-1 p-4 sm:grid-cols-2" key={spec.label}>
                <dt className="font-semibold text-zinc-950">{spec.label}</dt>
                <dd className="text-zinc-600">{spec.value}</dd>
              </div>
            ))}
            {(technicalSpecs ?? []).length === 0 ? (
              <p className="p-4 text-sm text-zinc-500">
                Specifications coming soon.
              </p>
            ) : null}
          </dl>
        ) : null}

        {activeTab === "Key Features" ? (
          <ul className="grid gap-3 text-zinc-700">
            {(features ?? []).map((feature, index) => (
              <li
                className="rounded-md border border-zinc-200 bg-white p-4"
                key={`${feature}-${index}`}
              >
                {feature}
              </li>
            ))}
            {(features ?? []).length === 0 ? (
              <p className="text-sm text-zinc-500">Key features coming soon.</p>
            ) : null}
          </ul>
        ) : null}

        {activeTab === "Applications" ? (
          <ul className="space-y-3 text-zinc-700">
            {(applications ?? []).map((application, index) => (
              <li
                className="rounded-md border border-zinc-200 bg-white p-4"
                key={`${application}-${index}`}
              >
                {application}
              </li>
            ))}
            {(applications ?? []).length === 0 ? (
              <p className="text-sm text-zinc-500">Applications coming soon.</p>
            ) : null}
          </ul>
        ) : null}

        {activeTab === "FAQs" ? (
          <div className="space-y-3">
            {(faqs ?? []).map((faq, index) => (
              <details
                className="rounded-md border border-zinc-200 bg-white p-4"
                key={`${faq.question}-${index}`}
              >
                <summary className="cursor-pointer font-semibold text-zinc-950">
                  {faq.question}
                </summary>
                <p className="mt-2 text-zinc-600">{faq.answer}</p>
              </details>
            ))}
            {(faqs ?? []).length === 0 ? (
              <p className="text-sm text-zinc-500">FAQs coming soon.</p>
            ) : null}
          </div>
        ) : null}

        {activeTab === "Blog" ? (
          <p className="text-sm text-zinc-500">No blog posts yet.</p>
        ) : null}
      </div>
    </div>
  );
}
