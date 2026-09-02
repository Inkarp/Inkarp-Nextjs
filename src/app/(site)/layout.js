import BasketSync from "@/components/account/BasketSync";
import Footer from "@/components/common/Footer";
import FloatingChatbot from "@/components/common/FloatingChatbot";
import FloatingQuickActions from "@/components/common/FloatingQuickActions";
import Header from "@/components/common/Header";
import PromoPopup from "@/components/common/PromoPopup";
import ShortlistFloats from "@/components/common/ShortlistFloats";
import Script from "next/script";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <div className="relative w-[90%] mx-auto">{children}</div>
      <Footer />
      <BasketSync />
      <ShortlistFloats />
      <PromoPopup />
      <Script id="tawk-to-widget" strategy="afterInteractive">
        {`
          window.Tawk_API = window.Tawk_API || {};
          window.Tawk_API.customStyle = {
            zIndex: "2147483647 !important",
            visibility: {
              desktop: {
                position: "br",
                xOffset: 15,
                yOffset: 96
              },
              mobile: {
                position: "br",
                xOffset: 15,
                yOffset: 88
              }
            }
          };
          window.Tawk_LoadStart = new Date();
          (function() {
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = "https://embed.tawk.to/6a97d25e839c96344543fdfc/1k1ggrgnc";
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            s0.parentNode.insertBefore(s1, s0);
          })();
        `}
      </Script>
      <FloatingChatbot />
      <FloatingQuickActions />
    </>
  );
}
