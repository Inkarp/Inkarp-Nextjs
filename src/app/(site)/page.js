import Companies from "@/components/home/Companies";
import HomeAboutHero from "@/components/home/HomeAboutHero";
import HomeCampaignSlider from "@/components/home/HomeCampaignSlider";
import HomeAchievements from "@/components/home/HomeAchievements";
import HomeClientReviews from "@/components/home/HomeClientReviews";
import HomeEventsInsights from "@/components/home/HomeEventsInsights";
import HomeWorkflowWheel from "@/components/home/HomeWorkflowWheel";
import Principles from "@/components/home/Principles";
import { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/");

export default function Home() {
  return (
    <main>
      <BreadcrumbJsonLd path="/" />
      <HomeCampaignSlider />
      <HomeAboutHero />
      <HomeWorkflowWheel />
      <HomeAchievements />
      <Companies />
      <Principles />
      <HomeEventsInsights />
      <HomeClientReviews />
    </main>
  );
}
