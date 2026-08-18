"use client";

import { useRouter } from"next/navigation";
import { useRef, useState } from"react";
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
} from"react-icons/fi";
import { collectTracking } from"@/lib/browserTracking";
import SectionHeading from"@/components/home/SectionHeading";

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
  { name:"department", label:"Department", placeholder:"Enter department name", type:"text", icon: FiBriefcase },
];

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

  return (
    <section
      className="relative mx-auto max-w-[1180px] scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8"
      id="careers-form"
    >
      <div className="pb-8" data-reveal>
        <SectionHeading
          className="mb-0"
          eyebrow="Careers at Inkarp"
          title="Apply to Join Our Team"
          description="Tell us a bit about yourself and attach your resume — our team reviews every application personally."
        />
      </div>

      <form
        className="relative overflow-hidden border border-line-light bg-white p-1"
        onSubmit={handleSubmit}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-red"
        />

        <div className="space-y-8 p-5 sm:p-8">
          {status.message ? (
            <div
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                status.type ==="success"
                  ?"bg-green-100 text-green-700"
                  :"bg-red-100 text-red"
              }`}
            >
              {status.type ==="success" ? (
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
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft"
                  htmlFor={name}
                >
                  {label} *
                </label>
                <div className="relative">
                  <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft transition-colors group-focus-within:text-red" />
                  <input
                    className="w-full border border-line-light bg-white py-2.5 pl-10 pr-3 text-sm text-ink-soft outline-none transition focus:border-red focus:ring-2 focus:ring-red/30"
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
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Resume *
            </label>

            {selectedFile ? (
              <div className="flex items-center justify-between gap-3 border border-red/30 bg-parchment-alt px-4 py-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="flex size-9 flex-shrink-0 items-center justify-center bg-red text-parchment">
                    <FiFileText className="size-4" />
                  </span>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium text-ink-soft">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  aria-label="Remove file"
                  className="flex size-7 flex-shrink-0 items-center justify-center text-ink-soft transition hover:bg-parchment-alt hover:text-ink-soft"
                  onClick={removeFile}
                  type="button"
                >
                  <FiX className="size-4" />
                </button>
              </div>
            ) : (
              <label
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-8 text-center transition ${
                  isDragging
                    ?"border-red bg-parchment-alt"
                    :"border-line-light hover:border-red/60 hover:bg-parchment-alt"
                }`}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDrop={handleDrop}
              >
                <FiUploadCloud className="size-7 text-red" />
                <p className="text-sm text-ink-soft">
                  <span className="font-semibold text-red">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-ink-soft">
                  PDF or Word, up to 4MB
                </p>
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
          </div>

          <div>
            <label
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft"
              htmlFor="message"
            >
              Additional Message
            </label>
            <textarea
              className="w-full border border-line-light bg-white px-4 py-2.5 text-sm text-ink-soft outline-none transition focus:border-red focus:ring-2 focus:ring-red/30"
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
              className={`group relative overflow-hidden bg-rose-50 px-10 py-3 font-medium text-rose-700 transition ${
                isSubmitting
                  ?"cursor-not-allowed opacity-70"
                  :"hover:-translate-y-0.5 hover:bg-red-soft"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ?"Submitting..." :"Submit Application"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
