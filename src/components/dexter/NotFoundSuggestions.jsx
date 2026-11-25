"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

/** On the page-not-found screen: the address that wasn't found, and the closest real pages. */
export default function NotFoundSuggestions() {
  const pathname = usePathname() ?? "";
  const [pages, setPages] = useState(null);

  useEffect(() => {
    let live = true;
    fetch(`/api/dexter/suggest?path=${encodeURIComponent(pathname)}`)
      .then((response) => (response.ok ? response.json() : { pages: [] }))
      .then((data) => {
        if (live) setPages(Array.isArray(data.pages) ? data.pages : []);
      })
      .catch(() => {
        if (live) setPages([]);
      });
    return () => {
      live = false;
    };
  }, [pathname]);

  return (
    <div className="mt-4">
      {pathname ? (
        <p className="text-[15px] text-ink-soft">
          Nothing lives at <code className="break-all bg-parchment-alt px-1.5 py-0.5 text-[13.5px] text-ink">inkarp.co.in{pathname}</code>
        </p>
      ) : null}
      {pages?.length ? (
        <div className="mt-5">
          <p className="text-sm font-semibold text-ink">Did you mean</p>
          <ul className="mt-2 grid gap-1.5">
            {pages.map((page) => (
              <li key={page.href}>
                <Link className="flex items-center justify-between gap-3 border border-line-light bg-white px-3.5 py-2.5 text-[15px] font-medium text-ink transition hover:border-red hover:text-red" href={page.href}>
                  <span className="min-w-0">{page.title}</span>
                  <FiArrowRight aria-hidden="true" className="shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
