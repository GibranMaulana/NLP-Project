export default function HomeLoading() {
  return (
    <div className="loading-screen cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col items-center bg-[#111116] px-6 py-20 text-[#e8e8ec] sm:px-10 md:py-28">
      {/* Background Glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-70"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(41,36,119,0.25)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        {/* Eyebrow Skeleton */}
        <div className="mb-6 flex items-center gap-3">
          <div className="prologue-shimmer h-3 w-28 rounded-full" />
          <div className="h-1 w-1 rounded-full bg-[#292477]" />
          <div className="prologue-shimmer h-3 w-32 rounded-full" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-6 flex flex-col items-center gap-3 w-full">
          <div className="prologue-shimmer h-12 w-3/4 max-w-lg rounded-2xl sm:h-16" />
        </div>

        {/* Overview Box Skeleton */}
        <div className="relative mb-20 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#292477]/40 bg-[#1a1a24]/60 p-8 text-left shadow-xl backdrop-blur-xl sm:p-12">
          <div className="mb-6 inline-flex">
            <div className="prologue-shimmer h-5 w-32 rounded-full" />
          </div>
          <div className="mb-6">
            <div className="prologue-shimmer h-8 w-48 rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="prologue-shimmer h-4 w-full rounded" />
            <div className="prologue-shimmer h-4 w-5/6 rounded" />
            <div className="prologue-shimmer h-4 w-4/5 rounded" />
          </div>
        </div>

        {/* Try Now Header Skeleton */}
        <div className="mb-10 flex w-full items-center justify-between border-b border-[#292477]/30 pb-5">
          <div className="prologue-shimmer h-8 w-32 rounded-xl" />
        </div>

        {/* Batches Grid Skeleton */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-[#292477]/40 bg-[#1a1a24]/80 p-6 text-left shadow-lg"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="prologue-shimmer h-3.5 w-16 rounded-full" />
                  <div className="prologue-shimmer h-4 w-20 rounded-full" />
                </div>
                <div className="mb-4">
                  <div className="prologue-shimmer h-6 w-3/4 rounded-lg" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#292477]/30">
                <div className="prologue-shimmer h-9 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
      <span className="sr-only">Platform overzicht laden…</span>
    </div>
  );
}
