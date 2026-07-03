import RecTag from "./RecTag";
import { achievements} from "@/data/homeShowcase";

export default function HomeAchievements() {
  return (
    <section className="bg-white py-20" id="testimonials" data-reveal>
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag>Track Record</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Milestones that speak for themselves
            </h2>
          </div>
          <p className="max-w-[420px] text-sm text-ink-soft">
            Since 1985, Inkarp has built its reputation on long-term principal partnerships and dependable
            after-sales support.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-2 gap-px border border-line-light bg-line-light md:grid-cols-4">
          {achievements.map((item) => (
            <div key={item.label} className="bg-white p-6.5 px-5">
              <div className="text-[32px] font-semibold text-red">{item.num}</div>
              <div className="mt-1.5 text-xs text-ink-soft">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
