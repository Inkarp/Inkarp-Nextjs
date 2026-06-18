'use client';
import { useState } from 'react';

export default function DemoBooking({ data }) {
  const { fields = [], submitLabel, successMessage, eyebrow, title, description } = data ?? {};
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="booking" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          {/* Left */}
          <div>
            <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">{eyebrow ?? 'Book a demo'}</p>
            <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">{title ?? 'See it in action'}</h2>
            {description && <p className="mt-4 text-sm leading-7 text-zinc-600">{description}</p>}

            <div className="mt-8 space-y-4">
              {[
                { title: 'Why book a demo?', body: 'A demo lets your team see the control concept, review glassware choices and discuss your solvent-specific workflow.' },
                { title: 'What Inkarp will confirm', body: 'Lift type, glassware, coating, vacuum pump, chiller, Woulff bottle, installation needs and current pricing.' },
                { title: 'What to prepare', body: 'Solvents, batch volume, batches per week, recovery goals, space constraints and safety expectations.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#BE0010] text-white text-xs">✓</div>
                  <div>
                    <div className="font-semibold text-sm text-zinc-900">{item.title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-maxot text-xl text-zinc-950 mb-2">Enquiry sent!</h3>
                <p className="text-sm text-zinc-600">{successMessage ?? 'Inkarp will be in touch within 1 business day.'}</p>
                <button onClick={() => { setSubmitted(false); setForm({}); }} className="mt-5 text-sm font-semibold text-[#BE0010] hover:underline">
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  {fields.map((field) => {
                    if (field.type === 'textarea') return null;
                    return (
                      <div key={field.key} className={field.key === 'message' ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                          {field.label}{field.required && <span className="text-[#BE0010] ml-0.5">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            required={field.required}
                            value={form[field.key] ?? ''}
                            onChange={(e) => set(field.key, e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                          >
                            <option value="">Select…</option>
                            {(field.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            required={field.required}
                            value={form[field.key] ?? ''}
                            onChange={(e) => set(field.key, e.target.value)}
                            placeholder={field.label}
                            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Textarea separately */}
                {fields.filter((f) => f.type === 'textarea').map((field) => (
                  <div key={field.key} className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">{field.label}</label>
                    <textarea
                      rows={3}
                      value={form[field.key] ?? ''}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.label}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20 resize-none"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#BE0010] py-3.5 text-sm font-semibold text-white transition hover:bg-[#9f000d] disabled:opacity-60"
                >
                  {loading ? 'Sending…' : (submitLabel ?? 'Send enquiry')}
                </button>
                <p className="mt-3 text-xs text-zinc-400 text-center">
                  Your information is handled in accordance with our privacy policy. No spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
