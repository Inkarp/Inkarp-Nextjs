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
  const { company, contact, navigation, socials,mapEmbedUrl } = siteConfig;
  const quickLinks = navigation.flatMap((item) => [
    {
      label: item.label,
      href: item.href,
    },
    ...(item.children ?? []),
  ]);

  return (
    <footer className="font-maxot border-t border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[7fr_3fr] lg:px-8">
        <div className="space-y-6 ">
          <div>
            <Link
              aria-label={`${company.name} home`}
              className="relative block h-12 w-48 rounded-md p-1.5 dark:bg-white"
              href="/"
            >
              <Image
                alt={`${company.name} logo`}
                className="object-contain"
                fill
                sizes="192px"
                src={company.logo}
              />
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {company.description}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
              Quick Links
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
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
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Contact</h2>
            <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <a
                className="flex items-center gap-2 transition hover:text-[#BE0010]"
                href={`tel:${contact.phone.replaceAll(" ", "")}`}
              >
                <FiPhone className="shrink-0" />
                {contact.phone}
              </a>
              <a
                className="flex items-center gap-2 transition hover:text-[#BE0010]"
                href={`mailto:${contact.email}`}
              >
                <FiMail className="shrink-0" />
                {contact.email}
              </a>
              <p className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 shrink-0" />
                <span>{contact.address}</span>
              </p>
            </div>

            <div
              aria-label="Social media links"
              className="mt-3 flex flex-wrap gap-2"
            >
              {Object.entries(socials).map(([name, href]) => (
                <a
                  aria-label={name}
                  className="inline-flex size-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 transition hover:border-[#BE0010] hover:bg-[#BE0010] hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
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

        <div>
          <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Find Us</h2>
          <div className="mt-2.5 h-40 overflow-hidden rounded-md border border-zinc-200 bg-white lg:h-full lg:min-h-[200px] dark:border-zinc-700">
            <iframe
              allowFullScreen
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapEmbedUrl}
              title="Inkarp Instruments Private Limited location"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 px-4 py-5 sm:px-6 lg:px-8 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
          <p>
            Copyright {new Date().getFullYear()} {company.name}. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link
              className="text-black transition hover:text-[#BE0010] dark:text-zinc-200"
              href="/terms-and-conditions"
            >
              Terms & Conditions
            </Link>
            <Link
              className="text-black transition hover:text-[#BE0010] dark:text-zinc-200"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
