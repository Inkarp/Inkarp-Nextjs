import localFont from "next/font/local";
import ScrollAnimations from "@/components/common/ScrollAnimations";
import TrackingCapture from "@/components/common/TrackingCapture";
import { SITE_AUTHOR, SITE_PUBLISHER, SITE_URL } from "@/data/pageSeo";
import "./globals.css";

// Self-hosted rather than next/font/google: that helper downloads the font from
// fonts.gstatic.com during the build, so any build host without reliable access
// to Google Fonts fails with "Error while requesting resource" / module-not-found.
// These are the official Roboto v51 variable woff2 subsets committed to the repo,
// so the build has no network dependency. MaxOT is already self-hosted the same way.
const roboto = localFont({
  variable: "--font-roboto",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/roboto/roboto-latin.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../../public/fonts/roboto/roboto-latin-ext.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Best Laboratory Equipment Supplier in India - Inkarp Instruments Pvt Ltd",
  description:
    "Inkarp Instruments Pvt Ltd is a laboratory equipment supplier in India.",
  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  creator: SITE_AUTHOR,
  publisher: SITE_PUBLISHER,
  alternates: {
    canonical: "/",
  },
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
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-parchment text-ink"
        suppressHydrationWarning
      >
        <ScrollAnimations />
        <TrackingCapture />
        {children}
      </body>
    </html>
  );
}
