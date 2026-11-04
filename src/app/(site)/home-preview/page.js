import HomeBody from "@/components/home/HomeBody";

// The homepage with each of its scroll animations, for choosing between them:
// this page has the travelling glassware (as on the homepage now); /line,
// /reveals and /subtle have the others (see HomeBody). Not linked anywhere,
// kept out of search and the sitemap.
export const metadata = {
  title: "Homepage preview: travelling glassware | Inkarp",
  description: "Preview of the Inkarp homepage with its scroll animation.",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default function HomePreview() {
  return <HomeBody motion="glassware" path="/home-preview" />;
}
