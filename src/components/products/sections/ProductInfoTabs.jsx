'use client';
import { useEffect, useState } from 'react';
import {
  FiInfo, FiZap, FiGrid, FiBarChart2, FiTrendingUp,
  FiShield, FiSliders, FiFileText, FiMonitor, FiTool,
  FiTarget, FiSun, FiLayers, FiSettings,
  FiMove, FiThermometer, FiDollarSign,
  FiAward, FiCheckCircle, FiBookOpen, FiDroplet, FiCoffee,
  FiWind, FiClock, FiDownload, FiBook, FiActivity,
} from 'react-icons/fi';
import SectionHeader from './SectionHeader';

/* ── Tab config ─────────────────────────────────────── */
const TABS = [
  { key: 'overview',     label: 'Overview',                  Icon: FiInfo       },
  { key: 'features',     label: 'Features',                  Icon: FiZap        },
  { key: 'applications', label: 'Applications',              Icon: FiGrid       },
  { key: 'specs',        label: 'Technical Specs',           Icon: FiBarChart2  },
  { key: 'performance',  label: 'Performance',               Icon: FiTrendingUp },
  { key: 'compliance',   label: 'Compliance',                Icon: FiShield     },
  { key: 'config',       label: 'Configurations',            Icon: FiSliders    },
  { key: 'docs',         label: 'Documentation & Resources', Icon: FiFileText   },
];

/* ════════════════════════════════════════════════════════
   ICON RESOLUTION
   ════════════════════════════════════════════════════════ */

function resolveIcon(text, rules, fallback = FiSettings) {
  const t = (text ?? '').toLowerCase();
  for (const rule of rules) {
    if (rule.match(t)) return rule.icon;
  }
  return fallback;
}

/* Shared by Features tab AND Overview card resolution */
const FEATURE_ICON_RULES = [
  { match: (t) => t.includes('display'),                                                     icon: FiMonitor     },
  { match: (t) => t.includes('precision'),                                                   icon: FiTarget      },
  { match: (t) => t.includes('knob') || t.includes('control') || t.includes('tuning'),      icon: FiSliders     },
  { match: (t) => t.includes('operation') || t.includes('simplif'),                         icon: FiSliders     },
  { match: (t) => t.includes('led') || t.includes('light'),                                 icon: FiSun         },
  { match: (t) => t.includes('immersion') || t.includes('inclination') || t.includes('adjustable'), icon: FiMove },
  { match: (t) => t.includes('standby') || t.includes('heat warning') || t.includes('residual'),    icon: FiThermometer },
  { match: (t) => t.includes('lift'),                                                        icon: FiMove        },
  { match: (t) => t.includes('glassware') || t.includes('space-saving'),                   icon: FiLayers      },
  { match: (t) => t.includes('safety') || t.includes('visibility'),                        icon: FiShield      },
  { match: (t) => t.includes('setup') || t.includes('flexible') || t.includes('adapt'),   icon: FiTool        },
  { match: (t) => t.includes('cost'),                                                        icon: FiDollarSign  },
];

const APPLICATION_ICON_RULES = [
  { match: (t) => t.includes('pharmaceutical'),                                               icon: FiTarget   },
  { match: (t) => t.includes('chemical research') || t.includes('organic synthesis'),        icon: FiActivity },
  { match: (t) => t.includes('academic') || t.includes('teaching'),                          icon: FiBookOpen },
  { match: (t) => t.includes('food and beverage') || t.includes('food & beverage'),          icon: FiCoffee  },
  { match: (t) => t.includes('environmental'),                                                icon: FiDroplet },
  { match: (t) => t.includes('biotech') || t.includes('life science'),                       icon: FiActivity },
];

/* category-based (exact equality on category string) */
const COMPLIANCE_ICON_RULES = [
  { match: (t) => t === 'certifications', icon: FiAward       },
  { match: (t) => t === 'safety',         icon: FiShield      },
  { match: (t) => t === 'quality',        icon: FiCheckCircle },
];

const CONFIG_ICON_RULES = [
  { match: (t) => t.includes('lift'),      icon: FiMove   },
  { match: (t) => t.includes('glassware'), icon: FiLayers },
  { match: (t) => t.includes('coating'),   icon: FiShield },
  { match: (t) => t.includes('accessor'),  icon: FiTool   },
];

const DOCS_ICON_RULES = [
  { match: (t) => t.includes('brochure'),                                icon: FiDownload    },
  { match: (t) => t.includes('data sheet'),                              icon: FiFileText    },
  { match: (t) => t.includes('operating') || t.includes('instructions'), icon: FiBook        },
  { match: (t) => t.includes('safety'),                                  icon: FiShield      },
  { match: (t) => t.includes('chiller'),                                 icon: FiThermometer },
  { match: (t) => t.includes('vacuum'),                                  icon: FiWind        },
  { match: (t) => t.includes('declaration') || t.includes('conformity'), icon: FiAward      },
  { match: (t) => t.includes('nrtl'),                                    icon: FiAward       },
  { match: (t) => t.includes('continuous'),                              icon: FiClock       },
];

/* Derives a short display title from a plain application sentence */
function deriveAppTitle(sentence) {
  const t = sentence.toLowerCase();
  if (t.includes('pharmaceutical'))                               return 'Pharmaceutical labs';
  if (t.includes('chemical research') || t.includes('organic synthesis')) return 'Chemical research labs';
  if (t.includes('academic') || t.includes('teaching'))          return 'Academic & teaching labs';
  if (t.includes('food and beverage') || t.includes('food & beverage')) return 'Food & beverage testing';
  if (t.includes('environmental'))                                return 'Environmental labs';
  if (t.includes('biotech') || t.includes('life science'))       return 'Biotech & life science';
  return sentence.split('.')[0].trim();
}

/* ════════════════════════════════════════════════════════
   CARD COMPONENTS
   ════════════════════════════════════════════════════════ */

function IconCard({ title, description, items, icon: IconProp, badge }) {
  const Icon = IconProp ?? FiSettings;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-[#BE0010]/25 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#BE0010]" />
        {badge && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#BE0010] bg-[#BE0010]/10 rounded-full px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-sm text-black mb-1 dark:text-zinc-100">{title}</h3>
      {description && <p className="text-sm leading-6 text-black dark:text-zinc-100">{description}</p>}
      {items?.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-black dark:text-zinc-100">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#BE0010]" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlainCard({ title, description, items }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-[#BE0010]/25 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-semibold text-sm text-black mb-1 dark:text-zinc-100">{title}</h3>
      {description && <p className="text-sm leading-6 text-black dark:text-zinc-100">{description}</p>}
      {items?.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-black dark:text-zinc-100">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#BE0010]" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KPIRow({ kpis }) {
  if (!kpis?.length) return null;
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="font-maxot text-2xl font-bold text-black dark:text-zinc-100">{k.value}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-black dark:text-zinc-400">{k.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════ */

export default function ProductInfoTabs({ product }) {
  const [active, setActive] = useState('overview');
  const lf = product.longForm ?? {};
  const storageKey = `inkarp-product-last-tab:${product.name ?? 'product'}`;

  useEffect(() => {
    if (active === 'overview') return;
    const label = TABS.find((t) => t.key === active)?.label;
    window.sessionStorage.setItem(storageKey, JSON.stringify({ tab: active, label }));
    window.dispatchEvent(new CustomEvent('product-tab-changed', { detail: { tab: active, label } }));
  }, [active, storageKey]);

  useEffect(() => {
    const onSetTab = (event) => {
      if (event.detail?.tab) setActive(event.detail.tab);
    };
    window.addEventListener('product-set-tab', onSetTab);
    return () => window.removeEventListener('product-set-tab', onSetTab);
  }, []);

  const section = (eyebrow) => lf.sections?.find((s) => s.eyebrow === eyebrow);
  const overviewSec   = lf.sections?.[0];
  const perfSec       = section('Performance');
  const complianceSec = section('Quality and safety');
  const configSec     = section('Configuration');
  const docsSec       = section('Documentation');

  /* ── Tab content ─────────────────────────────────── */
  const renderContent = () => {
    switch (active) {

      /* ── 1. OVERVIEW ─────────────────────────────── */
      case 'overview':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-black mb-4 dark:text-zinc-100">
              Reliable rotary evaporation, focused on the essentials
            </h3>
            {overviewSec?.body?.map((p, i) => (
              <p key={i} className="mb-4 text-sm leading-7 text-black dark:text-zinc-100">{p}</p>
            ))}
            {overviewSec?.cards?.length > 0 && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {overviewSec.cards.slice(0, 4).map((c) => (
                  <IconCard
                    key={c.title}
                    {...c}
                    icon={resolveIcon(c.title, FEATURE_ICON_RULES)}
                  />
                ))}
              </div>
            )}
            <KPIRow kpis={lf.stats} />
          </div>
        );

      /* ── 2. FEATURES ─────────────────────────────── */
      case 'features':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-black mb-4 dark:text-zinc-100">
              Built around safe, visible and repeatable evaporation
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(product.features ?? []).slice(0, 9).map((f) => {
                const colonIdx = f.indexOf(':');
                const title       = colonIdx > -1 ? f.slice(0, colonIdx).trim() : f.trim();
                const description = colonIdx > -1 ? f.slice(colonIdx + 1).trim() : '';
                return (
                  <IconCard
                    key={f}
                    title={title}
                    description={description}
                    icon={resolveIcon(title, FEATURE_ICON_RULES)}
                  />
                );
              })}
            </div>
          </div>
        );

      /* ── 3. APPLICATIONS ─────────────────────────── */
      case 'applications':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-black mb-4 dark:text-zinc-100">Where it&apos;s used</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(product.applications ?? []).map((sentence, i) => (
                <IconCard
                  key={i}
                  title={deriveAppTitle(sentence)}
                  description={sentence}
                  icon={resolveIcon(sentence, APPLICATION_ICON_RULES)}
                />
              ))}
            </div>
          </div>
        );

      /* ── 4. SPECS ────────────────────────────────── */
      case 'specs':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-black mb-4 dark:text-zinc-100">Technical specifications</h3>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {(product.technicalSpecs ?? []).map((row) => (
                  <div key={row.label} className="grid px-5 py-3 text-sm sm:grid-cols-[0.45fr_0.55fr]">
                    <dt className="font-medium text-black dark:text-zinc-100">{row.label}</dt>
                    <dd className="text-black dark:text-zinc-400">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              * Per Heidolph published technical data for this model. Confirm details against the latest datasheet from Inkarp before ordering.
            </p>
          </div>
        );

      /* ── 5. PERFORMANCE ──────────────────────────── */
      case 'performance':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-black mb-4 dark:text-zinc-100">Evaporation performance</h3>
            {perfSec?.body?.map((p, i) => (
              <p key={i} className="mb-4 text-sm leading-7 text-black dark:text-zinc-100">{p}</p>
            ))}
            <KPIRow kpis={perfSec?.metrics ?? lf.stats ?? []} />
            {perfSec?.disclaimer && (
              <p className="mt-5 rounded-xl border border-[#BE0010]/15 bg-[#BE0010]/5 p-4 text-xs leading-6 text-black dark:text-zinc-100">
                {perfSec.disclaimer}
              </p>
            )}
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              Use the{' '}
              <a href="#simulator" className="text-[#BE0010] hover:underline">distillation simulator</a>
              {' '}and the{' '}
              <a href="#solvents" className="text-[#BE0010] hover:underline">solvent guide</a>
              {' '}below to explore performance.
            </p>
          </div>
        );

      /* ── 6. COMPLIANCE ───────────────────────────── */
      case 'compliance':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-black mb-4 dark:text-zinc-100">Quality, safety &amp; certification</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(complianceSec?.cards ?? []).map((c) => (
                <IconCard
                  key={c.title}
                  {...c}
                  icon={resolveIcon(c.category ?? '', COMPLIANCE_ICON_RULES)}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              See the related standards and certificates in{' '}
              <a href="#standards" className="text-[#BE0010] hover:underline">Standards &amp; certificates</a>.
            </p>
          </div>
        );

      /* ── 7. CONFIGURATIONS ───────────────────────── */
      case 'config':
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-black mb-4 dark:text-zinc-100">
              Configure the Hei-VAP Core around your workflow
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {(configSec?.cards ?? []).map((c) => (
                <IconCard
                  key={c.title}
                  {...c}
                  icon={resolveIcon(c.title, CONFIG_ICON_RULES)}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              Not sure which to choose? Use the{' '}
              <a href="#config" className="text-[#BE0010] hover:underline">configuration wizard</a>
              , the{' '}
              <a href="#glassware" className="text-[#BE0010] hover:underline">glassware guide</a>
              {' '}or the{' '}
              <a href="#pairing" className="text-[#BE0010] hover:underline">vacuum &amp; chiller pairing helper</a>
              {' '}below.
            </p>
          </div>
        );

      /* ── 8. DOCS ─────────────────────────────────── */
      case 'docs': {
        return (
          <div>
            <h3 className="font-maxot text-lg font-semibold text-black mb-2 dark:text-zinc-100">Documentation &amp; Resources</h3>
            <p className="mb-5 text-sm leading-7 text-black dark:text-zinc-100">
              Product and compliance documents for internal evaluation, purchase and safety review. Request any from Inkarp.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(docsSec?.cards ?? []).map((c) => {
                const DocIcon = resolveIcon(c.title, DOCS_ICON_RULES);
                return (
                  <div key={c.title} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[#BE0010]/25 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#BE0010]/10">
                      <DocIcon className="h-4 w-4 text-[#BE0010]" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-black dark:text-zinc-100">{c.title}</div>
                      <div className="text-xs text-black mt-0.5 dark:text-zinc-400">{c.description}</div>
                      <a
                        href={`mailto:info@inkarp.co.in?subject=${encodeURIComponent(`Request: Hei-VAP Core ${c.title}`)}`}
                        className="mt-2 inline-block text-xs font-semibold text-[#BE0010] hover:underline"
                      >
                        Request →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <section id="overview" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">

        <SectionHeader
          number="01"
          eyebrow="Product information"
          title="Hei-VAP Core at a glance"
          description="Everything you need to evaluate the rotary evaporator — overview, features, applications, specifications, quality & compliance, configurations & packages, and documentation."
        />

        {/* Pill tabs — active uses brand red */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active === key
                  ? 'border-[#BE0010] bg-[#BE0010] text-white dark:border-[#BE0010] dark:bg-[#BE0010] dark:text-white'
                  : 'border-zinc-200 bg-white text-black hover:border-zinc-400 hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm min-h-[300px] dark:border-zinc-800 dark:bg-zinc-900">
          {renderContent()}
        </div>

      </div>
    </section>
  );
}
