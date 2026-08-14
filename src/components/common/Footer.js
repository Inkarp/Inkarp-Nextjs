import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import CompanyLogoMedia from "@/components/common/CompanyLogoMedia";
import { siteConfig } from "@/data/siteConfig";

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

// Small mono label with a red rule, echoing RecTag from the home sections.
function FooterLabel({ children }) {
  return (
    <h2 className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft">
      <span aria-hidden="true" className="h-px w-5 bg-red" />
      {children}
    </h2>
  );
}

// Thin corner ticks — the same drafting-mark motif used on the home hero panels.
function CornerBrackets() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-1px] top-[-1px] h-3 w-3 border-l border-t border-red"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-1px] right-[-1px] h-3 w-3 border-b border-r border-red"
      />
    </>
  );
}

export default function Footer() {
  const { company, contact, navigation, socials, mapEmbedUrl, mapPlaceUrl, googleBusinessUrl } =
    siteConfig;
  const quickLinks = navigation.flatMap((item) => [
    {
      label: item.label,
      href: item.href,
    },
    ...(item.children ?? []),
  ]);

  return (
    <footer className="relative overflow-hidden border-t border-line-light bg-parchment-alt text-ink">
      {/* Accent rule + faint blueprint grid: the technical texture used across the home sections. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-red via-red/35 to-teal"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,var(--ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--ink)_1px,transparent_1px)] [background-size:46px_46px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red/6 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 right-[-6rem] h-80 w-80 rounded-full bg-teal/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.85fr_1.1fr]">
          {/* Brand */}
          <div>
            <Link
              aria-label={`${company.name} home`}
              className="relative block h-14 w-48 border border-line-light bg-parchment p-2 transition hover:-translate-y-0.5 hover:border-red"
              href="/"
            >
              <CornerBrackets />
              <CompanyLogoMedia
                alt={`${company.name} logo`}
                className="object-contain"
                sizes="192px"
                src={company.logo}
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-ink-soft">
              {company.description}
            </p>

            <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
              From the first enquiry to long-term care, our teams handle product selection,
              application guidance, installation, calibration, AMC, and spare parts — so your
              lab stays productive well past the day the instrument arrives.
            </p>

            <p className="mt-5 inline-flex items-center gap-2 border border-line-light bg-parchment px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-soft">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-red" />
              Reach Us &amp; 
            </p>

            <div aria-label="Social media links" className="mt-6 flex flex-wrap gap-2.5">
              {Object.entries(socials).map(([name, href]) => {
                const Icon = socialIcons[name];
                return (
                  <a
                    aria-label={name}
                    className="group relative inline-flex size-9 items-center justify-center border border-line-light bg-parchment text-ink-soft transition hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
                    href={href}
                    key={name}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <CornerBrackets />
                    {Icon ? <Icon /> : name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <FooterLabel>Quick Links</FooterLabel>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-0.5 sm:grid-cols-3 lg:grid-cols-2">
              {quickLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <Link
                    className="group flex items-center gap-1.5 border-b border-line-light py-2 text-sm text-ink-soft transition hover:text-red"
                    href={link.href}
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-0 bg-red transition-all duration-300 group-hover:w-3"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + map */}
          <div>
            <FooterLabel>Reach Us</FooterLabel>

            <div className="mt-4 space-y-2.5">
              {/* Phone and email share one row as two separate cards. */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <a
                  className="group relative flex min-w-0 items-center gap-3 border border-line-light bg-parchment px-4 py-3 transition hover:-translate-y-0.5 hover:border-red"
                  href={`tel:${contact.phone.replaceAll(" ", "")}`}
                >
                  <CornerBrackets />
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red/10 text-red transition group-hover:bg-red group-hover:text-white">
                    <FiPhone className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 truncate text-sm text-ink transition group-hover:text-red">
                    {contact.phone}
                  </span>
                </a>

                <a
                  className="group relative flex min-w-0 items-center gap-3 border border-line-light bg-parchment px-4 py-3 transition hover:-translate-y-0.5 hover:border-red"
                  href={`mailto:${contact.email}`}
                >
                  <CornerBrackets />
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red/10 text-red transition group-hover:bg-red group-hover:text-white">
                    <FiMail className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 truncate text-sm text-ink transition group-hover:text-red">
                    {contact.email}
                  </span>
                </a>
              </div>

              {/* Address opens the Google Business Profile; the map tile below
                  opens the same listing in Google Maps. */}
              <a
                aria-label="Open the Inkarp Google Business Profile"
                className="group relative flex items-start gap-3 border border-line-light bg-parchment px-4 py-3 transition hover:-translate-y-0.5 hover:border-red"
                href={googleBusinessUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <CornerBrackets />
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red/10 text-red transition group-hover:bg-red group-hover:text-white">
                  <FiMapPin className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 text-sm leading-6 text-ink-soft transition group-hover:text-ink">
                  {contact.address}
                  <span className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-red">
                    View on Google
                    <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </span>
              </a>
            </div>

            {/* Whole tile opens the Google Business Profile in Google Maps. The
                iframe is pointer-events-none so clicks reach the link, not the embed. */}
            <a
              aria-label="Open Inkarp Instruments on Google Maps"
              className="group relative mt-3 block h-40 overflow-hidden border border-line-light bg-parchment transition hover:border-red"
              href={mapPlaceUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <CornerBrackets />
              <iframe
                className="pointer-events-none h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedUrl}
                tabIndex={-1}
                title="Inkarp Instruments Private Limited location"
              />

              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line-light bg-parchment/95 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink backdrop-blur-sm">
                {contact.addressNav}
                <span className="flex items-center gap-1 text-red">
                  <FiMapPin className="h-3 w-3" />
                  Google Business Profile
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-line-light bg-parchment px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-wide">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link className="transition hover:text-red" href="/terms-and-conditions">
              Terms &amp; Conditions
            </Link>
            <span aria-hidden="true" className="h-3 w-px bg-line-light" />
            <Link className="transition hover:text-red" href="/privacy-policy">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
