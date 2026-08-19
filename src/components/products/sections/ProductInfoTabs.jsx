'use client';
import { useEffect, useState } from 'react';
import {
  FiInfo, FiZap, FiGrid, FiBarChart2, FiTrendingUp,
  FiShield, FiSliders, FiFileText, FiMonitor, FiTool,
  FiTarget, FiSun, FiLayers, FiSettings,
  FiMove, FiThermometer, FiDollarSign,
  FiAward, FiCheckCircle, FiBookOpen, FiDroplet, FiCoffee,
  FiWind, FiClock, FiDownload, FiBook, FiActivity,
  FiRotateCw, FiPackage, FiVolume2,
} from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import TechnicalSpecsTable from '../TechnicalSpecsTable';

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

/* Stats/KPI row: solvent evaporation rates, drive specs, etc. */
const METRIC_ICON_RULES = [
  { match: (t) => t.includes('torque trend'),                                                icon: FiTrendingUp },
  { match: (t) => t.includes('torque'),                                                       icon: FiZap        },
  { match: (t) => t.includes('viscosity'),                                                    icon: FiActivity   },
  { match: (t) => t.includes('gear') || t.includes('rpm') || t.includes('rotation') || t.includes('rotary') || t.includes('speed'), icon: FiRotateCw },
  { match: (t) => t.includes('toluene') || t.includes('acetone') || t.includes('ethanol') || t.includes('methanol') || t.includes('water') || t.includes('volume') || t.includes('capacity') || t.includes('flask'), icon: FiDroplet },
  { match: (t) => t.includes('usb') || t.includes('rs232') || t.includes('interface') || t.includes('plc') || t.includes('automation') || t.includes('lab 4.0') || t.includes('touch') || t.includes('display'), icon: FiMonitor },
  { match: (t) => t.includes('program') || t.includes('method') || t.includes('favourites') || t.includes('cleaning'), icon: FiSliders },
  { match: (t) => t.includes('protection') || /\bip\d{2}\b/.test(t),                          icon: FiShield     },
  { match: (t) => t.includes('weight'),                                                        icon: FiPackage    },
  { match: (t) => t.includes('shaft') || t.includes('chuck') || t.includes('kera-disk') || t.includes('plate'), icon: FiTool },
  { match: (t) => t.includes('power') || t.includes('voltage') || t.includes('input'),        icon: FiZap        },
  { match: (t) => t.includes('temperature') || t.includes('heating') || t.includes('bath'),   icon: FiThermometer },
  { match: (t) => t.includes('acoustic') || t.includes('pressure'),                            icon: FiVolume2    },
  { match: (t) => t.includes('warranty'),                                                      icon: FiAward      },
  { match: (t) => t.includes('stir'),                                                          icon: FiRotateCw   },
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
    <div className="border border-line-light bg-parchment p-3.5 transition hover:border-red/30">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-red/8 text-red">
          <Icon className="h-3.5 w-3.5" />
        </span>
        {badge && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-ink bg-parchment-alt px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-[13px] leading-snug text-black">{title}</h3>
      {description && <p className="mt-1 text-xs leading-5 text-black">{description}</p>}
      {items?.length > 0 && (
        <ul className="mt-2 space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs leading-5 text-black">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-ink-soft" />
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
      {kpis.map((k) => {
        const Icon = resolveIcon(k.label, METRIC_ICON_RULES, FiBarChart2);
        return (
          <div key={k.label} className="border border-line-light bg-parchment p-4 text-center transition hover:border-red/30">
            <span className="mx-auto mb-2 flex h-8 w-8 items-center justify-center bg-red/8 text-red">
              <Icon className="h-4 w-4" />
            </span>
            <div className="text-2xl font-semibold tracking-tight text-ink">{k.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-black">{k.label}</div>
          </div>
        );
      })}
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
  const sectionAny = (keys = [], eyebrows = []) =>
    lf.sections?.find((s) => keys.includes(s.key) || eyebrows.includes(s.eyebrow));

  // Flat-schema fallback: products without `longForm.sections` (e.g. the
  // newer Mettler Toledo pages) carry the same content as top-level fields
  // instead (`overview`, `performance`, `docs`). Synthesize an equivalent
  // section shape from those so the tabs show real content, not placeholders.
  const flatOverviewSec = product.overview && typeof product.overview === 'object'
    ? { subheading: product.subhead, body: product.overview.body ?? [], cards: [] }
    : undefined;
  const flatPerfSec = product.performance && typeof product.performance === 'object'
    ? product.performance
    : undefined;

  // Fall back to the first prose section — never the workflow section, whose
  // `steps` belong to the process cycle rather than the Overview tab.
  const overviewSec      = section('overview', 'Product overview')
    ?? lf.sections?.find((s) => !s.steps?.length)
    ?? flatOverviewSec;
  const keyFeaturesSec   = section('features', 'Key Features');
  const applicationsSec  = section('applications', 'Applications');
  const specsSec         = section('specs', 'Technical Specs');
  const perfSec          = section('performance', 'Performance') ?? flatPerfSec;
  const complianceSec    = section('certs', 'Quality and safety');
  const configSec        = sectionAny(['config', 'configuration'], ['Configuration', 'Configurations', 'Platform Capacity & Sample Compatibility', 'Platform Capacity / Sample Compatibility', 'Attachments', 'Platform Capacity']);
  const docsSec          = sectionAny(['docs'], ['Documentation', 'Documentation & Resources', 'Documentation and Resources']);
  const solventGuideSec  = section('solventGuide', 'Solvent setup guide');
  const glassSec         = section('glassware', 'Glassware guide');
  const configCards = configSec?.cards ?? configSec?.metrics?.map((item) => ({
    title: item.label,
    description: item.value,
  })) ?? [];
  const docsCards = docsSec?.cards ?? docsSec?.resources?.map((item) => ({
    title: item.title,
    description: item.description ?? item.note ?? item.type,
  })) ?? (Array.isArray(product.docs) ? product.docs.map((item) => ({
    title: item.label ?? item.title,
    description: item.description ?? item.type ?? item.note,
  })) : []);

  // A tab is only offered when it has something to show. Products carry very
  // different section sets, so an unconditional tab opens onto a bare heading
  // (e.g. the Labstation I size-configuration page had four empty tabs).
  const visibleTabs = TABS.filter(({ key }) => {
    switch (key) {
      case 'overview':     return !!(overviewSec?.body?.length || overviewSec?.cards?.length);
      case 'features':     return (product.features ?? []).length > 0;
      case 'applications': return (product.applications ?? []).length > 0;
      case 'specs':        return (product.technicalSpecs ?? []).length > 0;
      case 'performance':  return !!perfSec;
      case 'compliance':   return !!complianceSec?.cards?.length;
      case 'config':       return configCards.length > 0;
      case 'docs':         return docsCards.length > 0;
      default:             return true;
    }
  });
  // Fall back to the first tab that actually exists — 'overview' itself can be hidden.
  const safeActive = visibleTabs.some((t) => t.key === active)
    ? active
    : (visibleTabs[0]?.key ?? 'overview');

  // One line saying what the open tab covers, when the content supplies one.
  const sectionForTab = {
    overview: overviewSec,
    features: keyFeaturesSec,
    applications: applicationsSec,
    specs: specsSec,
    performance: perfSec,
    compliance: complianceSec,
    config: configSec,
    docs: docsSec,
  };
  const activeSummary = sectionForTab[safeActive]?.tabSummary;

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
            {overviewSec?.body?.map((p, i) => {
              const colonIdx = p.indexOf(':');
              const heading = colonIdx > -1 ? p.slice(0, colonIdx).trim() : null;
              const rest = colonIdx > -1 ? p.slice(colonIdx + 1).trim() : p;
              return (
                <p key={i} className="mb-4 flex items-start gap-3 text-sm leading-7 text-black">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center bg-parchment-alt text-red">
                    <FiCheckCircle aria-hidden="true" className="text-sm" />
                  </span>
                  <span>
                    {heading && <strong className="font-semibold text-ink">{heading}: </strong>}
                    {rest}
                  </span>
                </p>
              );
            })}
            {overviewSec?.cards?.length > 0 && (
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {(product.features ?? []).slice(0, 12).map((f, i) => {
                const isObject = f && typeof f === 'object';
                const colonIdx = isObject ? -1 : f.indexOf(':');
                const title       = isObject ? (f.title ?? '') : (colonIdx > -1 ? f.slice(0, colonIdx).trim() : f.trim());
                const description = isObject ? (f.description ?? '') : (colonIdx > -1 ? f.slice(colonIdx + 1).trim() : '');
                return (
                  <IconCard
                    key={isObject ? title || i : f}
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
              {(product.applications ?? []).map((app, i) => {
                const isObject = app && typeof app === 'object';
                const title = isObject ? (app.title ?? '') : deriveAppTitle(app);
                const description = isObject ? (app.description ?? '') : app;
                return (
                  <IconCard
                    key={i}
                    title={title}
                    description={description}
                    icon={resolveIcon(description, APPLICATION_ICON_RULES)}
                  />
                );
              })}
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
            <TechnicalSpecsTable
              note="Per published technical data for this model. Confirm details against the latest datasheet from Inkarp before ordering."
              specs={product.technicalSpecs ?? []}
            />
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
                  {perfSec.columnHeaders && (
                    <div className="grid bg-parchment-alt px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft sm:grid-cols-[0.45fr_0.55fr]">
                      <dt>{perfSec.columnHeaders.label}</dt>
                      <dd>{perfSec.columnHeaders.value}</dd>
                    </div>
                  )}
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
              {configCards.map((c) => (
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
              {docsCards.map((c) => {
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

  // Nothing to tab through at all — skip the section rather than render an
  // empty header and an empty card.
  if (visibleTabs.length === 0) return null;

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
        <div aria-label="Product information" className="mb-6 flex flex-wrap gap-2" role="tablist">
          {visibleTabs.map(({ key, label, Icon }) => (
            <button
              aria-controls="product-info-panel"
              aria-selected={safeActive === key}
              id={`product-info-tab-${key}`}
              key={key}
              onClick={() => setActive(key)}
              role="tab"
              type="button"
              className={`inline-flex items-center gap-1.5 border px-4 py-2 text-xs font-semibold transition ${
                safeActive === key
                  ? 'border-black bg-red text-white'
                  : 'border-line-light bg-parchment text-black hover:border-line-light hover:text-black'
              }`}
            >
              <Icon aria-hidden="true" className={`h-3.5 w-3.5 ${safeActive === key ? '' : 'text-red'}`} />
              {label}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div
          aria-labelledby={`product-info-tab-${safeActive}`}
          className="border border-line-light bg-parchment p-6 min-h-[300px]"
          id="product-info-panel"
          role="tabpanel"
          tabIndex={0}
        >
          {activeSummary && (
            <p className="mb-5 border-l-2 border-red pl-3 text-sm leading-6 text-ink-soft">
              {activeSummary}
            </p>
          )}
          {renderContent()}
        </div>

      </div>
    </section>
  );
}
