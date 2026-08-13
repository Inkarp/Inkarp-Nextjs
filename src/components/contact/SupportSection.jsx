import { FaRupeeSign, FaTruckLoading } from"react-icons/fa";
import { MdEmail, MdLocalPhone, MdOutlineMail } from"react-icons/md";
import RecTag from"@/components/home/RecTag";

const supportData = [
  {
    title:"Import / Logistics / Customs\nRelated Enquiries",
    email:"saritha@inkarp.co.in",
    phone:"9949018605",
    icon: FaTruckLoading,
  },
  {
    title:"Accounts / Finance Enquiries",
    email:"sundar@inkarp.co.in",
    phone:"7032221890",
    icon: FaRupeeSign,
  },
  {
    title:"HR Enquiries",
    email:"hrd@inkarp.co.in",
    phone:"8886277717",
    icon: MdOutlineMail,
  },
];

export default function SupportSection() {
  return (
    <section className="border-b border-line-light bg-white px-4 py-16 sm:px-6 lg:px-8">
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
          {supportData.map((item) => {
            const Icon = item.icon;

            return (
              <article
                aria-label={item.title.replace(/\n/g,"")}
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
                      className="group/link flex items-center gap-3 bg-parchment-alt px-3.5 py-3 text-left text-xs font-medium text-ink transition-colors duration-200 outline-none hover:bg-red hover:text-parchment focus-visible:ring-2 focus-visible:ring-red/40"
                      // Gmail compose rather than mailto: — see ContactForm.
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        item.email
                      )}&su=${encodeURIComponent(
                        `Enquiry — ${item.title.replace(/\n/g," ")}`
                      )}`}
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
                      className="group/link flex items-center gap-3 bg-parchment-alt px-3.5 py-3 text-left text-xs font-medium text-ink transition-colors duration-200 outline-none hover:bg-red hover:text-parchment focus-visible:ring-2 focus-visible:ring-red/40"
                      href={`tel:+91${item.phone}`}
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