"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiBox,
  FiMessageCircle,
  FiMonitor,
  FiX,
} from "react-icons/fi";

function getPopupConfig(pathname) {
  if (pathname === "/") {
    return {
      id: "home-webinar-products",
      threshold: 0,
      switchThreshold: 50,
      initial: {
        icon: <FiMonitor aria-hidden="true" />,
        eyebrow: "Live webinar",
        title: "Join our upcoming scientific webinar",
        description:
          "Get practical ideas for modern lab workflows, better product selection, and application-focused decisions.",
        primary: {
          label: "Register Now",
          href: "/contact-us",
        },
        secondary: {
          label: "Explore Products",
          href: "/products",
        },
      },
      switched: {
        icon: <FiBox aria-hidden="true" />,
        eyebrow: "Explore products",
        title: "Find the right lab solution faster",
        description:
          "Browse curated instruments, principal brands, and application-ready solutions from Inkarp.",
        primary: {
          label: "Explore Products",
          href: "/products",
        },
        secondary: {
          label: "Talk to Specialist",
          href: "/contact-us",
        },
      },
    };
  }

  if (pathname === "/products") {
    return {
      id: "products-quote",
      threshold: 14,
      icon: <FiMessageCircle aria-hidden="true" />,
      eyebrow: "Need pricing?",
      title: "Do you want to request a quote?",
      description:
        "Share your requirement and our team will help with product fit, configuration, and current pricing.",
      primary: {
        label: "Request Quote",
        href: "/contact-us?interest=quote",
      },
      secondary: {
        label: "Continue Browsing",
        action: "close",
      },
    };
  }

  if (pathname.startsWith("/products/")) {
    return {
      id: "product-detail-interest",
      threshold: 15,
      icon: <FiBookOpen aria-hidden="true" />,
      eyebrow: "Worth a closer look",
      title: "Want the useful details before you decide?",
      description:
        "Read more about applications, configuration choices, and support options, or ask Inkarp for a quote.",
      primary: {
        label: "Read More",
        href: `${pathname}#product-details`,
      },
      secondary: {
        label: "Request Quote",
        href: `/contact-us?interest=quote&product=${encodeURIComponent(pathname.split("/").pop() ?? "")}`,
      },
    };
  }

  return null;
}

function getActiveConfig(config, scrollPercent) {
  if (config?.initial && config?.switched) {
    return scrollPercent >= config.switchThreshold
      ? config.switched
      : config.initial;
  }

  return config;
}

export default function PromoPopup() {
  const pathname = usePathname();
  const config = useMemo(() => getPopupConfig(pathname), [pathname]);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const activeConfig = getActiveConfig(config, scrollPercent);

  useEffect(() => {
    setScrollPercent(0);
    setIsVisible(false);
    setIsDismissed(false);

    if (!config) {
      return;
    }

    const storageKey = `inkarp-bottom-popup:${config.id}`;
    const dismissed = window.sessionStorage.getItem(storageKey) === "dismissed";

    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    function updateVisibility() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 100;
      const nextScrollPercent = Math.min(100, Math.max(0, progress));

      setScrollPercent(nextScrollPercent);

      if (nextScrollPercent >= config.threshold) {
        setIsVisible(true);
      }
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [config]);

  if (!config || !activeConfig || isDismissed) {
    return null;
  }

  function closePopup() {
    window.sessionStorage.setItem(
      `inkarp-bottom-popup:${config.id}`,
      "dismissed"
    );
    setIsDismissed(true);
  }

  function renderButton(button, variant) {
    const className =
      variant === "primary"
        ? "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#BE0010] px-5 text-sm font-semibold text-white transition hover:bg-[#9f000d] sm:flex-none"
        : "inline-flex h-10 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:border-[#BE0010]/35 hover:text-[#BE0010] sm:flex-none";

    if (button.action === "close") {
      return (
        <button className={className} onClick={closePopup} type="button">
          {button.label}
        </button>
      );
    }

    return (
      <Link className={className} href={button.href} onClick={closePopup}>
        {button.label}
        {variant === "primary" ? <FiArrowRight aria-hidden="true" /> : null}
      </Link>
    );
  }

  return (
    <div
      className={`fixed inset-x-3 bottom-4 z-[60] mx-auto w-[min(44rem,calc(100vw-1.5rem))] transition duration-500 ease-out sm:bottom-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-[140%] opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-2xl border border-[#BE0010]/15 bg-white shadow-2xl shadow-zinc-950/20">
        <div className="h-1 bg-[#BE0010]" />
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-start gap-3 sm:flex-1">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#BE0010]/10 text-xl text-[#BE0010]">
              {activeConfig.icon}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#BE0010]">
                {activeConfig.eyebrow}
              </p>
              <h2 className="font-maxot mt-1 text-lg leading-tight text-zinc-950 sm:text-xl">
                {activeConfig.title}
              </h2>
              <p className="mt-1 text-sm leading-5 text-zinc-500">
                {activeConfig.description}
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:shrink-0">
            {renderButton(activeConfig.primary, "primary")}
            {renderButton(activeConfig.secondary, "secondary")}
          </div>

          <button
            aria-label="Close popup"
            className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            onClick={closePopup}
            type="button"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
