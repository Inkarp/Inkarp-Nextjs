import Companies from "@/components/home/Companies";
import HomeAboutHero from "@/components/home/HomeAboutHero";
import HomeAchievements from "@/components/home/HomeAchievements";
import HomeClientReviews from "@/components/home/HomeClientReviews";
import HomeEventsInsights from "@/components/home/HomeEventsInsights";
import HomeProductEnquiry from "@/components/home/HomeProductEnquiry";
import HomeQuoteWall from "@/components/home/HomeQuoteWall";
import HomeShowcaseSlider from "@/components/home/HomeShowcaseSlider";
import HomeWorkflowWheel from "@/components/home/HomeWorkflowWheel";
import Principles from "@/components/home/Principles";
import { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";


export const metadata = buildPageMetadata("/");

export default function Home() {
  return (
    <main>
      <BreadcrumbJsonLd path="/" />
      <HomeAboutHero />
      {/* <HomeWorkflows /> */}
      <HomeWorkflowWheel />
      {/* <HomeShowcaseSlider /> */}
      <HomeAchievements />
      <Companies />
      <Principles /> 
      <HomeProductEnquiry />
      <HomeEventsInsights />
      <HomeQuoteWall />
      <HomeClientReviews />
    </main>
  );
}
