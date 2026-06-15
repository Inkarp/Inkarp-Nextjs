import { Roboto } from "next/font/google";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ScrollAnimations from "@/components/common/ScrollAnimations";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Best Laboratory Equipment Supplier in India - Inkarp Instruments Pvt Ltd",
  description:
    "Inkarp Instruments Pvt Ltd is a laboratory equipment supplier in India.",
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
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ScrollAnimations />
        <Header />
        <div className="flex-1 w-[90%] mx-auto">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
