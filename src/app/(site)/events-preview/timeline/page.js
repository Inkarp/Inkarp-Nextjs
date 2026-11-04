import EventsPage from "@/components/events/EventsPage";
import PageBreadcrumbs from "@/components/common/PageBreadcrumbs";

// The events page with its list of events as a timeline (EventsPage `list`),
// for choosing between the layouts. Not linked anywhere, kept out of search
// and the sitemap.
export const metadata = {
  title: "Events preview: timeline | Inkarp",
  description: "Preview of the Inkarp events page layout.",
  robots: { index: false, follow: false },
};

export default function EventsPreviewTimeline() {
  return (
    <>
      <PageBreadcrumbs path="/events" />
      <EventsPage list="timeline" />
    </>
  );
}
