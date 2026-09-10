import BasketSync from "@/components/account/BasketSync";
import Footer from "@/components/common/Footer";
import FloatingChatbot from "@/components/common/FloatingChatbot";
import FloatingQuickActions from "@/components/common/FloatingQuickActions";
import Header from "@/components/common/Header";
import LeftRail from "@/components/common/LeftRail";
import PromoPopup from "@/components/common/PromoPopup";
import ShortlistFloats from "@/components/common/ShortlistFloats";
import Script from "next/script";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <LeftRail />
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

          html:not(.inkarp-live-chat-requested) iframe[src*="tawk.to"],
          html:not(.inkarp-live-chat-requested) iframe[title*="tawk" i],
          html:not(.inkarp-live-chat-requested) iframe[title*="chat" i] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}
      </style>
      <Script id="tawk-to-widget" strategy="afterInteractive">
        {`
          (function() {
            var root = document.documentElement;
            var isClosingLiveChat = false;

            function markLiveChatRequested() {
              window.__inkarpLiveChatRequested = true;
              root.classList.add("inkarp-live-chat-requested");
              root.classList.add("inkarp-live-chat-launcher-small");
            }

            function keepLiveChatHidden() {
              if (window.__inkarpLiveChatRequested) return;
              root.classList.remove("inkarp-live-chat-requested");
              root.classList.remove("inkarp-live-chat-launcher-small");
              if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
                window.Tawk_API.hideWidget();
              }
            }

            window.__inkarpCloseLiveChat = function() {
              if (isClosingLiveChat) return;
              isClosingLiveChat = true;
              window.__inkarpLiveChatRequested = false;
              root.classList.remove("inkarp-live-chat-requested");
              root.classList.remove("inkarp-live-chat-launcher-small");
              if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
                window.Tawk_API.hideWidget();
              }
              window.setTimeout(function() {
                isClosingLiveChat = false;
              }, 0);
            };

            window.__inkarpOpenLiveChat = function() {
              markLiveChatRequested();
              var tawk = window.Tawk_API;
              if (!tawk || typeof tawk.showWidget !== "function") return false;

              tawk.showWidget();
              if (typeof tawk.maximize === "function") {
                tawk.maximize();
              }
              return true;
            };

            keepLiveChatHidden();
          })();

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
              window.__inkarpOpenLiveChat();
              return;
            }
            window.Tawk_API.hideWidget();
          };
          window.Tawk_API.onChatMaximized = function() {
            if (!window.__inkarpLiveChatRequested) {
              if (typeof window.Tawk_API.minimize === "function") {
                window.Tawk_API.minimize();
              }
              if (typeof window.Tawk_API.hideWidget === "function") {
                window.Tawk_API.hideWidget();
              }
              return;
            }
            document.documentElement.classList.remove("inkarp-live-chat-launcher-small");
          };
          window.Tawk_API.onChatMinimized = function() {
            window.__inkarpCloseLiveChat();
          };
          window.Tawk_API.onChatHidden = function() {
            window.__inkarpCloseLiveChat();
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
