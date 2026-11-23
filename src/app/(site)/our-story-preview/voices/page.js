import Link from "next/link";

export const metadata = {
  title: "Our Story preview | Inkarp",
};

// The Our Story preview now opens directly at /our-story-preview. Links shared
// to this old address forward there with a refresh tag (React places it in the
// head); a redirect() thrown during render logs a dev-only React timing error.
export default function VoicesPreview() {
  return (
    <main className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 lg:px-8" data-scroll-skip>
      <meta content="0;url=/our-story-preview" httpEquiv="refresh" />
      <p className="text-base text-ink-soft">
        The Our Story preview has moved to{" "}
        <Link className="font-semibold text-red hover:underline" href="/our-story-preview">
          /our-story-preview
        </Link>
        .
      </p>
    </main>
  );
}
