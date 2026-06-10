"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiChevronDown, FiMenu, FiSearch, FiX } from "react-icons/fi";
import HeaderSearchModal from "@/components/common/HeaderSearchModal";
import { getAllProducts } from "@/data/products/principals";
import { siteConfig } from "@/data/siteConfig";

const headerSearchProducts = getAllProducts();

export default function Header() {
  const { company, navigation } = siteConfig;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState(null);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenMobileItem(null);
  };

  return (
    <header className="font-maxot sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-[1500px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          aria-label={`${company.name} home`}
          className="relative block h-16 w-64 shrink-0"
          href="/"
          onClick={closeMenu}
        >
          <Image
            alt={`${company.name} logo`}
            className="object-contain"
            fill
            priority
            sizes="256px"
            src={company.logo}
          />
        </Link>

        <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 xl:block">
          <ul className="flex items-center justify-center gap-1">
            {navigation.map((item) => (
              <li className="group relative" key={item.label}>
                <Link
                  className="flex h-11 items-center gap-1 rounded-md px-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 hover:text-[#BE0010]"
                  href={item.href}
                >
                  {item.logo ? (
                    <span className="relative block h-8 w-32">
                      <Image
                        alt={item.label}
                        className="object-contain"
                        fill
                        sizes="128px"
                        src={item.logo}
                      />
                    </span>
                  ) : (
                    item.label
                  )}
                  {item.children ? (
                    <FiChevronDown className="text-base transition group-hover:rotate-180" />
                  ) : null}
                </Link>

                {item.children ? (
                  <div className="invisible absolute left-0 top-full min-w-64 translate-y-2 rounded-md border border-zinc-200 bg-white p-2 opacity-0 shadow-lg shadow-zinc-900/10 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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
            ))}
          </ul>
        </nav>

        <button
          className="hidden h-12 w-80 shrink-0 items-center gap-3 rounded-md border border-zinc-200 bg-white px-4 text-left text-sm text-zinc-500 transition hover:border-[#BE0010] hover:text-zinc-800 xl:flex"
          onClick={() => setIsSearchOpen(true)}
          type="button"
        >
          <FiSearch className="text-lg text-zinc-400" />
          Search products...
        </button>

        <button
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
          className="inline-flex size-11 items-center justify-center rounded-md border border-zinc-200 text-2xl text-zinc-800 xl:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isMenuOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-zinc-200 bg-white px-4 py-4 xl:hidden"
        >
          <button
            className="mb-4 flex h-12 w-full items-center gap-3 rounded-md border border-zinc-200 bg-white px-4 text-left text-sm text-zinc-500"
            onClick={() => setIsSearchOpen(true)}
            type="button"
          >
            <FiSearch className="text-lg text-zinc-400" />
            Search products...
          </button>

          <ul className="space-y-1">
            {navigation.map((item) => {
              const isOpen = openMobileItem === item.label;

              return (
                <li key={item.label}>
                  <div className="flex items-center gap-2">
                    <Link
                      className="flex min-h-11 flex-1 items-center rounded-md px-3 text-base font-medium text-zinc-800 hover:bg-zinc-50 hover:text-[#BE0010]"
                      href={item.href}
                      onClick={item.children ? undefined : closeMenu}
                    >
                      {item.logo ? (
                        <span className="relative block h-8 w-36">
                          <Image
                            alt={item.label}
                            className="object-contain"
                            fill
                            sizes="144px"
                            src={item.logo}
                          />
                        </span>
                      ) : (
                        item.label
                      )}
                    </Link>

                    {item.children ? (
                      <button
                        aria-expanded={isOpen}
                        aria-label={`Toggle ${item.label} submenu`}
                        className="inline-flex size-11 items-center justify-center rounded-md border border-zinc-200 text-zinc-700"
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
                          className="block rounded-md px-3 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-[#BE0010]"
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
