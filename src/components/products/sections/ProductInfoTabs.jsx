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

/* Paragraph(s) shown under a tab heading: prefers `body` (array), falls back to `description` (string) */
function introText(sec) {
  if (sec?.body?.length) return sec.body;
  if (sec?.description) return [sec.description];
  return [];
}

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
  const colonIdx = sentence.indexOf(':');
  if (colonIdx > -1) return sentence.slice(0, colonIdx).trim();
  return sentence.split('.')[0].trim();
}

/* ════════════════════════════════════════════════════════
   CARD COMPONENTS
   ════════════════════════════════════════════════════════ */

function IconCard({ title, description, items, icon: IconProp, badge }) {
  const Icon = IconProp ?? FiSettings;
  return (
    <div className="border border-line-light bg-parchment p-5 transition hover:border-line-light">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-red" />
        {badge && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-ink bg-parchment-alt px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-sm text-black mb-1">{title}</h3>
      {description && <p className="text-sm leading-6 text-black">{description}</p>}
      {items?.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-black">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-ink-soft" />
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
    <div className="border border-line-light bg-parchment p-5 transition hover:border-line-light">
      <h3 className="font-semibold text-sm text-black mb-1">{title}</h3>
      {description && <p className="text-sm leading-6 text-black">{description}</p>}
      {items?.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-black">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-ink-soft" />
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
        <div key={k.label} className="border border-line-light bg-parchment p-4 text-center">
          <div className="text-2xl font-semibold tracking-tight text-ink">{k.value}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-black">{k.label}</div>
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

  const section = (key, eyebrow) => lf.sections?.find((s) => s.key === key || s.eyebrow === eyebrow);
  const overviewSec      = section('overview', 'Product overview') ?? lf.sections?.[0];
  const keyFeaturesSec   = section('features', 'Key Features');
  const applicationsSec  = section('applications', 'Applications');
  const specsSec         = section('specs', 'Technical Specs');
  const perfSec          = section('performance', 'Performance');
  const complianceSec    = section('certs', 'Quality and safety');
  const configSec        = section('config', 'Configuration');
  const docsSec          = section('docs', 'Documentation');
  const solventGuideSec  = section('solventGuide', 'Solvent setup guide');
  const glassSec         = section('glassware', 'Glassware guide');

  const visibleTabs = TABS.filter(({ key }) => {
    if (key === 'performance') return !!perfSec;
    if (key === 'compliance') return !!complianceSec?.cards?.length;
    return true;
  });
  const safeActive = visibleTabs.some((t) => t.key === active) ? active : 'overview';

  /* ── Tab content ─────────────────────────────────── */
  const renderContent = () => {
    switch (safeActive) {

      /* ── 1. OVERVIEW ─────────────────────────────── */
      case 'overview':
        return (
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink mb-4">
              {overviewSec?.subheading ?? 'Reliable rotary evaporation, focused on the essentials'}
            </h3>
            {overviewSec?.body?.map((p, i) => (
              <p key={i} className="mb-4 text-sm leading-7 text-black">{p}</p>
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
          </div>
        );

      /* ── 2. FEATURES ─────────────────────────────── */
      case 'features':
        return (
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink mb-4">
              {keyFeaturesSec?.title ?? 'Built around safe, visible and repeatable evaporation'}
            </h3>
            {introText(keyFeaturesSec).map((p, i) => (
              <p key={i} className="mb-5 text-sm leading-7 text-black">{p}</p>
            ))}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(product.features ?? []).slice(0, 12).map((f) => {
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
            <h3 className="text-lg font-semibold tracking-tight text-ink mb-4">
              {applicationsSec?.title ?? "Where it's used"}
            </h3>
            {introText(applicationsSec).map((p, i) => (
              <p key={i} className="mb-5 text-sm leading-7 text-black">{p}</p>
            ))}
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
            <h3 className="text-lg font-semibold tracking-tight text-ink mb-4">
              {specsSec?.title ?? 'Technical specifications'}
            </h3>
            {introText(specsSec).map((p, i) => (
              <p key={i} className="mb-5 text-sm leading-7 text-black">{p}</p>
            ))}
            <div className="overflow-hidden border border-line-light bg-parchment">
              <dl className="divide-y divide-line-light">
                {(product.technicalSpecs ?? []).map((row) => (
                  <div key={row.label} className="grid px-5 py-3 text-sm sm:grid-cols-[0.45fr_0.55fr]">
                    <dt className="font-medium text-black">{row.label}</dt>
                    <dd className="text-black">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 text-xs text-ink-soft">
              * Per Heidolph published technical data for this model. Confirm details against the latest datasheet from Inkarp before ordering.
            </p>
          </div>
        );

      /* ── 5. PERFORMANCE ──────────────────────────── */
      case 'performance':
        return (
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink mb-4">
              {perfSec?.title ?? 'Evaporation performance'}
            </h3>
            {perfSec?.body?.map((p, i) => (
              <p key={i} className="mb-4 text-sm leading-7 text-black">{p}</p>
            ))}
            <KPIRow kpis={perfSec?.metrics ?? lf.stats ?? []} />
            {perfSec?.utilityChecklist?.length > 0 && (
              <div className="mt-6 overflow-hidden border border-line-light bg-parchment">
                <dl className="divide-y divide-line-light">
                  {perfSec.utilityChecklist.map((row) => (
                    <div key={row.label} className="grid px-5 py-3 text-sm sm:grid-cols-[0.45fr_0.55fr]">
                      <dt className="font-medium text-black">{row.label}</dt>
                      <dd className="text-black">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {perfSec?.disclaimer && (
              <p className="mt-5 border border-line-light bg-parchment-alt p-4 text-xs leading-6 text-black">
                {perfSec.disclaimer}
              </p>
            )}
            {(product.simulator || solventGuideSec?.cards?.length > 0) && (
              <p className="mt-4 text-xs text-ink-soft">
                Use the{' '}
                {product.simulator && (
                  <a href="#simulator" className="font-semibold text-ink underline hover:text-red">distillation simulator</a>
                )}
                {product.simulator && solventGuideSec?.cards?.length > 0 && ' and the '}
                {solventGuideSec?.cards?.length > 0 && (
                  <a href="#solvents" className="font-semibold text-ink underline hover:text-red">solvent guide</a>
                )}
                {' '}below to explore performance.
              </p>
            )}
          </div>
        );

      /* ── 6. COMPLIANCE ───────────────────────────── */
      case 'compliance':
        return (
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink mb-4">
              {complianceSec?.title ?? 'Quality, safety & certification'}
            </h3>
            {introText(complianceSec).map((p, i) => (
              <p key={i} className="mb-5 text-sm leading-7 text-black">{p}</p>
            ))}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(complianceSec?.cards ?? []).map((c) => (
                <IconCard
                  key={c.title}
                  {...c}
                  icon={resolveIcon(c.category ?? '', COMPLIANCE_ICON_RULES)}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-soft">
              See the related standards and certificates in{' '}
              <a href="#standards" className="font-semibold text-ink underline hover:text-red">Standards &amp; certificates</a>.
            </p>
          </div>
        );

      /* ── 7. CONFIGURATIONS ───────────────────────── */
      case 'config':
        return (
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink mb-4">
              {configSec?.title ?? `Configure the ${product.name} around your workflow`}
            </h3>
            {introText(configSec).map((p, i) => (
              <p key={i} className="mb-5 text-sm leading-7 text-black">{p}</p>
            ))}
            <div className="grid gap-3 sm:grid-cols-2">
              {(configSec?.cards ?? []).map((c) => (
                <IconCard
                  key={c.title}
                  {...c}
                  icon={resolveIcon(c.title, CONFIG_ICON_RULES)}
                />
              ))}
            </div>
            {(product.configWizard || glassSec?.cards?.length > 0 || product.pairing) && (
              <p className="mt-4 text-xs text-ink-soft">
                Not sure which to choose?{' '}
                {product.configWizard && (
                  <>Use the <a href="#config" className="font-semibold text-ink underline hover:text-red">configuration wizard</a>{glassSec?.cards?.length > 0 || product.pairing ? ', ' : '.'}</>
                )}
                {glassSec?.cards?.length > 0 && (
                  <>the <a href="#glassware" className="font-semibold text-ink underline hover:text-red">glassware guide</a>{product.pairing ? ' or ' : '.'}</>
                )}
                {product.pairing && (
                  <>the <a href="#pairing" className="font-semibold text-ink underline hover:text-red">vacuum &amp; chiller pairing helper</a> below.</>
                )}
              </p>
            )}
          </div>
        );

      /* ── 8. DOCS ─────────────────────────────────── */
      case 'docs': {
        return (
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink mb-2">
              {docsSec?.title ?? 'Documentation & Resources'}
            </h3>
            {(introText(docsSec).length ? introText(docsSec) : ['Product and compliance documents for internal evaluation, purchase and safety review. Request any from Inkarp.']).map((p, i) => (
              <p key={i} className="mb-5 text-sm leading-7 text-black">{p}</p>
            ))}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(docsSec?.cards ?? []).map((c) => {
                const DocIcon = resolveIcon(c.title, DOCS_ICON_RULES);
                return (
                  <div key={c.title} className="flex items-start gap-3 border border-line-light bg-parchment p-4 transition hover:border-line-light">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-parchment-alt">
                      <DocIcon className="h-4 w-4 text-red" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-black">{c.title}</div>
                      <div className="text-xs text-black mt-0.5">{c.description}</div>
                      <a
                        href={`mailto:info@inkarp.co.in?subject=${encodeURIComponent(`Request: ${product.name} ${c.title}`)}`}
                        className="mt-2 inline-block text-xs font-semibold text-ink underline hover:text-red"
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
    <section id="overview" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">

        <SectionHeader
          number="01"
          eyebrow={overviewSec?.eyebrow ?? 'Product information'}
          title={overviewSec?.title ?? 'Product at a glance'}
          description={overviewSec?.description ?? ''}
        />

        {/* Pill tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {visibleTabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`inline-flex items-center gap-1.5 border px-4 py-2 text-xs font-semibold transition ${
                safeActive === key
                  ? 'border-black bg-red text-white'
                  : 'border-line-light bg-parchment text-black hover:border-line-light hover:text-black'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${safeActive === key ? '' : 'text-red'}`} />
              {label}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="border border-line-light bg-parchment p-6 min-h-[300px]">
          {renderContent()}
        </div>

      </div>
    </section>
  );
}
