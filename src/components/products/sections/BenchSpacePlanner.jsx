'use client';
import { useMemo, useState } from 'react';
import { FiGrid, FiRefreshCw, FiTool, FiVolume2 } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

function cleanNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

function NumberInput({ label, note, suffix, value, onChange, min = 0, step = 1 }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-black">{label}</span>
      {note ? <span className="mt-1 block text-xs leading-5 text-ink-soft">{note}</span> : null}
      <div className="mt-2 flex h-12 overflow-hidden border border-line-light bg-white focus-within:border-red focus-within:ring-4 focus-within:ring-red/10">
        <input
          className="min-w-0 flex-1 bg-transparent px-4 text-base font-semibold text-ink outline-none"
          min={min}
          onChange={(event) => onChange(cleanNumber(event.target.value))}
          step={step}
          type="number"
          value={value}
        />
        {suffix ? (
          <span className="flex items-center border-l border-line-light bg-parchment-alt px-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export default function BenchSpacePlanner({ data, productName }) {
  const unit = data?.unit ?? {};
  const width = unit.widthMm ?? 126;
  const depth = unit.depthMm ?? 140;
  const weight = unit.weightKg ?? 1.1;
  const noise = unit.noise ?? 'Less than 70 dB(A)';

  const defaults = data?.defaults ?? {};
  const [benchLength, setBenchLength] = useState(defaults.benchLengthMm ?? 1200);
  const [benchDepth, setBenchDepth] = useState(defaults.benchDepthMm ?? 600);
  const [clearance, setClearance] = useState(defaults.clearanceMm ?? 80);
  const [peakStations, setPeakStations] = useState(defaults.peakStations ?? 6);
  const [currentStirrers, setCurrentStirrers] = useState(defaults.currentStirrers ?? 3);
  const [heatedStations, setHeatedStations] = useState(defaults.heatedStations ?? 1);
  const [largeVolumeStations, setLargeVolumeStations] = useState(defaults.largeVolumeStations ?? 0);
  const [noiseSensitive, setNoiseSensitive] = useState(Boolean(defaults.noiseSensitive));

  const results = useMemo(() => {
    const pitch = width + clearance;
    const stationsByLength = pitch > 0 ? Math.floor(benchLength / pitch) : 0;
    const depthOk = benchDepth >= depth;
    const physicalStations = depthOk ? Math.max(0, stationsByLength) : 0;
    const targetStations = Math.max(0, peakStations);
    const specialStations = Math.min(targetStations, heatedStations + largeVolumeStations);
    const heiMixStations = Math.max(0, Math.min(physicalStations, targetStations) - specialStations);
    const shortfall = Math.max(0, targetStations - currentStirrers);
    const unservedStations = Math.max(0, targetStations - physicalStations);

    return {
      depthOk,
      heiMixStations,
      physicalStations,
      shortfall,
      specialStations,
      unservedStations,
    };
  }, [benchDepth, benchLength, clearance, currentStirrers, depth, heatedStations, largeVolumeStations, peakStations, width]);

  if (!data) return null;

  const reset = () => {
    setBenchLength(defaults.benchLengthMm ?? 1200);
    setBenchDepth(defaults.benchDepthMm ?? 600);
    setClearance(defaults.clearanceMm ?? 80);
    setPeakStations(defaults.peakStations ?? 6);
    setCurrentStirrers(defaults.currentStirrers ?? 3);
    setHeatedStations(defaults.heatedStations ?? 1);
    setLargeVolumeStations(defaults.largeVolumeStations ?? 0);
    setNoiseSensitive(Boolean(defaults.noiseSensitive));
  };

  const summary = [
    `Product: ${productName}`,
    `Usable bench length: ${benchLength} mm`,
    `Usable bench depth: ${benchDepth} mm`,
    `Working clearance per station: ${clearance} mm`,
    `Peak parallel preparations: ${peakStations}`,
    `Current stirrers: ${currentStirrers}`,
    `Preparations needing heating: ${heatedStations}`,
    `Preparations above 5 L: ${largeVolumeStations}`,
    `Noise-sensitive bench: ${noiseSensitive ? 'Yes' : 'No'}`,
    `Physical stations by footprint: ${results.physicalStations}`,
    `Suggested Hei-Mix S stations to review: ${results.heiMixStations}`,
    `Stations needing alternate models: ${results.specialStations}`,
  ].join('\n');

  return (
    <section id={data.sectionId ?? 'bench-planner'} className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-8">
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeader
          number={data.number ?? '13'}
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border border-line-light bg-parchment p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberInput label="Usable bench length" note="Length available for side-by-side stations." onChange={setBenchLength} suffix="mm" value={benchLength} />
              <NumberInput label="Usable bench depth" note="Instrument depth is checked against this." onChange={setBenchDepth} suffix="mm" value={benchDepth} />
              <NumberInput label="Working clearance per station" note="Space for hands, labels, and vessel access." onChange={setClearance} suffix="mm" value={clearance} />
              <NumberInput label="Peak parallel preparations" note="How many stations you need at the busiest time." onChange={setPeakStations} value={peakStations} />
              <NumberInput label="Stirrers currently available" note="Shows the gap between current capacity and peak need." onChange={setCurrentStirrers} value={currentStirrers} />
              <NumberInput label="Preparations needing heat" note="These should move to a Hei-Plate Mix 'n' Heat model." onChange={setHeatedStations} value={heatedStations} />
              <NumberInput label="Preparations above 5 L" note="These should move to a 20 L stirring model." onChange={setLargeVolumeStations} value={largeVolumeStations} />
            </div>

            <label className="mt-5 flex items-start gap-3 border border-line-light bg-parchment-alt p-4 text-sm font-semibold text-black">
              <input
                checked={noiseSensitive}
                className="mt-1 h-4 w-4 accent-red"
                onChange={(event) => setNoiseSensitive(event.target.checked)}
                type="checkbox"
              />
              <span>This bench is noise-sensitive or shared by multiple users.</span>
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <LeadCaptureForm
                formType="bench-space-planner"
                productName={productName}
                submitLabel={data.ctaLabel ?? 'Plan my bench'}
                successMessage={(name) =>
                  `Thank you${name ? `, ${name}` : ''}. Inkarp will review your bench plan and suggest the right station mix.`
                }
                summary={summary}
                triggerLabel={data.ctaLabel ?? 'Plan my bench'}
              />
              <button
                className="inline-flex h-11 items-center gap-2 border border-line-light px-5 text-sm font-bold text-black transition hover:border-red hover:text-red"
                onClick={reset}
                type="button"
              >
                <FiRefreshCw className="text-red" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="border border-line-light bg-parchment p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <FiGrid className="text-red" />
                Physical stations by footprint
              </p>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-red">{results.physicalStations}</div>
              <p className="mt-2 text-xs leading-5 text-ink-soft">
                Based on {width} mm width plus {clearance} mm clearance per station.
              </p>
            </div>

            <div className="border border-line-light bg-parchment p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <FiTool className="text-red" />
                Hei-Mix S stations to review
              </p>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-ink">{results.heiMixStations}</div>
              <p className="mt-2 text-xs leading-5 text-ink-soft">
                Heating and above-5 L stations are separated for alternate Heidolph models.
              </p>
            </div>

            <div className="border border-line-light bg-parchment p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <FiVolume2 className="text-red" />
                Noise and load note
              </p>
              <div className="mt-3 text-2xl font-semibold tracking-tight text-ink">{noise}</div>
              <p className="mt-2 text-xs leading-5 text-ink-soft">
                Each unit weighs {weight} kg. Confirm filled vessel weight against the 6 kg load limit.
              </p>
            </div>

            <div className={`border p-5 ${results.depthOk && results.unservedStations === 0 ? 'border-line-light bg-parchment' : 'border-red bg-red text-white'}`}>
              <p className={`text-sm font-semibold ${results.depthOk && results.unservedStations === 0 ? 'text-ink-soft' : 'text-white/80'}`}>
                Planning signal
              </p>
              <div className="mt-3 text-2xl font-semibold tracking-tight">
                {!results.depthOk
                  ? 'Depth needs review'
                  : results.unservedStations > 0
                    ? `${results.unservedStations} station gap`
                    : 'Bench plan fits'}
              </div>
              <p className={`mt-2 text-sm leading-6 ${results.depthOk && results.unservedStations === 0 ? 'text-ink-soft' : 'text-white/85'}`}>
                {data.resultNote}
              </p>
            </div>
          </div>
        </div>

        <SectionDisclaimer>{data.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
