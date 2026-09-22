'use client';
import { useState, useEffect, useCallback } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import {
  FiActivity, FiBarChart2, FiCamera, FiCloudDrizzle, FiCrosshair, FiDroplet,
  FiFileText, FiFilter, FiLayers, FiLock, FiLogIn, FiLogOut, FiMinimize2,
  FiRefreshCw, FiRepeat, FiRotateCw, FiSettings, FiSliders, FiSun, FiTarget,
  FiThermometer, FiTrendingUp, FiWind, FiZap,
} from 'react-icons/fi';

const STEP_DURATION = 4000; // ms per step

/* Step icons.
   The step vocabulary across the catalogue runs to ~227 distinct names, so
   icons resolve by keyword rather than exact match: "Load Sample", "Load
   Samples" and "Load" all read as loading. Unmatched steps fall back to a
   numbered circle. */
const STEP_ICON_RULES = [
  { test: /rotat|spin|orbital|centrifug|shake|vortex|swirl/,        Icon: FiRotateCw    },
  { test: /evaporat|vapor|boil.?off|distil/,                        Icon: FiTrendingUp  },
  { test: /condens/,                                                Icon: FiCloudDrizzle},
  { test: /cool|chill|freeze|cryo/,                                 Icon: FiWind        },
  { test: /heat|warm|cure|incubat|anneal|bake/,                     Icon: FiThermometer },
  { test: /dry|dehydrat|lyophil/,                                   Icon: FiSun         },
  { test: /weigh|balance|tare|level|mass/,                          Icon: FiSliders     },
  { test: /calibrat|standard|zero|reference/,                       Icon: FiTarget      },
  { test: /load|mount|insert|charge|fill|feed|place/,               Icon: FiLogIn       },
  { test: /unload|discharg|eject|remove|recover|harvest|collect/,   Icon: FiLogOut      },
  { test: /rinse|clean|wash|purge|flush/,                           Icon: FiDroplet     },
  { test: /separat|purif|filter|extract|elut|chromatograph/,        Icon: FiFilter      },
  { test: /pump|prime|circulat|dispens|aspirat|inject|flow|dose/,   Icon: FiRepeat      },
  { test: /evacuat|vacuum|degas|pressur/,                           Icon: FiMinimize2   },
  { test: /seal|close|lock|cap/,                                    Icon: FiLock        },
  { test: /stir|mix|homogenis|homogeniz|blend|dissolv|disperse/,    Icon: FiRefreshCw   },
  { test: /react|synthes|sonicat|digest|titrat/,                    Icon: FiZap         },
  { test: /coat|spread|print|deposit|apply/,                        Icon: FiLayers      },
  { test: /illuminat|expos|irradiat|flame|atomis|atomiz|emission|light/, Icon: FiSun    },
  { test: /focus|image|captur|observ|view|acquir|scan|microscop/,   Icon: FiCamera      },
  { test: /detect|sens|probe|immers|approach|electrode/,            Icon: FiCrosshair   },
  { test: /measur|analys|analyz|calculat|quantif|read|assay/,       Icon: FiBarChart2   },
  { test: /monitor|maintain|stabilis|stabiliz|track|hold/,          Icon: FiActivity    },
  { test: /report|record|document|log|export|result/,               Icon: FiFileText    },
  { test: /prepar|set ?up|configur|program|select|set /,            Icon: FiSettings    },
];

function stepIcon(title) {
  const t = String(title ?? '').toLowerCase();
  const rule = STEP_ICON_RULES.find((r) => r.test.test(t));
  return rule ? <rule.Icon className="h-5 w-5" /> : null;
}

/* Connector between cards */
function Connector({ complete }) {
  return (
    <div className="hidden shrink-0 items-center gap-1 px-1 lg:flex">
      <div className={`h-px w-7 transition-colors duration-300 ${complete ? 'bg-red' : 'bg-line-light'}`} />
      <div className={`h-2.5 w-2.5 border-2 transition-colors duration-300 ${complete ? 'border-red bg-red' : 'border-line-light bg-parchment-alt'}`} />
    </div>
  );
}

/* Single step card */
function StepCard({ step, index, isActive, isPast, onClick, totalDuration }) {
  const isFuture = !isActive && !isPast;

  return (
    <button
      aria-pressed={isActive}
      onClick={onClick}
      className={`group relative flex h-full w-full min-w-[160px] flex-col border-2 px-5 pb-5 pt-5 text-left transition-all duration-300 ${
        isActive
          ? 'z-10 scale-[1.02] border-red bg-white shadow-[0_18px_45px_rgba(190,0,16,0.16)] ring-4 ring-red/10'
          : isFuture
            ? 'border-line-light bg-parchment-alt opacity-45 saturate-0 hover:opacity-80 hover:saturate-100'
            : 'border-line-light bg-parchment opacity-55 saturate-0 hover:opacity-85 hover:saturate-100'
      }`}
    >
      {/* Progress bar at the top edge of the active card. */}
      {isActive && (
        <div className="absolute -left-0.5 -right-0.5 -top-0.5 h-1 overflow-hidden bg-red/15">
          <div
            key={`progress-${index}`}
            className="h-full bg-red"
            style={{ animation: `hvc-progress-fill ${totalDuration}ms linear forwards` }}
          />
        </div>
      )}

      <span className={`absolute right-4 top-3 text-xs font-bold tabular-nums transition-colors ${isActive ? 'text-red' : 'text-ink-soft'}`}>
        {isActive ? 'Active' : String(index + 1).padStart(2, '0')}
      </span>

      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center transition-colors duration-300 ${
          isActive ? 'bg-red text-white' : 'bg-white text-ink-soft'
        }`}
      >
        {stepIcon(step.title) ?? <span className="text-sm font-bold">{index + 1}</span>}
      </div>

      <h3 className={`mb-2 text-sm font-semibold tracking-tight transition-colors ${isActive ? 'text-ink' : 'text-ink-soft'}`}>
        {step.title}
      </h3>

      <p className={`min-h-[60px] text-xs leading-5 transition-colors ${isActive ? 'text-black' : 'text-ink-soft'}`}>
        {step.description}
      </p>
    </button>
  );
}

/* Evaporation-rate reference strip */
// Reuses the same metrics feeding the Performance tab/table, so the
// workflow section never carries its own copy of the numbers.
function RateStrip({ metrics }) {
  if (!metrics?.length) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <div
          className="border border-line-light bg-parchment-alt p-3 text-center"
          key={m.label}
        >
          <div className="text-lg font-semibold tracking-tight text-red">{m.value}</div>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-black">{m.label}</p>
        </div>
      ))}
    </div>
  );
}

/* Main component */
export default function EvaporationWorkflow({ section = {}, metrics }) {
  const steps = section.steps ?? [];
  const disclaimer = section.disclaimer;
  const rateMetrics = metrics ?? section.metrics;
  const [active, setActive] = useState(0);

  const advance = useCallback(() => {
    setActive((a) => (a + 1) % steps.length);
  }, [steps.length]);

  useEffect(() => {
    if (!steps.length) return;
    const id = setInterval(advance, STEP_DURATION);
    return () => clearInterval(id);
  }, [advance, steps.length]);

  if (!steps.length) return null;

  return (
    <section id="workflow" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">

        {/* number="02" is fixed for now; derive from section position once a
            master sections array drives page assembly. */}
        <SectionHeader
          number="02"
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        {/* Cards with connectors. Below `lg` this scrolls horizontally — the extra
            `pl-8` (on top of the section's own padding) keeps the first card clear
            of the fixed-position compare button (CompareCategoryButton, pinned at
            left-0/top-1/2), and the right-edge fade signals there's more to scroll
            instead of clipping mid-card. */}
        <div className="relative">
          <div className="flex items-stretch gap-2 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory scroll-pl-8 pb-2 pl-8 pr-6 pt-6 lg:snap-none lg:scroll-pl-0 lg:gap-0 lg:overflow-visible lg:pl-0 lg:pr-0 lg:pt-0">
            {steps.map((step, i) => (
              <div key={`step-${i}`} className="flex min-w-[160px] flex-1 snap-start items-stretch">
                <StepCard
                  step={step}
                  index={i}
                  isActive={active === i}
                  isPast={i < active}
                  onClick={() => setActive(i)}
                  totalDuration={STEP_DURATION}
                />
                {i < steps.length - 1 && (
                  <Connector complete={i < active} />
                )}
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-parchment to-transparent lg:hidden"
          />
        </div>

        {/* Step dots (mobile progress indicator) */}
        <div className="mt-6 flex justify-center gap-2 lg:hidden">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 transition-all ${active === i ? 'w-6 bg-red' : 'w-2 bg-parchment-alt'}`}
            />
          ))}
        </div>

        <SectionDisclaimer>{disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
