import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "@/components/common/Footer";
import FloatingQuickActions from "@/components/common/FloatingQuickActions";
import Header from "@/components/common/Header";
import PromoPopup from "@/components/common/PromoPopup";
import ProductProfileFloat from "@/components/common/ProductProfileFloat";
import ScrollAnimations from "@/components/common/ScrollAnimations";
import { ThemeProvider, themeInitScript } from "@/components/common/ThemeProvider";
import { SITE_AUTHOR, SITE_PUBLISHER, SITE_URL } from "@/data/pageSeo";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Best Laboratory Equipment Supplier in India - Inkarp Instruments Pvt Ltd",
  description:
    "Inkarp Instruments Pvt Ltd is a laboratory equipment supplier in India.",
  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  creator: SITE_AUTHOR,
  publisher: SITE_PUBLISHER,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ScrollAnimations />
          <Header />
          {/* <div className="relative flex-1 overflow-hidden bg-[#fff5f6]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(190,0,16,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(190,0,16,0.045)_1px,transparent_1px)] bg-[size:56px_56px]"
          /> */}
          <div className="relative z-10 w-[90%] mx-auto">{children}</div>
          {/* </div> */}
          <Footer />
          <ProductProfileFloat />
          <PromoPopup />
          <FloatingQuickActions />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
