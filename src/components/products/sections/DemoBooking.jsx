'use client';
import { useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';

const EXTRA_FIELDS = [
  { key: 'designation', label: 'Designation', type: 'text', required: false },
  { key: 'department', label: 'Department', type: 'text', required: false },
  {
    key: 'industry',
    label: 'Industry',
    type: 'select',
    required: false,
    options: ['Pharmaceuticals', 'Chemical research', 'Academic / teaching', 'Food & beverage', 'Environmental', 'Biotech / life sciences', 'Other'],
  },
  { key: 'state', label: 'State', type: 'text', required: false },
];

const WHY_ITEMS = [
  { title: 'See it with your solvents', body: 'Discuss real distillation conditions, evaporation rate and recovery expectations for your samples.' },
  { title: 'Get the right package', body: 'Confirm glassware set, vacuum pump, chiller, coating and Woulff bottle requirements.' },
  { title: 'Safety and training built in', body: 'Review safe operation, glassware handling, bath setup and consistent results.' },
  { title: 'Reach us directly', body: '+91 40 2717 2293 - info@inkarp.com - Mon-Sat, 9am-6pm IST' },
];

export default function DemoBooking({ data }) {
  const { fields = [], submitLabel, successMessage, eyebrow, title, description } = data ?? {};
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const enhancedFields = useMemo(() => {
    const keys = new Set(fields.map((field) => field.key));
    return [...fields, ...EXTRA_FIELDS.filter((field) => !keys.has(field.key))];
  }, [fields]);

  const set = (key, val) => {
    setError('');
    setForm((current) => ({ ...current, [key]: val }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formEl = event.currentTarget;

    if (!formEl.checkValidity()) {
      setError('Please fill all required fields with valid details before submitting.');
      formEl.reportValidity();
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
    window.dispatchEvent(new CustomEvent('product-demo-submitted'));
  };

  const visibleFields = enhancedFields.filter((field) => field.type !== 'textarea');
  const textareaFields = enhancedFields.filter((field) => field.type === 'textarea');

  return (
    <section id="booking" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="19"
          eyebrow={eyebrow ?? 'Book a demo'}
          title={title ?? 'See it in action'}
          description={description}
        />

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center py-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-maxot mb-2 text-xl text-zinc-950">Enquiry sent!</h3>
                <p className="max-w-md text-sm leading-6 text-zinc-600">
                  {successMessage ?? 'An Inkarp specialist will call you back shortly. You can also browse the FAQ while we review your request.'}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button className="text-sm font-semibold text-[#BE0010] hover:underline" onClick={() => { setSubmitted(false); setForm({}); }} type="button">
                    Send another enquiry
                  </button>
                  <a className="text-sm font-semibold text-[#BE0010] hover:underline" href="#faq">Browse FAQ</a>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit}>
                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  {visibleFields.map((field) => (
                    <div className={['message', 'notes'].includes(field.key) ? 'sm:col-span-2' : ''} key={field.key}>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {field.label}{field.required && <span className="ml-0.5 text-[#BE0010]">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                          onChange={(e) => set(field.key, e.target.value)}
                          required={field.required}
                          value={form[field.key] ?? ''}
                        >
                          <option value="">Select...</option>
                          {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                          onChange={(e) => set(field.key, e.target.value)}
                          placeholder={field.label}
                          required={field.required}
                          type={field.type}
                          value={form[field.key] ?? ''}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {textareaFields.map((field) => (
                  <div className="mb-4" key={field.key}>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{field.label}</label>
                    <textarea
                      className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder="Solvents used, sample volume, lift preference, glassware needs..."
                      rows={4}
                      value={form[field.key] ?? ''}
                    />
                  </div>
                ))}

                {error ? (
                  <div className="mb-4 rounded-lg border border-[#BE0010]/20 bg-[#BE0010]/5 px-4 py-3 text-xs font-semibold text-[#BE0010]">
                    {error}
                  </div>
                ) : null}

                <button className="w-full rounded-xl bg-[#BE0010] py-3.5 text-sm font-semibold text-white transition hover:bg-[#9f000d] disabled:opacity-60" disabled={loading} type="submit">
                  {loading ? 'Sending...' : (submitLabel ?? 'Request demo - we will call you back')}
                </button>
                <p className="mt-3 text-center text-xs text-zinc-400">
                  Your information is handled in accordance with our privacy policy. No spam.
                </p>
              </form>
            )}
          </div>

          <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="font-maxot text-xl text-zinc-950">Why book a demo?</h3>
            <div className="mt-5 divide-y divide-zinc-100">
              {WHY_ITEMS.map((item) => (
                <div className="flex gap-3 py-4 first:pt-0 last:pb-0" key={item.title}>
                  <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#BE0010]/15 bg-[#BE0010]/5 text-sm font-bold text-[#BE0010]">i</div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{item.title}</div>
                    <div className="mt-1 text-xs leading-5 text-zinc-500">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
