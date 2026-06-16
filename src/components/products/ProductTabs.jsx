"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiFileText,
  FiHelpCircle,
  FiSettings,
  FiStar,
  FiTarget,
} from "react-icons/fi";

const TABS = ["Specifications", "Key Features", "Applications", "FAQs", "Blog"];

const TAB_ICONS = {
  Specifications: FiSettings,
  "Key Features": FiStar,
  Applications: FiTarget,
  FAQs: FiHelpCircle,
  Blog: FiFileText,
};

function getTextHeading(text) {
  const [heading] = text.split(":");
  return heading.length < text.length ? heading : text;
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
      <Icon className="text-3xl text-zinc-300" />
      <p className="text-sm font-medium text-zinc-500">{text}</p>
    </div>
  );
}

function ExpandableItem({ badge, body, heading, itemKey, onToggle, open }) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-[#BE0010]/35 hover:shadow-sm">
      <button
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
        onClick={() => onToggle(itemKey)}
        type="button"
      >
        <span className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#BE0010]/10 text-xs font-bold text-[#BE0010]">
            {badge}
          </span>
          <span className="font-maxot text-base font-bold leading-6 text-zinc-950">
            {heading}
          </span>
        </span>
        <FiChevronDown
          className={`shrink-0 text-lg text-zinc-400 transition-transform duration-300 ${
            open ? "rotate-180 text-[#BE0010]" : ""
          }`}
        />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <p className="border-t border-zinc-100 px-4 pb-4 pt-3 text-sm leading-6 text-zinc-600">
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}

function ExpandableList({ emptyIcon, emptyText, items, renderItem }) {
  const [openKey, setOpenKey] = useState(null);

  function handleToggle(itemKey) {
    setOpenKey((currentKey) => (currentKey === itemKey ? null : itemKey));
  }

  if (!items.length) {
    return <EmptyState icon={emptyIcon} text={emptyText} />;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) =>
        renderItem(item, index, openKey, handleToggle)
      )}
    </div>
  );
}

export default function ProductTabs({ technicalSpecs, features, applications, faqs }) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="w-full">
      <div className="flex w-full gap-2 overflow-x-auto pb-1" role="tablist">
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const isActive = activeTab === tab;

          return (
            <button
              aria-selected={isActive}
              className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                isActive
                  ? "border-[#BE0010] bg-[#BE0010]/5 text-[#BE0010]"
                  : "border-transparent text-zinc-500 hover:border-zinc-200 hover:text-zinc-900"
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              type="button"
            >
              <Icon className="text-base" />
              {tab}
            </button>
          );
        })}
      </div>

      <div className="mt-4 w-full rounded-xl border border-[#BE0010]/30 bg-white p-4 sm:p-6">
        {activeTab === "Specifications" ? (
          (technicalSpecs ?? []).length > 0 ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              {(technicalSpecs ?? []).map((spec) => (
                <div
                  className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 transition hover:border-[#BE0010]/30 hover:bg-white"
                  key={spec.label}
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-900">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <EmptyState icon={FiSettings} text="Specifications coming soon." />
          )
        ) : null}

        {activeTab === "Key Features" ? (
          <ExpandableList
            emptyIcon={FiStar}
            emptyText="Key features coming soon."
            items={features ?? []}
            renderItem={(feature, index, openKey, handleToggle) => {
              const itemKey = `feature-${index}`;

              return (
                <ExpandableItem
                  badge={index + 1}
                  body={feature}
                  heading={getTextHeading(feature)}
                  itemKey={itemKey}
                  key={itemKey}
                  onToggle={handleToggle}
                  open={openKey === itemKey}
                />
              );
            }}
          />
        ) : null}

        {activeTab === "Applications" ? (
          <ExpandableList
            emptyIcon={FiTarget}
            emptyText="Applications coming soon."
            items={applications ?? []}
            renderItem={(application, index, openKey, handleToggle) => {
              const itemKey = `application-${index}`;

              return (
                <ExpandableItem
                  badge={index + 1}
                  body={application}
                  heading={getTextHeading(application)}
                  itemKey={itemKey}
                  key={itemKey}
                  onToggle={handleToggle}
                  open={openKey === itemKey}
                />
              );
            }}
          />
        ) : null}

        {activeTab === "FAQs" ? (
          <ExpandableList
            emptyIcon={FiHelpCircle}
            emptyText="FAQs coming soon."
            items={faqs ?? []}
            renderItem={(faq, index, openKey, handleToggle) => {
              const itemKey = `faq-${index}`;

              return (
                <ExpandableItem
                  badge="Q"
                  body={faq.answer}
                  heading={faq.question}
                  itemKey={itemKey}
                  key={itemKey}
                  onToggle={handleToggle}
                  open={openKey === itemKey}
                />
              );
            }}
          />
        ) : null}

        {activeTab === "Blog" ? (
          <EmptyState icon={FiFileText} text="No blog posts yet." />
        ) : null}
      </div>
    </div>
  );
}
