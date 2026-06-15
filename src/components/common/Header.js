"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiChevronDown,
  FiDownload,
  FiMenu,
  FiSearch,
  FiX,
} from "react-icons/fi";
import HeaderSearchModal from "@/components/common/HeaderSearchModal";
import { getAllProducts } from "@/data/products/principals";
import { siteConfig } from "@/data/siteConfig";

const headerSearchProducts = getAllProducts();

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
    <span className={`relative block ${mobile ? "h-8 w-36" : "h-7 w-28"}`}>
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
  const { company, navigation } = siteConfig;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState(null);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenMobileItem(null);
  };

  return (
    <header className="font-maxot sticky top-0 z-50 px-3 py-3 sm:px-5">
      <div className="mx-auto max-w-[1480px]">
        <div className="relative flex min-h-20 items-center gap-3 rounded-lg border border-zinc-200/80 bg-white/90 px-3 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <Link
            aria-label={`${company.name} home`}
            className="relative flex h-14 w-52 shrink-0 items-center rounded-lg bg-white px-3 ring-1 ring-zinc-200 transition hover:ring-[#BE0010]/30 sm:w-60"
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
            className="hidden min-w-0 flex-1 2xl:block"
          >
            <ul className="flex items-center justify-center gap-1">
              {navigation.map((item) => {
                const active = isNavActive(item, pathname);

                return (
                  <li className="group relative" key={item.label}>
                    <Link
                      className={`flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium transition ${
                        active
                          ? "bg-zinc-950 text-white"
                          : "text-zinc-700 hover:bg-zinc-100 hover:text-[#BE0010]"
                      }`}
                      href={getNavHref(item)}
                    >
                      <NavLabel item={item} />
                      {item.children ? (
                        <FiChevronDown
                          className={`text-base transition group-hover:rotate-180 ${
                            active ? "text-white/80" : "text-zinc-400"
                          }`}
                        />
                      ) : null}
                    </Link>

                    {item.children ? (
                      <div className="invisible absolute left-1/2 top-full min-w-72 -translate-x-1/2 translate-y-3 rounded-lg border border-zinc-200 bg-white p-2 opacity-0 shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                        {item.children.map((child) => (
                          <Link
                            className="block rounded-md px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-[#BE0010]"
                            href={child.href}
                            key={child.label}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-2 2xl:flex">
            <button
              className="group flex h-12 w-72 items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-left text-sm text-zinc-500 transition hover:border-[#BE0010]/40 hover:bg-white hover:text-zinc-800"
              onClick={() => setIsSearchOpen(true)}
              type="button"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-white text-zinc-500 ring-1 ring-zinc-200 transition group-hover:text-[#BE0010]">
                <FiSearch className="text-base" />
              </span>
              <span className="truncate">Search products...</span>
            </button>

            <a
              aria-label="Download product profile"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#BE0010] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9a000d]"
              download
              href="/assets/productProfile/Inkarp_product_profile_2026.pdf"
            >
              <FiDownload className="text-base" />
              Profile
            </a>
          </div>

          <div className="ml-auto flex items-center gap-2 2xl:hidden">
            <button
              aria-label="Search products"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-xl text-zinc-700 transition hover:border-[#BE0010]/40 hover:text-[#BE0010]"
              onClick={() => setIsSearchOpen(true)}
              type="button"
            >
              <FiSearch />
            </button>

            <button
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              className="inline-flex size-11 items-center justify-center rounded-lg bg-zinc-950 text-2xl text-white transition hover:bg-[#BE0010]"
              onClick={() => setIsMenuOpen((current) => !current)}
              type="button"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="mx-auto mt-3 max-w-[1480px] rounded-lg border border-zinc-200 bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.10)] 2xl:hidden"
        >
          <a
            className="mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#BE0010] px-4 text-sm font-semibold text-white"
            download
            href="/assets/productProfile/Inkarp_product_profile_2026.pdf"
          >
            <FiDownload className="text-base" />
            Download Product Profile
          </a>

          <ul className="space-y-1">
            {navigation.map((item) => {
              const isOpen = openMobileItem === item.label;
              const active = isNavActive(item, pathname);

              return (
                <li key={item.label}>
                  <div className="flex items-center gap-2">
                    <Link
                      className={`flex min-h-12 flex-1 items-center rounded-lg px-3 text-base font-medium transition ${
                        active
                          ? "bg-zinc-950 text-white"
                          : "text-zinc-800 hover:bg-zinc-50 hover:text-[#BE0010]"
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
                        className="inline-flex size-12 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700"
                        onClick={() =>
                          setOpenMobileItem(isOpen ? null : item.label)
                        }
                        type="button"
                      >
                        <FiChevronDown
                          className={`text-lg transition ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : null}
                  </div>

                  {item.children && isOpen ? (
                    <div className="mt-1 space-y-1 border-l border-zinc-200 pl-4">
                      {item.children.map((child) => (
                        <Link
                          className="block rounded-lg px-3 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-[#BE0010]"
                          href={child.href}
                          key={child.label}
                          onClick={closeMenu}
                        >
                          {child.label}
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
