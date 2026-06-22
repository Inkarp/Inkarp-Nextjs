"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiCpu, FiFastForward, FiMessageCircle, FiX } from "react-icons/fi";

const POPUPS = {
  welcome: {
    title: "What are you exploring for?",
    body: "Choose a focus area and we will point you toward the most useful Hei-VAP Core sections.",
    actions: [
      { label: "Pharma workflows", target: "industries" },
      { label: "Solvent recovery", target: "calculator" },
      { label: "Just exploring", target: "overview" },
    ],
  },
  nudge: {
    title: "There is something interesting here.",
    body: "The simulator shows how solvent moves from evaporation to condensation and recovery.",
    actions: [{ label: "Show me", target: "simulator" }],
  },
  calculator: {
    title: "That estimate can become a quote.",
    body: "Send your calculated values to Inkarp and the team can tailor the glassware, pump and chiller package.",
    actions: [{ label: "Book a demo", target: "booking" }],
  },
  simulator: {
    title: "Want to test this with your solvents?",
    body: "Inkarp can help validate real evaporation rate and recovery with your sample conditions.",
    actions: [{ label: "Discuss my setup", target: "booking" }],
  },
  assist: {
    title: "Need help choosing the right setup?",
    body: "Share your solvent, volume and recovery goal. We can help narrow the configuration.",
    actions: [
      { label: "Chat on WhatsApp", href: "https://wa.me/914027172293?text=Hi%20Inkarp%2C%20I%27m%20on%20the%20Hei-VAP%20Core%20page%20and%20have%20a%20question." },
      { label: "Book a demo", target: "booking" },
    ],
  },
  poll: {
    title: "What matters most for your lab?",
    body: "Your answer helps frame the final recommendation.",
    actions: [
      { label: "Higher throughput", target: "calculator" },
      { label: "Simple control", target: "overview" },
      { label: "Max recovery", target: "pairing" },
    ],
  },
  idle: {
    title: "Still evaluating the Hei-VAP Core?",
    body: "Continue from the section you were reading, or jump straight to demo booking.",
    actions: [
      { label: "Continue reading", closeOnly: true },
      { label: "Book a demo", target: "booking" },
    ],
  },
  exit: {
    title: "Before you go...",
    body: "Talk through your own samples with a specialist — a free, no-obligation consultation, anywhere in India.",
    icon: FiCpu,
    actions: [
      { label: "Book a free demo", target: "booking" },
      { label: "Email me the brochure", href: "mailto:info@inkarp.com?subject=Request%3A%20Hei-VAP%20Core%20brochure" },
    ],
  },
  welcomeBack: {
    title: "Welcome back",
    body: "Pick up where you left off.",
    icon: FiFastForward,
    actions: [
      { label: "Continue reading", target: "overview", resumeTab: true },
      { label: "Start from the top", target: "overview", resetTab: true, closeOnly: true },
    ],
  },
};

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ProductEngagementPopups({ productName }) {
  const [activePopup, setActivePopup] = useState(null);
  const [lastTab, setLastTab] = useState(null);
  const cooldownUntil = useRef(0);
  const shown = useRef(new Set());

  const close = useCallback(() => {
    setActivePopup(null);
    cooldownUntil.current = Date.now() + 18000;
  }, []);

  const show = useCallback((id) => {
    if (!POPUPS[id] || shown.current.has(id) || Date.now() < cooldownUntil.current) {
      return;
    }

    const storageKey = `inkarp-product-popup:${productName ?? "product"}:${id}`;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(storageKey)) {
      shown.current.add(id);
      return;
    }

    shown.current.add(id);
    window.sessionStorage.setItem(storageKey, "1");
    setActivePopup(id);
  }, [productName]);

  const showWelcomeBack = useCallback((tabInfo) => {
    const id = "welcomeBack";
    if (shown.current.has(id) || Date.now() < cooldownUntil.current) {
      return;
    }

    const storageKey = `inkarp-product-popup:${productName ?? "product"}:${id}`;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(storageKey)) {
      shown.current.add(id);
      return;
    }

    shown.current.add(id);
    window.sessionStorage.setItem(storageKey, "1");
    setLastTab(tabInfo);
    setActivePopup(id);
  }, [productName]);

  useEffect(() => {
    let hiddenAt = 0;

    const onVisibilityChange = () => {
      if (document.hidden) {
        hiddenAt = Date.now();
        return;
      }
      if (!hiddenAt || Date.now() - hiddenAt < 5000) return;

      const tabStorageKey = `inkarp-product-last-tab:${productName ?? "product"}`;
      const raw = window.sessionStorage.getItem(tabStorageKey);
      if (!raw) return;

      try {
        const tabInfo = JSON.parse(raw);
        if (tabInfo?.tab && tabInfo.tab !== "overview") {
          showWelcomeBack(tabInfo);
        }
      } catch {
        // ignore malformed storage
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [productName, showWelcomeBack]);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => show("welcome"), 4200),
      window.setTimeout(() => show("nudge"), 15000),
    ];

    const showCalculator = () => show("calculator");
    const showSimulator = () => show("simulator");
    const showAssist = () => show("assist");

    window.addEventListener("product-calculator-results", showCalculator);
    window.addEventListener("product-roi-results", showCalculator);
    window.addEventListener("product-config-ready", showCalculator);
    window.addEventListener("product-simulator-complete", showSimulator);
    window.addEventListener("product-suitability-checked", showAssist);
    window.addEventListener("product-quiz-complete", showAssist);

    const onMouseOut = (event) => {
      if (!event.relatedTarget && event.clientY <= 0) {
        show("exit");
      }
    };

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && window.scrollY / maxScroll > 0.7) {
        show("poll");
      }
    };

    let idleTimer;
    const resetIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => show("idle"), 60000);
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", resetIdle, { passive: true });
    window.addEventListener("keydown", resetIdle);
    resetIdle();

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(idleTimer);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("product-calculator-results", showCalculator);
      window.removeEventListener("product-roi-results", showCalculator);
      window.removeEventListener("product-config-ready", showCalculator);
      window.removeEventListener("product-simulator-complete", showSimulator);
      window.removeEventListener("product-suitability-checked", showAssist);
      window.removeEventListener("product-quiz-complete", showAssist);
    };
  }, [show]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  if (!activePopup) {
    return null;
  }

  const popup = POPUPS[activePopup];

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-zinc-950/35 px-4 backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      role="dialog"
    >
      <div className="relative w-full max-w-md rounded-md border border-zinc-200 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
        <button
          aria-label="Close product prompt"
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
          onClick={close}
          type="button"
        >
          <FiX />
        </button>
        <div className="mb-4 inline-flex size-11 items-center justify-center rounded-md bg-[#BE0010]/10 text-[#BE0010]">
          {(() => {
            const Icon = popup.icon ?? FiMessageCircle;
            return <Icon />;
          })()}
        </div>
        <h2 className="font-maxot pr-8 text-2xl font-bold leading-tight text-zinc-950">
          {popup.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {activePopup === "welcomeBack" && lastTab?.label
            ? <>Pick up where you left off — you were reading &quot;{lastTab.label}&quot;.</>
            : popup.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {popup.actions.map((action) => {
            const className =
              action.href && !action.href.startsWith("mailto:")
                ? "inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
                : "inline-flex h-11 items-center justify-center rounded-md bg-[#BE0010] px-4 text-sm font-semibold text-white transition hover:bg-[#9f000d]";

            if (action.href) {
              return (
                <a
                  className={className}
                  href={action.href}
                  key={action.label}
                  onClick={close}
                  rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  target={action.href.startsWith("http") ? "_blank" : undefined}
                >
                  {action.label}
                </a>
              );
            }

            return (
              <button
                className={action.closeOnly ? "inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:border-[#BE0010] hover:text-[#BE0010]" : className}
                key={action.label}
                onClick={() => {
                  close();
                  if (action.resumeTab && lastTab?.tab) {
                    window.dispatchEvent(new CustomEvent("product-set-tab", { detail: { tab: lastTab.tab } }));
                  } else if (action.resetTab) {
                    window.dispatchEvent(new CustomEvent("product-set-tab", { detail: { tab: "overview" } }));
                  }
                  if (action.target) {
                    window.setTimeout(() => scrollToSection(action.target), 80);
                  }
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
