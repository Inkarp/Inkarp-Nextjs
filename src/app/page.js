import TrustedClients from "@/components/about/TrustedClients";
import ClientReviews from "@/components/home/ClientReviews";
import Companies from "@/components/home/Companies";
import CompaniesAlternate from "@/components/home/CompaniesAlternate";
import HeroSection from "@/components/home/HeroSection";
import OrderServiceSteps from "@/components/home/OrderServiceSteps";
import PickProduct from "@/components/home/PickProduct";
import Principles from "@/components/home/Principles";
import PrinciplesAlternate from "@/components/home/PrinciplesAlternate";

export default function Home() {
  return (
    <main>
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
