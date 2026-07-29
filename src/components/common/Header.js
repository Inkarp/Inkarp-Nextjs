"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
// Festival/launch top banner — re-enable by uncommenting this import and its
// usage below once there's real content ready in src/data/campaigns.js.
// import AnnouncementBar from "@/components/common/AnnouncementBar";
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
  const headerRef = useRef(null);
  const headerSpacerHeightRef = useRef(124);
  const topLinks = [
    { label: "Our Story", href: "/our-story" },
    { label: "Awards and Recognitions", href: "/awards" },
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
   
    const TOP_ENTER = 10;
    const TOP_EXIT = 40;
    
    const DIRECTION_TOLERANCE = 30;

    let lastScrollY = window.scrollY;
    let anchorScrollY = window.scrollY;
    let committedDirection = null; // 'up' | 'down' | null
    let atTop = window.scrollY <= TOP_ENTER;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      atTop = atTop ? currentScrollY <= TOP_EXIT : currentScrollY <= TOP_ENTER;
      setIsAtTop(atTop);

      if (atTop) {
        setIsHeaderVisible(true);
        committedDirection = null;
        anchorScrollY = currentScrollY;
        lastScrollY = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (delta === 0) return;

      const direction = delta > 0 ? "down" : "up";

      if (direction !== committedDirection) {
        // Direction just reversed - start measuring fresh from here instead
        // of acting immediately, so a brief wiggle can't flip visibility.
        committedDirection = direction;
        anchorScrollY = currentScrollY;
        return;
      }

      if (Math.abs(currentScrollY - anchorScrollY) > DIRECTION_TOLERANCE) {
        setIsHeaderVisible(direction === "up");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const shouldShowHeader = isHeaderVisible || isMenuOpen || isSearchOpen;

  // Publishes the header's real visible height for sticky children while a
  // stable spacer keeps the fixed header from moving page content on scroll.
  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return undefined;

    let frameId;
    const updateOffset = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const height = Math.round(node.getBoundingClientRect().height);
        const visibleHeight = shouldShowHeader ? height : 0;

        if (isAtTop && height > 0) {
          headerSpacerHeightRef.current = height;
          document.documentElement.style.setProperty("--header-spacer", `${height}px`);
        } else if (!document.documentElement.style.getPropertyValue("--header-spacer")) {
          document.documentElement.style.setProperty(
            "--header-spacer",
            `${headerSpacerHeightRef.current}px`
          );
        }

        document.documentElement.style.setProperty("--header-offset", `${visibleHeight}px`);
      });
    };

    updateOffset();

    window.addEventListener("load", updateOffset);
    window.addEventListener("resize", updateOffset);

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateOffset)
      : null;
    resizeObserver?.observe(node);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("load", updateOffset);
      window.removeEventListener("resize", updateOffset);
      resizeObserver?.disconnect();
    };
  }, [isAtTop, shouldShowHeader]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out will-change-transform ${shouldShowHeader ? "translate-y-0" : "-translate-y-full"
          }`}
      >
      {/* <AnnouncementBar collapsed={!(isAtTop || isMenuOpen || isSearchOpen)} /> */}
      <div
        className={`overflow-hidden bg-black text-parchment transition-[max-height,opacity] duration-300 ease-out ${isAtTop || isMenuOpen || isSearchOpen
            ? "max-h-40 opacity-100"
            : "max-h-0 opacity-0"
          }`}
      >
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-3 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-parchment/80">
            <Link
              className="inline-flex items-center gap-2 transition hover:text-red hover:underline "
              href={`mailto:${contact.email}`}
            >
              <FiMail className="text-red" />
              {contact.email}
            </Link>
            <span className="hidden items-center gap-2 xl:inline-flex">
              <FiPhoneCall className="text-red" />
              {contact.phone}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <nav aria-label="Quick links" className="flex items-center gap-3">
              {topLinks.map((link) => (
                <Link
                  className="text-parchment/80 transition hover:text-red"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden h-5 w-px bg-parchment/20 sm:block" />
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    aria-label={item.label}
                    className="text-parchment text-xl transition hover:text-red"
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

      <div className="bg-parchment dark:bg-zinc-950">
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
                            ? "text-red"
                            : "text-ink-soft hover:text-red dark:text-zinc-300"
                          }`}
                        href={getNavHref(item)}
                      >
                        <NavLabel item={item} />
                        {item.children ? (
                          <FiChevronDown
                            className={`text-base transition group-hover:rotate-180 ${active ? "text-red" : "text-ink-soft"
                              }`}
                          />
                        ) : null}
                      </Link>

                      {item.children ? (
                        <div className="invisible absolute left-1/2 top-full min-w-72 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                          <div className="rounded-lg border border-line-light bg-parchment p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:border-zinc-800 dark:bg-zinc-900">
                            {item.children.map((child) => (
                              <Link
                                className="flex items-center justify-between gap-2 rounded-md px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-parchment-alt hover:text-red dark:text-zinc-300 dark:hover:bg-zinc-800"
                                href={child.href}
                                key={child.label}
                              >
                                {child.label}
                                {child.label === "Webinars" &&
                                upcomingWebinarsCount > 0 ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E63946] px-2 py-0.5 text-[10px] font-bold uppercase text-parchment">
                                    <span className="size-1.5 animate-pulse rounded-full bg-parchment" />
                                    Live
                                  </span>
                                ) : null}
                              </Link>
                            ))}
                          </div>
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
                className="inline-flex h-12 w-12 items-center justify-center text-2xl text-[#071f3d] transition hover:text-red dark:text-zinc-200"
                onClick={() => setIsSearchOpen(true)}
                type="button"
              >
                <FiSearch />
              </button>
             
              <Link
                aria-label="Download product profile"
                className="inline-flex h-12 items-center justify-center gap-2 bg-red px-7 text-sm font-bold text-parchment transition hover:bg-[#fff3f4] hover:text-black"
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
                className="inline-flex size-11 items-center justify-center rounded-lg border border-line-light bg-parchment text-xl text-ink-soft transition hover:border-red/40 hover:text-red dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                download
                href={productProfileUrl}
              >
                <FaDownload />
              </a>

              <button
                aria-label="Search products"
                className="inline-flex size-11 items-center justify-center rounded-lg border border-line-light bg-parchment text-xl text-ink-soft transition hover:border-red/40 hover:text-red dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                onClick={() => setIsSearchOpen(true)}
                type="button"
              >
                <FiSearch />
              </button>

              <button
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
                className="inline-flex size-11 items-center justify-center rounded-lg bg-red text-2xl text-parchment transition hover:bg-[#9a000d]"
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
          className="mx-auto max-w-[1480px] border-t border-line-light bg-parchment p-3 shadow-[0_18px_55px_rgba(15,23,42,0.10)] xl:hidden dark:border-zinc-800 dark:bg-zinc-950"
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
                          ? "bg-red text-parchment"
                          : "text-ink hover:bg-parchment-alt hover:text-red dark:text-zinc-200 dark:hover:bg-zinc-900"
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
                        className="inline-flex size-12 items-center justify-center rounded-lg border border-line-light text-ink-soft dark:border-zinc-800 dark:text-zinc-200"
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
                    <div className="mt-1 space-y-1 border-l border-line-light pl-4 dark:border-zinc-800">
                      {item.children.map((child) => (
                        <Link
                          className="flex items-center justify-between gap-2 rounded-lg px-3 py-3 text-sm font-medium text-ink-soft transition hover:bg-parchment-alt hover:text-red dark:text-zinc-300 dark:hover:bg-zinc-900"
                          href={child.href}
                          key={child.label}
                          onClick={closeMenu}
                        >
                          {child.label}
                          {child.label === "Webinars" &&
                          upcomingWebinarsCount > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#E63946] px-2 py-0.5 text-[10px] font-bold uppercase text-parchment">
                              <span className="size-1.5 animate-pulse rounded-full bg-parchment" />
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
      <div
        aria-hidden="true"
        className="shrink-0"
        style={{ height: "var(--header-spacer, 124px)" }}
      />
    </>
  );
}
