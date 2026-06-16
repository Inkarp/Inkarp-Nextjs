import {
  MdAccessTime,
  MdEmail,
  MdLocalPhone,
  MdLocationPin,
} from "react-icons/md";

const items = [
  {
    title: "Head Office",
    lines: [
      "Plot No - 5A/10-11, 3rd Floor,",
      "IDA Nacharam Road No. 1",
      "Hyderabad - 500076",
    ],
    icon: MdLocationPin,
  },
  {
    title: "Mail Us 24/7",
    lines: ["info@inkarp.co.in"],
    icon: MdEmail,
  },
  {
    title: "Call Us",
    lines: ["+91 8125580808"],
    icon: MdLocalPhone,
  },
  {
    title: "Working Days",
    lines: [
      "Mon-Fri · 09:30am - 05:30pm",
      <>
        1<sup>st</sup> & 3<sup>rd</sup> Sat · 09:30am - 01:30pm
      </>,
      <>
        2<sup>nd</sup> & 4<sup>th</sup> Saturday - Holidays
      </>,
    ],
    icon: MdAccessTime,
  },
];

export default function ContactNew() {
  return (
    <section className="relative mx-auto w-[98%] max-w-5xl py-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <article
              aria-label={item.title}
              className="group relative rounded-lg border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#E63946]/45 hover:shadow-[0_14px_40px_rgba(230,57,70,0.15)]"
              data-scroll-reveal="true"
              key={item.title}
            >
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <div
                  className="inline-grid size-12 place-items-center rounded-lg bg-[#BE0010]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="block will-change-transform group-hover:animate-[spin_0.6s_linear_1]">
                    <Icon className="size-7 text-white" />
                  </span>
                </div>

                <h3 className="font-maxot text-lg text-[#E63946]">
                  {item.title}
                </h3>

                <ul className="space-y-1 text-zinc-950">
                  {item.lines.map((line, lineIndex) =>
                    line ? (
                      <li className="text-sm" key={lineIndex}>
                        {item.title.includes("Mail") ? (
                          <a
                            className="font-semibold text-[#333] hover:text-[#E63946] hover:underline"
                            href={`mailto:${line}`}
                          >
                            {line}
                          </a>
                        ) : item.title.includes("Call") &&
                          typeof line === "string" &&
                          line.includes("+91") ? (
                          <a
                            className="font-semibold text-[#333] hover:text-[#E63946] hover:underline"
                            href={`tel:${line.replace(/\s+/g, "")}`}
                          >
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
