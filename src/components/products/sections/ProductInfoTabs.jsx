'use client';
import { useState } from 'react';
import {
  FiInfo, FiZap, FiGrid, FiBarChart2, FiTrendingUp,
  FiShield, FiSliders, FiFileText, FiMonitor, FiTool,
  FiTarget, FiSun, FiLayers, FiSettings,
} from 'react-icons/fi';

/* ── Tab config ─────────────────────────────────────── */
const TABS = [
  { key: 'overview',     label: 'Overview',                Icon: FiInfo       },
  { key: 'features',     label: 'Features',                Icon: FiZap        },
  { key: 'applications', label: 'Applications',            Icon: FiGrid       },
  { key: 'specs',        label: 'Technical Specs',         Icon: FiBarChart2  },
  { key: 'performance',  label: 'Performance',             Icon: FiTrendingUp },
  { key: 'compliance',   label: 'Compliance',              Icon: FiShield     },
  { key: 'config',       label: 'Configurations',          Icon: FiSliders    },
  { key: 'docs',         label: 'Documentation & Resources', Icon: FiFileText },
];

/* ── Icon map for overview cards ────────────────────── */
const CARD_ICON = {
  'Simple operation':             FiSliders,
  'Clear visibility':             FiMonitor,
  'Flexible setup':               FiTool,
  'Reliable safety':              FiShield,
  'LED ring light system':        FiSun,
  'Precision control':            FiTarget,
  'Space-saving vertical glassware': FiLayers,
};

/* ── Icon card ──────────────────────────────────────── */
function IconCard({ title, description, items }) {
  const Icon = CARD_ICON[title] ?? FiSettings;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-[#BE0010]/25 hover:shadow-sm">
      <Icon className="mb-3 h-5 w-5 text-[#BE0010]" />
      <h3 className="font-semibold text-sm text-zinc-950 mb-1">{title}</h3>
      {description && <p className="text-sm leading-6 text-zinc-500">{description}</p>}
      {items?.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-zinc-500">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#BE0010]" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Simple card (no icon) ──────────────────────────── */
function PlainCard({ title, description, items }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-[#BE0010]/25 hover:shadow-sm">
      <h3 className="font-semibold text-sm text-zinc-950 mb-1">{title}</h3>
      {description && <p className="text-sm leading-6 text-zinc-500">{description}</p>}
      {items?.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-zinc-500">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#BE0010]" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── KPI row ────────────────────────────────────────── */
function KPIRow({ kpis }) {
  if (!kpis?.length) return null;
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
          <div className="font-maxot text-2xl font-bold text-zinc-950">{k.value}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">{k.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */
export default function ProductInfoTabs({ product }) {
  const [active, setActive] = useState('overview');
  const lf = product.longForm ?? {};

  const section = (eyebrow) => lf.sections?.find((s) => s.eyebrow === eyebrow);
  const overviewSec  = lf.sections?.[0];
  const perfSec      = section('Performance');
  const complianceSec= section('Quality and safety');
  const configSec    = section('Configuration');
  const docsSec      = section('Documentation');

  /* ── Tab content ─────────────────────────────────── */
  const renderContent = () => {
    switch (active) {

      case 'overview':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-zinc-950 mb-4">
              Reliable rotary evaporation, focused on the essentials
            </h3>
            {overviewSec?.body?.map((p, i) => (
              <p key={i} className="mb-4 text-sm leading-7 text-zinc-600">{p}</p>
            ))}
            {overviewSec?.cards?.length > 0 && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {overviewSec.cards.slice(0, 4).map((c) => <IconCard key={c.title} {...c} />)}
              </div>
            )}
          </div>
        );

      case 'features':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-zinc-950 mb-4">
              Built around safe, visible and repeatable evaporation
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(product.features ?? []).slice(0, 9).map((f) => {
                const [title, ...rest] = f.split(':');
                return <PlainCard key={f} title={title.trim()} description={rest.join(':').trim()} />;
              })}
            </div>
          </div>
        );

      case 'applications':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-zinc-950 mb-4">Where it&apos;s used</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(product.applications ?? []).map((a, i) => {
                const [title, ...rest] = a.split(',');
                return <PlainCard key={i} title={title.trim()} description={a} />;
              })}
            </div>
          </div>
        );

      case 'specs':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-zinc-950 mb-4">Technical specifications</h3>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <dl className="divide-y divide-zinc-100">
                {(product.technicalSpecs ?? []).map((row) => (
                  <div key={row.label} className="grid px-5 py-3 text-sm sm:grid-cols-[0.45fr_0.55fr]">
                    <dt className="font-medium text-zinc-500">{row.label}</dt>
                    <dd className="text-zinc-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-zinc-950 mb-4">Evaporation performance</h3>
            {perfSec?.body?.map((p, i) => (
              <p key={i} className="mb-4 text-sm leading-7 text-zinc-600">{p}</p>
            ))}
            <KPIRow kpis={(perfSec?.metrics ?? lf.stats ?? [])} />
            {perfSec?.disclaimer && (
              <p className="mt-5 rounded-xl border border-[#BE0010]/15 bg-[#BE0010]/5 p-4 text-xs leading-6 text-zinc-600">
                {perfSec.disclaimer}
              </p>
            )}
          </div>
        );

      case 'compliance':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-zinc-950 mb-4">Quality, safety &amp; certification</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(complianceSec?.cards ?? []).map((c) => <IconCard key={c.title} {...c} />)}
            </div>
          </div>
        );

      case 'config':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-zinc-950 mb-4">
              Configure the Hei-VAP Core around your workflow
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {(configSec?.cards ?? []).map((c) => <PlainCard key={c.title} {...c} />)}
            </div>
          </div>
        );

      case 'docs':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-zinc-950 mb-2">Documentation &amp; Resources</h3>
            <p className="mb-5 text-sm leading-7 text-zinc-500">
              Product and compliance documents for internal evaluation, purchase and safety review. Request any from Inkarp.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(docsSec?.cards ?? []).map((c) => (
                <div key={c.title} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[#BE0010]/25">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#BE0010]/10">
                    <FiFileText className="h-4 w-4 text-[#BE0010]" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-zinc-900">{c.title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{c.description}</div>
                    <a href="/contact-us" className="mt-2 inline-block text-xs font-semibold text-[#BE0010] hover:underline">
                      Request →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="overview" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header row with watermark number */}
        <div className="relative mb-8">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-4 right-0 select-none font-maxot text-[120px] font-bold leading-none text-zinc-100 sm:text-[160px]"
          >
            01
          </span>

          {/* Eyebrow with red dot */}
          <p className="flex items-center gap-2 font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#BE0010]" />
            Product information
          </p>
          <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">
            Hei-VAP Core at a glance
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-500">
            Everything you need to evaluate the rotary evaporator — overview, features, applications, specifications,
            quality &amp; compliance, configurations &amp; packages, and documentation.
          </p>
        </div>

        {/* Pill tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active === key
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm min-h-[300px]">
          {renderContent()}
        </div>

      </div>
    </section>
  );
}
