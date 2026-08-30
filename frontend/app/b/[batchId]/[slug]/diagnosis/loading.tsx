export default function DiagnosisLoading() {
  return (
    <div className="loading-screen cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col bg-[#111116] text-[#e8e8ec]">
      {/* Cinematic Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(41,36,119,0.2)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[680px] flex-1 flex-col px-6 py-20 sm:px-10 md:py-28">
        {/* Headline Skeleton */}
        <div className="py-4 flex flex-col items-center gap-3">
          <div className="prologue-shimmer h-9 w-4/5 rounded-xl sm:h-11" />
          <div className="prologue-shimmer h-9 w-3/5 rounded-xl sm:h-11" />
        </div>

        {/* Harsh Truth Card Skeleton */}
        <div className="mt-8 rounded-2xl border border-[#292477]/50 bg-[#1a1a24]/80 p-8 sm:p-10 shadow-xl space-y-4">
          <div className="prologue-shimmer h-4 w-full rounded" />
          <div className="prologue-shimmer h-4 w-11/12 rounded" />
          <div className="prologue-shimmer h-4 w-4/5 rounded" />
          <div className="prologue-shimmer h-4 w-5/6 rounded" />
          <div className="prologue-shimmer h-4 w-2/3 rounded" />
        </div>

        {/* Upsell Card Skeleton */}
        <div className="mt-10 rounded-2xl border border-[#F46B3C]/20 bg-[#1a1a24]/50 p-6 space-y-3">
          <div className="prologue-shimmer h-4 w-24 rounded-full" />
          <div className="prologue-shimmer h-6 w-3/4 rounded-lg" />
          <div className="prologue-shimmer h-3 w-5/6 rounded" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <div className="prologue-shimmer h-12 w-full sm:w-44 rounded-full" />
          <div className="prologue-shimmer h-12 w-full sm:w-48 rounded-full" />
        </div>
      </main>
      <span className="sr-only">Reflectiepatronen en diagnose analyseren…</span>
    </div>
  );
}
