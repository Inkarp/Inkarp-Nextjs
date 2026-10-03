"use client";

import Link from "next/link";
import { FaRupeeSign, FaTruckLoading, FaWhatsapp } from "react-icons/fa";
import { FiArrowRight, FiFileText, FiTool, FiUsers } from "react-icons/fi";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import RecTag from "@/components/home/RecTag";
import { contactDirectory } from "@/data/contactDirectory";
import { gmailComposeHref, whatsappEnquiryHref } from "@/data/siteConfig";
import { pushEvent } from "@/lib/analytics";

// Icons per department; the contacts themselves live in contactDirectory.
const ICONS = {
  sales: FiFileText,
  service: FiTool,
  import: FaTruckLoading,
  accounts: FaRupeeSign,
  hr: FiUsers,
};

const actionClass =
  "group/link flex min-w-0 items-center gap-3 bg-parchment-alt px-3.5 py-3 text-left text-xs font-medium text-ink transition-colors duration-200 outline-none hover:bg-rose-100 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-red/40";

export default function SupportSection() {
  return (
    <section className="border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8" id="departments">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 max-w-2xl" data-reveal>
          <RecTag>Department directory</RecTag>
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Who should I <em className="italic text-red">contact?</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            Know which team you need? Reach them directly.
          </p>
        </div>

        {/* Six-column grid: the two main desks take half a row each, the
            three back-office teams a third. */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {contactDirectory.map((item) => {
            const Icon = ICONS[item.id];

            return (
              <article
                aria-label={item.title}
                className={`flex flex-col border border-line-light bg-white p-6 transition duration-200 hover:border-red/35 ${
                  item.primary ? "border-t-2 border-t-red lg:col-span-3" : "lg:col-span-2"
                } ${item.id === "hr" ? "md:col-span-2" : ""}`}
                data-scroll-reveal="true"
                key={item.id}
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center bg-parchment-alt text-red">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.summary}</p>
                  </div>
                </div>

                <ul className={`mt-5 grid gap-2.5 ${item.primary ? "sm:grid-cols-2" : ""}`}>
                  <li className="min-w-0">
                    <a
                      aria-label={`Email ${item.email}`}
                      className={actionClass}
                      href={gmailComposeHref(item.email, `Enquiry — ${item.title}`)}
                      onClick={() => pushEvent("email_clicked", { source: "contact_directory", department: item.title })}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <MdEmail aria-hidden="true" className="size-4 shrink-0 text-red" />
                      <span className="truncate">{item.email}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label={`Call +91 ${item.phone}`}
                      className={actionClass}
                      href={`tel:+91${item.phone}`}
                      onClick={() => pushEvent("phone_clicked", { source: "contact_directory", department: item.title })}
                    >
                      <MdLocalPhone aria-hidden="true" className="size-4 shrink-0 text-red" />
                      +91 {item.phone}
                    </a>
                  </li>
                  {item.whatsapp ? (
                    <li>
                      <a
                        className={actionClass}
                        href={whatsappEnquiryHref()}
                        onClick={() => pushEvent("whatsapp_clicked", { source: "contact_directory", department: item.title })}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <FaWhatsapp aria-hidden="true" className="size-4 shrink-0 text-[#25D366]" />
                        WhatsApp us
                      </a>
                    </li>
                  ) : null}
                  {item.link ? (
                    <li>
                      <Link className={`${actionClass} font-semibold`} href={item.link.href}>
                        <FiArrowRight aria-hidden="true" className="size-4 shrink-0 text-red" />
                        {item.link.label}
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
