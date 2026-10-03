"use client";

import { FaRupeeSign, FaTruckLoading } from"react-icons/fa";
import { MdEmail, MdLocalPhone, MdOutlineMail } from"react-icons/md";
import RecTag from"@/components/home/RecTag";
import { contactDirectory } from"@/data/contactDirectory";
import { gmailComposeHref } from"@/data/siteConfig";
import { pushEvent } from"@/lib/analytics";

// Icons per department; the contacts themselves live in contactDirectory.
const ICONS = {
  import: FaTruckLoading,
  accounts: FaRupeeSign,
  hr: MdOutlineMail,
};

export default function SupportSection() {
  return (
    <section className="border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] space-y-10">
        {/* Heading */}
        <div
          className="flex flex-col items-center justify-center gap-3 text-center"
          data-reveal
        >
          <RecTag>Contact Us</RecTag>
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            For Support &amp; <em className="italic text-red">Enquiries</em>
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            For smooth coordination, please reach out to the respective teams
            for any of the following queries:
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contactDirectory.map((item) => {
            const Icon = ICONS[item.id];
            const department = item.title.replace(/\n/g," ");

            return (
              <article
                aria-label={department}
                className="flex flex-col border border-line-light bg-white p-6 transition duration-200 hover:border-red/35"
                data-scroll-reveal="true"
                key={item.title}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="inline-flex size-14 items-center justify-center bg-parchment-alt text-red">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="min-h-[3.5rem] text-lg font-semibold leading-snug text-ink">
                    {item.title.split("\n").map((line) => (
                      <span className="block" key={line}>
                        {line}
                      </span>
                    ))}
                  </h3>
                </div>

                <ul className="mt-4 w-full space-y-2.5">
                  <li>
                    <a
                      aria-label={`Email ${item.email}`}
                      className="group/link flex items-center gap-3 bg-parchment-alt px-3.5 py-3 text-left text-xs font-medium text-ink transition-colors duration-200 outline-none hover:bg-rose-100 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-red/40"
                      href={gmailComposeHref(item.email, `Enquiry — ${department}`)}
                      onClick={() => pushEvent("email_clicked", { source:"contact_directory", department })}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <MdEmail className="size-4 shrink-0 text-red transition-colors duration-200 group-hover/link:text-parchment" />
                      <span className="truncate">{item.email}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label={`Call +91 ${item.phone}`}
                      className="group/link flex items-center gap-3 bg-parchment-alt px-3.5 py-3 text-left text-xs font-medium text-ink transition-colors duration-200 outline-none hover:bg-rose-100 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-red/40"
                      href={`tel:+91${item.phone}`}
                      onClick={() => pushEvent("phone_clicked", { source:"contact_directory", department })}
                    >
                      <MdLocalPhone className="size-4 shrink-0 text-red transition-colors duration-200 group-hover/link:text-parchment" />
                      +91 {item.phone}
                    </a>
                  </li>
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}