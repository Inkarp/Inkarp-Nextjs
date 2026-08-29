import CompareView from "@/components/products/CompareView";

export const metadata = {
  title: "Compare Products | Inkarp",
  description: "Compare specifications for the products on your shortlist, side by side.",
  // The list lives in the visitor's own browser, so there is nothing to index.
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return (
    <main className="bg-white px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <CompareView />
      </div>
    </main>
  );
}
