import HomeBody from "@/components/home/HomeBody";

// The homepage with the "subtle" scroll animation (see HomeBody), for choosing
// between them. Not linked anywhere, kept out of search and the sitemap.
export const metadata = {
  title: "Homepage preview: glassware in the margin | Inkarp",
  description: "Preview of the Inkarp homepage with its scroll animation.",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default function HomePreviewSubtle() {
  return <HomeBody motion="subtle" path="/home-preview/subtle" />;
}
