'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from './SectionHeader';
import { collectTracking } from '@/lib/browserTracking';
import { normaliseGstin, validateProductEnquiry } from '@/lib/formValidation';
import { workflowIndustries } from '@/data/homeShowcase';

const DEFAULT_WHY_ITEMS = [
  { title: 'See it with your solvents', body: 'Discuss real distillation conditions, evaporation rate and recovery expectations for your samples.' },
  { title: 'Get the right package', body: 'Confirm glassware set, vacuum pump, chiller, coating and Woulff bottle requirements.' },
  { title: 'Safety and training built in', body: 'Review safe operation, glassware handling, bath setup and consistent results.' },
  { title: 'Reach us directly', body: '+91 40 2717 2293 - info@inkarp.com - Mon-Sat, 9am-6pm IST' },
];

// Every field is required; the enquiry is only useful to sales when complete.
const FIELDS = [
  { key: 'firstName', label: 'First Name', type: 'text', autoComplete: 'given-name' },
  { key: 'lastName', label: 'Last Name', type: 'text', autoComplete: 'family-name' },
  { key: 'designation', label: 'Designation', type: 'text', autoComplete: 'organization-title' },
  { key: 'department', label: 'Department', type: 'text' },
  { key: 'companyName', label: 'Company Name', type: 'text', autoComplete: 'organization' },
  // Taken from the page the form sits on, so it is shown but not editable.
  { key: 'productName', label: 'Product Name', type: 'text', readOnly: true },
  { key: 'gstNumber', label: 'GST Number', type: 'text', placeholder: '27AAPFU0939F1ZV', maxLength: 15, uppercase: true },
  { key: 'industry', label: 'Industry', type: 'select' },
  { key: 'state', label: 'State', type: 'text', autoComplete: 'address-level1' },
  { key: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'name@company.com' },
  { key: 'contact', label: 'Contact', type: 'tel', autoComplete: 'tel', placeholder: '9876543210', maxLength: 15 },
];

const INDUSTRY_OPTIONS = workflowIndustries.map((item) => item.industry);

const INPUT_BASE =
  'w-full border bg-parchment-alt px-3 py-2.5 text-sm text-black transition focus:outline-none focus:ring-2';
const INPUT_OK = 'border-line-light focus:border-rose-400 focus:ring-rose-200';
const INPUT_BAD = 'border-red bg-red/5 focus:border-red focus:ring-red/20';
const INPUT_LOCKED = 'border-line-light bg-line-light/40 text-ink-soft cursor-not-allowed';

export default function DemoBooking({ data, productName }) {
  const { submitLabel, successMessage, eyebrow, title, description, whyItems } = data ?? {};
  const whyHeading = data?.whyHeading ?? 'Why request a quote?';
  const items = whyItems?.length ? whyItems : DEFAULT_WHY_ITEMS;

  const [form, setForm] = useState({ productName: productName ?? '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef(null);

  // Keep the prefilled product in step with the page the form sits on.
  useEffect(() => {
    setForm((current) => ({ ...current, productName: current.productName || (productName ?? '') }));
  }, [productName]);

  const liveErrors = useMemo(() => validateProductEnquiry(form), [form]);

  const set = (key, raw) => {
    const value = key === 'gstNumber' ? normaliseGstin(raw) : raw;
    setError('');
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const blur = (key) => setTouched((current) => ({ ...current, [key]: true }));

  const showError = (key) => (touched[key] || errors[key]) && liveErrors[key];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.keys(liveErrors).length) {
      setErrors(liveErrors);
      setTouched(Object.fromEntries(FIELDS.map((f) => [f.key, true])));
      setError('Please correct the highlighted fields before submitting.');
      errorRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'demo-booking', ...form, ...collectTracking() }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        // Surface per-field problems the server caught but the browser did not.
        if (result?.errors && typeof result.errors === 'object') {
          setErrors(result.errors);
          setTouched(Object.fromEntries(FIELDS.map((f) => [f.key, true])));
        }
        setError(result?.message || 'Something went wrong. Please try again.');
        errorRef.current?.focus();
        return;
      }

      setSubmitted(true);
      window.dispatchEvent(new CustomEvent('product-demo-submitted'));
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
      errorRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ productName: productName ?? '' });
    setErrors({});
    setTouched({});
    setError('');
  };

  return (
    <section id="booking" className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px]">
        <SectionHeader
          number="19"
          eyebrow={eyebrow ?? 'Request a quote'}
          title={title ?? 'Request a quote'}
          description={description}
        />

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
          <div className="border border-line-light bg-parchment p-6">
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center py-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center bg-emerald-100">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold tracking-tight text-ink">Quote request sent!</h3>
                <p className="max-w-md text-sm leading-6 text-black">
                  {successMessage ?? 'An Inkarp specialist will get back to you with pricing and availability shortly. You can also browse the FAQ while we review your request.'}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button className="text-sm font-semibold text-ink underline hover:text-rose-700" onClick={reset} type="button">
                    Send another request
                  </button>
                  <a className="text-sm font-semibold text-ink underline hover:text-rose-700" href="#faq">Browse FAQ</a>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit}>
                <p className="mb-4 text-xs text-ink-soft">
                  All fields are required.
                </p>

                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  {FIELDS.map((field) => {
                    const invalid = Boolean(showError(field.key));
                    const describedBy = invalid ? `${field.key}-error` : undefined;

                    return (
                      <div className={field.full ? 'sm:col-span-2' : ''} key={field.key}>
                        <label
                          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black"
                          htmlFor={`booking-${field.key}`}
                        >
                          {field.label}
                          {field.readOnly ? null : (
                            <span aria-hidden="true" className="ml-0.5 text-red">*</span>
                          )}
                        </label>

                        {field.type === 'select' ? (
                          <select
                            aria-describedby={describedBy}
                            aria-invalid={invalid}
                            className={`${INPUT_BASE} ${invalid ? INPUT_BAD : INPUT_OK}`}
                            id={`booking-${field.key}`}
                            name={field.key}
                            onBlur={() => blur(field.key)}
                            onChange={(e) => set(field.key, e.target.value)}
                            value={form[field.key] ?? ''}
                          >
                            <option value="">Select an industry...</option>
                            {INDUSTRY_OPTIONS.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            aria-describedby={describedBy}
                            aria-invalid={invalid}
                            aria-readonly={field.readOnly || undefined}
                            autoComplete={field.autoComplete}
                            className={`${INPUT_BASE} ${
                              field.readOnly ? INPUT_LOCKED : invalid ? INPUT_BAD : INPUT_OK
                            } placeholder:text-ink-soft ${field.uppercase ? 'uppercase' : ''}`}
                            id={`booking-${field.key}`}
                            maxLength={field.maxLength}
                            name={field.key}
                            onBlur={field.readOnly ? undefined : () => blur(field.key)}
                            onChange={field.readOnly ? undefined : (e) => set(field.key, e.target.value)}
                            placeholder={field.readOnly ? undefined : (field.placeholder ?? field.label)}
                            readOnly={field.readOnly}
                            tabIndex={field.readOnly ? -1 : undefined}
                            type={field.type}
                            value={form[field.key] ?? ''}
                          />
                        )}

                        {invalid ? (
                          <p className="mt-1 text-[11px] font-semibold text-red" id={`${field.key}-error`}>
                            {liveErrors[field.key]}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div aria-live="polite" ref={errorRef} tabIndex={-1}>
                  {error ? (
                    <div className="mb-4 border border-red/20 bg-red/5 px-4 py-3 text-xs font-semibold text-red">
                      {error}
                    </div>
                  ) : null}
                </div>

                <button
                  className="w-full border border-rose-200 bg-rose-50 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? 'Sending...' : (submitLabel ?? 'Request Quote - we will call you back')}
                </button>
              </form>
            )}
          </div>

          <div className="border border-line-light bg-parchment p-6">
            <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink">{whyHeading}</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-black">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
