import BasketSync from "@/components/account/BasketSync";
import DelayedWebinarNotice from "@/components/common/DelayedWebinarNotice";
import Footer from "@/components/common/Footer";
import FloatingChatbot from "@/components/common/FloatingChatbot";
import FloatingQuickActions from "@/components/common/FloatingQuickActions";
import Header from "@/components/common/Header";
import PromoPopup from "@/components/common/PromoPopup";
import ShortlistFloats from "@/components/common/ShortlistFloats";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <div className="relative w-[90%] mx-auto">{children}</div>
      <Footer />
      <BasketSync />
      <ShortlistFloats />
      <PromoPopup />
      <DelayedWebinarNotice />
      <FloatingChatbot />
      <FloatingQuickActions />
    </>
  );
}
