"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";

/**
 * Shows "Sign in" or "My account" in the header. Renders nothing until the
 * session is known, so a signed-in visitor never sees "Sign in" flash first.
 */
export default function AccountLink({ className = "" }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : Promise.reject(response)))
      .then((data) => {
        if (!cancelled) setState(data?.signedIn ? "in" : "out");
      })
      .catch(() => {
        if (!cancelled) setState("out");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === null) return null;

  return (
    <Link
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition hover:text-red ${className}`}
      href={state === "in" ? "/account" : "/signin"}
    >
      <FiUser aria-hidden className="size-4" />
      {state === "in" ? "My account" : "Sign in"}
    </Link>
  );
}
