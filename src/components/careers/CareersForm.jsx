"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  role: "",
  location: "",
  department: "",
  message: "",
};

export default function CareersForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setStatus({
        type: "error",
        message: "Please upload a PDF or Word document",
      });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        type: "error",
        message: "File size should be less than 5MB",
      });
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setStatus({ type: "", message: "" });
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
        setSelectedFile(null);
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
    <section className="relative mx-auto max-w-5xl py-5">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.08),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.08),transparent)]" />

      <div className="flex items-center justify-center p-5">
        <h2 className="font-maxot w-fit rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs uppercase text-zinc-950 sm:text-sm">
          Apply to Join Our Team
        </h2>
      </div>

      {status.message ? (
        <div
          className={`mb-6 rounded-lg p-4 ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <form
        className="space-y-6 rounded-lg border border-zinc-300 p-5"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Full Name *
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:ring-2 focus:ring-[#E63946]"
              name="name"
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              type="text"
              value={formData.name}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email *</label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:ring-2 focus:ring-[#E63946]"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              required
              type="email"
              value={formData.email}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phone *</label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:ring-2 focus:ring-[#E63946]"
              name="phone"
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              type="tel"
              value={formData.phone}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Position *
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-4 py-2"
              name="role"
              onChange={handleChange}
              placeholder="Enter your position"
              required
              type="text"
              value={formData.role}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Preferred Location *
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-4 py-2"
              name="location"
              onChange={handleChange}
              placeholder="Enter preferred location"
              required
              type="text"
              value={formData.location}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Department *
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-4 py-2"
              name="department"
              onChange={handleChange}
              placeholder="Enter department name"
              required
              type="text"
              value={formData.department}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Resume *</label>
          <input
            accept=".pdf,.doc,.docx"
            className="block w-full rounded-lg border border-zinc-300 p-2 text-sm"
            onChange={handleFileChange}
            required
            type="file"
          />
          {selectedFile ? (
            <p className="mt-2 text-sm text-zinc-600">
              Selected: {selectedFile.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Additional Message
          </label>
          <textarea
            className="w-full rounded-lg border border-zinc-300 px-4 py-2"
            name="message"
            onChange={handleChange}
            placeholder="Any additional information"
            rows="4"
            value={formData.message}
          />
        </div>

        <div className="flex justify-center">
          <button
            className={`rounded-lg bg-[#E63946] px-8 py-3 font-medium text-white transition ${
              isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-red-600"
            }`}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </section>
  );
}
