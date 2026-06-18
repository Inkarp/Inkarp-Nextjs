'use client';
import { useState } from 'react';

export default function ConfigWizard({ data }) {
  const steps = data?.steps ?? [];
  const result = data?.result ?? {};
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [done, setDone] = useState(false);

  const current = steps[step];
  const select = (val) => {
    const next = { ...selections, [current.key]: val };
    setSelections(next);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => { setStep(0); setSelections({}); setDone(false); };

  const LABELS = {
    lift: 'Lift type', glassware: 'Glassware', coating: 'Coating', vacuum: 'Vacuum pump', chiller: 'Chiller',
  };

  return (
    <section id="config" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Configuration wizard</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Build your ideal Hei-VAP Core setup</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Answer 5 quick questions and get a recommended configuration you can quote from Inkarp.
        </p>

        {/* Progress */}
        <div className="mb-8 flex gap-2 items-center">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full transition ${i < step || done ? 'bg-[#BE0010]' : i === step && !done ? 'bg-[#BE0010] ring-4 ring-[#BE0010]/20' : 'bg-zinc-200'}`} />
              {i < steps.length - 1 && <div className={`h-px w-6 ${i < step ? 'bg-[#BE0010]' : 'bg-zinc-200'}`} />}
            </div>
          ))}
          <span className="ml-3 text-xs text-zinc-400">{done ? 'Complete' : `Step ${step + 1} of ${steps.length}`}</span>
        </div>

        {!done ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm max-w-2xl">
            <h3 className="font-maxot text-xl text-zinc-950 mb-6">{current?.question}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {(current?.options ?? []).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => select(opt.val)}
                  className="flex flex-col items-start rounded-xl border-2 border-zinc-200 bg-white p-4 text-left transition hover:border-[#BE0010] hover:shadow-md"
                >
                  <span className="font-semibold text-sm text-zinc-950">{opt.label}</span>
                  {opt.desc && <span className="mt-1 text-xs text-zinc-500">{opt.desc}</span>}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="mt-5 text-xs text-zinc-400 hover:text-zinc-700">
                ← Back
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-[#BE0010]/30 bg-white p-8 shadow-sm max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">✓ Configuration ready</div>
            <h3 className="font-maxot text-xl text-zinc-950 mt-3 mb-5">{result.title}</h3>

            <div className="space-y-2 mb-6">
              {Object.entries(selections).map(([key, val]) => {
                const stepDef = steps.find((s) => s.key === key);
                const optDef = stepDef?.options.find((o) => o.val === val);
                return (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{LABELS[key] ?? key}</span>
                    <span className="font-semibold text-sm text-zinc-900">{optDef?.label ?? val}</span>
                  </div>
                );
              })}
            </div>

            {result.ctaNote && <p className="text-xs text-zinc-500 mb-4">{result.ctaNote}</p>}
            <div className="flex gap-3">
              <a href="/contact-us" className="rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
                {result.ctaLabel ?? 'Request quote'}
              </a>
              <button onClick={reset} className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition">
                Start again
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
