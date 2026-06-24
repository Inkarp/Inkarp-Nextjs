"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiClock,
  FiChevronDown,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMenu,
  FiMapPin,
  FiPhoneCall,
  FiSearch,
  FiX,
  FiYoutube,
} from "react-icons/fi";
import HeaderSearchModal from "@/components/common/HeaderSearchModal";
import { getAllProducts } from "@/data/products/principals";
import { getUpcomingWebinarsCount } from "@/data/webinars";
import { siteConfig } from "@/data/siteConfig";
import { FaDownload } from "react-icons/fa";

const headerSearchProducts = getAllProducts();
const upcomingWebinarsCount = getUpcomingWebinarsCount();

function getNavHref(item) {
  return item.href || "#";
}

function isNavActive(item, pathname) {
  if (item.href && item.href !== "/" && pathname.startsWith(item.href)) {
    return true;
  }

  if (item.href === "/" && pathname === "/") {
    return true;
  }

  return item.children?.some((child) => pathname.startsWith(child.href));
}

function NavLabel({ item, mobile = false }) {
  if (!item.logo) {
    return item.label;
  }

  return (
    <span
      className={`relative block rounded-md dark:bg-white dark:p-1 ${mobile ? "h-8 w-36" : "h-7 w-28"}`}
    >
      <Image
        alt={item.label}
        className="object-contain"
        fill
        loading="eager"
        sizes={mobile ? "144px" : "112px"}
        src={item.logo}
      />
    </span>
  );
}

export default function Header() {
  const { company, contact, navigation, socials } = siteConfig;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const previousScrollY = useRef(0);
  const topLinks = [
    { label: "Our Story", href: "/our-story" },
    { label: "Awards and Recognitions", href: "/awards-and-recognitions" },
    { label: "Service", href: "/service" },
    { label: "Careers", href: "/careers" },
  ];
  const mainNavigation = navigation.filter(
    (item) => !["About Us", "Service", "Careers"].includes(item.label)
  );
  const productProfileUrl = "/assets/productProfile/Inkarp_product_profile_2026.pdf";

  const socialLinks = [
    { label: "LinkedIn", href: socials.linkedin, icon: FiLinkedin },
    { label: "Facebook", href: socials.facebook, icon: FiFacebook },
    { label: "Instagram", href: socials.instagram, icon: FiInstagram },
    { label: "YouTube", href: socials.youtube, icon: FiYoutube },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenMobileItem(null);
  };

  useEffect(() => {
    previousScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY <= 24);

      if (currentScrollY <= 24) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > previousScrollY.current) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < previousScrollY.current) {
        setIsHeaderVisible(true);
      }

      previousScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const shouldShowHeader = isHeaderVisible || isMenuOpen || isSearchOpen;

  return (
    <header
      className={`font-maxot sticky top-0 z-50 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out ${shouldShowHeader ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div
        className={`overflow-hidden bg-black text-white transition-[max-height,opacity] duration-300 ease-out ${isAtTop || isMenuOpen || isSearchOpen
            ? "max-h-40 opacity-100"
            : "max-h-0 opacity-0"
          }`}
      >
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-3 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80">
            <Link
              className="inline-flex items-center gap-2 transition hover:text-[#BE0010] hover:underline "
              href={`mailto:${contact.email}`}
            >
              <FiMail className="text-[#BE0010]" />
              {contact.email}
            </Link>
            <span className="hidden items-center gap-2 xl:inline-flex">
              <FiPhoneCall className="text-[#BE0010]" />
              {contact.phone}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <nav aria-label="Quick links" className="flex items-center gap-3">
              {topLinks.map((link) => (
                <Link
                  className="text-white/80 transition hover:text-[#BE0010]"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden h-5 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    aria-label={item.label}
                    className="text-white text-xl transition hover:text-[#BE0010]"
                    href={item.href}
                    key={item.label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon aria-hidden="true" className="text-xl" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="relative flex min-h-20 items-center gap-4">
            <Link
              aria-label={`${company.name} home`}
              className="relative flex h-16 w-48 shrink-0 items-center rounded-lg p-1.5 sm:w-56 dark:bg-white"
              href="/"
              onClick={closeMenu}
            >
              <Image
                alt={`${company.name} logo`}
                className="object-contain"
                fill
                priority
                sizes="240px"
                src={company.logo}
              />
            </Link>

            <nav
              aria-label="Primary navigation"
              className="hidden min-w-0 flex-1 xl:block"
            >
              <ul className="flex items-center justify-center gap-2">
                {mainNavigation.map((item) => {
                  const active = isNavActive(item, pathname);

                  return (
                    <li className="group relative" key={item.label}>
                      <Link
                        className={`flex h-11 items-center gap-1 px-3 text-base  transition ${active
                            ? "text-[#BE0010]"
                            : "text-zinc-600 hover:text-[#BE0010] dark:text-zinc-300"
                          }`}
                        href={getNavHref(item)}
                      >
                        <NavLabel item={item} />
                        {item.children ? (
                          <FiChevronDown
                            className={`text-base transition group-hover:rotate-180 ${active ? "text-[#BE0010]" : "text-zinc-400"
                              }`}
                          />
                        ) : null}
                      </Link>

                      {item.children ? (
                        <div className="invisible absolute left-1/2 top-full min-w-72 -translate-x-1/2 translate-y-3 rounded-lg border border-zinc-200 bg-white p-2 opacity-0 shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900">
                          {item.children.map((child) => (
                            <Link
                              className="flex items-center justify-between gap-2 rounded-md px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-[#BE0010] dark:text-zinc-300 dark:hover:bg-zinc-800"
                              href={child.href}
                              key={child.label}
                            >
                              {child.label}
                              {child.label === "Webinars" &&
                              upcomingWebinarsCount > 0 ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#E63946] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                  <span className="size-1.5 animate-pulse rounded-full bg-white" />
                                  Live
                                </span>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto gap-4 hidden shrink-0 items-stretch xl:flex">

              <div className="mx-6 w-px bg-zinc-200" />
              <button
                aria-label="Search products"
                className="inline-flex h-12 w-12 items-center justify-center text-2xl text-[#071f3d] transition hover:text-[#BE0010] dark:text-zinc-200"
                onClick={() => setIsSearchOpen(true)}
                type="button"
              >
                <FiSearch />
              </button>
              {/* <a
              className="ml-5 inline-flex items-center gap-3 bg-[#BE0010] px-5 py-2 text-white transition hover:bg-[#9f000d]"
              href={`tel:${contact.phone.replaceAll(" ", "")}`}
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-xl text-[#BE0010]">
                <FiPhoneCall />
              </span>
              <span className="grid leading-tight">
                <span className="text-xs font-semibold">Call Us Anytime</span>
                <span className="text-lg font-bold">{contact.phone}</span>
              </span>
            </a> */}
              <Link
                aria-label="Download product profile"
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#BE0010] px-7 text-sm font-bold text-white transition hover:bg-[#fff3f4] hover:text-black"
                download
                href={productProfileUrl}
              >
                <FaDownload className="text-base animate-bounce" />
                Product Profile
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-2 xl:hidden">
              <a
                aria-label="Download product profile"
                className="inline-flex size-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-xl text-zinc-700 transition hover:border-[#BE0010]/40 hover:text-[#BE0010] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                download
                href={productProfileUrl}
              >
                <FaDownload />
              </a>

              <button
                aria-label="Search products"
                className="inline-flex size-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-xl text-zinc-700 transition hover:border-[#BE0010]/40 hover:text-[#BE0010] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                onClick={() => setIsSearchOpen(true)}
                type="button"
              >
                <FiSearch />
              </button>

              <button
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
                className="inline-flex size-11 items-center justify-center rounded-lg bg-[#BE0010] text-2xl text-white transition hover:bg-[#9a000d]"
                onClick={() => setIsMenuOpen((current) => !current)}
                type="button"
              >
                {isMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="mx-auto max-w-[1480px] border-t border-zinc-200 bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.10)] xl:hidden dark:border-zinc-800 dark:bg-zinc-950"
        >
          <ul className="space-y-1">
            {mainNavigation.map((item) => {
              const isOpen = openMobileItem === item.label;
              const active = isNavActive(item, pathname);

              return (
                <li key={item.label}>
                  <div className="flex items-center gap-2">
                    <Link
                      className={`flex min-h-12 flex-1 items-center rounded-lg px-3 text-base font-medium transition ${active
                          ? "bg-[#BE0010] text-white"
                          : "text-zinc-800 hover:bg-zinc-50 hover:text-[#BE0010] dark:text-zinc-200 dark:hover:bg-zinc-900"
                        }`}
                      href={getNavHref(item)}
                      onClick={item.children ? undefined : closeMenu}
                    >
                      <NavLabel item={item} mobile />
                    </Link>

                    {item.children ? (
                      <button
                        aria-expanded={isOpen}
                        aria-label={`Toggle ${item.label} submenu`}
                        className="inline-flex size-12 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                        onClick={() =>
                          setOpenMobileItem(isOpen ? null : item.label)
                        }
                        type="button"
                      >
                        <FiChevronDown
                          className={`text-lg transition ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                    ) : null}
                  </div>

                  {item.children && isOpen ? (
                    <div className="mt-1 space-y-1 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                      {item.children.map((child) => (
                        <Link
                          className="flex items-center justify-between gap-2 rounded-lg px-3 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-[#BE0010] dark:text-zinc-300 dark:hover:bg-zinc-900"
                          href={child.href}
                          key={child.label}
                          onClick={closeMenu}
                        >
                          {child.label}
                          {child.label === "Webinars" &&
                          upcomingWebinarsCount > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#E63946] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                              <span className="size-1.5 animate-pulse rounded-full bg-white" />
                              Live
                            </span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}

      <HeaderSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={headerSearchProducts}
      />
    </header>
  );
}
