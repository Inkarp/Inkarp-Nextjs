'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { FiFilter, FiGitBranch, FiHeadphones, FiSearch } from 'react-icons/fi';
import { HOW_TO_FIND_STEPS } from './catalogCopy';

const STEP_DURATION = 4000; // ms per step, as in the product pages' workflow section
const STEP_ICONS = { '01': FiSearch, '02': FiGitBranch, '03': FiFilter, '04': FiHeadphones };

/**
 * The four ways to find an instrument, run like the workflow section on the
 * product pages (EvaporationWorkflow): one step at a time lights up, a red bar
 * fills across it, the line to the next step fills red as it passes, and then
 * the next step takes over. Clicking a step jumps to it. It waits while the
 * hero is off screen; reduced motion keeps every step still.
 */
const REDUCE = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (onChange) => {
  const query = window.matchMedia(REDUCE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

export default function HowToFindSteps() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  // Server and first paint: moving; corrected after hydration if the viewer asks for less motion.
  const still = useSyncExternalStore(subscribeMotion, () => window.matchMedia(REDUCE).matches, () => false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Each step gets its full time, whether it was reached on its own or clicked.
  useEffect(() => {
    if (!visible || still) return undefined;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % HOW_TO_FIND_STEPS.length), STEP_DURATION);
    return () => window.clearTimeout(timer);
  }, [active, visible, still]);

  const running = visible && !still;

  return (
    <ol className="grid gap-2" ref={ref}>
      {HOW_TO_FIND_STEPS.map((step, index) => {
        const isActive = !still && index === active;
        const isPast = !still && index < active;
        const Icon = STEP_ICONS[step.num];
        const last = index === HOW_TO_FIND_STEPS.length - 1;

        return (
          <li className="relative" key={step.num}>
            {/* The line down to the next step's icon: grey, filling red once
                this step is done. */}
            {!last ? (
              <span aria-hidden="true" className="absolute -bottom-[21px] left-[34px] top-[49px] z-10 w-px overflow-hidden bg-line-light">
                <span
                  className={`block h-full w-full origin-top bg-red transition-transform duration-500 ease-out ${
                    isPast ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />
              </span>
            ) : null}

            <button
              aria-pressed={isActive}
              className={`relative flex w-full items-start gap-4 border px-4 py-3 text-left transition-all duration-300 ${
                isActive
                  ? 'border-red bg-white shadow-[0_14px_36px_rgba(190,0,16,0.12)]'
                  : 'border-line-light bg-white hover:border-red/40'
              }`}
              onClick={() => setActive(index)}
              type="button"
            >
              {/* Fills across the step while it is the active one. */}
              {isActive && running ? (
                <span aria-hidden="true" className="absolute -left-px -right-px -top-px h-[3px] overflow-hidden bg-red/15">
                  <span
                    className="block h-full bg-red"
                    key={`progress-${active}`}
                    style={{ animation: `hvc-progress-fill ${STEP_DURATION}ms linear forwards` }}
                  />
                </span>
              ) : null}

              <span
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center transition-colors duration-300 ${
                  isActive || still ? 'bg-red text-white' : isPast ? 'bg-red/10 text-red' : 'bg-parchment-alt text-ink-soft'
                }`}
              >
                <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className={`text-sm font-semibold tracking-tight transition-colors ${isActive || still ? 'text-ink' : 'text-ink-soft'}`}>
                    {step.title}
                  </span>
                  <span className={`text-xs font-bold tabular-nums transition-colors ${isActive ? 'text-red' : 'text-ink-soft'}`}>
                    {isActive ? 'Active' : step.num}
                  </span>
                </span>
                <span className={`mt-1 block text-sm leading-snug transition-colors ${isActive ? 'text-black' : 'text-ink-soft'}`}>
                  {step.description}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
