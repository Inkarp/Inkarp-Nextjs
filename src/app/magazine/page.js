import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import CatalystPage from"@/components/catalystcue/CatalystPage";
import MagazineCueDial from"@/components/catalystcue/MagazineCueDial";
import MagazineVideoStage from"@/components/catalystcue/MagazineVideoStage";
import { getMagazineIssues } from"@/components/catalystcue/magazineIssues";
import PageBreadcrumbs, { BreadcrumbJsonLd } from"@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from"@/data/pageSeo";

export const metadata = buildPageMetadata("/magazine");

export default function CatalystCue() {
  const issues = getMagazineIssues();

  return (
    <>
      <BreadcrumbJsonLd path="/magazine" />
      <div className="mx-auto flex w-[90%] shrink-0 flex-col gap-3 pb-3 pt-6 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
        <Link aria-label="CATALYSTCue" className="inline-block sm:justify-self-start" href="/magazine">
          <Image alt="CATALYSTCue" className="h-10 w-auto sm:h-12" height={82} priority src="/CatalystNew.svg" width={324} />
        </Link>

        <PageBreadcrumbs
          className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:justify-self-center"
          path="/magazine"
        />

        <Link
          aria-label="Back to Inkarp"
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-100/90 sm:justify-self-end sm:text-sm"
          href="/"
        >
          <FiArrowLeft className="h-3.5 w-3.5 shrink-0" />
          Back to Inkarp
        </Link>
      </div>

      {/* The magazine film settling into a frame as the latest issue swings
          in; then the archive shelf; then one dial per volume, its covers
          turning round the logo's red C. */}
      <MagazineVideoStage latest={issues[0]} />

      <CatalystPage issues={issues}>
        <MagazineCueDial issues={issues} />
      </CatalystPage>
    </>
  );
}
