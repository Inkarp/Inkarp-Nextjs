import { FiDownload } from "react-icons/fi";

export default function ProductProfileFloat() {
  return (
    <a
      aria-label="Download product profile"
      className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#BE0010] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition hover:bg-[#9a000d]"
      download
      href="/assets/productProfile/Inkarp_product_profile_2026.pdf"
    >
      <FiDownload className="text-base" />
      <span className="font-maxot tracking-wide">Product<br/> Profile</span>
    </a>
  );
}
