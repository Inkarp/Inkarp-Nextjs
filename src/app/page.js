import ClientReviews from "@/components/home/ClientReviews";
import Companies from "@/components/home/Companies";
import HeroSection from "@/components/home/HeroSection";
import Principles from "@/components/home/Principles";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Principles />
      <Companies />
      <ClientReviews />
    </main>
  );
}
