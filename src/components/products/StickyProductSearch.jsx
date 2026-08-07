"use client";

export default function StickyProductSearch({ children }) {
  return (
    <div
      data-sticky-product-search
      className="sticky z-40 border-y border-line-light bg-white px-4 py-4 transition-[top] duration-300 ease-out sm:px-6 lg:px-8"
      style={{ top: "var(--header-offset, 124px)" }}
    >
      <div className="mx-auto w-full max-w-[1440px]">{children}</div>
    </div>
  );
}
