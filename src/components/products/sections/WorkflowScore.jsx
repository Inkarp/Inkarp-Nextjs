'use client';

export default function WorkflowScore({ data }) {
  const steps = data?.steps ?? [];
  if (!steps.length) return null;

  return (
    <section id="workflow-score" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Workflow fit</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">
          {data?.title ?? 'How the Hei-VAP Core simplifies your workflow'}
        </h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Side-by-side comparison of a manual evaporation workflow versus working with the Hei-VAP Core.
        </p>

        {/* Header */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_1fr] gap-0 mb-2 px-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Parameter</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Manual / basic</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#BE0010]">With Hei-VAP Core</span>
        </div>

        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={s.label} className={`grid gap-2 rounded-xl p-4 sm:grid-cols-[1fr_1fr_1fr] ${i % 2 === 0 ? 'bg-[#F6F6F6]' : 'bg-white border border-zinc-100'}`}>
              <div className="font-semibold text-sm text-zinc-900">{s.label}</div>
              <div className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-zinc-300" />
                {s.manual}
              </div>
              <div className="flex items-start gap-2 text-sm text-zinc-900">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#BE0010]" />
                {s.core}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <a href="/contact-us" className="rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
            Discuss your workflow with Inkarp →
          </a>
        </div>
      </div>
    </section>
  );
}
