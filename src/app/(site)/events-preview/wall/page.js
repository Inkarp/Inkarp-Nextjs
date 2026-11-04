import EventsPage from "@/components/events/EventsPage";
import PageBreadcrumbs from "@/components/common/PageBreadcrumbs";

// The events page with its list of events as a poster wall (EventsPage `list`),
// for choosing between the layouts. Not linked anywhere, kept out of search
// and the sitemap.
export const metadata = {
  title: "Events preview: poster wall | Inkarp",
  description: "Preview of the Inkarp events page layout.",
  robots: { index: false, follow: false },
};

export default function EventsPreviewWall() {
  return (
    <>
      <PageBreadcrumbs path="/events" />
      <EventsPage list="wall" />
    </>
  );
}
