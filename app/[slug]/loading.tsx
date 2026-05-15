export default function Loading() {
  return (
    <main className="animate-pulse bg-brand-navy">
      {/* Hero skeleton */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="h-14 bg-white/10 rounded-xl w-3/4 mx-auto" />
          <div className="space-y-2">
            <div className="h-5 bg-white/10 rounded w-2/3 mx-auto" />
            <div className="h-5 bg-white/10 rounded w-1/2 mx-auto" />
          </div>
          <div className="h-14 bg-white/30 rounded-2xl w-40 mx-auto" />
        </div>
      </section>

      {/* Reviews skeleton */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="h-8 bg-white/10 rounded w-48 mx-auto" />
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-none w-80 rounded-2xl border border-white/20 bg-white/10 p-6 space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-5 h-5 bg-white/10 rounded" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                  <div className="h-4 bg-white/10 rounded w-4/6" />
                </div>
                <div className="space-y-1 pt-2">
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-white/10 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
