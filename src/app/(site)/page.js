import HomeBody from "@/components/home/HomeBody";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/");

// Re-render the homepage at most hourly so the campaign strip for today (IST)
// is already in the HTML rather than appearing after load.
export const revalidate = 3600;

// The scroll animation is chosen by `motion` (see HomeBody); /home-preview/*
// show the others.
export default function Home() {
  return <HomeBody motion="glassware" structuredData />;
}
