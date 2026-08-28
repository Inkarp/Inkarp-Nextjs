function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse bg-line-light/60 ${className}`} />;
}

export default function ProductDetailLoading() {
  return (
    <main className="bg-white text-ink" data-scroll-skip>
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[7.6fr_2.4fr] lg:items-center">
          <div>
            <SkeletonBlock className="h-7 w-36" />
            <div className="mt-5 flex flex-wrap gap-2">
              <SkeletonBlock className="h-11 w-28" />
              <SkeletonBlock className="h-11 w-40" />
              <SkeletonBlock className="h-11 w-36" />
            </div>
            <SkeletonBlock className="mt-8 h-12 w-full max-w-[480px]" />
            <SkeletonBlock className="mt-3 h-12 w-full max-w-[360px]" />
            <SkeletonBlock className="mt-5 h-6 w-full max-w-[420px]" />
            <div className="mt-5 flex flex-wrap gap-2.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-9 w-28" />
              ))}
            </div>
            <SkeletonBlock className="mt-6 h-5 w-full max-w-[560px]" />
            <SkeletonBlock className="mt-3 h-5 w-full max-w-[500px]" />
          </div>
          <div className="self-center border border-line-light bg-parchment-alt p-4">
            <SkeletonBlock className="min-h-[240px] w-full sm:min-h-[320px] lg:min-h-[260px]" />
            <div className="mt-4">
              <SkeletonBlock className="h-12 w-full" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}