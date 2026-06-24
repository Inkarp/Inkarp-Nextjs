import { FaRupeeSign, FaTruckLoading } from "react-icons/fa";
import { MdEmail, MdLocalPhone, MdOutlineMail } from "react-icons/md";

const supportData = [
  {
    title: "Import / Logistics / Customs\nRelated Enquiries",
    email: "saritha@inkarp.co.in",
    phone: "9949018605",
    icon: FaTruckLoading,
  },
  {
    title: "Accounts / Finance Enquiries",
    email: "sundar@inkarp.co.in",
    phone: "7032221890",
    icon: FaRupeeSign,
  },
  {
    title: "HR Enquiries",
    email: "hrd@inkarp.co.in",
    phone: "8886277717",
    icon: MdOutlineMail,
  },
];

export default function SupportSection() {
  return (
    <section className="relative mx-auto flex w-[98%] flex-col justify-center px-4 py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.08),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.08),transparent)] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.12),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.12),transparent)]" />

      <div className="relative mx-auto w-[98%] max-w-4xl space-y-6">
        <div
          className="flex flex-col items-center justify-center gap-3 text-center"
          data-reveal
        >
          <span className="font-maxot rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs uppercase text-zinc-950 sm:text-sm dark:bg-zinc-900 dark:text-zinc-100">
            Contact Us
          </span>
          <h2 className="font-maxot text-3xl text-[#E63946]">
            For Support &amp; Enquiries
          </h2>
          <p className="text-base text-zinc-800 dark:text-zinc-400">
            For smooth coordination, please reach out to the respective teams
            for any of the following queries:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {supportData.map((item) => {
            const Icon = item.icon;

            return (
              <article
                aria-label={item.title.replace(/\n/g, " ")}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(230,57,70,0.15)] dark:border-zinc-800 dark:bg-zinc-900"
                data-scroll-reveal="true"
                key={item.title}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#BE0010] to-[#E63946]"
                />

                <div className="flex flex-col items-center gap-3 p-6 pt-7 text-center">
                  <div className="inline-flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#BE0010] to-[#E63946] text-white shadow-lg shadow-[#BE0010]/20 ring-4 ring-[#fff3f4] dark:ring-zinc-800">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="font-maxot text-lg leading-snug text-zinc-950 dark:text-zinc-100">
                    {item.title.split("\n").map((line) => (
                      <span className="block" key={line}>
                        {line}
                      </span>
                    ))}
                  </h3>

                  <ul className="mt-1 w-full space-y-2">
                    <li>
                      <a
                        aria-label={`Email ${item.email}`}
                        className="flex items-center gap-2.5 rounded-lg bg-[#fef2f2] px-3 py-2.5 text-left text-xs font-semibold text-zinc-700 transition hover:bg-[#BE0010] hover:text-white dark:bg-zinc-800 dark:text-zinc-200"
                        href={`mailto:${item.email}`}
                      >
                        <MdEmail className="shrink-0 text-base text-[#E63946] transition group-hover:text-current" />
                        <span className="truncate">{item.email}</span>
                      </a>
                    </li>
                    <li>
                      <a
                        aria-label={`Call +91 ${item.phone}`}
                        className="flex items-center gap-2.5 rounded-lg bg-[#f5f5f5] px-3 py-2.5 text-left text-xs font-semibold text-zinc-700 transition hover:bg-[#BE0010] hover:text-white dark:bg-zinc-800/70 dark:text-zinc-200"
                        href={`tel:+91${item.phone}`}
                      >
                        <MdLocalPhone className="shrink-0 text-base text-[#E63946] transition group-hover:text-current" />
                        +91 {item.phone}
                      </a>
                    </li>
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
