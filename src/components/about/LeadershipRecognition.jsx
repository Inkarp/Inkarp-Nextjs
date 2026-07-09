import SectionHeading from "@/components/home/SectionHeading";

const recognitionSignals = [
  {
    title: "Customer-first leadership",
    body: "Every regional decision is measured against customer continuity, application clarity, and dependable service after installation.",
  },
  {
    title: "Technical depth",
    body: "Our leaders bring domain understanding into commercial, service, and support conversations so laboratories receive practical guidance.",
  },
  {
    title: "Pan-India consistency",
    body: "A shared operating standard keeps teams aligned across branches, principals, and customer workflows.",
  },
];

export default function LeadershipRecognition() {
  return (
    <section className="border-t border-line-light bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          eyebrow="Leadership Recognition"
          title="The people behind every milestone"
          description="Awards and partnerships are the visible result of everyday discipline: listening well, supporting consistently, and staying accountable to the scientific teams we serve."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {recognitionSignals.map((item, index) => (
            <article className="border border-line-light bg-parchment-alt p-6" key={item.title}>
              <span className="text-sm font-semibold text-red">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}