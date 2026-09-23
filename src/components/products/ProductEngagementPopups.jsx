'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiCpu, FiMessageCircle, FiX } from 'react-icons/fi';

/* ════════════════════════════════════════════════════════
   POPUP DEFINITIONS
   ════════════════════════════════════════════════════════ */

const NUDGE_TABS = new Set(['features', 'applications', 'specs']);

/* Generic, product-agnostic defaults. Any product can override individual
   popups (by key) via the `popups` prop — see buildPopups() below. */
function buildDefaultPopups(productName) {
  const name = productName ?? 'this product';
  return {
    /* 3. Welcome segmentation — 4 s after page load, bypasses cooldown */
    welcome: {
      ovId: 'welcome-overlay',
      title: 'What are you exploring for?',
      body: 'Choose a focus area and we will point you toward the most useful sections.',
      bypassCooldown: true,
      actions: [
        { label: 'Applications', target: 'industries' },
        { label: 'Suitability check', target: 'suitability' },
        { label: 'Just exploring', target: 'overview' },
      ],
    },

    /* 1. Scroll nudge — 5 s after opening Features / Applications / Specs tab, once per tab */
    nudge: {
      ovId: 'nudge-overlay',
      title: 'There is something interesting here.',
      body: 'There is more worth seeing further down this page.',
      actions: [{ label: 'Show me', target: 'workflow' }],
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
          href: `mailto:info@inkarp.co.in?subject=${encodeURIComponent(`Request: ${name} brochure`)}`,
        },
      ],
    },

    /* 4. Calculator intent — 1.5 s after 4 slider interactions (only fires if a calculator section exists) */
    calcIntent: {
      ovId: 'calcpop-overlay',
      title: 'That estimate can become a quote.',
      body: 'Send your calculated values to Inkarp and the team can tailor a package to match.',
      actions: [{ label: 'Book a demo', target: 'booking' }],
    },

    /* 5. Assist — 1.2 s after clicking a chip or Check button in suitability checker */
    assist: {
      ovId: 'assist-overlay',
      title: 'Need help choosing the right setup?',
      body: 'Share your requirements and we can help narrow the configuration.',
      actions: [
        {
          label: 'Chat on WhatsApp',
          href: `https://wa.me/914027172293?text=${encodeURIComponent(`Hi Inkarp, I'm on the ${name} page and have a question.`)}`,
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
        { label: 'Consistent results', target: 'workflow-score' },
        { label: 'Simple control', target: 'overview' },
        { label: 'Automation-ready', target: 'suitability' },
      ],
    },

    /* 7. Idle return — fires immediately when tab becomes visible again after being hidden */
    idle: {
      ovId: 'idle-overlay',
      title: `Still evaluating ${name}?`,
      body: 'Continue from the section you were reading, or jump straight to demo booking.',
      actions: [
        { label: 'Continue reading', closeOnly: true },
        { label: 'Book a demo', target: 'booking' },
      ],
    },
  };
}

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

export default function ProductEngagementPopups({ productName, popups: popupOverrides }) {
  const [activePopup, setActivePopup] = useState(null);

  const POPUPS = useMemo(() => {
    const defaults = buildDefaultPopups(productName);
    if (!popupOverrides) return defaults;
    const merged = {};
    for (const key of Object.keys(defaults)) {
      merged[key] = { ...defaults[key], ...(popupOverrides[key] ?? {}) };
    }
    return merged;
  }, [productName, popupOverrides]);

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
  }, [productName, POPUPS]);

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
      data-popup-open=""
      aria-modal="true"
      role="dialog"
      className="nudge-overlay fixed inset-0 z-[90] flex items-center justify-center bg-navy/35 px-4 backdrop-blur-[2px]"
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="nudge-box relative w-full max-w-md border border-line-light bg-parchment p-6">
        <button
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center text-red transition hover:bg-parchment-alt"
          onClick={close}
          type="button"
        >
          <FiX />
        </button>

        <div className="mb-4 inline-flex size-11 items-center justify-center bg-parchment-alt text-red">
          {(() => { const Icon = popup.icon ?? FiMessageCircle; return <Icon />; })()}
        </div>

        <h2 className="pr-8 text-2xl font-semibold leading-tight tracking-tight text-ink">
          {popup.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
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
                      ? 'inline-flex h-11 items-center justify-center bg-navy px-4 text-sm font-semibold text-parchment transition hover:bg-parchment-alt '
                      : 'inline-flex h-11 items-center justify-center bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100'
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
                    ? 'inline-flex h-11 items-center justify-center border border-line-light bg-parchment px-4 text-sm font-semibold text-ink transition hover:border-red hover:text-red'
                    : 'inline-flex h-11 items-center justify-center bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100'
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
