'use client';
import { useMemo, useState } from 'react';
import { FiActivity, FiBookOpen, FiCheck, FiCoffee, FiCpu, FiDroplet, FiThermometer } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

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

function getDescription(industry, productName) {
  if (industry.note) return industry.note;
  if (!industry.tasks?.length) return undefined;
  const tasks = industry.tasks.map((task) => task.toLowerCase());
  const lastTask = tasks.length > 1 ? ` and ${tasks.at(-1)}` : '';
  const firstTasks = tasks.slice(0, -1).join(', ');
  const taskCopy = tasks.length > 1 ? `${firstTasks}${lastTask}` : tasks[0];
  return `${industry.name.replace(' Labs', '').replace(' / Teaching', '')} laboratories use ${productName ?? 'this product'} for ${taskCopy}.`;
}

export default function ApplicationsExplorer({ data, productName }) {
  const industries = data?.industries ?? [];
  const [active, setActive] = useState(0);

  const industry = industries[active];
  const profile = useMemo(() => (industry ? getIndustryProfile(industry) : null), [industry]);

  if (!industries.length || !industry || !profile) return null;

  return (
    <section id="industries" className="scroll-mt-16 border-b border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="08"
          eyebrow={data?.eyebrow ?? 'Applications explorer'}
          title={data?.title ?? `How is ${productName ?? 'this product'} used in your field?`}
          description={data?.description ?? 'Select your field to see typical tasks and the capabilities that matter.'}
        />

        <div className="relative mt-8 flex flex-wrap gap-2">
          {industries.map((item, index) => {
            const Icon = ICON_MAP[item.icon] ?? FiActivity;
            const isActive = active === index;
            return (
              <button
                className={`inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-black bg-navy text-parchment dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                    : 'border-line-light bg-parchment text-black hover:border-zinc-400 hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
                }`}
                key={item.name}
                onClick={() => setActive(index)}
                type="button"
              >
                <Icon className={`text-base ${isActive ? '' : 'text-red'}`} />
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 rounded-2xl border border-line-light bg-parchment p-6 shadow-sm sm:p-8 lg:grid lg:grid-cols-[1fr_464px] lg:gap-12 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-ink dark:text-zinc-100">{industry.name}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-black dark:text-zinc-100">
              {getDescription(industry, productName)}
            </p>

            <div className="mt-7 space-y-4">
              {profile.bullets.map((item) => (
                <div className="flex items-center gap-4 text-base text-black dark:text-zinc-100" key={item}>
                  <FiCheck className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span className="rounded-full border border-line-light dark:border-zinc-800 bg-parchment-alt dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-ink-soft dark:text-zinc-300" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4 lg:mt-0">
            {profile.metrics.slice(0, 3).map((metric) => (
              <div className="rounded-2xl border border-line-light bg-parchment-alt p-5 dark:border-zinc-800 dark:bg-zinc-900" key={`${industry.name}-${metric.label}`}>
                <div className="text-2xl font-semibold tracking-tight text-red">{metric.value}</div>
                <p className="mt-3 text-xs font-semibold text-black dark:text-zinc-100">{metric.label}</p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-navy dark:bg-zinc-500" style={{ width: `${metric.fill}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <SectionDisclaimer>
          {data?.disclaimer ?? 'Application highlights are indicative summaries based on manufacturer-published capabilities. Confirm specifics for your samples and safety requirements with Inkarp.'}
        </SectionDisclaimer>
      </div>
    </section>
  );
}
