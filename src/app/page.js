import TrustedClients from "@/components/about/TrustedClients";
import ClientReviews from "@/components/home/ClientReviews";
import Companies from "@/components/home/Companies";
import CompaniesAlternate from "@/components/home/CompaniesAlternate";
import HeroSection from "@/components/home/HeroSection";
import OrderServiceSteps from "@/components/home/OrderServiceSteps";
import PickProduct from "@/components/home/PickProduct";
import Principles from "@/components/home/Principles";
import PrinciplesAlternate from "@/components/home/PrinciplesAlternate";
import { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/");

export default function Home() {
  return (
    <main>
      <BreadcrumbJsonLd path="/" />
      <HeroSection />
      <PickProduct />
      <CompaniesAlternate />    
      <Companies />  
      <PrinciplesAlternate />
      <Principles />
      <OrderServiceSteps />
      <TrustedClients />
      <ClientReviews />
    </main>
  );
}
