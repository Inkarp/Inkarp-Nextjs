import Image from "next/image";
import { getPrincipalLogo } from "@/data/products/principalLogos";

export default function PrincipalLogo({ principalSlug, principalName, className = "" }) {
  const logo = getPrincipalLogo(principalSlug);

  if (!logo) {
    return <span className={className}>{principalName}</span>;
  }

  return (
    <Image
      alt={principalName}
      className={`object-contain object-left ${className}`}
      height={20}
      src={logo}
      title={principalName}
      width={80}
    />
  );
}
