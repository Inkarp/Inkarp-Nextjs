"use client";

import { useRouter } from"next/navigation";
import { useRef, useState } from"react";
import {
  FiAlertCircle,
  FiArrowUp,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiGrid,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiX,
} from"react-icons/fi";
import { LuFileText, LuFileUp } from "react-icons/lu";
import { collectTracking } from"@/lib/browserTracking";
import SubmitButton from"@/components/common/SubmitButton";
import styles from "./CareersForm.module.css";

const initialFormData = {
  name:"",
  email:"",
  phone:"",
  role:"",
  location:"",
  department:"",
  message:"",
};

const fields = [
  { name:"name", label:"Full Name", placeholder:"Enter your full name", type:"text", icon: FiUser },
  { name:"email", label:"Email", placeholder:"Enter your email", type:"email", icon: FiMail },
  { name:"phone", label:"Phone", placeholder:"Enter phone number", type:"tel", icon: FiPhone },
  { name:"role", label:"Position", placeholder:"Enter your position", type:"text", icon: FiBriefcase },
  { name:"location", label:"Preferred Location", placeholder:"Enter preferred location", type:"text", icon: FiMapPin },
  { name:"department", label:"Department", placeholder:"Enter department name", type:"text", icon: FiGrid },
];

const FIELD_BY_NAME = Object.fromEntries(fields.map((field) => [field.name, field]));

// The form's numbered steps; step 03 (resume) and 04 (message) are laid out below.
const GROUPS = [
  { step:"01", title:"About you", fields: ["name","email","phone"] },
  { step:"02", title:"The role you want", fields: ["role","location","department"] },
];

// Everything required, in the order it appears: ticks off in the side panel and
// fills the submit button.
const CHECKLIST = [
  ...fields.map((field) => ({ key: field.name, label: field.label })),
  { key:"resume", label:"Resume" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isItemDone(key, formData, selectedFile) {
  if (key === "resume") return Boolean(selectedFile);
  const value = (formData[key] || "").trim();
  if (key === "email") return EMAIL_PATTERN.test(value);
  return value.length > 0;
}

const INPUT_CLASS =
  "h-12 w-full border border-line-light bg-parchment-alt/40 pl-11 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 hover:border-ink/25 focus:border-red focus:bg-white focus:ring-4 focus:ring-red/10";

const allowedTypes = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CareersForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState({ type:"", message:"" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validateAndSetFile = (file) => {
    if (!file) {
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setStatus({
        type:"error",
        message:"Please upload a PDF or Word document",
      });
      return false;
    }

    // 4MB, not 5: serverless hosts (Vercel) cap request bodies at ~4.5MB, so a
    // larger upload is rejected with a 413 before the route handler ever runs.
    if (file.size > 4 * 1024 * 1024) {
      setStatus({
        type:"error",
        message:"File size should be less than 4MB",
      });
      return false;
    }

    setSelectedFile(file);
    setStatus({ type:"", message:"" });
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!validateAndSetFile(file)) {
      event.target.value ="";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value ="";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    // Replaces the `required` attribute the hidden file input can no longer
    // carry — without this a missing resume would reach the API and 400.
    if (!selectedFile) {
      setStatus({
        type: "error",
        message: "Please attach your resume (PDF or Word, up to 4MB) before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type:"", message:"" });

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value ??"");
      });
      Object.entries(collectTracking()).forEach(([key, value]) => {
        formDataToSend.append(key, value ??"");
      });

      if (selectedFile) {
        formDataToSend.append("resume", selectedFile);
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 45000);

      const response = await fetch("/api/careers/submit",
        {
          body: formDataToSend,
          method:"POST",
          signal: controller.signal,
        }
      );

      window.clearTimeout(timeoutId);
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus({
          type:"success",
          message:"Application submitted successfully! Redirecting...",
        });
        setFormData(initialFormData);
        removeFile();
        event.target.reset();
        window.setTimeout(() => router.push("/thank-you"), 200);
      } else {
        setStatus({
          type:"error",
          message:
            data?.message ||
            `Server error (${response.status}). Please try again.`,
        });
      }
    } catch (error) {
      const isAbort = error?.name ==="AbortError";

      setStatus({
        type:"error",
        message: isAbort
          ?"The application is taking longer than expected. Please try again in a moment."
          :"Couldn't reach the server. Please try again or check your network.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const doneCount = CHECKLIST.filter((item) => isItemDone(item.key, formData, selectedFile)).length;
  const progress = doneCount / CHECKLIST.length;

  const renderField = (name, wide = false) => {
    const { label, placeholder, type, icon: Icon } = FIELD_BY_NAME[name];
    const done = isItemDone(name, formData, selectedFile);
    return (
      <div className={`group ${wide ? "sm:col-span-2" : ""}`} key={name}>
        <label
          className="mb-2 flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft"
          htmlFor={name}
        >
          <span>
            {label} <span className="text-red">*</span>
          </span>
          {done ? <FiCheck aria-hidden="true" className="size-3.5 text-emerald-600" /> : null}
        </label>
        <div className="relative">
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft transition-colors group-focus-within:text-red"
          />
          <input
            className={INPUT_CLASS}
            id={name}
            name={name}
            onChange={handleChange}
            placeholder={placeholder}
            required
            type={type}
            value={formData[name]}
          />
        </div>
      </div>
    );
  };

  return (
    <section
      className="relative mx-auto max-w-[1180px] scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      id="careers-form"
    >
      <div className={`${styles.frame} grid border border-line-light bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]`}>
        {/* ── Side panel: heading + a checklist that ticks as the form fills ── */}
        <aside className={`${styles.aside} flex flex-col p-6 text-white sm:p-8 lg:p-10`}>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/75">
            <span aria-hidden="true" className="h-px w-[22px] bg-[#ff3b4a]" />
            Careers at Inkarp
          </span>
          <h2 className="mt-4 text-[28px] leading-[1.05] tracking-tight text-white sm:text-4xl">
            Apply to Join Our Team
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Tell us a bit about yourself and attach your resume — our team reviews every application personally.
          </p>

          <div className="mt-8 lg:mt-12">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/60">Your application</p>
              <p className="font-mono text-sm tabular-nums text-white">
                {doneCount}
                <span className="text-white/50"> / {CHECKLIST.length}</span>
              </p>
            </div>
            <div aria-hidden="true" className="mt-3 h-1 bg-white/10">
              <div className={`${styles.meter} h-full bg-[#ff3b4a]`} style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            {/* Phones show just the count and bar: the list would repeat the fields right below it. */}
            <ul aria-label="Application checklist" className="mt-5 hidden grid-cols-2 gap-x-4 gap-y-3 sm:grid lg:grid-cols-1">
              {CHECKLIST.map((item) => {
                const done = isItemDone(item.key, formData, selectedFile);
                return (
                  <li className="flex items-center gap-3 text-sm" key={item.key}>
                    <span
                      aria-hidden="true"
                      className={`${styles.tick} flex size-5 shrink-0 items-center justify-center border ${
                        done ? "border-[#ff3b4a] bg-[#ff3b4a] text-white" : "border-white/30"
                      }`}
                    >
                      {done ? <FiCheck className="size-3.5" /> : null}
                    </span>
                    <span className={done ? "text-white" : "text-white/60"}>
                      {item.label}
                      <span className="sr-only">{done ? ", done" : ", to do"}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <a
            className="group mt-auto hidden items-center gap-2 border-t border-white/15 pt-5 text-sm font-semibold text-white/80 transition hover:text-white lg:flex"
            href="#open-roles"
          >
            <FiArrowUp
              aria-hidden="true"
              className="size-4 text-[#ff3b4a] transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none"
            />
            Applying for a listed role? Browse open roles
          </a>
        </aside>

        {/* ── The form, in numbered steps ── */}
        <form className="space-y-9 p-6 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
          {status.message ? (
            <div
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                status.type ==="success"
                  ?"bg-green-100 text-green-700"
                  :"bg-red-100 text-red"
              }`}
              role={status.type === "success" ? "status" : "alert"}
            >
              {status.type ==="success" ? (
                <FiCheckCircle className="size-5 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="size-5 flex-shrink-0" />
              )}
              {status.message}
            </div>
          ) : null}

          {GROUPS.map((group) => (
            <fieldset key={group.step}>
              <StepLegend step={group.step} title={group.title} />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {group.fields.map((name, index) => renderField(name, index === 0))}
              </div>
            </fieldset>
          ))}

          <fieldset>
            <StepLegend step="03" title="Resume" />
            {selectedFile ? (
              <div className="flex items-center gap-4 border border-l-4 border-line-light border-l-red bg-white px-4 py-3.5">
                <span className="flex size-11 shrink-0 items-center justify-center bg-red/5 text-red">
                  <LuFileText aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{selectedFile.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                    {formatFileSize(selectedFile.size)} · ready to send
                  </p>
                </div>
                <button
                  aria-label="Remove file"
                  className="flex size-9 shrink-0 items-center justify-center border border-line-light text-ink-soft transition hover:border-red hover:text-red"
                  onClick={removeFile}
                  type="button"
                >
                  <FiX className="size-4" />
                </button>
              </div>
            ) : (
              <label
                className={`flex cursor-pointer items-center gap-4 border-2 border-dashed px-4 py-5 transition sm:gap-5 sm:px-6 sm:py-6 ${
                  isDragging
                    ?"border-red bg-red/5"
                    :"border-line-light bg-parchment-alt/50 hover:border-red/50 hover:bg-white"
                }`}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDrop={handleDrop}
              >
                <span className="flex size-12 shrink-0 items-center justify-center bg-red text-white sm:size-14">
                  <LuFileUp aria-hidden="true" className="size-6" />
                </span>
                <span className="block">
                  <span className="block text-sm font-semibold text-ink sm:text-base">
                    {isDragging ? "Drop it here" : (
                      <>
                        Drop your resume here, or{" "}
                        <span className="text-red underline decoration-red/40 underline-offset-4">browse</span>
                      </>
                    )}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                    PDF or Word · up to 4MB
                  </span>
                </span>
                {/* No `required` here: the input is display:none, and browsers
                    refuse to submit a form containing an invalid control they
                    cannot focus — it blocked submit silently with
                    "An invalid form control with name='' is not focusable".
                    The resume is validated in handleSubmit instead. */}
                <input
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  name="resume"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  type="file"
                />
              </label>
            )}
          </fieldset>

          <fieldset>
            <StepLegend optional step="04" title="Anything else" />
            <label className="sr-only" htmlFor="message">
              Additional Message
            </label>
            <textarea
              className="w-full border border-line-light bg-parchment-alt/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 hover:border-ink/25 focus:border-red focus:bg-white focus:ring-4 focus:ring-red/10"
              id="message"
              name="message"
              onChange={handleChange}
              placeholder="Any additional information"
              rows="4"
              value={formData.message}
            />
          </fieldset>

          <div className="flex flex-col-reverse gap-4 border-t border-line-light pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-soft">
              Fields marked <span className="text-red">*</span> are required.
            </p>
            {/* Fills red as the checklist is completed (the site's progress button). */}
            <SubmitButton
              className="w-full border border-rose-200 bg-rose-50 px-8 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[320px]"
              doneLabel="Application sent"
              progress={progress}
              progressLabel={`${doneCount} of ${CHECKLIST.length} done · Submit application`}
              sending={isSubmitting}
              sendingLabel="Submitting..."
              succeeded={status.type ==="success"}
            >
              Submit Application
            </SubmitButton>
          </div>
        </form>
      </div>
    </section>
  );
}

function StepLegend({ optional = false, step, title }) {
  return (
    <legend className="mb-5 w-full">
      <span className="flex items-center gap-3">
        <span className="font-mono text-xs tabular-nums text-red">{step}</span>
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">{title}</span>
        {optional ? (
          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft">Optional</span>
        ) : null}
        <span aria-hidden="true" className="h-px flex-1 bg-line-light" />
      </span>
    </legend>
  );
}
