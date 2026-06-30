'use client';
import { useMemo, useState } from 'react';
import { FiActivity, FiBookOpen, FiCheck, FiCoffee, FiCpu, FiDroplet, FiInfo, FiThermometer } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const ICON_MAP = {
  pill: FiActivity,
  flask: FiThermometer,
  school: FiBookOpen,
  coffee: FiCoffee,
  droplet: FiDroplet,
  cpu: FiCpu,
};

function getIndustryProfile(industry) {
  return {
    bullets: industry.bullets ?? industry.tasks ?? [],
    tags: industry.tags ?? [],
    metrics: (industry.highlights ?? []).map((item) => ({
      value: item.value,
      label: item.label,
      fill: item.fill ?? 80,
    })),
  };
}

function getDescription(industry) {
  if (!industry.tasks?.length) return industry.note;
  const tasks = industry.tasks.map((task) => task.toLowerCase());
  const lastTask = tasks.length > 1 ? ` and ${tasks.at(-1)}` : '';
  const firstTasks = tasks.slice(0, -1).join(', ');
  const taskCopy = tasks.length > 1 ? `${firstTasks}${lastTask}` : tasks[0];
  return `${industry.name.replace(' Labs', '').replace(' / Teaching', '')} laboratories use the Hei-VAP Core for ${taskCopy}.`;
}

export default function ApplicationsExplorer({ data }) {
  const industries = data?.industries ?? [];
  const [active, setActive] = useState(0);

  const industry = industries[active];
  const profile = useMemo(() => (industry ? getIndustryProfile(industry) : null), [industry]);

  if (!industries.length || !industry || !profile) return null;

  return (
    <section id="industries" className="scroll-mt-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="08"
          eyebrow="Applications explorer"
          title="How is the Hei-VAP Core used in your industry?"
          description="Select your field to see typical rotary-evaporation tasks and the capabilities that matter."
        />

        <div className="relative mt-8 flex flex-wrap gap-2">
          {industries.map((item, index) => {
            const Icon = ICON_MAP[item.icon] ?? FiActivity;
            const isActive = active === index;
            return (
              <button
                className={`inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                    : 'border-zinc-200 bg-white text-black hover:border-zinc-400 hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
                }`}
                key={item.name}
                onClick={() => setActive(index)}
                type="button"
              >
                <Icon className="text-base" />
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:grid lg:grid-cols-[1fr_464px] lg:gap-12 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <h3 className="font-maxot text-2xl font-bold text-black dark:text-zinc-100">{industry.name}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-black dark:text-zinc-100">
              {getDescription(industry)}
            </p>

            <div className="mt-7 space-y-4">
              {profile.bullets.map((item) => (
                <div className="flex items-center gap-4 text-base text-black dark:text-zinc-100" key={item}>
                  <FiCheck className="shrink-0 text-[#BE0010]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span className="rounded-full border border-[#BE0010]/15 bg-[#BE0010]/5 px-4 py-2 text-xs font-bold text-[#BE0010]" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4 lg:mt-0">
            {profile.metrics.slice(0, 3).map((metric) => (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900" key={`${industry.name}-${metric.label}`}>
                <div className="font-maxot text-2xl font-bold text-[#BE0010]">{metric.value}</div>
                <p className="mt-3 text-xs font-semibold text-black dark:text-zinc-100">{metric.label}</p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-[#D30013]" style={{ width: `${metric.fill}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-5 max-w-5xl rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-xs leading-6 text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <FiInfo className="mr-2 inline-block text-sm" />
          Disclaimer: application highlights are indicative summaries based on manufacturer-published capabilities. Confirm specifics for your samples and safety requirements with Inkarp.
        </div>
      </div>
    </section>
  );
}
