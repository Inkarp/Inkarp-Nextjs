import Companies from "@/components/home/Companies";
import HomeAboutHero from "@/components/home/HomeAboutHero";
import HomeCampaignSlider from "@/components/home/HomeCampaignSlider";
import HomeAchievements from "@/components/home/HomeAchievements";
import HomeClientReviews from "@/components/home/HomeClientReviews";
import HomeEventsInsights from "@/components/home/HomeEventsInsights";
import HomeWorkflowWheel from "@/components/home/HomeWorkflowWheel";
import OrganizationJsonLd from "@/components/home/OrganizationJsonLd";
import Principles from "@/components/home/Principles";
import { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { getStripCampaigns, todayInIndia } from "@/data/campaigns";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/");

// Re-render the homepage at most hourly so the campaign strip for today (IST)
// is already in the HTML rather than appearing after load.
export const revalidate = 3600;

export default function Home() {
  const today = todayInIndia();

  return (
    <main>
      <BreadcrumbJsonLd path="/" />
      <OrganizationJsonLd />
      <HomeCampaignSlider initialSlides={getStripCampaigns(today)} initialToday={today} />
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
