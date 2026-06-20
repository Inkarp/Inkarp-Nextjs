'use client';
import { useMemo, useState } from 'react';
import { FiBookOpen, FiCheck, FiCoffee, FiCpu, FiDroplet, FiInfo, FiLink, FiThermometer } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const TAB_ICONS = [FiLink, FiThermometer, FiBookOpen, FiCoffee, FiDroplet, FiCpu];

const INDUSTRY_COPY = {
  Pharmaceuticals: {
    bullets: [
      'Controlled evaporation',
      'Repeatable temperature and speed settings',
      'Safe heated-bath operation',
      'Suitable condenser and glassware setup',
    ],
    tags: ['Solvent Recovery', 'API Work-up', 'Sample Concentration', 'Routine Evaporation'],
    metrics: [
      { value: '\u00B11\u00B0C', label: 'Control accuracy', fill: 95 },
      { value: '10-280', label: 'rpm range', fill: 90 },
      { value: '20-210\u00B0C', label: 'Bath range (oil)', fill: 90 },
    ],
  },
  'Chemical Research': {
    bullets: [
      'Flexible glassware selection',
      'Wide speed and bath-temperature range',
      'Vacuum-supported solvent removal',
      'Reliable distillation and compound concentration',
    ],
    tags: ['Organic Synthesis', 'Distillation', 'Compound Concentration', 'Flexible Setup'],
    metrics: [
      { value: '10-280', label: 'rpm range', fill: 90 },
      { value: '20-210\u00B0C', label: 'Bath range (oil)', fill: 90 },
      { value: '0.22 m2', label: 'Condenser surface', fill: 82 },
    ],
  },
  'Academic / Teaching': {
    bullets: [
      'Easy two-knob operation',
      'Visible LED status feedback',
      'Safe residual-heat awareness',
      'Robust setup for repeated student use',
    ],
    tags: ['Teaching Labs', 'Student Training', 'Simple Operation', 'Safe Handling'],
    metrics: [
      { value: '2 knobs', label: 'Core controls', fill: 86 },
      { value: 'LED ring', label: 'Status visibility', fill: 88 },
      { value: '>50\u00B0C', label: 'Residual heat warning', fill: 74 },
    ],
  },
  'Food & Beverage': {
    bullets: [
      'Controlled heating for extract concentration',
      'Gentle evaporation for quality-sensitive samples',
      'Repeatable temperature and speed settings',
      'Suitable glassware for ethanol and aqueous workflows',
    ],
    tags: ['Extracts', 'Flavour Isolation', 'EtOH / Water', 'Sample Prep'],
    metrics: [
      { value: '\u00B11\u00B0C', label: 'Control accuracy', fill: 95 },
      { value: '20-100\u00B0C', label: 'Water-bath range', fill: 78 },
      { value: '4.5 L', label: 'Bath volume', fill: 70 },
    ],
  },
  Environmental: {
    bullets: [
      'Consistent sample concentration before analysis',
      'Vacuum evaporation for mixed solvent workflows',
      'Repeatable runs across routine preparation',
      'Accessory support for pump and condenser protection',
    ],
    tags: ['Pre-analysis Prep', 'Matrix Removal', 'Solvent Evaporation', 'Repeatability'],
    metrics: [
      { value: '10-280', label: 'rpm range', fill: 90 },
      { value: '0.22 m2', label: 'Condenser surface', fill: 82 },
      { value: 'IP 67', label: 'Bath cable protection', fill: 72 },
    ],
  },
  'Biotech / Life Sciences': {
    bullets: [
      'Gentle low-temperature concentration',
      'Vacuum control for temperature-sensitive samples',
      'Reliable bath and rotation settings',
      'Configurable glassware and cooling options',
    ],
    tags: ['Gentle Handling', 'Low-temp Evaporation', 'Sample Concentration', 'Vacuum Control'],
    metrics: [
      { value: '\u00B11\u00B0C', label: 'Control accuracy', fill: 95 },
      { value: '20-100\u00B0C', label: 'Water-bath range', fill: 78 },
      { value: '10-280', label: 'rpm range', fill: 90 },
    ],
  },
};

function getIndustryProfile(industry) {
  const profile = INDUSTRY_COPY[industry.name] ?? {};
  return {
    bullets: profile.bullets ?? industry.tasks ?? [],
    tags: profile.tags ?? industry.tasks ?? [],
    metrics: profile.metrics ?? (industry.highlights ?? []).map((item, index) => ({
      value: item.value,
      label: item.label,
      fill: [88, 80, 72][index] ?? 76,
    })),
  };
}

function getDescription(industry) {
  if (!industry.tasks?.length) return industry.note;
  const tasks = industry.tasks.map((task) => task.toLowerCase());
  const lastTask = tasks.length > 1 ? ` and ${tasks.at(-1)}` : '';
  const firstTasks = tasks.slice(0, -1).join(', ');
  const taskCopy = tasks.length > 1 ? `${firstTasks}${lastTask}` : tasks[0];
  return `${industry.name.replace(' / Teaching', '')} laboratories use the Hei-VAP Core for ${taskCopy}.`;
}

function getTabLabel(industry) {
  const labels = {
    Pharma: 'Pharmaceuticals',
    Chemistry: 'Chemical Research',
    Academic: 'Academic Labs',
    Food: 'Food & Beverage',
    'Environ.': 'Environmental',
  };

  return labels[industry.shortName] ?? industry.shortName ?? industry.name;
}

export default function ApplicationsExplorer({ data }) {
  const industries = data?.industries ?? [];
  const [active, setActive] = useState(0);

  const industry = industries[active];
  const profile = useMemo(() => (industry ? getIndustryProfile(industry) : null), [industry]);

  if (!industries.length || !industry || !profile) return null;

  return (
    <section id="industries" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="07"
          eyebrow="Applications explorer"
          title="How is the Hei-VAP Core used in your industry?"
          description="Select your field to see typical rotary-evaporation tasks and the capabilities that matter."
        />

        <div className="relative mt-8 flex flex-wrap gap-2">
          {industries.map((item, index) => {
            const Icon = TAB_ICONS[index % TAB_ICONS.length];
            const isActive = active === index;
            return (
              <button
                className={`inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950'
                }`}
                key={item.name}
                onClick={() => setActive(index)}
                type="button"
              >
                <Icon className="text-base" />
                {getTabLabel(item)}
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:grid lg:grid-cols-[1fr_464px] lg:gap-12">
          <div>
            <h3 className="font-maxot text-2xl font-bold text-zinc-950">{getTabLabel(industry)}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
              {getDescription(industry)}
            </p>

            <div className="mt-7 space-y-4">
              {profile.bullets.map((item) => (
                <div className="flex items-center gap-4 text-base text-zinc-800" key={item}>
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
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5" key={`${industry.name}-${metric.label}`}>
                <div className="font-maxot text-2xl font-bold text-[#BE0010]">{metric.value}</div>
                <p className="mt-3 text-xs font-semibold text-zinc-500">{metric.label}</p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-zinc-200">
                  <div className="h-full rounded-full bg-[#D30013]" style={{ width: `${metric.fill}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-5 max-w-5xl rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-xs leading-6 text-zinc-500">
          <FiInfo className="mr-2 inline-block text-sm" />
          Disclaimer: application highlights are indicative summaries based on manufacturer-published capabilities. Confirm specifics for your samples and safety requirements with Inkarp.
        </div>
      </div>
    </section>
  );
}
