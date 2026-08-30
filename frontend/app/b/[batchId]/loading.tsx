export default function BatchLoading() {
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
          <div className="prologue-shimmer h-3 w-24 rounded-full" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-4 flex justify-center w-full">
          <div className="prologue-shimmer h-12 w-64 rounded-2xl sm:h-16 sm:w-96" />
        </div>

        {/* Subtitle Skeleton */}
        <div className="mb-12 flex justify-center w-full">
          <div className="prologue-shimmer h-4 w-80 rounded-full" />
        </div>

        {/* Scenarios Grid Skeleton */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-[#292477]/40 bg-[#1a1a24]/80 p-6 text-left shadow-lg"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="prologue-shimmer h-3.5 w-20 rounded-full" />
                  <div className="prologue-shimmer h-4 w-16 rounded-full" />
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
      <span className="sr-only">Batch scenario's laden…</span>
    </div>
  );
}
