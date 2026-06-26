import EventsPage from "@/components/events/EventsPage";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/events");

export default function Events() {
  return (
    <>
      <BreadcrumbJsonLd path="/events" />
      <PageBreadcrumbs path="/events" />
      <EventsPage />
    </>
  );
}
