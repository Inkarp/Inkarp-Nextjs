"use client";

import Link from "next/link";
import { pushEvent } from "@/lib/analytics";

const DEFAULT_CLASS =
  "inline-flex h-12 w-full items-center justify-center border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100";

/** The "Request Quote" CTA on a product page hero — tagged per product so each click is attributable. */
export default function RequestQuoteButton({ className, href, product }) {
  return (
    <Link
      className={className ?? DEFAULT_CLASS}
      href={href}
      onClick={() => pushEvent("request_quote_clicked", { product_name: product?.name, product_slug: product?.slug })}
    >
      Request Quote
    </Link>
  );
}
