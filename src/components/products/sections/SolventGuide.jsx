'use client';
import { useMemo, useState } from 'react';
import { FiAlertTriangle, FiInfo, FiPlus, FiCloudSnow, FiThermometer } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const BOILING_POINTS = {
  Toluene: 111,
  Acetone: 56,
  Ethanol: 78,
  Water: 100,
  Methanol: 65,
  Dichloromethane: 40,
  Acetonitrile: 82,
};

const DETAIL_ICONS = [FiThermometer, FiCloudSnow, FiInfo, FiAlertTriangle, FiPlus];
const DETAIL_LABELS = [
  'Suggested glassware',
  'Cooling approach',
  'Vacuum setup',
  'Safety note',
  'Accessory recommendation',
];

function normaliseText(value = '') {
  return String(value)
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/\u00c2\u00b2/g, '2')
    .replace(/\u00c2\u00b0C/g, 'deg C')
    .replace(/\u00c2\u00b7/g, '-')
    .replace(/\u00b0C/g, 'deg C')
    .replace(/\u00b7/g, '-');
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
  const description = parseDescription(card.description);

  return [
    items[0] ?? 'Standard G3 vertical glassware works well for routine evaporation.',
    items[1] ?? 'Choose cooling based on vapour temperature and volatility.',
    description.vacuum
      ? `Moderate vacuum - around ${description.vacuum} with a suitable Hei-VAC pump.`
      : items[2] ?? 'Select a compatible Hei-VAC pump based on solvent behaviour.',
    `${card.title} handling depends on volatility and lab safety practice; verify bath, vacuum and condenser setup before running.`,
    items[2] ?? 'Confirm pump, chiller and protective accessories with Inkarp.',
  ];
}

export default function SolventGuide({ cards = [], disclaimer }) {
  const [active, setActive] = useState(0);

  const enrichedCards = useMemo(() => cards.map((card) => ({
    ...card,
    parsed: parseDescription(card.description),
    boilingPoint: BOILING_POINTS[card.title],
    rows: makeDetailRows(card),
  })), [cards]);

  if (!cards.length) return null;
  const card = enrichedCards[active];

  return (
    <section id="solvents" className="scroll-mt-16 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F6F6] dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="05"
          eyebrow="Interactive - solvent setup guide"
          title="Which solvent are you evaporating?"
          description="Pick your solvent and we will suggest a starting setup - glassware direction, cooling approach, vacuum, a safety note and accessory recommendations."
        />

        <div className="relative mt-9 grid gap-6 lg:grid-cols-[294px_1fr]">
          <div className="space-y-2">
            {enrichedCards.map((item, index) => (
              <button
                className={`flex min-h-12 w-full items-center justify-between rounded-2xl border px-5 py-3 text-left transition ${
                  active === index
                    ? 'border-[#BE0010] bg-[#BE0010]/5 text-black dark:text-zinc-100'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 hover:border-zinc-300'
                }`}
                key={item.title}
                onClick={() => setActive(index)}
                type="button"
              >
                <span className="text-sm font-bold">{item.title}</span>
                <span className="text-xs text-black dark:text-zinc-100">{item.boilingPoint ? `${item.boilingPoint} deg C bp` : 'setup'}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm sm:p-8">
            <h3 className="font-maxot text-2xl font-bold text-black dark:text-zinc-100">{card.title}</h3>
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
                    <div className="flex size-9 items-center justify-center rounded-xl border border-[#BE0010]/15 bg-[#BE0010]/5 text-[#BE0010]">
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

            <div className="mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm leading-6 text-black dark:text-zinc-400">
              Tip - the <span className="font-semibold text-black dark:text-zinc-100">20/40/60 rule</span>: ~40 deg C bath, ~20 deg C coolant and a ~60 deg C gap to the vapour temperature for safe, efficient evaporation.
            </div>

            <a
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#D30013] px-5 text-sm font-bold text-white transition hover:bg-[#BE0010]"
              href="#booking"
            >
              Ask Inkarp for solvent-specific configuration
            </a>
          </div>
        </div>

        {disclaimer && (
          <div className="relative mt-6 max-w-5xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 text-xs leading-6 text-black dark:text-zinc-400">
            <span className="mr-2 inline-flex size-4 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 text-[10px] font-bold text-black dark:text-zinc-100">i</span>
            Disclaimer: {normaliseText(disclaimer)}
          </div>
        )}
      </div>
    </section>
  );
}
