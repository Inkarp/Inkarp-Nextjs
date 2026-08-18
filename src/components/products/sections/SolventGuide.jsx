'use client';
import { useMemo, useState } from 'react';
import { FiCheckCircle, FiInfo, FiPlus, FiCloudSnow, FiShield, FiThermometer } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

// Bridges the naming gap between solvent guide cards and simulator/calculator entries
const SOLVENT_NAME_ALIASES = { Dichloromethane: 'DCM' };

// Legacy cards ship 4 items (glassware/cooling/vacuum/accessory). Cards that also
// provide a 5th item (safety note) get an extra row, and a 6th item (end result)
// gets one more on top of that - existing 4/5-item cards are unaffected.
const DETAIL_ICONS_4 = [FiThermometer, FiCloudSnow, FiInfo, FiPlus];
const DETAIL_LABELS_4 = [
  'Suggested glassware',
  'Cooling approach',
  'Vacuum setup',
  'Accessory recommendation',
];
const DETAIL_ICONS_5 = [FiThermometer, FiCloudSnow, FiInfo, FiShield, FiPlus];
const DETAIL_LABELS_5 = [
  'Suggested glassware',
  'Cooling approach',
  'Vacuum setup',
  'Safety note',
  'Accessory recommendation',
];
const DETAIL_ICONS_6 = [FiThermometer, FiCloudSnow, FiInfo, FiShield, FiPlus, FiCheckCircle];
const DETAIL_LABELS_6 = [
  'Suggested glassware',
  'Cooling approach',
  'Vacuum setup',
  'Safety note',
  'Accessory recommendation',
  'End result',
];
// Generic icon cycle used when a section supplies its own `detailLabels`
// (column headings that don't match the glassware-guide wording above).
const GENERIC_ICONS = [FiThermometer, FiCloudSnow, FiInfo, FiShield, FiPlus, FiCheckCircle];

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

function makeDetailRows(card, customLabels) {
  const items = (card.items ?? []).map(normaliseText);
  if (customLabels?.length) {
    const n = Math.min(items.length, customLabels.length);
    return { labels: customLabels.slice(0, n), icons: GENERIC_ICONS.slice(0, n), rows: items.slice(0, n) };
  }
  if (items.length >= 6) {
    return { labels: DETAIL_LABELS_6, icons: DETAIL_ICONS_6, rows: items.slice(0, 6) };
  }
  if (items.length >= 5) {
    return { labels: DETAIL_LABELS_5, icons: DETAIL_ICONS_5, rows: items.slice(0, 5) };
  }
  return {
    labels: DETAIL_LABELS_4,
    icons: DETAIL_ICONS_4,
    rows: [
      items[0] ?? 'Standard G3 vertical glassware works well for routine evaporation.',
      items[1] ?? 'Choose cooling based on vapour temperature and volatility.',
      items[2] ?? 'Select a compatible Hei-VAC pump based on solvent behaviour.',
      items[3] ?? 'Confirm pump, chiller and protective accessories with Inkarp.',
    ],
  };
}

function lookupBp(cardTitle, simulatorSolvents = []) {
  const lookupName = SOLVENT_NAME_ALIASES[cardTitle] ?? cardTitle;
  return simulatorSolvents.find((s) => s.name === lookupName)?.bp ?? null;
}

export default function SolventGuide({ data, simulatorData, sectionNumber = '06' }) {
  const cards = data?.cards ?? [];
  const disclaimer = data?.disclaimer;
  const customLabels = data?.detailLabels;
  const simulatorSolvents = simulatorData?.solvents ?? [];
  const [active, setActive] = useState(0);

  const enrichedCards = useMemo(() => cards.map((card) => ({
    ...card,
    parsed: parseDescription(card.description),
    boilingPoint: lookupBp(card.title, simulatorSolvents),
    detail: makeDetailRows(card, customLabels),
  })), [cards, simulatorSolvents, customLabels]);

  if (!cards.length) return null;
  const card = enrichedCards[active];

  return (
    <section id="solvents" className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px] w-full">
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
                aria-pressed={active === index}
                className={`flex min-h-12 w-full items-center justify-between border px-5 py-3 text-left transition ${
                  active === index
                    ? 'border-black bg-red text-white'
                    : 'border-line-light bg-parchment text-black hover:border-line-light'
                }`}
                key={item.title}
                onClick={() => setActive(index)}
                type="button"
              >
                <span className="text-sm font-bold">{item.title}</span>
                <span className={`text-xs ${active === index ? 'text-white/70' : 'text-black'}`}>
                  {item.boilingPoint ? `${item.boilingPoint} deg C bp` : 'setup'}
                </span>
              </button>
            ))}
          </div>

          <div className="border border-line-light bg-parchment p-6 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight text-ink">{card.title}</h3>
            <p className="mt-2 text-sm text-black">
              {[
                card.parsed.bath && `bath ${card.parsed.bath}`,
                card.parsed.vapour && `vapour ~${card.parsed.vapour}`,
                card.parsed.vacuum && card.parsed.vacuum,
                card.parsed.rate && card.parsed.rate,
              ].filter(Boolean).join(' - ') || card.parsed.text}
            </p>

            <div className="mt-6 space-y-4">
              {card.detail.rows.map((row, index) => {
                const Icon = card.detail.icons[index] ?? FiInfo;
                const label = card.detail.labels[index];
                return (
                  <div className="grid gap-4 sm:grid-cols-[36px_1fr]" key={`${card.title}-${label}`}>
                    <div className="flex size-9 items-center justify-center border border-line-light bg-parchment-alt text-red">
                      <Icon className="text-base" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-black">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-black">{row}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border border-line-light bg-parchment-alt px-4 py-3 text-sm leading-6 text-black">
              Tip - the <span className="font-semibold text-black">20/40/60 rule</span>: ~40 deg C bath, ~20 deg C coolant and a ~60 deg C gap to the vapour temperature for safe, efficient evaporation.
            </div>

            <a
              className="mt-6 inline-flex h-11 items-center justify-center bg-red px-5 text-sm font-bold text-white transition hover:bg-transparent hover:text-red"
              href="#booking"
            >
              {card.cta ?? 'Ask Inkarp for solvent-specific configuration'}
            </a>
          </div>
        </div>

        <SectionDisclaimer>{disclaimer && normaliseText(disclaimer)}</SectionDisclaimer>
      </div>
    </section>
  );
}
