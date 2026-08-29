"use client";

import Link from "next/link";
import { FiSend } from "react-icons/fi";
import { pushEvent } from "@/lib/analytics";

const DEFAULT_CLASS =
  "inline-flex h-14 w-full items-center justify-center gap-2 border border-rose-200 bg-rose-50 px-6 text-base font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100";

/**
 * The immediate, single-product enquiry CTA on a product page hero — distinct from
 * "Add to Quote List", which shortlists the product instead of contacting us right away.
 * Tagged per product so each click is attributable.
 */
export default function RequestQuoteButton({ className, href, product }) {
  return (
    <Link
      className={className ?? DEFAULT_CLASS}
      href={href}
      onClick={() => pushEvent("request_quote_clicked", { product_name: product?.name, product_slug: product?.slug })}
    >
      <FiSend className="shrink-0" />
      Enquire Now
    </Link>
  );
}
