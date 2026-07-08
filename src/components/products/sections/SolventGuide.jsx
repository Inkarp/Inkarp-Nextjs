'use client';
import { useMemo, useState } from 'react';
import { FiInfo, FiPlus, FiCloudSnow, FiThermometer } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

// Bridges the naming gap between solvent guide cards and simulator/calculator entries
const SOLVENT_NAME_ALIASES = { Dichloromethane: 'DCM' };

const DETAIL_ICONS = [FiThermometer, FiCloudSnow, FiInfo, FiPlus];
const DETAIL_LABELS = [
  'Suggested glassware',
  'Cooling approach',
  'Vacuum setup',
  'Accessory recommendation',
];

function normaliseText(value = '') {
  return String(value)
    .replace(/â€[“”]/g, '-')
    .replace(/Â²/g, '2')
    .replace(/Â°C/g, 'deg C')
    .replace(/Â·/g, '-')
    .replace(/°C/g, 'deg C')
    .replace(/·/g, '-');
}

function parseDescription(description = '') {
  const text = normaliseText(description);
  return {
    bath: text.match(/Bath\s*([^,]+)/i)?.[1]?.trim(),
    vapour: text.match(/vapou?r\s*(?:around\s*)?([^,]+)/i)?.[1]?.trim(),
    vacuum: text.match(/about\s*([^,]+mbar)/i)?.[1]?.trim(),
    rate: text.match(/up to\s*([^,.]+)/i)?.[1]?.trim(),
    text,
  };
}

function makeDetailRows(card) {
  const items = (card.items ?? []).map(normaliseText);
  return [
    items[0] ?? 'Standard G3 vertical glassware works well for routine evaporation.',
    items[1] ?? 'Choose cooling based on vapour temperature and volatility.',
    items[2] ?? 'Select a compatible Hei-VAC pump based on solvent behaviour.',
    items[3] ?? 'Confirm pump, chiller and protective accessories with Inkarp.',
  ];
}

function lookupBp(cardTitle, simulatorSolvents = []) {
  const lookupName = SOLVENT_NAME_ALIASES[cardTitle] ?? cardTitle;
  return simulatorSolvents.find((s) => s.name === lookupName)?.bp ?? null;
}

export default function SolventGuide({ data, simulatorData, sectionNumber = '06' }) {
  const cards = data?.cards ?? [];
  const disclaimer = data?.disclaimer;
  const simulatorSolvents = simulatorData?.solvents ?? [];
  const [active, setActive] = useState(0);

  const enrichedCards = useMemo(() => cards.map((card) => ({
    ...card,
    parsed: parseDescription(card.description),
    boilingPoint: lookupBp(card.title, simulatorSolvents),
    rows: makeDetailRows(card),
  })), [cards, simulatorSolvents]);

  if (!cards.length) return null;
  const card = enrichedCards[active];

  return (
    <section id="solvents" className="scroll-mt-16 border-b border-line-light dark:border-zinc-800 bg-[#F6F6F6] dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative mx-auto max-w-7xl w-full">
        <SectionHeader
          number={sectionNumber}
          eyebrow={data?.eyebrow}
          title={data?.title}
          description={data?.description}
        />

        <div className="relative mt-9 grid gap-6 lg:grid-cols-[294px_1fr]">
          <div className="space-y-2">
            {enrichedCards.map((item, index) => (
              <button
                className={`flex min-h-12 w-full items-center justify-between rounded-2xl border px-5 py-3 text-left transition ${
                  active === index
                    ? 'border-black dark:border-zinc-100 bg-navy dark:bg-zinc-100 text-parchment dark:text-zinc-900'
                    : 'border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 text-black dark:text-zinc-100 hover:border-zinc-300'
                }`}
                key={item.title}
                onClick={() => setActive(index)}
                type="button"
              >
                <span className="text-sm font-bold">{item.title}</span>
                <span className={`text-xs ${active === index ? 'text-parchment/70 dark:text-zinc-900/70' : 'text-black dark:text-zinc-100'}`}>
                  {item.boilingPoint ? `${item.boilingPoint} deg C bp` : 'setup'}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight text-ink dark:text-zinc-100">{card.title}</h3>
            <p className="mt-2 text-sm text-black dark:text-zinc-400">
              {[
                card.parsed.bath && `bath ${card.parsed.bath}`,
                card.parsed.vapour && `vapour ~${card.parsed.vapour}`,
                card.parsed.vacuum && card.parsed.vacuum,
                card.parsed.rate && card.parsed.rate,
              ].filter(Boolean).join(' - ') || card.parsed.text}
            </p>

            <div className="mt-6 space-y-4">
              {card.rows.map((row, index) => {
                const Icon = DETAIL_ICONS[index] ?? FiInfo;
                return (
                  <div className="grid gap-4 sm:grid-cols-[36px_1fr]" key={`${card.title}-${DETAIL_LABELS[index]}`}>
                    <div className="flex size-9 items-center justify-center rounded-xl border border-line-light bg-parchment-alt text-red dark:border-zinc-800 dark:bg-zinc-900">
                      <Icon className="text-base" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-black dark:text-zinc-100">{DETAIL_LABELS[index]}</p>
                      <p className="mt-1 text-sm leading-6 text-black dark:text-zinc-400">{row}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-line-light dark:border-zinc-800 bg-parchment-alt dark:bg-zinc-900 px-4 py-3 text-sm leading-6 text-black dark:text-zinc-400">
              Tip - the <span className="font-semibold text-black dark:text-zinc-100">20/40/60 rule</span>: ~40 deg C bath, ~20 deg C coolant and a ~60 deg C gap to the vapour temperature for safe, efficient evaporation.
            </div>

            <a
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-red px-5 text-sm font-bold text-parchment transition hover:bg-[#9f000d]"
              href="#booking"
            >
              Ask Inkarp for solvent-specific configuration
            </a>
          </div>
        </div>

        <SectionDisclaimer>{disclaimer && normaliseText(disclaimer)}</SectionDisclaimer>
      </div>
    </section>
  );
}
