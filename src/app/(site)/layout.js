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
      <style>
        {`
          html.inkarp-live-chat-launcher-small iframe[title*="chat" i] {
            transform: scale(0.78) !important;
            transform-origin: bottom right !important;
            transition: transform 160ms ease !important;
          }

          @media (max-width: 640px) {
            html.inkarp-live-chat-launcher-small iframe[title*="chat" i] {
              transform: scale(0.72) !important;
            }
          }
        `}
      </style>
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
          window.Tawk_API.onLoad = function() {
            if (window.__inkarpLiveChatRequested) {
              document.documentElement.classList.add("inkarp-live-chat-launcher-small");
              window.Tawk_API.showWidget();
              return;
            }
            window.Tawk_API.hideWidget();
          };
          window.Tawk_API.onChatMaximized = function() {
            document.documentElement.classList.remove("inkarp-live-chat-launcher-small");
          };
          window.Tawk_API.onChatMinimized = function() {
            if (window.__inkarpLiveChatRequested) {
              document.documentElement.classList.add("inkarp-live-chat-launcher-small");
            } else {
              window.Tawk_API.hideWidget();
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
