'use client';
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { collectTracking } from '@/lib/browserTracking';

export default function LeadCaptureForm({
  className = '',
  formType,
  productName,
  startExpanded = false,
  submitLabel,
  successMessage,
  summary,
  triggerLabel,
}) {
  const [expanded, setExpanded] = useState(startExpanded);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!contact.name.trim() || !contact.email.trim()) return;

    setSubmitState('sending');
    setSubmitError('');

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType,
          name: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          productName,
          productUrl: typeof window !== 'undefined' ? window.location.href : '',
          configuration: summary,
          ...collectTracking(),
        }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        throw new Error(json?.message || 'Could not send this. Please try again.');
      }

      setSubmitState('sent');
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error.message);
    }
  };

  if (submitState === 'sent') {
    return (
      <div className={`border border-line-light bg-parchment-alt p-4 text-sm leading-6 text-black ${className}`}>
        {typeof successMessage === 'function'
          ? successMessage(contact.name)
          : successMessage ??
            `Thank you${contact.name ? `, ${contact.name}` : ''}. We have received your details and will get back to you shortly.`}
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        className={`inline-flex h-11 items-center justify-center gap-2 bg-rose-50 px-6 text-sm font-bold text-rose-700 transition hover:bg-rose-100 ${className}`}
        onClick={() => setExpanded(true)}
        type="button"
      >
        {triggerLabel}
        <FiArrowRight />
      </button>
    );
  }

  return (
    <form className={`space-y-3 ${className}`} onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className="h-11 border border-line-light bg-white px-3 text-sm text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/20"
          onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))}
          placeholder="Your name"
          required
          type="text"
          value={contact.name}
        />
        <input
          className="h-11 border border-line-light bg-white px-3 text-sm text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/20"
          onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email address"
          required
          type="email"
          value={contact.email}
        />
        <input
          className="h-11 border border-line-light bg-white px-3 text-sm text-ink outline-none focus:border-red focus:ring-2 focus:ring-red/20"
          onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))}
          placeholder="Phone (optional)"
          type="tel"
          value={contact.phone}
        />
      </div>

      {submitState === 'error' ? <p className="text-sm font-semibold text-red">{submitError}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="inline-flex h-11 items-center justify-center gap-2 bg-rose-50 px-6 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitState === 'sending'}
          type="submit"
        >
          {submitState === 'sending' ? 'Sending...' : submitLabel ?? triggerLabel}
          <FiArrowRight />
        </button>
        {!startExpanded ? (
          <button
            className="text-sm font-semibold text-ink-soft transition hover:text-red"
            onClick={() => setExpanded(false)}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
