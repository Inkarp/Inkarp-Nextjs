import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { siteConfig } from "@/data/siteConfig";

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

export default function Footer() {
  const { company, contact, navigation, socials } = siteConfig;
  const quickLinks = navigation.flatMap((item) => [
    {
      label: item.label,
      href: item.href,
    },
    ...(item.children ?? []),
  ]);

  return (
    <footer className="font-maxot border-t border-zinc-200 bg-zinc-50 text-zinc-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_1fr_1fr] lg:px-8">
        <div>
          <Link
            aria-label={`${company.name} home`}
            className="relative block h-16 w-64"
            href="/"
          >
            <Image
              alt={`${company.name} logo`}
              className="object-contain"
              fill
              sizes="256px"
              src={company.logo}
            />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-zinc-600">
            {company.description}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Quick Links</h2>
          <div className="mt-5 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                className="transition hover:text-[#BE0010]"
                href={link.href}
                key={`${link.label}-${link.href}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Contact</h2>
          <div className="mt-5 space-y-4 text-sm text-zinc-600">
            <a
              className="flex items-center gap-3 transition hover:text-[#BE0010]"
              href={`tel:${contact.phone.replaceAll(" ", "")}`}
            >
              <FiPhone className="shrink-0 text-lg" />
              {contact.phone}
            </a>
            <a
              className="flex items-center gap-3 transition hover:text-[#BE0010]"
              href={`mailto:${contact.email}`}
            >
              <FiMail className="shrink-0 text-lg" />
              {contact.email}
            </a>
            <p className="flex items-start gap-3">
              <FiMapPin className="mt-0.5 shrink-0 text-lg" />
              <span>{contact.address}</span>
            </p>
          </div>

          <div
            aria-label="Social media links"
            className="mt-6 flex flex-wrap gap-3"
          >
            {Object.entries(socials).map(([name, href]) => (
              <a
                aria-label={name}
                className="inline-flex size-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-lg text-zinc-800 transition hover:border-[#BE0010] hover:bg-[#BE0010] hover:text-white"
                href={href}
                key={name}
                rel="noopener noreferrer"
                target="_blank"
              >
                {(() => {
                  const Icon = socialIcons[name];
                  return Icon ? <Icon /> : name;
                })()}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 px-4 py-5 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-7xl text-sm text-zinc-500">
          Copyright {new Date().getFullYear()} {company.name}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
