import EventsPage from "@/components/events/EventsPage";
import PageBreadcrumbs from "@/components/common/PageBreadcrumbs";

// The events page with its list of events as a year rows (EventsPage `list`),
// for choosing between the layouts. Not linked anywhere, kept out of search
// and the sitemap.
export const metadata = {
  title: "Events preview: year rows | Inkarp",
  description: "Preview of the Inkarp events page layout.",
  robots: { index: false, follow: false },
};

export default function EventsPreviewRows() {
  return (
    <>
      <PageBreadcrumbs path="/events" />
      <EventsPage list="rows" />
    </>
  );
}
