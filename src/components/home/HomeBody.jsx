// import Companies from "@/components/home/Companies";
import FlaskJourney from "@/components/home/FlaskJourney";
import HomeAboutHero from "@/components/home/HomeAboutHero";
import HomeCampaignSlider from "@/components/home/HomeCampaignSlider";
import HomeAchievements from "@/components/home/HomeAchievements";
import HomeClientReviews from "@/components/home/HomeClientReviews";
import HomeEventsInsights from "@/components/home/HomeEventsInsights";
import HomeWorkflowWheel from "@/components/home/HomeWorkflowWheel";
import LabIntro from "@/components/home/LabIntro";
import MarginFlask from "@/components/home/MarginFlask";
import OrganizationJsonLd from "@/components/home/OrganizationJsonLd";
import Principles from "@/components/home/Principles";
import SampleLine from "@/components/home/SampleLine";
import revealStyles from "@/components/home/SectionReveals.module.css";
import SectionReveals from "@/components/home/SectionReveals";
import { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { getStripCampaigns, todayInIndia } from "@/data/campaigns";

/**
 * The homepage's sections, with one of its scroll animations (`motion`):
 * - "glassware": a sample falls into the hero and travels down through every
 *   section, turning into each one's glassware (FlaskJourney + FlaskDock).
 * - "line": a red sample line flows down the left edge as the page is read,
 *   filling a node at each section's heading (SampleLine).
 * - "reveals": nothing travels; each section has its own entrance as it comes
 *   into view (SectionReveals).
 * - "subtle": small glassware rides the left margin from heading to heading,
 *   never over the content, changing as it lands (MarginFlask).
 * The homepage (app/(site)/page.js) uses one; /home-preview/* show each, so
 * they can be compared. `path`: the page's own path (for LabIntro, which plays
 * only when a visit starts there). `structuredData`: the homepage's JSON-LD.
 */
export default function HomeBody({ motion = "glassware", path = "/", structuredData = false }) {
  const today = todayInIndia();
  const flask = motion === "glassware";

  return (
    <>
      <LabIntro path={path} />
      <main
        className={motion === "reveals" ? revealStyles.reveals : undefined}
        // The site-wide fade-up of sections (ScrollAnimations) would fight
        // the sections' own entrances.
        data-scroll-skip={motion === "reveals" ? "" : undefined}
      >
        {structuredData ? (
          <>
            <BreadcrumbJsonLd path="/" />
            <OrganizationJsonLd />
          </>
        ) : null}
        <HomeCampaignSlider initialSlides={getStripCampaigns(today)} initialToday={today} />
        {/* `flask`: each section's landing spot for the travelling sample. */}
        <HomeAboutHero flask={flask} />
        <HomeWorkflowWheel flask={flask} />
        <HomeAchievements flask={flask} />
        {/* <Companies /> */}
        <Principles flask={flask} />
        <HomeEventsInsights flask={flask} />
        <HomeClientReviews flask={flask} />
      </main>
      {flask ? <FlaskJourney /> : null}
      {motion === "line" ? <SampleLine /> : null}
      {motion === "reveals" ? <SectionReveals /> : null}
      {motion === "subtle" ? <MarginFlask /> : null}
    </>
  );
}
