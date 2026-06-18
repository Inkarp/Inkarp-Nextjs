'use client';
import { useState } from 'react';

function getResult(results, score) {
  return results.find((r) => score >= r.min && score <= r.max) ?? results[results.length - 1];
}

const VERDICT_COLORS = {
  strong: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  good: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  partial: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
};

export default function FitQuiz({ data }) {
  const { questions = [], results = [], eyebrow, title, description } = data ?? {};
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const total = questions.length;
  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const result = submitted ? getResult(results, score) : null;
  const colors = result ? (VERDICT_COLORS[result.verdict] ?? VERDICT_COLORS.good) : null;

  const answer = (qi, points) => {
    setAnswers((a) => ({ ...a, [qi]: points }));
    setSubmitted(false);
  };

  const reset = () => { setAnswers({}); setSubmitted(false); };

  return (
    <section id="quiz" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">{eyebrow ?? 'Fit quiz'}</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">{title ?? 'Is this right for your lab?'}</h2>
        {description && <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">{description}</p>}

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
            <span>{answered} / {total} answered</span>
            <span>{Math.round((answered / total) * 100)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div className="h-2 rounded-full bg-[#BE0010] transition-all duration-300" style={{ width: `${(answered / total) * 100}%` }} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Questions */}
          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="font-semibold text-sm text-zinc-900 mb-3">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#BE0010] text-white text-xs font-bold mr-2">{qi + 1}</span>
                  {q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => answer(qi, opt.points)}
                      className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                        answers[qi] === opt.points
                          ? 'border-[#BE0010] bg-[#BE0010]/5 font-semibold text-[#BE0010]'
                          : 'border-zinc-200 text-zinc-700 hover:border-[#BE0010]/40 hover:bg-zinc-50'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              disabled={answered < total}
              onClick={() => setSubmitted(true)}
              className="w-full rounded-xl bg-[#BE0010] py-3 text-sm font-semibold text-white transition hover:bg-[#9f000d] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Get my recommendation →
            </button>
          </div>

          {/* Result */}
          <div className="flex flex-col justify-start pt-0 lg:pt-0">
            {result ? (
              <div className={`rounded-2xl border-2 p-6 shadow-sm ${colors.bg} ${colors.border}`}>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
                  {result.verdict === 'strong' ? '★ Strong fit' : result.verdict === 'good' ? '✓ Good fit' : '⚠ Partial fit'}
                </span>
                <h3 className="font-maxot text-xl text-zinc-950 mt-3 mb-3">{result.title}</h3>
                <p className="text-sm leading-7 text-zinc-600 mb-4">{result.body}</p>
                {result.next && (
                  <p className="text-sm font-semibold text-zinc-700 mb-5">
                    → {result.next}
                  </p>
                )}
                <div className="flex gap-3">
                  <a href="/contact-us" className="rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
                    Talk to Inkarp
                  </a>
                  <button onClick={reset} className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition">
                    Retake quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-5xl mb-4">🧪</div>
                <p className="font-maxot text-zinc-400">Answer all questions to get your personalised recommendation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
