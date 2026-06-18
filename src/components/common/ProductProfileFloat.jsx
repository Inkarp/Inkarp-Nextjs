import Link from "next/link";
import { FiDownload } from "react-icons/fi";

export default function ProductProfileFloat() {
  return (
    <Link
      aria-label="Download product profile"
      className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#BE0010] px-4 py-2.5 text-sm font-semibold text-[#BE0010] shadow-lg shadow-zinc-900/15 transition hover:bg-[#f5f5f5] "
      download
      href="/assets/productProfile/Inkarp_product_profile_2026.pdf"
    >
      <span className="font-maxot tracking-wide">Product<br/> Profile</span>
      <FiDownload className="text-base animate-bounce" />
    </Link>
  );
}
