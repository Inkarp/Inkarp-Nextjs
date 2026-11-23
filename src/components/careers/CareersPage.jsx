import CareersForm from "@/components/careers/CareersForm";
import CareersHero from "@/components/careers/CareersHero";
import CareersKeka from "@/components/careers/CareersKeka";

export default function CareersPage() {
  return (
    <main className="mx-auto w-[98%] overflow-hidden">
      <CareersHero />

      <CareersKeka />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 bg-red p-6 text-parchment md:flex-row md:p-10">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-[22px] font-semibold tracking-tight md:text-3xl">
              Don&apos;t see a perfect role?
            </h2>
            <p className="text-parchment/90">
              We always welcome exceptional talent. Share your profile with us.
            </p>
          </div>
        </div>
      </section>

      <CareersForm />
    </main>
  );
}
