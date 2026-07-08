'use client';
import { useMemo, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

function getResult(results, score) {
  return results.find((item) => score >= item.min && score <= item.max) ?? results[results.length - 1];
}

function cleanText(value = '') {
  return String(value)
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/\u00e2\u20ac\u2122/g, "'");
}

function ScoreRing({ percent }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative size-32 shrink-0">
      <svg className="size-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle className="dark:stroke-zinc-800" cx="60" cy="60" fill="none" r={radius} stroke="#ECECEC" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="#161616"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tracking-tight text-ink dark:text-zinc-100">
        {percent}%
      </div>
    </div>
  );
}

export default function FitQuiz({ data }) {
  const { questions = [], results = [], title } = data ?? {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const score = answers.reduce((sum, item) => sum + item.points, 0);
  const maxScore = total * 3;
  const scorePercent = maxScore ? Math.round((score / maxScore) * 100) : 0;
  const progressPercent = submitted ? 100 : total ? Math.round((currentIndex / total) * 100) : 0;

  const result = useMemo(() => (submitted && results.length ? getResult(results, score) : null), [results, score, submitted]);

  if (!total || !currentQuestion) return null;

  const answerQuestion = (option) => {
    const nextAnswers = [...answers.slice(0, currentIndex), option];
    setAnswers(nextAnswers);

    if (currentIndex >= total - 1) {
      setSubmitted(true);
      window.dispatchEvent(new CustomEvent('product-quiz-complete'));
      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  const reset = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setSubmitted(false);
  };

  return (
    <section id="quiz" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="12"
          eyebrow="Interactive - 60-second quiz"
          title={title?.replace('right for your lab', 'right for you') ?? 'Is the Hei-VAP Core right for you?'}
          description="Five quick questions for a fit score and a recommendation. (A faster, lighter version of the suitability checker above.)"
        />

        <div className="mt-8 rounded-2xl border border-line-light bg-parchment px-5 py-8 shadow-sm sm:px-9 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="h-1 overflow-hidden rounded-full bg-parchment-alt dark:bg-zinc-800">
            <div className="h-full rounded-full bg-navy dark:bg-zinc-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>

          {!submitted ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-ink dark:text-zinc-100">Question {currentIndex + 1} of {total}</p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-ink dark:text-zinc-100">{cleanText(currentQuestion.text)}</h3>
                <p className="mt-4 text-sm text-black dark:text-zinc-400">Pick the answer closest to your lab today.</p>
              </div>

              <div className="space-y-3">
                {(currentQuestion.options ?? []).map((option) => (
                  <button
                    className="flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border border-line-light bg-parchment px-5 py-3 text-left text-base font-medium text-black transition hover:border-red hover:bg-red/[0.03] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    key={option.text}
                    onClick={() => answerQuestion(option)}
                    type="button"
                  >
                    <span>{cleanText(option.text)}</span>
                    <FiArrowRight className="shrink-0 text-black dark:text-zinc-100" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-2xl text-center">
              <ScoreRing percent={scorePercent} />
              <h3 className="mt-7 text-2xl font-semibold tracking-tight text-ink dark:text-zinc-100">{cleanText(result?.title ?? 'Recommendation ready')}</h3>
              <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-black dark:text-zinc-400">
                {cleanText(result?.body ?? 'Your answers have been scored. Talk to Inkarp to confirm the best configuration for your workflow.')}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a className="inline-flex h-12 items-center justify-center rounded-full bg-red px-8 text-sm font-bold text-parchment transition hover:bg-[#9f000d]" href="#booking">
                  Get my recommendation
                </a>
                <button
                  className="inline-flex h-12 items-center justify-center rounded-full border border-line-light bg-parchment px-7 text-sm font-semibold text-black transition hover:border-zinc-300 hover:text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
                  onClick={reset}
                  type="button"
                >
                  Retake quiz
                </button>
              </div>
            </div>
          )}
        </div>

        <SectionDisclaimer>
          {data?.disclaimer ?? 'This quiz produces an indicative fit score for guidance and discussion only - it is not a formal recommendation. Inkarp will confirm the best model for your needs.'}
        </SectionDisclaimer>
      </div>
    </section>
  );
}
