import HomeBody from "@/components/home/HomeBody";

// The homepage with the "line" scroll animation (see HomeBody), for choosing
// between them. Not linked anywhere, kept out of search and the sitemap.
export const metadata = {
  title: "Homepage preview: sample line | Inkarp",
  description: "Preview of the Inkarp homepage with its scroll animation.",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default function HomePreviewLine() {
  return <HomeBody motion="line" path="/home-preview/line" />;
}
