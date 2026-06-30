'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiCpu, FiMessageCircle, FiX } from 'react-icons/fi';

/* ════════════════════════════════════════════════════════
   POPUP DEFINITIONS
   ════════════════════════════════════════════════════════ */

const NUDGE_TABS = new Set(['features', 'applications', 'specs']);

const POPUPS = {
  /* 3. Welcome segmentation — 4 s after page load, bypasses cooldown */
  welcome: {
    ovId: 'welcome-overlay',
    title: 'What are you exploring for?',
    body: 'Choose a focus area and we will point you toward the most useful Hei-VAP Core sections.',
    bypassCooldown: true,
    actions: [
      { label: 'Pharma workflows', target: 'industries' },
      { label: 'Solvent recovery', target: 'calculator' },
      { label: 'Just exploring', target: 'overview' },
    ],
  },

  /* 1. Scroll nudge — 5 s after opening Features / Applications / Specs tab, once per tab */
  nudge: {
    ovId: 'nudge-overlay',
    title: 'There is something interesting here.',
    body: 'The simulator shows how solvent moves from evaporation to condensation and recovery.',
    actions: [{ label: 'Show me', target: 'simulator' }],
  },

  /* 2. Exit intent — mouseout with clientY ≤ 0, once */
  exit: {
    ovId: 'exit-overlay',
    title: 'Before you go…',
    body: 'Talk through your own samples with a specialist — a free, no-obligation consultation, anywhere in India.',
    icon: FiCpu,
    actions: [
      { label: 'Book a free demo', target: 'booking' },
      {
        label: 'Email me the brochure',
        href: 'mailto:info@inkarp.co.in?subject=Request%3A%20Hei-VAP%20Core%20brochure',
      },
    ],
  },

  /* 4. Calculator intent — 1.5 s after 4 slider interactions */
  calcIntent: {
    ovId: 'calcpop-overlay',
    title: 'That estimate can become a quote.',
    body: 'Send your calculated values to Inkarp and the team can tailor the glassware, pump and chiller package.',
    actions: [{ label: 'Book a demo', target: 'booking' }],
  },

  /* 5. Time-on-page assist — 1.2 s after clicking a chip or Check button in suitability checker */
  assist: {
    ovId: 'assist-overlay',
    title: 'Need help choosing the right setup?',
    body: 'Share your solvent, volume and recovery goal. We can help narrow the configuration.',
    actions: [
      {
        label: 'Chat on WhatsApp',
        href: 'https://wa.me/914027172293?text=Hi%20Inkarp%2C%20I%27m%20on%20the%20Hei-VAP%20Core%20page%20and%20have%20a%20question.',
      },
      { label: 'Book a demo', target: 'booking' },
    ],
  },

  /* 6. Mini poll — 70 % scroll depth, auto-closes 1.4 s after answering */
  poll: {
    ovId: 'poll-overlay',
    title: 'What matters most for your lab?',
    body: 'Your answer helps frame the final recommendation.',
    autoCloseDuration: 1400,
    actions: [
      { label: 'Higher throughput', target: 'calculator' },
      { label: 'Simple control', target: 'overview' },
      { label: 'Max recovery', target: 'pairing' },
    ],
  },

  /* 7. Idle return — fires immediately when tab becomes visible again after being hidden */
  idle: {
    ovId: 'idle-overlay',
    title: 'Still evaluating the Hei-VAP Core?',
    body: 'Continue from the section you were reading, or jump straight to demo booking.',
    actions: [
      { label: 'Continue reading', closeOnly: true },
      { label: 'Book a demo', target: 'booking' },
    ],
  },
};

const COOLDOWN_MS = 20000;

/* ════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════ */

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════ */

export default function ProductEngagementPopups({ productName }) {
  const [activePopup, setActivePopup] = useState(null);

  /* anyPopOpen — true while any popup is visible */
  const anyPopOpen = () => activePopup !== null;

  const cooldownUntil = useRef(0);   // timestamp until which new popups are blocked
  const shown = useRef(new Set());   // popShown — IDs that have already fired once
  const nudgeShownTabs = useRef(new Set()); // per-tab nudge tracking (separate from global shown)
  const calcInputCount = useRef(0);  // running count of calculator slider interactions
  const autoCloseTimer = useRef(null);

  /* ── closePop ──────────────────────────────────────── */
  const close = useCallback(() => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
    setActivePopup(null);
    cooldownUntil.current = Date.now() + COOLDOWN_MS;
  }, []);

  /* ── tryShowPop ─────────────────────────────────────
     opts.force = true → bypass cooldown (used for welcome) */
  const show = useCallback((id, opts = {}) => {
    if (!POPUPS[id] || shown.current.has(id)) return;
    if (!opts.force && Date.now() < cooldownUntil.current) return;

    const storageKey = `inkarp-popup:${productName ?? 'product'}:${id}`;
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) {
      shown.current.add(id);
      return;
    }

    shown.current.add(id);
    window.sessionStorage.setItem(storageKey, '1');
    setActivePopup(id);
  }, [productName]);

  /* nudge uses its own per-tab tracking instead of global shown */
  const showNudge = useCallback((tab) => {
    if (nudgeShownTabs.current.has(tab) || Date.now() < cooldownUntil.current) return;

    const storageKey = `inkarp-popup:${productName ?? 'product'}:nudge-${tab}`;
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) {
      nudgeShownTabs.current.add(tab);
      return;
    }

    nudgeShownTabs.current.add(tab);
    window.sessionStorage.setItem(storageKey, '1');
    setActivePopup('nudge');
  }, [productName]);

  /* ── Trigger 3: Welcome — 4 s, bypass cooldown ─────── */
  useEffect(() => {
    const t = window.setTimeout(() => show('welcome', { force: true }), 4000);
    return () => window.clearTimeout(t);
  }, [show]);

  /* ── Trigger 1: Nudge — 5 s after Features/Applications/Specs tab ── */
  useEffect(() => {
    let nudgeTimer = null;
    let pendingTab = null;

    const onTabChange = (event) => {
      const tab = event.detail?.tab;
      if (!NUDGE_TABS.has(tab)) return;

      window.clearTimeout(nudgeTimer);
      pendingTab = tab;
      nudgeTimer = window.setTimeout(() => {
        if (pendingTab) showNudge(pendingTab);
      }, 5000);
    };

    window.addEventListener('product-tab-changed', onTabChange);
    return () => {
      window.removeEventListener('product-tab-changed', onTabChange);
      window.clearTimeout(nudgeTimer);
    };
  }, [showNudge]);

  /* ── Trigger 2: Exit intent — mouseout clientY ≤ 0 ─── */
  useEffect(() => {
    const onMouseOut = (event) => {
      if (!event.relatedTarget && event.clientY <= 0) show('exit');
    };
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, [show]);

  /* ── Trigger 4: Calculator intent — 1.5 s after 4 slider interactions ── */
  useEffect(() => {
    let calcTimer = null;

    const onCalcInput = () => {
      calcInputCount.current += 1;
      if (calcInputCount.current === 4) {
        window.clearTimeout(calcTimer);
        calcTimer = window.setTimeout(() => show('calcIntent'), 1500);
      }
    };

    window.addEventListener('product-calc-input', onCalcInput);
    return () => {
      window.removeEventListener('product-calc-input', onCalcInput);
      window.clearTimeout(calcTimer);
    };
  }, [show]);

  /* ── Trigger 5: Assist — 1.2 s after suitability chip/check click ── */
  useEffect(() => {
    let assistTimer = null;

    const onSuitabilityChecked = () => {
      window.clearTimeout(assistTimer);
      assistTimer = window.setTimeout(() => show('assist'), 1200);
    };

    window.addEventListener('product-suitability-checked', onSuitabilityChecked);
    return () => {
      window.removeEventListener('product-suitability-checked', onSuitabilityChecked);
      window.clearTimeout(assistTimer);
    };
  }, [show]);

  /* ── Trigger 6: Poll — 70 % scroll depth ─────────── */
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && window.scrollY / maxScroll > 0.7) show('poll');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [show]);

  /* ── Trigger 7: Idle return — tab becomes visible ── */
  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden) show('idle');
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [show]);

  /* ── Escape key ─────────────────────────────────── */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close]);

  if (!anyPopOpen()) return null;

  const popup = POPUPS[activePopup];
  if (!popup) return null;

  /* Poll actions scroll immediately then auto-close after autoCloseDuration */
  const handleAction = (action) => {
    if (popup.autoCloseDuration && !action.closeOnly && !action.href) {
      if (action.target) scrollToSection(action.target);
      autoCloseTimer.current = window.setTimeout(() => {
        setActivePopup(null);
        cooldownUntil.current = Date.now() + COOLDOWN_MS;
      }, popup.autoCloseDuration);
    } else {
      close();
      if (action.target) window.setTimeout(() => scrollToSection(action.target), 80);
    }
  };

  /* ════════════════════════════════════════════════════
     MARKUP  (.nudge-overlay / .nudge-box structure)
     ════════════════════════════════════════════════════ */
  return (
    <div
      id={popup.ovId}
      aria-modal="true"
      role="dialog"
      className="nudge-overlay fixed inset-0 z-[90] flex items-center justify-center bg-zinc-950/35 dark:bg-zinc-950/60 px-4 backdrop-blur-[2px]"
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="nudge-box relative w-full max-w-md rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
        <button
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100"
          onClick={close}
          type="button"
        >
          <FiX />
        </button>

        <div className="mb-4 inline-flex size-11 items-center justify-center rounded-md bg-[#BE0010]/10 text-[#BE0010]">
          {(() => { const Icon = popup.icon ?? FiMessageCircle; return <Icon />; })()}
        </div>

        <h2 className="font-maxot pr-8 text-2xl font-bold leading-tight text-zinc-950 dark:text-zinc-100">
          {popup.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {popup.body}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {popup.actions.map((action) => {
            if (action.href) {
              const isExternal = action.href.startsWith('http');
              return (
                <a
                  key={action.label}
                  className={
                    isExternal
                      ? 'inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 dark:bg-zinc-800 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:hover:bg-zinc-700'
                      : 'inline-flex h-11 items-center justify-center rounded-md bg-[#BE0010] px-4 text-sm font-semibold text-white transition hover:bg-[#9f000d]'
                  }
                  href={action.href}
                  onClick={close}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  target={isExternal ? '_blank' : undefined}
                >
                  {action.label}
                </a>
              );
            }

            return (
              <button
                key={action.label}
                className={
                  action.closeOnly
                    ? 'inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm font-semibold text-zinc-800 dark:text-zinc-100 transition hover:border-[#BE0010] hover:text-[#BE0010]'
                    : 'inline-flex h-11 items-center justify-center rounded-md bg-[#BE0010] px-4 text-sm font-semibold text-white transition hover:bg-[#9f000d]'
                }
                onClick={() => {
                  if (action.closeOnly) { close(); return; }
                  handleAction(action);
                }}
                type="button"
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
