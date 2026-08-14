import Image from "next/image";

function isVideoLogo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

export default function CompanyLogoMedia({
  alt,
  className = "object-contain",
  priority = false,
  sizes,
  src,
}) {
  if (isVideoLogo(src)) {
    return (
      <video
        aria-label={alt}
        autoPlay
        className={`absolute inset-0 h-full w-full ${className}`}
        loop
        muted
        playsInline
        preload="auto"
        src={src}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      fill
      priority={priority}
      sizes={sizes}
      src={src}
    />
  );
}
