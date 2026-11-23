function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse bg-line-light/60 ${className}`} />;
}

// Shape of the careers hero (heading, buttons, figures | dark quote panel),
// like the product pages' loaders, so the page doesn't jump when it arrives.
export default function CareersLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-[98%] bg-white" data-scroll-skip>
      <span className="sr-only">Loading careers</span>
      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-10 lg:justify-between">
            <div>
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="mt-6 h-11 w-full max-w-[480px]" />
              <SkeletonBlock className="mt-3 h-11 w-full max-w-[360px]" />
              <SkeletonBlock className="mt-6 h-5 w-full max-w-[460px]" />
              <SkeletonBlock className="mt-3 h-5 w-full max-w-[380px]" />
              <div className="mt-8 flex gap-4">
                <SkeletonBlock className="h-12 w-40" />
                <SkeletonBlock className="h-12 w-36" />
              </div>
            </div>
            <SkeletonBlock className="h-20 w-full max-w-[500px]" />
          </div>
          <div className="min-h-[360px] animate-pulse bg-ink/90 lg:min-h-[430px]" />
        </div>
      </section>
    </main>
  );
}
