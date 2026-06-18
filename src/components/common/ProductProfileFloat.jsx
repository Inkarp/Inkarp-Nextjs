"use client";

import { useState } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";

const initialFormData = {
  name: "",
  email: "",
  interests: "",
  message: "",
};

export default function ProductProfileFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          inquiryType: "Feedback Form",
          message: `Interests: ${formData.interests}\n\n${formData.message}`,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus({
          type: "success",
          message: "Thank you! Your feedback is submitted successfully.",
        });
        setFormData(initialFormData);
        window.setTimeout(() => {
          setIsOpen(false);
          setStatus({ type: "", message: "" });
        }, 2500);
      } else {
        setStatus({
          type: "error",
          message: data?.message ||
            "Unable to submit feedback. Please try again later.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Unable to submit feedback. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-end gap-3 text-sm">
      {isOpen && (
        <div className="w-[320px] rounded-[32px] border border-[#BE0010] bg-white p-5 shadow-2xl shadow-zinc-900/15">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE0010]">
                Feedback
              </p>
              <h2 className="mt-1 font-maxot text-lg text-zinc-900">
                Share your interests
              </h2>
            </div>
            <button
              aria-label="Close feedback form"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <FiX />
            </button>
          </div>

          {status.message ? (
            <div
              className={`mb-4 rounded-2xl border p-3 text-xs font-medium ${
                status.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-600">
                Name
              </label>
              <input
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                name="name"
                onChange={handleChange}
                placeholder="Your name"
                required
                type="text"
                value={formData.name}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-600">
                Email
              </label>
              <input
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                name="email"
                onChange={handleChange}
                placeholder="Your email"
                required
                type="email"
                value={formData.email}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-600">
                Interests
              </label>
              <select
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                name="interests"
                onChange={handleChange}
                required
                value={formData.interests}
              >
                <option value="">Choose an interest</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Consumables">Consumables</option>
                <option value="Analytical Support">Analytical Support</option>
                <option value="Application Training">Application Training</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-600">
                Message
              </label>
              <textarea
                className="min-h-[90px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
                name="message"
                onChange={handleChange}
                placeholder="Tell us more about your interests"
                value={formData.message}
              />
            </div>

            <button
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#BE0010] to-[#E63946] px-4 py-3 text-sm font-semibold text-white transition ${
                isSubmitting ? "cursor-not-allowed opacity-80" : "hover:opacity-95"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting…" : "Submit feedback"}
              <FiSend />
            </button>
          </form>
        </div>
      )}

      <button
        aria-label={isOpen ? "Close feedback form" : "Open feedback form"}
        className="inline-flex min-h-[52px] min-w-[52px] items-center justify-center rounded-full border border-[#BE0010] bg-white p-3 text-[#BE0010] shadow-lg shadow-zinc-900/15 transition hover:bg-[#fdf2f2] gap-2"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isOpen ? <FiX className="text-xl" /> : <FiMessageCircle className="text-xl" />}
       <span>Feedback</span> 
      </button>
    </div>
  );
}
