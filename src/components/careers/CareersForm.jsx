"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUploadCloud,
  FiUser,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  role: "",
  location: "",
  department: "",
  message: "",
};

const fields = [
  { name: "name", label: "Full Name", placeholder: "Enter your full name", type: "text", icon: FiUser },
  { name: "email", label: "Email", placeholder: "Enter your email", type: "email", icon: FiMail },
  { name: "phone", label: "Phone", placeholder: "Enter phone number", type: "tel", icon: FiPhone },
  { name: "role", label: "Position", placeholder: "Enter your position", type: "text", icon: FiBriefcase },
  { name: "location", label: "Preferred Location", placeholder: "Enter preferred location", type: "text", icon: FiMapPin },
  { name: "department", label: "Department", placeholder: "Enter department name", type: "text", icon: FiBriefcase },
];

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
  const [status, setStatus] = useState({ type: "", message: "" });
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
        type: "error",
        message: "Please upload a PDF or Word document",
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        type: "error",
        message: "File size should be less than 5MB",
      });
      return false;
    }

    setSelectedFile(file);
    setStatus({ type: "", message: "" });
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!validateAndSetFile(file)) {
      event.target.value = "";
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
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value ?? "");
      });

      if (selectedFile) {
        formDataToSend.append("resume", selectedFile);
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        "https://inkarppersonal.vercel.app/api/careers/submit",
        {
          body: formDataToSend,
          method: "POST",
          signal: controller.signal,
        }
      );

      window.clearTimeout(timeoutId);
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus({
          type: "success",
          message: "Application submitted successfully! Redirecting...",
        });
        setFormData(initialFormData);
        removeFile();
        event.target.reset();
        window.setTimeout(() => router.push("/thank-you"), 200);
      } else {
        setStatus({
          type: "error",
          message:
            data?.message ||
            `Server error (${response.status}). Please try again.`,
        });
      }
    } catch (error) {
      const isAbort = error?.name === "AbortError";

      setStatus({
        type: "error",
        message: isAbort
          ? "Request timed out. Please try again in a moment or check your connection."
          : "Couldn't reach the server. Please try again or check your network.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8"
      id="careers-form"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.08),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.08),transparent)] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.12),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.12),transparent)]" />

      <div className="flex flex-col items-center justify-center gap-2 pb-8 text-center" data-reveal>
        <span className="font-maxot w-fit rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs uppercase text-zinc-950 sm:text-sm dark:bg-zinc-900 dark:text-zinc-100">
          Careers at Inkarp
        </span>
        <h2 className="font-maxot text-2xl text-zinc-900 sm:text-3xl dark:text-zinc-100">
          Apply to Join Our Team
        </h2>
        <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
          Tell us a bit about yourself and attach your resume - our team
          reviews every application personally.
        </p>
      </div>

      <form
        className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/80 p-1 shadow-xl shadow-[#BE0010]/5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60"
        onSubmit={handleSubmit}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#BE0010] via-[#E63946] to-[#BE0010]"
        />

        <div className="space-y-8 p-5 sm:p-8">
          {status.message ? (
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                status.type === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
              }`}
            >
              {status.type === "success" ? (
                <FiCheckCircle className="size-5 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="size-5 flex-shrink-0" />
              )}
              {status.message}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map(({ name, label, placeholder, type, icon: Icon }) => (
              <div className="group relative" key={name}>
                <label
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                  htmlFor={name}
                >
                  {label} *
                </label>
                <div className="relative">
                  <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#E63946]" />
                  <input
                    className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none transition focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
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
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Resume *
            </label>

            {selectedFile ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E63946]/30 bg-[#fff3f4] px-4 py-3 dark:border-[#E63946]/40 dark:bg-zinc-800">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#E63946] text-white">
                    <FiFileText className="size-4" />
                  </span>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  aria-label="Remove file"
                  className="flex size-7 flex-shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                  onClick={removeFile}
                  type="button"
                >
                  <FiX className="size-4" />
                </button>
              </div>
            ) : (
              <label
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                  isDragging
                    ? "border-[#E63946] bg-[#fff3f4] dark:bg-zinc-800"
                    : "border-zinc-300 hover:border-[#E63946]/60 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/60"
                }`}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDrop={handleDrop}
              >
                <FiUploadCloud className="size-7 text-[#E63946]" />
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold text-[#E63946]">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  PDF or Word, up to 5MB
                </p>
                <input
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required
                  type="file"
                />
              </label>
            )}
          </div>

          <div>
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              htmlFor="message"
            >
              Additional Message
            </label>
            <textarea
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              id="message"
              name="message"
              onChange={handleChange}
              placeholder="Any additional information"
              rows="4"
              value={formData.message}
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              className={`group relative overflow-hidden rounded-full bg-gradient-to-r from-[#BE0010] to-[#E63946] px-10 py-3 font-medium text-white shadow-lg shadow-[#E63946]/30 transition ${
                isSubmitting
                  ? "cursor-not-allowed opacity-70"
                  : "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#E63946]/40"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
