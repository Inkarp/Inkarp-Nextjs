"use client";

import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

const initialFormData = {
  name: "",
  designation: "",
  email: "",
  department: "",
  institutionName: "",
  mobileNumber: "",
};

export default function CatalystModal({ onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const backdropRef = useRef(null);

  useEffect(() => {
    if (status !== "success") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      window.location.href = "/thank-you";
    }, 300);

    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === backdropRef.current) {
      onClose?.();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://inkarppersonal.vercel.app/api/catalyst/register",
        {
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }
      );
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus("success");
        setFormData(initialFormData);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Catalyst submit error:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      ref={backdropRef}
      role="dialog"
    >
      <div className="relative z-10 mx-auto max-w-md">
        <div className="relative space-y-2 rounded-lg bg-white/90 p-6 shadow-lg">
          <h2 className="font-maxot text-lg font-semibold md:text-xl">
            Request a Physical Copy
          </h2>
          <p className="mb-4 text-sm text-neutral-600">
            Fill in your details and our team will contact you for delivery
            confirmation.
          </p>

          <button
            aria-label="Close"
            className="absolute right-4 top-4 cursor-pointer rounded-full border border-black/30 p-1 transition hover:border-black hover:bg-white/20"
            onClick={onClose}
            type="button"
          >
            <MdClose className="text-2xl" />
          </button>

          <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-full border border-zinc-400 px-3 py-2"
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              required
              value={formData.name}
            />
            <input
              className="w-full rounded-full border border-zinc-400 px-3 py-2"
              name="designation"
              onChange={handleChange}
              placeholder="Designation"
              value={formData.designation}
            />
            <input
              className="w-full rounded-full border border-zinc-400 px-3 py-2"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
              type="email"
              value={formData.email}
            />
            <input
              className="w-full rounded-full border border-zinc-400 px-3 py-2"
              name="department"
              onChange={handleChange}
              placeholder="Department"
              value={formData.department}
            />
            <input
              className="w-full rounded-full border border-zinc-400 px-3 py-2"
              name="institutionName"
              onChange={handleChange}
              placeholder="Institution Name"
              required
              value={formData.institutionName}
            />
            <input
              className="w-full rounded-full border border-zinc-400 px-3 py-2"
              name="mobileNumber"
              onChange={handleChange}
              placeholder="Mobile Number"
              required
              value={formData.mobileNumber}
            />

            <button
              className="w-full rounded-full bg-[#BE0010] py-2.5 text-white hover:bg-[#e01b2a] disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            {status === "success" ? (
              <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-green-700">
                Registration successful! Redirecting...
              </div>
            ) : null}

            {status === "error" ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
                Something went wrong. Please try again.
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
