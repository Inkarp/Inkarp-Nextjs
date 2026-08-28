function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse bg-line-light/60 ${className}`} />;
}

export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-white text-ink" data-scroll-skip>
      <section className="bg-white px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SkeletonBlock className="h-7 w-40" />
            <SkeletonBlock className="mt-6 h-12 w-full max-w-[420px]" />
            <SkeletonBlock className="mt-3 h-12 w-full max-w-[360px]" />
            <SkeletonBlock className="mt-6 h-5 w-full max-w-[560px]" />
            <SkeletonBlock className="mt-3 h-5 w-full max-w-[480px]" />
            <div className="mt-8 flex gap-3">
              <SkeletonBlock className="h-12 w-32" />
              <SkeletonBlock className="h-12 w-32" />
            </div>
          </div>
          <div className="border border-line-light bg-parchment-alt p-4">
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="border border-line-light bg-white p-4">
                  <SkeletonBlock className="h-5 w-32" />
                  <SkeletonBlock className="mt-3 h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line-light bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <SkeletonBlock className="h-12 w-full" />
        </div>
      </section>

      <section className="bg-parchment-alt px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="border border-line-light bg-white p-4">
              <SkeletonBlock className="aspect-[4/3] w-full" />
              <SkeletonBlock className="mt-4 h-5 w-3/4" />
              <SkeletonBlock className="mt-3 h-4 w-1/2" />
              <SkeletonBlock className="mt-6 h-10 w-full" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}