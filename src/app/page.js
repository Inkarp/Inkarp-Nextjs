import TrustedClients from "@/components/about/TrustedClients";
import ClientReviews from "@/components/home/ClientReviews";
import Companies from "@/components/home/Companies";
import CompaniesAlternate from "@/components/home/CompaniesAlternate";
import HeroSection from "@/components/home/HeroSection";
import PickProduct from "@/components/home/PickProduct";
import Principles from "@/components/home/Principles";
import PrinciplesAlternate from "@/components/home/PrinciplesAlternate";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PickProduct />
      <Companies />
      <CompaniesAlternate />
      <Principles />  
      <PrinciplesAlternate />   
      <TrustedClients />     
      <ClientReviews />
    </main>
  );
}
