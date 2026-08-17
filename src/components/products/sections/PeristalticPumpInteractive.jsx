'use client';

import { useMemo, useState } from 'react';
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiCpu,
  FiDroplet,
  FiRepeat,
  FiShield,
  FiSliders,
  FiToggleLeft,
  FiZap,
} from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

const TOOL_IDS = new Set([
  'flow-rate-calculator',
  'dosing-accuracy-visualiser',
  'turbo-drain-simulator',
  'analogue-signal-mapper',
  'channel-configuration-flow-calculator',
  'pump-head-selector',
  'channel-and-turbo-flow-calculator',
  'analogue-control-mapper',
  'channel-and-dosing-precision-calculator',
  'closed-hood-operation-simulator',
]);

const PRODUCT_LIMITS = {
  'Hei-FLOW Ultimate 600 Single Channel Peristaltic Pump': {
    minRpm: 24,
    maxRpm: 600,
    singleMin: 2,
    singleMax: 4056,
    precision: 2,
  },
  'Hei-FLOW Expert 600 Single Channel Peristaltic Pump': {
    minRpm: 24,
    maxRpm: 600,
    singleMin: 2,
    singleMax: 4056,
    precision: 3.5,
  },
  'Hei-FLOW Core 120 Multi Channel Peristaltic Pump': {
    minRpm: 10,
    maxRpm: 120,
    singleMin: 0.85,
    singleMax: 861,
    multiMin: 0.005,
    multiMax: 364,
    precision: 5,
  },
  'Hei-FLOW Expert 120 Multi Channel Peristaltic Pump': {
    minRpm: 5,
    maxRpm: 120,
    singleMin: 0.5,
    singleMax: 936,
    multiMin: 0.005,
    multiMax: 277,
    precision: 3.5,
  },
  'Hei-FLOW Ultimate 120 Multi Channel Peristaltic Pump': {
    minRpm: 5,
    maxRpm: 120,
    singleMin: 0.36,
    singleMax: 813,
    multiMin: 0.005,
    multiMax: 329,
    precision: 1,
  },
};

const BORE_OPTIONS = [
  { label: 'Fine', value: 0.18, note: 'Small dose control' },
  { label: 'Medium', value: 0.52, note: 'Routine transfer' },
  { label: 'Wide', value: 1, note: 'Fast fill or drain' },
];

export function isPeristalticPumpTool(data) {
  return TOOL_IDS.has(data?.sectionId);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, decimals = 1) {
  if (!Number.isFinite(value)) return 0;
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function formatNumber(value, decimals = 1) {
  return round(value, decimals).toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: value < 10 && decimals > 0 ? 1 : 0,
  });
}

function flowAtSpeed({ rpm, limits, bore = 1, mode = 'single' }) {
  const max = mode === 'multi' ? limits.multiMax : limits.singleMax;
  const min = mode === 'multi' ? limits.multiMin : limits.singleMin;
  const ratio = rpm / limits.maxRpm;
  return clamp(max * ratio * bore, min, max);
}

function modeLabel(flow, max) {
  const ratio = flow / max;
  if (ratio < 0.08) return 'Dosing range';
  if (ratio < 0.45) return 'Steady transfer';
  return 'Fast-fill range';
}

function timeLabel(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0 s';
  if (seconds < 60) return `${formatNumber(seconds, 0)} s`;
  if (seconds < 3600) return `${formatNumber(seconds / 60, 1)} min`;
  return `${formatNumber(seconds / 3600, 1)} h`;
}

function buildSummary(title, rows) {
  return [title, ...rows.map((row) => `${row.label}: ${row.value}`)].join('\n');
}

function ToolShell({ children, data, productName, summary, triggerLabel }) {
  return (
    <section
      id={data?.sectionId ?? 'interactive-tool'}
      className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1180px] w-full">
        <SectionHeader
          number="12"
          eyebrow={data?.eyebrow}
          title={data?.title}
          description={data?.description}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.68fr)]">
          {children}
        </div>

        <LeadCaptureForm
          className="mt-7"
          formType="peristaltic-interactive-tool"
          productName={productName}
          submitLabel={triggerLabel ?? 'Send setup to Inkarp'}
          successMessage={(name) =>
            `Thank you${name ? `, ${name}` : ''}. Your setup has been sent to the Inkarp team for configuration support.`
          }
          summary={summary}
          triggerLabel={triggerLabel ?? 'Send setup to Inkarp'}
        />

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}

function Panel({ children, className = '' }) {
  return <div className={`border border-line-light bg-parchment p-5 sm:p-6 ${className}`}>{children}</div>;
}

function ResultPanel({ children, className = '' }) {
  return <div className={`border border-line-light bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}

function Field({ label, children, value }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-black">{label}</span>
        {value ? <span className="text-xs font-bold text-red">{value}</span> : null}
      </div>
      {children}
    </label>
  );
}

function RangeField({ label, max, min, onChange, step = 1, suffix, value }) {
  return (
    <Field label={label} value={`${formatNumber(value, step < 1 ? 2 : 0)}${suffix ? ` ${suffix}` : ''}`}>
      <input
        className="w-full accent-red"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </Field>
  );
}

function SegmentControl({ label, onChange, options, value }) {
  return (
    <Field label={label}>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              className={`border px-3 py-2.5 text-left text-xs font-semibold transition ${
                active ? 'border-black bg-red text-white' : 'border-line-light bg-white text-black hover:border-red hover:text-red'
              }`}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span className="block">{option.label}</span>
              {option.note ? <span className={`mt-1 block font-normal ${active ? 'text-white/80' : 'text-ink-soft'}`}>{option.note}</span> : null}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function ToggleButton({ checked, label, offLabel = 'Off', onChange, onLabel = 'On' }) {
  return (
    <button
      className={`flex w-full items-center justify-between border px-4 py-3 text-left transition ${
        checked ? 'border-black bg-red text-white' : 'border-line-light bg-white text-black hover:border-red'
      }`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className={`text-xs ${checked ? 'text-white/80' : 'text-ink-soft'}`}>{checked ? onLabel : offLabel}</span>
      </span>
      <FiToggleLeft className={`text-2xl ${checked ? 'rotate-180' : ''}`} />
    </button>
  );
}

function Metric({ icon: Icon = FiBarChart2, label, value }) {
  return (
    <div className="border border-line-light bg-parchment-alt p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center bg-white text-red">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xl font-semibold tracking-tight text-ink">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-black">{label}</div>
    </div>
  );
}

function FillBar({ label, percent }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-semibold text-black">
        <span>{label}</span>
        <span>{formatNumber(percent, 0)}%</span>
      </div>
      <div className="h-2 border border-line-light bg-parchment-alt">
        <div className="h-full bg-red" style={{ width: `${clamp(percent, 0, 100)}%` }} />
      </div>
    </div>
  );
}

function FlowPathVisual({ flow, max, mode }) {
  const width = clamp((flow / max) * 100, 4, 100);
  return (
    <div className="mt-6 border border-line-light bg-parchment-alt p-5">
      <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-black">
        <span>{mode}</span>
        <span>{modeLabel(flow, max)}</span>
      </div>
      <div className="relative h-16 overflow-hidden border border-line-light bg-white">
        <div className="absolute left-4 right-4 top-1/2 h-3 -translate-y-1/2 bg-parchment" />
        <div className="absolute left-4 top-1/2 h-3 -translate-y-1/2 bg-red transition-all duration-300" style={{ width: `calc((100% - 2rem) * ${width / 100})` }} />
        <div className="absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 border border-red bg-white" />
      </div>
    </div>
  );
}

function FlowRateCalculator({ data, limits, productName }) {
  const [rpm, setRpm] = useState(Math.round((limits.minRpm + limits.maxRpm) / 2));
  const [bore, setBore] = useState(0.52);
  const flow = flowAtSpeed({ rpm, limits, bore });
  const summary = buildSummary(data.title, [
    { label: 'Speed', value: `${rpm} rpm` },
    { label: 'Tubing bore', value: BORE_OPTIONS.find((item) => item.value === bore)?.label },
    { label: 'Estimated flow', value: `${formatNumber(flow, 1)} mL/min` },
    { label: 'Mode', value: modeLabel(flow, limits.singleMax) },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Get Configuration Support">
      <Panel>
        <div className="space-y-6">
          <RangeField label="Speed" max={limits.maxRpm} min={limits.minRpm} onChange={setRpm} suffix="rpm" value={rpm} />
          <SegmentControl label="Tubing bore" onChange={setBore} options={BORE_OPTIONS} value={bore} />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric icon={FiDroplet} label="Estimated flow" value={`${formatNumber(flow, 1)} mL/min`} />
          <Metric icon={FiActivity} label="Operating zone" value={modeLabel(flow, limits.singleMax)} />
        </div>
        <FlowPathVisual flow={flow} max={limits.singleMax} mode="Single-channel flow" />
      </ResultPanel>
    </ToolShell>
  );
}

function DosingAccuracyVisualizer({ data, limits, productName }) {
  const [volume, setVolume] = useState(10);
  const [pause, setPause] = useState(30);
  const [retraction, setRetraction] = useState(true);
  const precisionBand = volume * (limits.precision / 100);
  const dripError = retraction ? Math.min(volume * 0.002, 0.02) : Math.min(Math.max(volume * 0.04, 0.03), 0.35);
  const expectedHigh = volume + precisionBand + dripError;
  const expectedLow = Math.max(0, volume - precisionBand);
  const summary = buildSummary(data.title, [
    { label: 'Dose volume', value: `${formatNumber(volume, 3)} mL` },
    { label: 'Pause time', value: `${pause} s` },
    { label: 'Retraction', value: retraction ? 'On' : 'Off' },
    { label: 'Expected range', value: `${formatNumber(expectedLow, 3)} to ${formatNumber(expectedHigh, 3)} mL` },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Talk to Product Expert">
      <Panel>
        <div className="space-y-6">
          <RangeField label="Dosing volume" max={250} min={0.001} onChange={setVolume} step={0.001} suffix="mL" value={volume} />
          <RangeField label="Pause time" max={600} min={0.1} onChange={setPause} step={0.1} suffix="s" value={pause} />
          <ToggleButton checked={retraction} label="Retraction function" offLabel="Drop can remain at tube tip" onChange={setRetraction} onLabel="Brief reverse clears the tip" />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric icon={FiSliders} label="Target dose" value={`${formatNumber(volume, 3)} mL`} />
          <Metric icon={FiRepeat} label="Estimated band" value={`${formatNumber(expectedLow, 3)}-${formatNumber(expectedHigh, 3)} mL`} />
        </div>
        <div className="mt-6 border border-line-light bg-parchment-alt p-5">
          <div className="relative mx-auto h-48 max-w-sm border border-line-light bg-white">
            <div className="absolute left-1/2 top-0 h-24 w-8 -translate-x-1/2 bg-ink" />
            <div className="absolute left-1/2 top-24 h-16 w-2 -translate-x-1/2 bg-red" />
            <div className={`absolute left-1/2 rounded-full bg-red transition-all ${retraction ? 'top-36 h-3 w-3 -translate-x-1/2 opacity-35' : 'top-36 h-9 w-9 -translate-x-1/2 opacity-90'}`} />
            <div className="absolute bottom-4 left-5 right-5 h-9 border border-line-light bg-parchment" />
          </div>
          <p className="mt-4 text-sm leading-6 text-black">
            {retraction
              ? 'Retraction is engaged, so the endpoint drop is minimized before the next dose starts.'
              : 'Retraction is off, so a hanging drop can add visible error to small-volume dosing.'}
          </p>
        </div>
      </ResultPanel>
    </ToolShell>
  );
}

function TurboDrainSimulator({ data, limits, productName }) {
  const [rpm, setRpm] = useState(120);
  const [volume, setVolume] = useState(250);
  const [bore, setBore] = useState(0.52);
  const normalFlow = flowAtSpeed({ rpm, limits, bore });
  const turboFlow = flowAtSpeed({ rpm: limits.maxRpm, limits, bore });
  const normalSeconds = (volume / normalFlow) * 60;
  const turboSeconds = (volume / turboFlow) * 60;
  const saved = Math.max(0, normalSeconds - turboSeconds);
  const summary = buildSummary(data.title, [
    { label: 'Working speed', value: `${rpm} rpm` },
    { label: 'Line volume', value: `${volume} mL` },
    { label: 'Normal drain time', value: timeLabel(normalSeconds) },
    { label: 'Turbo drain time', value: timeLabel(turboSeconds) },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Get Configuration Support">
      <Panel>
        <div className="space-y-6">
          <RangeField label="Working speed" max={limits.maxRpm} min={limits.minRpm} onChange={setRpm} suffix="rpm" value={rpm} />
          <RangeField label="Tube or line volume" max={2000} min={20} onChange={setVolume} suffix="mL" value={volume} />
          <SegmentControl label="Tubing bore" onChange={setBore} options={BORE_OPTIONS} value={bore} />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric icon={FiActivity} label="Working speed drain" value={timeLabel(normalSeconds)} />
          <Metric icon={FiZap} label="Turbo drain" value={timeLabel(turboSeconds)} />
          <Metric icon={FiCheckCircle} label="Time saved" value={timeLabel(saved)} />
        </div>
        <div className="mt-6 space-y-4">
          <FillBar label="Working speed flow" percent={(normalFlow / turboFlow) * 100} />
          <FillBar label="Turbo flow" percent={100} />
        </div>
      </ResultPanel>
    </ToolShell>
  );
}

function SignalMapper({ data, limits, productName }) {
  const [signalType, setSignalType] = useState('voltage');
  const [signal, setSignal] = useState(5);
  const [reverse, setReverse] = useState(false);
  const minSignal = signalType === 'voltage' ? 0 : 4;
  const maxSignal = signalType === 'voltage' ? 10 : 20;
  const percent = ((signal - minSignal) / (maxSignal - minSignal)) * 100;
  const rpm = limits.minRpm + (limits.maxRpm - limits.minRpm) * (percent / 100);
  const summary = buildSummary(data.title, [
    { label: 'Signal type', value: signalType === 'voltage' ? '0 to 10 V' : '4 to 20 mA' },
    { label: 'Signal input', value: `${formatNumber(signal, 1)} ${signalType === 'voltage' ? 'V' : 'mA'}` },
    { label: 'Mapped speed', value: `${formatNumber(rpm, 0)} rpm` },
    { label: 'Direction', value: reverse ? 'Reverse' : 'Forward' },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Talk to Product Expert">
      <Panel>
        <div className="space-y-6">
          <SegmentControl
            label="Signal type"
            onChange={(value) => {
              setSignalType(value);
              setSignal(value === 'voltage' ? 5 : 12);
            }}
            options={[
              { label: '0 to 10 V', value: 'voltage', note: 'Voltage control' },
              { label: '4 to 20 mA', value: 'current', note: 'Current loop' },
            ]}
            value={signalType}
          />
          <RangeField label="Signal input" max={maxSignal} min={minSignal} onChange={setSignal} step={0.1} suffix={signalType === 'voltage' ? 'V' : 'mA'} value={signal} />
          <ToggleButton checked={reverse} label="Direction command" offLabel="Forward rotation" onChange={setReverse} onLabel="Reverse rotation" />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric icon={FiCpu} label="Input level" value={`${formatNumber(percent, 0)}%`} />
          <Metric icon={FiActivity} label="Mapped speed" value={`${formatNumber(rpm, 0)} rpm`} />
          <Metric icon={FiRepeat} label="Direction" value={reverse ? 'Reverse' : 'Forward'} />
        </div>
        <div className="mt-6">
          <FillBar label="Controller command" percent={percent} />
        </div>
      </ResultPanel>
    </ToolShell>
  );
}

function ChannelFlowCalculator({ data, limits, productName }) {
  const [mode, setMode] = useState('single');
  const [channels, setChannels] = useState(4);
  const [rpm, setRpm] = useState(Math.round((limits.minRpm + limits.maxRpm) / 2));
  const [bore, setBore] = useState(0.52);
  const perChannel = flowAtSpeed({ rpm, limits, bore, mode });
  const totalFlow = mode === 'multi' ? perChannel * channels : perChannel;
  const summary = buildSummary(data.title, [
    { label: 'Configuration', value: mode === 'single' ? 'Single-channel' : `${channels}-channel multi` },
    { label: 'Speed', value: `${rpm} rpm` },
    { label: 'Per-channel flow', value: `${formatNumber(perChannel, 2)} mL/min` },
    { label: 'Total flow', value: `${formatNumber(totalFlow, 2)} mL/min` },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Get Configuration Support">
      <Panel>
        <div className="space-y-6">
          <SegmentControl
            label="Configuration"
            onChange={setMode}
            options={[
              { label: 'Single', value: 'single', note: 'One larger flow' },
              { label: 'Multi', value: 'multi', note: 'Parallel channels' },
            ]}
            value={mode}
          />
          {mode === 'multi' ? <RangeField label="Channel count" max={8} min={2} onChange={setChannels} suffix="channels" value={channels} /> : null}
          <RangeField label="Speed" max={limits.maxRpm} min={limits.minRpm} onChange={setRpm} suffix="rpm" value={rpm} />
          <SegmentControl label="Tubing bore" onChange={setBore} options={BORE_OPTIONS} value={bore} />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric icon={FiDroplet} label="Per-channel flow" value={`${formatNumber(perChannel, 2)} mL/min`} />
          <Metric icon={FiBarChart2} label="Total flow" value={`${formatNumber(totalFlow, 2)} mL/min`} />
          <Metric icon={FiActivity} label="Configuration" value={mode === 'single' ? 'Single' : `${channels} ch`} />
        </div>
        <ChannelVisual channels={mode === 'multi' ? channels : 1} fill={(perChannel / (mode === 'multi' ? limits.multiMax : limits.singleMax)) * 100} />
      </ResultPanel>
    </ToolShell>
  );
}

function ChannelVisual({ channels, fill }) {
  return (
    <div className="mt-6 grid gap-2">
      {Array.from({ length: channels }).map((_, index) => (
        <div className="flex items-center gap-3" key={index}>
          <span className="w-12 text-xs font-semibold text-black">Ch {index + 1}</span>
          <div className="h-3 flex-1 border border-line-light bg-parchment-alt">
            <div className="h-full bg-red" style={{ width: `${clamp(fill, 4, 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PumpHeadSelector({ data, productName }) {
  const [flows, setFlows] = useState('one');
  const [flowSize, setFlowSize] = useState('large');
  const [fluid, setFluid] = useState('standard');
  const recommendation = flows === 'many' ? 'Multi-channel head' : flowSize === 'large' ? 'Single-channel high-flow head' : 'Single-channel precision head';
  const accessory = fluid === 'aggressive' ? 'Confirm tubing chemistry before quote' : 'Standard tubing review';
  const summary = buildSummary(data.title, [
    { label: 'Flows needed', value: flows === 'one' ? 'One flow' : 'Several parallel flows' },
    { label: 'Target flow', value: flowSize === 'large' ? 'Larger flow' : 'Smaller precise flow' },
    { label: 'Fluid', value: fluid === 'aggressive' ? 'Aggressive or sensitive' : 'Standard aqueous/solvent' },
    { label: 'Starting point', value: recommendation },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Talk to Product Expert">
      <Panel>
        <div className="space-y-6">
          <SegmentControl
            label="Number of flows"
            onChange={setFlows}
            options={[
              { label: 'One flow', value: 'one', note: 'One process line' },
              { label: 'Several', value: 'many', note: 'Parallel channels' },
            ]}
            value={flows}
          />
          <SegmentControl
            label="Target flow rate"
            onChange={setFlowSize}
            options={[
              { label: 'Larger', value: 'large', note: 'Bulk transfer' },
              { label: 'Smaller', value: 'small', note: 'Precise dosing' },
            ]}
            value={flowSize}
          />
          <SegmentControl
            label="Fluid type"
            onChange={setFluid}
            options={[
              { label: 'Standard', value: 'standard', note: 'Routine media' },
              { label: 'Aggressive', value: 'aggressive', note: 'Chemistry check' },
            ]}
            value={fluid}
          />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric icon={FiCheckCircle} label="Starting head choice" value={recommendation} />
          <Metric icon={FiShield} label="Tubing note" value={accessory} />
        </div>
        <p className="mt-6 border border-line-light bg-parchment-alt p-4 text-sm leading-6 text-black">
          This is a starting configuration only. Inkarp still needs channel count, fluid chemistry, bore, duty cycle, and target flow before confirming the final head and tubing.
        </p>
      </ResultPanel>
    </ToolShell>
  );
}

function ChannelTurboFlowCalculator({ data, limits, productName }) {
  const [turbo, setTurbo] = useState(false);
  const [mode, setMode] = useState('single');
  const [channels, setChannels] = useState(4);
  const [rpm, setRpm] = useState(45);
  const activeRpm = turbo ? limits.maxRpm : rpm;
  const perChannel = flowAtSpeed({ rpm: activeRpm, limits, bore: 0.52, mode });
  const totalFlow = mode === 'multi' ? perChannel * channels : perChannel;
  const summary = buildSummary(data.title, [
    { label: 'Configuration', value: mode === 'single' ? 'Single-channel' : `${channels}-channel multi` },
    { label: 'Turbo', value: turbo ? 'On' : 'Off' },
    { label: 'Active speed', value: `${activeRpm} rpm` },
    { label: 'Total flow', value: `${formatNumber(totalFlow, 2)} mL/min` },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Get Configuration Support">
      <Panel>
        <div className="space-y-6">
          <SegmentControl
            label="Configuration"
            onChange={setMode}
            options={[
              { label: 'Single', value: 'single', note: 'One larger flow' },
              { label: 'Multi', value: 'multi', note: 'Parallel channels' },
            ]}
            value={mode}
          />
          {mode === 'multi' ? <RangeField label="Channel count" max={8} min={2} onChange={setChannels} suffix="channels" value={channels} /> : null}
          <RangeField label="Working speed" max={limits.maxRpm} min={limits.minRpm} onChange={setRpm} suffix="rpm" value={rpm} />
          <ToggleButton checked={turbo} label="Turbo button" offLabel="Working speed" onChange={setTurbo} onLabel="Full-speed drain" />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric icon={FiZap} label="Active speed" value={`${activeRpm} rpm`} />
          <Metric icon={FiDroplet} label="Per-channel flow" value={`${formatNumber(perChannel, 2)} mL/min`} />
          <Metric icon={FiBarChart2} label="Total flow" value={`${formatNumber(totalFlow, 2)} mL/min`} />
        </div>
        <div className="mt-6">
          <FillBar label={turbo ? 'Turbo output' : 'Working output'} percent={(activeRpm / limits.maxRpm) * 100} />
        </div>
      </ResultPanel>
    </ToolShell>
  );
}

function PrecisionCalculator({ data, limits, productName }) {
  const [mode, setMode] = useState('single');
  const [channels, setChannels] = useState(4);
  const [dose, setDose] = useState(10);
  const [pause, setPause] = useState(60);
  const variation = dose * (limits.precision / 100);
  const low = Math.max(0, dose - variation);
  const high = dose + variation;
  const totalDose = mode === 'multi' ? dose * channels : dose;
  const summary = buildSummary(data.title, [
    { label: 'Configuration', value: mode === 'single' ? 'Single-channel' : `${channels}-channel multi` },
    { label: 'Target dose', value: `${formatNumber(dose, 3)} mL` },
    { label: 'Pause time', value: `${pause} s` },
    { label: 'Variation at +/-1%', value: `${formatNumber(low, 3)} to ${formatNumber(high, 3)} mL` },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Get Configuration Support">
      <Panel>
        <div className="space-y-6">
          <SegmentControl
            label="Configuration"
            onChange={setMode}
            options={[
              { label: 'Single', value: 'single', note: 'One precise flow' },
              { label: 'Multi', value: 'multi', note: 'Parallel precise flows' },
            ]}
            value={mode}
          />
          {mode === 'multi' ? <RangeField label="Channel count" max={8} min={2} onChange={setChannels} suffix="channels" value={channels} /> : null}
          <RangeField label="Dosing volume" max={250} min={0.001} onChange={setDose} step={0.001} suffix="mL" value={dose} />
          <RangeField label="Pause time" max={600} min={0.1} onChange={setPause} step={0.1} suffix="s" value={pause} />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric icon={FiSliders} label="Target dose" value={`${formatNumber(dose, 3)} mL`} />
          <Metric icon={FiRepeat} label="Dose variation" value={`+/-${formatNumber(variation, 3)} mL`} />
          <Metric icon={FiBarChart2} label="Total per cycle" value={`${formatNumber(totalDose, 3)} mL`} />
        </div>
        <div className="mt-6 border border-line-light bg-parchment-alt p-5">
          <FillBar label="Lower bound" percent={(low / high) * 100} />
          <p className="mt-4 text-sm leading-6 text-black">
            At +/-{limits.precision}% precision, a {formatNumber(dose, 3)} mL target dose sits around {formatNumber(low, 3)} to {formatNumber(high, 3)} mL per channel before final pump head, tubing, and calibration are confirmed.
          </p>
        </div>
      </ResultPanel>
    </ToolShell>
  );
}

function ClosedHoodSimulator({ data, productName }) {
  const [footSwitch, setFootSwitch] = useState(true);
  const [retraction, setRetraction] = useState(true);
  const status = footSwitch ? 'External start/stop ready' : 'Panel access needed';
  const doseState = retraction ? 'Endpoint drip minimized' : 'Drop may remain at tip';
  const summary = buildSummary(data.title, [
    { label: 'Foot switch', value: footSwitch ? 'On' : 'Off' },
    { label: 'Retraction', value: retraction ? 'On' : 'Off' },
    { label: 'Operation', value: status },
    { label: 'Dose endpoint', value: doseState },
  ]);

  return (
    <ToolShell data={data} productName={productName} summary={summary} triggerLabel="Talk to Product Expert">
      <Panel>
        <div className="space-y-4">
          <ToggleButton checked={footSwitch} label="Foot switch" offLabel="Manual panel start/stop" onChange={setFootSwitch} onLabel="Start/stop outside hood" />
          <ToggleButton checked={retraction} label="Retraction function" offLabel="Simple transfer endpoint" onChange={setRetraction} onLabel="Small-dose endpoint control" />
        </div>
      </Panel>
      <ResultPanel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric icon={FiShield} label="Hood workflow" value={status} />
          <Metric icon={FiDroplet} label="Dose endpoint" value={doseState} />
        </div>
        <div className="mt-6 border border-line-light bg-parchment-alt p-5">
          <div className="relative h-56 overflow-hidden border border-line-light bg-white">
            <div className="absolute inset-x-8 top-5 bottom-7 border-2 border-ink/30 bg-parchment-alt" />
            <div className="absolute inset-x-14 top-10 bottom-12 border border-line-light bg-white" />
            <div className="absolute left-20 top-20 h-16 w-24 border border-ink bg-parchment" />
            <div className="absolute left-28 top-24 h-3 w-8 bg-red" />
            <div className={`absolute left-36 top-28 rounded-full bg-red transition-all ${retraction ? 'h-2 w-2 opacity-40' : 'h-6 w-6 opacity-90'}`} />
            <div className={`absolute bottom-4 right-10 h-10 w-24 border text-center text-xs font-semibold leading-10 transition ${
              footSwitch ? 'border-red bg-red text-white' : 'border-line-light bg-white text-black'
            }`}>
              Foot switch
            </div>
            <div className={`absolute bottom-14 right-20 h-16 w-1 transition ${footSwitch ? 'bg-red' : 'bg-line-light'}`} />
          </div>
        </div>
      </ResultPanel>
    </ToolShell>
  );
}

export default function PeristalticPumpInteractive({ data, productName }) {
  const limits = useMemo(() => PRODUCT_LIMITS[productName] ?? PRODUCT_LIMITS['Hei-FLOW Ultimate 600 Single Channel Peristaltic Pump'], [productName]);

  switch (data?.sectionId) {
    case 'flow-rate-calculator':
      return <FlowRateCalculator data={data} limits={limits} productName={productName} />;
    case 'dosing-accuracy-visualiser':
      return <DosingAccuracyVisualizer data={data} limits={limits} productName={productName} />;
    case 'turbo-drain-simulator':
      return <TurboDrainSimulator data={data} limits={limits} productName={productName} />;
    case 'analogue-signal-mapper':
    case 'analogue-control-mapper':
      return <SignalMapper data={data} limits={limits} productName={productName} />;
    case 'channel-configuration-flow-calculator':
      return <ChannelFlowCalculator data={data} limits={limits} productName={productName} />;
    case 'pump-head-selector':
      return <PumpHeadSelector data={data} productName={productName} />;
    case 'channel-and-turbo-flow-calculator':
      return <ChannelTurboFlowCalculator data={data} limits={limits} productName={productName} />;
    case 'channel-and-dosing-precision-calculator':
      return <PrecisionCalculator data={data} limits={limits} productName={productName} />;
    case 'closed-hood-operation-simulator':
      return <ClosedHoodSimulator data={data} productName={productName} />;
    default:
      return null;
  }
}
