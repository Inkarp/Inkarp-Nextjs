"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import DexterChat from "./DexterChat";
import { createPortal } from "react-dom";
import {
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiSend,
  FiTool,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";
import {
  CHATBOT_CONFIG,
  CHATBOT_ENQUIRY_TYPES,
  CHATBOT_FIELDS,
  CHATBOT_WORKFLOW_QUESTIONS,
  CHATBOT_WORKFLOW_RESULTS,
} from "@/data/chatbotConfig";
import Image from "next/image";
import { collectTracking } from "@/lib/browserTracking";
import { pushEvent } from "@/lib/analytics";

const INPUT_CLASS =
  "w-full rounded-lg border border-line-light bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-red focus:ring-2 focus:ring-red/10";
const OPTION_BUTTON_CLASS =
  "group flex w-full items-center gap-3 rounded-xl border border-line-light bg-white px-4 py-3 text-left text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red/45 hover:bg-red/5";
const SUBMIT_BUTTON_CLASS =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60";
const TOP_LAYER = 2147483647;
const HELPER_PROMPT_DELAY_MS = 25000;
const GREETING_STORAGE_KEY = "inkarp-chatbot-greeting-dismissed";
const PANEL_TRANSITION_MS = 250;
const LAUNCHER_GREETING = "Need help choosing an instrument?";

const ENQUIRY_ICONS = {
  Product: FiBox,
  Service: FiTool,
  Quote: FiFileText,
  "Talk to expert": FiUser,
};

const WORKFLOW_LEAD_FIELDS = [
  { name: "productName", label: "Product / instrument", type: "text", required: true },
  {
    name: "inquiryType",
    label: "Request type",
    type: "select",
    required: true,
    options: ["Demo request", "Quote request", "Technical question", "Service enquiry", "General enquiry"],
  },
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "company", label: "Company / institute", type: "text", required: true },
  { name: "city", label: "City", type: "text", required: true },
  { name: "state", label: "State", type: "text", required: true },
  { name: "application", label: "Application / workflow", type: "text", required: true, wide: true },
  { name: "message", label: "Message", type: "textarea", required: false },
];

const WORKFLOW_LEAD_INITIAL = {
  productName: "",
  inquiryType: "Demo request",
  name: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  state: "",
  application: "",
  message: "",
};


function rememberGreetingDismissed() {
  try {
    window.sessionStorage.setItem(GREETING_STORAGE_KEY, "true");
  } catch {
    // Session storage can be unavailable in hardened browser contexts.
  }
}

function hasDismissedGreeting() {
  try {
    return window.sessionStorage.getItem(GREETING_STORAGE_KEY) === "true";
  } catch {
    return true;
  }
}

function emptyValues(fields) {
  return fields.reduce((values, field) => ({ ...values, [field.name]: "" }), {});
}

function getWorkflowResult(answers) {
  const scores = answers.reduce((total, answer) => {
    total[answer.scoreKey] = (total[answer.scoreKey] || 0) + 1;
    return total;
  }, {});
  const bestKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || "evaporation";
  return CHATBOT_WORKFLOW_RESULTS[bestKey] || CHATBOT_WORKFLOW_RESULTS.evaporation;
}

function Field({ field, category, values, errors, onChange, blankOption }) {
  const fieldId = `chatbot-${category}-${field.name}`;
  const errorText = errors[field.name];
  const value = values[field.name] ?? "";
  const describedBy = errorText ? `${fieldId}-error` : undefined;

  return (
    <label className={field.type === "textarea" || field.wide ? "sm:col-span-2" : ""}>
      <span className="text-xs font-semibold text-ink-soft">
        {field.label}
        {field.required ? <span className="text-red"> *</span> : null}
      </span>
      {field.type === "textarea" ? (
        <textarea
          aria-describedby={describedBy}
          aria-invalid={errorText ? "true" : undefined}
          className={`${INPUT_CLASS} mt-1 min-h-20 resize-y`}
          id={fieldId}
          onChange={(event) => onChange(field.name, event.target.value)}
          value={value}
        />
      ) : field.type === "select" ? (
        <select
          aria-describedby={describedBy}
          aria-invalid={errorText ? "true" : undefined}
          className={`${INPUT_CLASS} mt-1`}
          id={fieldId}
          onChange={(event) => onChange(field.name, event.target.value)}
          value={value}
        >
          {blankOption ? <option value="">Select</option> : null}
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          aria-describedby={describedBy}
          aria-invalid={errorText ? "true" : undefined}
          className={`${INPUT_CLASS} mt-1`}
          id={fieldId}
          onChange={(event) => onChange(field.name, event.target.value)}
          type={field.type}
          value={value}
        />
      )}
      {errorText ? (
        <span className="mt-1 block text-xs font-semibold text-red-600" id={`${fieldId}-error`} role="alert">
          {errorText}
        </span>
      ) : null}
    </label>
  );
}

export default function FloatingChatbot() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [helperPromptPath, setHelperPromptPath] = useState("");
  const [category, setCategory] = useState("");
  const [step, setStep] = useState("chat");
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState("");
  const [workflowIndex, setWorkflowIndex] = useState(0);
  const [workflowAnswers, setWorkflowAnswers] = useState([]);
  const [workflowResult, setWorkflowResult] = useState(null);
  const [workflowSaving, setWorkflowSaving] = useState(false);
  const [workflowLead, setWorkflowLead] = useState(WORKFLOW_LEAD_INITIAL);
  const [workflowLeadErrors, setWorkflowLeadErrors] = useState({});
  const [workflowLeadId, setWorkflowLeadId] = useState("");

  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const fields = CHATBOT_FIELDS[category] ?? [];
  const currentWorkflowQuestion = CHATBOT_WORKFLOW_QUESTIONS[workflowIndex];

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    const isProductDetailPage = /^\/products\/[^/]+\/?$/.test(pathname);
    const isApplicationPage =
      pathname === "/application-resources" ||
      pathname.startsWith("/application-resources/") ||
      /^\/workflows\/[^/]+/.test(pathname);

    if ((!isProductDetailPage && !isApplicationPage) || hasDismissedGreeting()) return undefined;

    const promptTimer = window.setTimeout(() => {
      if (document.visibilityState === "visible" && !isOpen) {
        setHelperPromptPath(pathname);
      }
    }, HELPER_PROMPT_DELAY_MS);

    return () => window.clearTimeout(promptTimer);
  }, [isOpen, pathname]);

  // Escape-to-close, and moving focus in/out of the panel as it opens and closes.
  useEffect(() => {
    if (!isOpen) return undefined;

    const launcherButton = launcherRef.current;
    previouslyFocusedRef.current = document.activeElement;
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 10);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        setHelperPromptPath("");
        rememberGreetingDismissed();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      } else {
        launcherButton?.focus();
      }
    };
  }, [isOpen]);

  // Lock background scroll only on small screens, where the panel covers most of the viewport.
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return undefined;
    if (!window.matchMedia("(max-width: 639px)").matches) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Scroll the panel body back to the top whenever the visible step changes.
  useEffect(() => {
    panelRef.current?.querySelector("[data-chatbot-scroll]")?.scrollTo({ top: 0 });
  }, [step]);

  function openChatbot() {
    pushEvent("chatbot_clicked");
    setHasOpenedOnce(true);
    setIsOpen(true);
    dismissGreetingTooltip();
    if (step === "workflow-result" || step === "success") setStep("chat");
  }

  function closeChatbot() {
    pushEvent("chatbot_closed");
    setIsOpen(false);
    dismissGreetingTooltip();
  }

  function dismissGreetingTooltip() {
    setHelperPromptPath("");
    rememberGreetingDismissed();
  }

  function resetFlow() {
    setCategory("");
    setStep("type");
    setValues({});
    setErrors({});
    setSuccess(null);
    setServerError("");
    setSubmitting(false);
    setWorkflowLead(WORKFLOW_LEAD_INITIAL);
    setWorkflowLeadErrors({});
    setWorkflowLeadId("");
    setWorkflowIndex(0);
    setWorkflowAnswers([]);
    setWorkflowResult(null);
  }

  function chooseType(nextCategory) {
    const nextFields = CHATBOT_FIELDS[nextCategory] ?? [];
    setCategory(nextCategory);
    setValues(emptyValues(nextFields));
    setErrors({});
    setServerError("");
    setStep("form");
  }

  function startWorkflowQuiz() {
    setWorkflowIndex(0);
    setWorkflowAnswers([]);
    setWorkflowResult(null);
    setServerError("");
    setStep("workflow");
  }

  function answerWorkflowQuestion(option) {
    const nextAnswers = [
      ...workflowAnswers,
      {
        questionId: currentWorkflowQuestion.id,
        question: currentWorkflowQuestion.question,
        answer: option.label,
        scoreKey: option.scoreKey,
      },
    ];

    if (workflowIndex < CHATBOT_WORKFLOW_QUESTIONS.length - 1) {
      setWorkflowAnswers(nextAnswers);
      setWorkflowIndex((current) => current + 1);
      return;
    }

    const result = getWorkflowResult(nextAnswers);
    setWorkflowAnswers(nextAnswers);
    setWorkflowResult(result);
    setWorkflowLead((current) => ({
      ...current,
      productName: result.productName,
      application: nextAnswers.map((answer) => `${answer.question}: ${answer.answer}`).join(" | "),
    }));
    setWorkflowLeadErrors({});
    setServerError("");
    setStep("workflow-form");
  }

  function validateWorkflowLead() {
    const nextErrors = {};
    for (const field of WORKFLOW_LEAD_FIELDS) {
      if (field.required && !String(workflowLead[field.name] ?? "").trim()) {
        nextErrors[field.name] = `${field.label} is required`;
      }
    }
    if (workflowLead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workflowLead.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (workflowLead.phone && !/^[+\d][\d\s().-]{6,19}$/.test(workflowLead.phone)) {
      nextErrors.phone = "Enter a valid phone number";
    }
    setWorkflowLeadErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitWorkflowLead(event) {
    event.preventDefault();
    setServerError("");
    if (!workflowResult || !validateWorkflowLead()) return;

    setWorkflowSaving(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "Workflow quiz",
          formSource: "Chatbot workflow product enquiry",
          answers: workflowAnswers,
          recommendedProduct: workflowResult.productName,
          recommendedProductSlug: workflowResult.productSlug,
          recommendedCategory: workflowResult.title,
          ...workflowLead,
          website: event.currentTarget.elements.website?.value || "",
          ...collectTracking(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Could not submit your enquiry. Please try again.");
      setWorkflowLeadId(result.id || "");
      setStep("workflow-result");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setWorkflowSaving(false);
    }
  }

  function validate() {
    const nextErrors = {};
    for (const field of fields) {
      if (field.required && !String(values[field.name] ?? "").trim()) {
        nextErrors[field.name] = `${field.label} is required`;
      }
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Enter a valid email address";
    if (values.contact && !/^[+\d][\d\s().-]{6,19}$/.test(values.contact)) nextErrors.contact = "Enter a valid phone number";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitForm(event) {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;
    const payload = {
      category,
      ...values,
      website: event.currentTarget.elements.website?.value || "",
      ...collectTracking(),
    };
    setSubmitting(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Could not submit your enquiry. Please try again.");
      setSuccess(result);
      setStep("success");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isMounted) return null;

  const showBackButton = step === "form";

  return createPortal(
    <>
      {helperPromptPath === pathname && !isOpen ? (
        <div
          data-floating-widget
          className="fixed max-w-[220px] rounded-2xl rounded-br-sm border border-line-light bg-white px-4 py-3 pr-9 text-sm font-semibold leading-5 text-ink shadow-xl shadow-zinc-900/15"
          role="status"
          style={{ bottom: "2.25rem", right: "5.25rem", zIndex: TOP_LAYER }}
        >
          {LAUNCHER_GREETING}
          <button
            aria-label="Dismiss Dexter greeting"
            className="absolute right-2 top-2 inline-flex size-5 items-center justify-center rounded-full text-ink-soft transition hover:bg-red/10 hover:text-red"
            onClick={dismissGreetingTooltip}
            type="button"
          >
            <FiX aria-hidden="true" className="size-3.5" />
          </button>
          <span
            aria-hidden="true"
            className="absolute -right-1.5 bottom-4 size-3 rotate-45 border-r border-t border-line-light bg-white"
          />
        </div>
      ) : null}

      <button
        aria-expanded={isOpen}
        aria-label="Open website chatbot"
        data-floating-widget
        className="group fixed inline-flex size-12 items-center justify-center rounded-full transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400 motion-reduce:transition-none motion-reduce:hover:transform-none sm:size-14"
        onClick={openChatbot}
        ref={launcherRef}
        style={{ bottom: "1.25rem", color: CHATBOT_CONFIG.colors.launcherText, right: "1rem", zIndex: TOP_LAYER }}
        type="button"
      >
        {!isOpen ? (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3.5 overflow-visible text-red drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] transition duration-300 group-hover:-translate-y-0.5 sm:-inset-4"
            viewBox="0 0 84 84"
          >
            <defs>
              <path d="M 12 43 A 30 30 0 0 1 72 43" id="dexter-label-arc" />
            </defs>
            <text
              fill="currentColor"
              fontSize="8"
              fontWeight="900"
              letterSpacing="1.7"
              textAnchor="middle"
              textLength="56"
            >
              <textPath href="#dexter-label-arc" startOffset="50%">
                I AM DEXTER
              </textPath>
            </text>
          </svg>
        ) : null}
        <Image
          alt=""
          className={`size-full rounded-full object-cover drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)] transition duration-300 group-hover:drop-shadow-[0_6px_14px_rgba(190,0,16,0.25)] ${
            isOpen ? "" : "motion-safe:animate-[dexter-idle_7s_ease-in-out_infinite]"
          }`}
          height={80}
          priority
          src="/chatbot-icon.webp"
          width={80}
        />
        {!isOpen ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-red px-1.5 py-[2px] text-[8px] font-black uppercase tracking-wider text-white shadow-md shadow-red/40 ring-2 ring-white"
          >
            AI
          </span>
        ) : null}
      </button>

      {hasOpenedOnce ? (
        <div
          aria-hidden={!isOpen}
          className="fixed inset-0 transition-opacity duration-300 sm:hidden motion-reduce:transition-none"
          inert={!isOpen}
          onClick={closeChatbot}
          style={{
            backdropFilter: "blur(1px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            zIndex: TOP_LAYER - 1,
          }}
        />
      ) : null}

      {hasOpenedOnce ? (
        <div
          aria-label={`Dexter — ${CHATBOT_CONFIG.brandName}'s AI Assistant`}
          aria-hidden={!isOpen}
          className={`fixed w-[calc(100vw-1.5rem)] max-w-[480px] origin-bottom-right overflow-hidden rounded-2xl border border-white/60 bg-white/75 text-ink shadow-2xl shadow-zinc-900/25 backdrop-blur-2xl backdrop-saturate-150 transition-all ease-out motion-reduce:transition-none ${
            isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"
          }`}
          inert={!isOpen}
          ref={panelRef}
          role="dialog"
          style={{ bottom: "6rem", isolation: "isolate", right: "1rem", transitionDuration: `${PANEL_TRANSITION_MS}ms`, zIndex: TOP_LAYER }}
          tabIndex={-1}
        >
          {/* Glass sheen — a soft top-down highlight, the way a glossy iOS surface catches light. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 via-white/10 to-transparent"
          />

          <div className="relative flex items-center justify-between gap-3 border-b border-white/50 bg-white/40 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <Image alt="" className="size-9 shrink-0 rounded-full" height={36} src="/chatbot-icon.webp" width={36} />
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  Dexter
                  <span className="inline-flex items-center rounded-full bg-red/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-red">
                    AI
                  </span>
                </p>
                <p className="flex items-center gap-1 text-xs text-ink-soft">
                  <FiZap aria-hidden="true" className="size-3 text-red" />
                  {CHATBOT_CONFIG.brandName}&apos;s AI assistant · Replies instantly
                </p>
              </div>
            </div>
            <button aria-label="Close chatbot" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line-light bg-parchment-alt text-ink-soft transition hover:border-red/30 hover:text-red" onClick={closeChatbot} type="button">
              <FiX />
            </button>
          </div>

          <div className="relative overflow-y-auto p-4" data-chatbot-scroll style={{ maxHeight: "min(74dvh, 720px)" }}>
            {showBackButton ? (
              <button className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-ink-soft hover:text-red" onClick={() => setStep("type")} type="button">
                <FiChevronLeft /> Back
              </button>
            ) : null}

            {step === "workflow" && currentWorkflowQuestion ? (
              <div className="animate-[hvc-fade_300ms_ease] space-y-4 motion-reduce:animate-none">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red">Quick workflow check</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{currentWorkflowQuestion.question}</p>
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-red/10">
                    <div
                      className="h-full rounded-full bg-red transition-all duration-300"
                      style={{ width: `${((workflowIndex + 1) / CHATBOT_WORKFLOW_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-ink-soft">
                    Question {workflowIndex + 1} of {CHATBOT_WORKFLOW_QUESTIONS.length}
                  </p>
                </div>
                <div className="grid gap-2">
                  {currentWorkflowQuestion.options.map((option) => (
                    <button className={OPTION_BUTTON_CLASS} key={option.label} onClick={() => answerWorkflowQuestion(option)} type="button">
                      <span className="flex-1">{option.label}</span>
                      <FiChevronRight aria-hidden="true" className="shrink-0 text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-red" />
                    </button>
                  ))}
                </div>
                <button className="text-xs font-semibold text-ink-soft underline hover:text-red" onClick={() => setStep("type")} type="button">
                  Skip and open enquiry form
                </button>
              </div>
            ) : null}

            {step === "workflow-form" && workflowResult ? (
              <form className="animate-[hvc-fade_300ms_ease] space-y-3 motion-reduce:animate-none" onSubmit={submitWorkflowLead}>
                <div>
                  <button className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-ink-soft hover:text-red" onClick={startWorkflowQuiz} type="button">
                    <FiChevronLeft /> Retake the quiz
                  </button>
                  <p className="text-xs font-bold uppercase tracking-wide text-red">Product enquiry</p>
                  <p className="mt-1 text-sm font-semibold text-ink">Share your details to get the right recommendation.</p>
                  <p className="mt-1 text-xs text-ink-soft">Suggested product: {workflowResult.productName}</p>
                </div>
                <input aria-hidden="true" autoComplete="off" className="hidden" name="website" tabIndex={-1} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {WORKFLOW_LEAD_FIELDS.map((field) => (
                    <Field
                      category="workflow"
                      errors={workflowLeadErrors}
                      field={field}
                      key={field.name}
                      onChange={(name, value) => setWorkflowLead((current) => ({ ...current, [name]: value }))}
                      values={workflowLead}
                    />
                  ))}
                </div>
                {serverError ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700" role="alert">
                    {serverError}
                  </p>
                ) : null}
                <button className={SUBMIT_BUTTON_CLASS} disabled={workflowSaving} type="submit">
                  {workflowSaving ? "Submitting..." : "Continue to recommendation"} <FiSend />
                </button>
              </form>
            ) : null}

            {step === "workflow-result" && workflowResult ? (
              <div className="animate-[hvc-fade_300ms_ease] space-y-4 text-center motion-reduce:animate-none">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50">
                  <FiCheckCircle className="text-4xl text-green-600" />
                </span>
                <div>
                  <p className="text-lg font-bold text-ink">Recommended starting point</p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">Based on your answers, start with {workflowResult.productName}.</p>
                </div>
                <a className={`${SUBMIT_BUTTON_CLASS} no-underline`} href={workflowResult.href}>
                  View product page
                </a>
                <button className="text-xs font-semibold text-ink-soft underline hover:text-red" onClick={() => setStep("type")} type="button">
                  Open regular enquiry form
                </button>
                {workflowLeadId ? <p className="text-xs text-ink-soft">Reference ID: {workflowLeadId}</p> : null}
              </div>
            ) : null}

            {step === "chat" ? (
              <div className="animate-[hvc-fade_300ms_ease] motion-reduce:animate-none">
                <DexterChat onFallback={() => setStep("type")} />
              </div>
            ) : null}

            {step === "type" ? (
              <div className="animate-[hvc-fade_300ms_ease] space-y-4 motion-reduce:animate-none">
                <div className="flex items-start gap-2.5">
                  <Image alt="" className="mt-0.5 size-8 shrink-0 rounded-full" height={32} src="/chatbot-icon.webp" width={32} />
                  <div className="rounded-2xl rounded-tl-sm bg-parchment-alt px-3.5 py-2.5 text-sm leading-5 text-ink">
                    Hi! I can help you find the right instrument, request a quote, or get support. What would you like to do?
                  </div>
                </div>
                <button
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-soft transition hover:text-red"
                  onClick={() => setStep("chat")}
                  type="button"
                >
                  <FiChevronLeft aria-hidden /> Back to chat
                </button>
                <div className="grid gap-2">
                  {CHATBOT_ENQUIRY_TYPES.map((item) => {
                    const Icon = ENQUIRY_ICONS[item.category] ?? FiBox;
                    return (
                      <button className={OPTION_BUTTON_CLASS} key={item.category} onClick={() => chooseType(item.category)} type="button">
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-red/10 text-red">
                          <Icon aria-hidden="true" />
                        </span>
                        <span className="flex-1">
                          <span className="block">{item.label}</span>
                          <span className="block text-xs font-normal text-ink-soft">{item.blurb}</span>
                        </span>
                        <FiChevronRight aria-hidden="true" className="shrink-0 text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-red" />
                      </button>
                    );
                  })}
                </div>
                <button
                  className="group flex w-full items-center gap-3 rounded-xl border border-red/20 bg-red/5 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-red/40 hover:bg-red/10"
                  onClick={startWorkflowQuiz}
                  type="button"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-red text-white">
                    <FiZap aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-ink">Not sure what you need?</span>
                    <span className="block text-xs text-ink-soft">Take our 30-second product finder</span>
                  </span>
                  <FiArrowRight aria-hidden="true" className="shrink-0 text-ink-soft transition group-hover:translate-x-0.5 group-hover:text-red" />
                </button>
              </div>
            ) : null}

            {step === "form" ? (
              <form className="animate-[hvc-fade_300ms_ease] space-y-3 motion-reduce:animate-none" onSubmit={submitForm}>
                <div>
                  <p className="text-sm font-semibold text-ink">{CHATBOT_ENQUIRY_TYPES.find((item) => item.category === category)?.label}</p>
                </div>
                <input aria-hidden="true" autoComplete="off" className="hidden" name="website" tabIndex={-1} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {fields.map((field) => (
                    <Field
                      blankOption
                      category={category}
                      errors={errors}
                      field={field}
                      key={field.name}
                      onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
                      values={values}
                    />
                  ))}
                </div>
                {serverError ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700" role="alert">
                    {serverError}
                  </p>
                ) : null}
                <button className={SUBMIT_BUTTON_CLASS} disabled={submitting} type="submit">
                  {submitting ? "Submitting..." : "Submit enquiry"} <FiSend />
                </button>
              </form>
            ) : null}

            {step === "success" ? (
              <div className="animate-[hvc-fade_300ms_ease] space-y-4 text-center motion-reduce:animate-none">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50">
                  <FiCheckCircle className="text-4xl text-green-600" />
                </span>
                <div>
                  <p className="text-lg font-bold text-ink">Thank you</p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">Your enquiry has been submitted. Our team will contact you shortly.</p>
                </div>
                {success?.id ? <p className="text-xs text-ink-soft">Reference ID: {success.id}</p> : null}
                <button className="inline-flex h-10 items-center justify-center rounded-xl border border-line-light px-4 text-sm font-bold text-ink transition hover:border-red/35 hover:text-red" onClick={resetFlow} type="button">
                  Start another enquiry
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>,
    document.body
  );
}
