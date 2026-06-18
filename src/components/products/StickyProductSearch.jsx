"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyProductSearch({ children }) {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const previousScrollY = useRef(0);

  useEffect(() => {
    previousScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const atTop = currentScrollY <= 24;
      setIsAtTop(atTop);

      if (atTop) {
        setIsVisible(true);
      } else if (currentScrollY > previousScrollY.current) {
        setIsVisible(true);
      } else if (currentScrollY < previousScrollY.current) {
        setIsVisible(false);
      }

      previousScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`sticky z-40 border-b border-zinc-200 bg-white px-4 py-3 shadow-sm shadow-zinc-950/5 transition-[top,transform] duration-300 ease-out sm:px-6 lg:px-8 ${
        isAtTop ? "top-24" : "top-0"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}
