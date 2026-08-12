import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import CatalystPage from"@/components/catalystcue/CatalystPage";
import PageBreadcrumbs, { BreadcrumbJsonLd } from"@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from"@/data/pageSeo";

export const metadata = buildPageMetadata("/magazine");

export default function CatalystCue() {
  return (
    <>
      <BreadcrumbJsonLd path="/magazine" />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-2 pt-8 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 sm:px-6 lg:px-8">
        <Link aria-label="CATALYSTCue" className="inline-block sm:justify-self-start" href="/magazine">
          <Image alt="CATALYSTCue" className="h-12 w-auto sm:h-14" height={82} priority src="/CatalystNew.svg" width={324} />
        </Link>

        <PageBreadcrumbs
          className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:justify-self-center dark:text-zinc-400"
          path="/magazine"
        />

        <Link
          aria-label="Back to Inkarp"
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red/90 sm:justify-self-end sm:text-sm"
          href="/"
        >
          <FiArrowLeft className="h-3.5 w-3.5 shrink-0" />
          Back to Inkarp
        </Link>
      </div>
      <CatalystPage />
    </>
  );
}
