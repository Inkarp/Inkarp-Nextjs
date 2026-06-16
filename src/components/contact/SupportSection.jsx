import { FaRupeeSign, FaTruckLoading } from "react-icons/fa";
import { MdEmail, MdLocalPhone, MdOutlineMail } from "react-icons/md";
import ContactForm from "@/components/contact/ContactForm";
import ContactNew from "@/components/contact/ContactNew";

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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.08),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.08),transparent)]" />

      <div className="relative mx-auto w-[98%] max-w-4xl space-y-6">
        <div
          className="flex flex-col items-center justify-center gap-3 text-center"
          data-scroll-reveal="true"
        >
          <span className="font-maxot rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs uppercase text-zinc-950 sm:text-sm">
            Contact Us
          </span>
          <h2 className="font-maxot text-3xl text-[#E63946]">
            For Support &amp; Enquiries
          </h2>
          <p className="text-base text-zinc-800">
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
                className="group relative rounded-lg border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#E63946]/45 hover:shadow-[0_14px_40px_rgba(230,57,70,0.15)]"
                data-scroll-reveal="true"
                key={item.title}
              >
                <div className="flex flex-col items-center gap-3 p-6 text-center text-[#111827]">
                  <div className="inline-grid size-12 place-items-center rounded-lg bg-[#BE0010]">
                    <span className="block will-change-transform group-hover:animate-[spin_0.6s_linear_1]">
                      <Icon className="size-7 text-white" />
                    </span>
                  </div>

                  <h3 className="font-maxot text-lg leading-snug text-[#E63946]">
                    {item.title.split("\n").map((line) => (
                      <span className="block" key={line}>
                        {line}
                      </span>
                    ))}
                  </h3>

                  <ul className="space-y-2">
                    <li className="text-sm">
                      <a
                        aria-label={`Email ${item.email}`}
                        className="inline-flex items-center gap-2 font-semibold text-[#333] hover:text-[#E63946] hover:underline"
                        href={`mailto:${item.email}`}
                      >
                        <MdEmail className="shrink-0 text-base text-[#E63946]" />
                        {item.email}
                      </a>
                    </li>
                    <li className="text-sm">
                      <a
                        aria-label={`Call +91 ${item.phone}`}
                        className="inline-flex items-center gap-2 font-semibold text-[#333] hover:text-[#E63946] hover:underline"
                        href={`tel:+91${item.phone}`}
                      >
                        <MdLocalPhone className="shrink-0 text-base text-[#E63946]" />
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

      <ContactNew />
      <ContactForm />
    </section>
  );
}
