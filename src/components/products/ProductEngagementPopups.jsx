'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import { LuFlaskConical } from 'react-icons/lu';
import { OPEN_CATALOGUE_EVENT } from './CatalogueDownloadButton';
import { pushEvent } from '@/lib/analytics';
import { getBasket } from '@/lib/quoteBasket';

/* ════════════════════════════════════════════════════════
   POPUP DEFINITIONS
   ════════════════════════════════════════════════════════ */

const NUDGE_TABS = new Set(['features', 'applications', 'specs']);

/* Generic, product-agnostic defaults. Any product can override individual
   popups (by key) via the `popups` prop — see buildPopups() below. */
function buildDefaultPopups(productName, { hasCatalogue = false } = {}) {
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

    /* 2. Exit intent — the mouse leaves through the top of the window, once a
       visitor has really read the page (see exitBlocked below). The second
       button opens the product's catalogue form where it has one; otherwise it
       offers WhatsApp. `track` names the button in analytics. */
    exit: {
      ovId: 'exit-overlay',
      title: `Before you go — see the ${name} working on your samples`,
      body: 'Talk through your own samples with a specialist — a free, no-obligation consultation, anywhere in India.',
      icon: LuFlaskConical,
      actions: [
        { label: 'Book a free demo', target: 'booking', primary: true, track: 'book_demo' },
        hasCatalogue
          ? { label: 'Download the catalogue', event: OPEN_CATALOGUE_EVENT, track: 'catalogue' }
          : {
            label: 'Ask on WhatsApp',
            href: `https://wa.me/918125580808?text=${encodeURIComponent(`Hi Inkarp, I'm on the ${name} page and have a question.`)}`,
            track: 'whatsapp',
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

// Switched off on 29 Oct 2026 after the popup review (only the exit popup
// stays). The popups and their triggers are kept: delete a key here to bring
// that popup back. The calculator follow-up repeated the solvent calculator's
// own "Email this estimate to Inkarp" button.
const TURNED_OFF = new Set(['welcome', 'nudge', 'calcIntent', 'assist', 'poll', 'idle']);

/* Exit popup rules (31 Oct 2026): only for a real reader who is leaving
   without having acted, at most once per visit across all product pages, then
   rested for a week after ✕ or a month after a button. Add 'exit' to
   TURNED_OFF to switch it off. */
const EXIT_MIN_MS = 40000;          // time on the page first
const EXIT_MIN_DEPTH = 1 / 3;       // share of the page seen first
const EXIT_REST_AFTER_CLOSE_DAYS = 7;
const EXIT_REST_AFTER_ACTION_DAYS = 30;
const EXIT_SHOWN_KEY = 'inkarp-exit-popup:shown';   // sessionStorage: shown this visit
const EXIT_ACTED_KEY = 'inkarp-exit-popup:acted';   // sessionStorage: visitor already enquired etc.
const EXIT_REST_KEY = 'inkarp-exit-popup:rest-until'; // localStorage: timestamp
const DAY_MS = 24 * 60 * 60 * 1000;

// Another overlay is open: catalogue form, photo zoom (aria-modal), open chat
// or the webinar strip (data-popup-open). The quote pill also carries
// data-popup-open but is a small floating widget, so it doesn't count.
const OTHER_OVERLAY = '[aria-modal="true"], [data-popup-open]:not([data-floating-widget])';
const TYPING_FIELD =
  'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, select, [contenteditable="true"]';

/* ════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════ */

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Storage can be blocked (private mode, site data off); the popup then simply
// falls back to its in-page rules.
function readStore(store, key) {
  try { return window[store].getItem(key); } catch { return null; }
}
function writeStore(store, key, value) {
  try { window[store].setItem(key, value); } catch { /* see readStore */ }
}

function restExitPopup(days) {
  writeStore('localStorage', EXIT_REST_KEY, String(Date.now() + days * DAY_MS));
}

/** Why the exit popup must not show right now, or null when it may. */
function exitBlocked({ openedAt, maxDepth }) {
  if (TURNED_OFF.has('exit')) return 'off';
  if (Date.now() - openedAt < EXIT_MIN_MS) return 'too-soon';
  if (maxDepth < EXIT_MIN_DEPTH) return 'not-read';
  if (readStore('sessionStorage', EXIT_SHOWN_KEY)) return 'shown-this-visit';
  if (readStore('sessionStorage', EXIT_ACTED_KEY)) return 'already-acted';
  if (Number(readStore('localStorage', EXIT_REST_KEY)) > Date.now()) return 'resting';
  if (getBasket().length > 0) return 'has-quote-list';
  if (document.querySelector(OTHER_OVERLAY)) return 'other-overlay';
  if (document.activeElement?.matches(TYPING_FIELD)) return 'typing';
  const booking = document.getElementById('booking')?.getBoundingClientRect();
  if (booking && booking.top < window.innerHeight && booking.bottom > 0) return 'at-booking';
  return null;
}

/* ════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════ */

export default function ProductEngagementPopups({ productName, popups: popupOverrides, hasCatalogue = false }) {
  const [activePopup, setActivePopupState] = useState(null);
  const activeRef = useRef(null);    // the open popup, readable inside listeners
  const setActivePopup = useCallback((id) => {
    activeRef.current = id;
    setActivePopupState(id);
  }, []);

  const POPUPS = useMemo(() => {
    const defaults = buildDefaultPopups(productName, { hasCatalogue });
    if (!popupOverrides) return defaults;
    const merged = {};
    for (const key of Object.keys(defaults)) {
      // The exit popup's title and buttons follow the rules above; a product
      // may only reword its sentence.
      const override = key === 'exit'
        ? (popupOverrides.exit?.body ? { body: popupOverrides.exit.body } : {})
        : popupOverrides[key] ?? {};
      merged[key] = { ...defaults[key], ...override };
    }
    return merged;
  }, [productName, popupOverrides, hasCatalogue]);

  /* anyPopOpen — true while any popup is visible */
  const anyPopOpen = () => activePopup !== null;

  const cooldownUntil = useRef(0);   // timestamp until which new popups are blocked
  const shown = useRef(new Set());   // popShown — IDs that have already fired once
  const nudgeShownTabs = useRef(new Set()); // per-tab nudge tracking (separate from global shown)
  const calcInputCount = useRef(0);  // running count of calculator slider interactions
  const autoCloseTimer = useRef(null);
  const openedAt = useRef(0);        // when this page was opened (set on mount)
  const maxDepth = useRef(0);        // largest share of the page seen so far

  /* ── closePop ──────────────────────────────────────── */
  const close = useCallback((via = 'close') => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
    if (activeRef.current === 'exit' && via !== 'action') {
      restExitPopup(EXIT_REST_AFTER_CLOSE_DAYS);
      pushEvent('exit_popup_close', { product_name: productName, via });
    }
    setActivePopup(null);
    cooldownUntil.current = Date.now() + COOLDOWN_MS;
  }, [productName, setActivePopup]);

  /* ── tryShowPop ─────────────────────────────────────
     opts.force = true → bypass cooldown (used for welcome) */
  const show = useCallback((id, opts = {}) => {
    if (!POPUPS[id] || TURNED_OFF.has(id) || shown.current.has(id)) return;
    if (!opts.force && Date.now() < cooldownUntil.current) return;

    const storageKey = `inkarp-popup:${productName ?? 'product'}:${id}`;
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) {
      shown.current.add(id);
      return;
    }

    shown.current.add(id);
    window.sessionStorage.setItem(storageKey, '1');
    setActivePopup(id);
  }, [productName, POPUPS, setActivePopup]);

  /* nudge uses its own per-tab tracking instead of global shown */
  const showNudge = useCallback((tab) => {
    if (TURNED_OFF.has('nudge') || nudgeShownTabs.current.has(tab) || Date.now() < cooldownUntil.current) return;

    const storageKey = `inkarp-popup:${productName ?? 'product'}:nudge-${tab}`;
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) {
      nudgeShownTabs.current.add(tab);
      return;
    }

    nudgeShownTabs.current.add(tab);
    window.sessionStorage.setItem(storageKey, '1');
    setActivePopup('nudge');
  }, [productName, setActivePopup]);

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

  /* ── Trigger 2: Exit intent — mouse leaves through the top ── */
  // Reading progress: time on the page and how far down it the visitor got.
  useEffect(() => {
    openedAt.current = Date.now();
    const onScroll = () => {
      const page = document.documentElement.scrollHeight;
      if (page > 0) maxDepth.current = Math.max(maxDepth.current, (window.scrollY + window.innerHeight) / page);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Enquire Now, Download Catalogue and the chat button carry data-lead-action;
  // any form sent on the page (demo booking, estimates) counts too. Either one
  // means the visitor already acted, so no exit popup for the rest of the visit.
  useEffect(() => {
    const markActed = () => writeStore('sessionStorage', EXIT_ACTED_KEY, '1');
    const onClick = (event) => {
      if (event.target instanceof Element && event.target.closest('[data-lead-action]')) markActed();
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('submit', markActed, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('submit', markActed, true);
    };
  }, []);

  useEffect(() => {
    // Mouse users only: phones and tablets have no "leaving" movement.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const onMouseOut = (event) => {
      if (event.relatedTarget || event.clientY > 0 || activeRef.current) return;
      if (exitBlocked({ openedAt: openedAt.current, maxDepth: maxDepth.current })) return;
      writeStore('sessionStorage', EXIT_SHOWN_KEY, '1');
      setActivePopup('exit');
      pushEvent('exit_popup_view', { product_name: productName });
    };
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, [productName, setActivePopup]);

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
      if (event.key === 'Escape' && activeRef.current) close('escape');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close]);

  if (!anyPopOpen()) return null;

  const popup = POPUPS[activePopup];
  if (!popup) return null;

  const handleAction = (action) => {
    if (action.closeOnly) { close(); return; }

    if (activePopup === 'exit') {
      restExitPopup(EXIT_REST_AFTER_ACTION_DAYS);
      writeStore('sessionStorage', EXIT_ACTED_KEY, '1');
      pushEvent('exit_popup_click', { product_name: productName, action: action.track ?? action.label });
    }

    /* Poll actions scroll immediately then auto-close after autoCloseDuration */
    if (popup.autoCloseDuration && !action.href) {
      if (action.target) scrollToSection(action.target);
      autoCloseTimer.current = window.setTimeout(() => {
        setActivePopup(null);
        cooldownUntil.current = Date.now() + COOLDOWN_MS;
      }, popup.autoCloseDuration);
      return;
    }

    close('action');
    // Links follow their href; the rest act once the popup has gone.
    window.setTimeout(() => {
      if (action.target) scrollToSection(action.target);
      if (action.event) window.dispatchEvent(new CustomEvent(action.event));
    }, 80);
  };

  const buttonClass = (action) => {
    if (action.primary) {
      return 'inline-flex h-11 items-center justify-center border border-red bg-red px-4 text-sm font-semibold text-white transition hover:bg-[#99000d]';
    }
    if (action.closeOnly) {
      return 'inline-flex h-11 items-center justify-center border border-line-light bg-parchment px-4 text-sm font-semibold text-ink transition hover:border-red hover:text-red';
    }
    return 'inline-flex h-11 items-center justify-center border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100';
  };

  /* ════════════════════════════════════════════════════
     MARKUP  (.nudge-overlay / .nudge-box structure)
     ════════════════════════════════════════════════════ */
  return (
    <div
      id={popup.ovId}
      data-popup-open=""
      aria-modal="true"
      aria-labelledby={`${popup.ovId}-title`}
      role="dialog"
      className="nudge-overlay fixed inset-0 z-[90] flex items-center justify-center bg-navy/35 px-4 backdrop-blur-[2px]"
      onClick={(event) => { if (event.target === event.currentTarget) close('backdrop'); }}
    >
      <div className="nudge-box relative w-full max-w-md border border-line-light bg-parchment p-6">
        <button
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center text-red transition hover:bg-parchment-alt"
          onClick={() => close('close')}
          type="button"
        >
          <FiX />
        </button>

        <div className="mb-4 inline-flex size-11 items-center justify-center bg-red/5 text-xl text-red">
          {(() => { const Icon = popup.icon ?? FiMessageCircle; return <Icon aria-hidden="true" />; })()}
        </div>

        <h2 id={`${popup.ovId}-title`} className="pr-8 text-2xl font-semibold leading-tight tracking-tight text-ink">
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
                  className={buttonClass(action)}
                  href={action.href}
                  onClick={() => handleAction(action)}
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
                className={buttonClass(action)}
                onClick={() => handleAction(action)}
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
