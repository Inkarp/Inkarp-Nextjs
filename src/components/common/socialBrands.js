import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

// One place for each network's logo and brand colour, shared by the header's
// segmented pill and the footer's quadrant circle. `color` is the logo colour at
// rest; `fill` (defaults to `color`) is the tile's background on hover.
export const SOCIAL_BRANDS = {
  linkedin: { label: "LinkedIn", icon: FaLinkedinIn, color: "#0A66C2" },
  facebook: { label: "Facebook", icon: FaFacebookF, color: "#1877F2" },
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
    color: "#E1306C",
    fill: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
  },
  youtube: { label: "YouTube", icon: FaYoutube, color: "#FF0000" },
};

// CSS variables the tiles read: `--social-color` for the logo, `--social-fill` for the hover fill.
export function socialBrandStyle(brand) {
  return { "--social-color": brand.color, "--social-fill": brand.fill ?? brand.color };
}
