import { FiAward, FiPackage, FiShield, FiTool } from "react-icons/fi";
import RecTag from "./RecTag";

const serviceCards = [
  {
    icon: FiAward,
    title: "Principal-Trained",
    description: "Service teams trained on technologies from global principals.",
  },
  {
    icon: FiTool,
    title: "Technical Support",
    description: "Troubleshooting, diagnostics, corrective maintenance, and application guidance.",
  },
  {
    icon: FiShield,
    title: "Preventive Care",
    description: "Planned service to reduce downtime, drift, and unexpected interruptions.",
  },
  {
    icon: FiPackage,
    title: "Spares & AMC",
    description: "Genuine spares and long-term maintenance support for continued use.",
  },
];

export default function HomeAchievements() {
  return (
    <section className="bg-white py-16" id="service-support" data-reveal>
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag>Service Support</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Support that stays with the solution.
            </h2>
          </div>
          <p className="max-w-[420px] text-sm text-ink-soft">
            After installation, the real work begins. Inkarp supports laboratories with
            principal-trained engineers, application specialists, preventive maintenance,
            breakdown service, genuine spares, AMC support, and remote troubleshooting across
            India.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map(({ icon: Icon, title, description }) => (
            <div key={title} className="border border-line-light bg-white p-6">
              <span className="flex size-11 items-center justify-center rounded-lg bg-red/8 text-red">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
