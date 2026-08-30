export default function PrologueSkeleton() {
  return (
    <main className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col items-center bg-[#111116] text-[#E9E7F5]">
      <div className="relative z-10 flex w-full max-w-[780px] flex-1 flex-col px-6 py-20 sm:px-10 md:py-28 lg:py-32">
        {/* Chapter number skeleton */}
        <div className="mb-4">
          <div className="prologue-shimmer h-3 w-8 rounded-full" />
        </div>

        {/* Eyebrow skeleton */}
        <div className="mb-8 flex items-center gap-3">
          <div className="prologue-shimmer h-3 w-24 rounded-full" />
          <div className="h-1 w-1 rounded-full bg-[#292477]" />
          <div className="prologue-shimmer h-3 w-16 rounded-full" />
        </div>

        {/* Title skeleton */}
        <div className="mb-8 space-y-3">
          <div className="prologue-shimmer h-14 w-full rounded-2xl sm:h-20" />
          <div className="prologue-shimmer h-14 w-2/3 rounded-2xl sm:h-20" />
        </div>

        {/* Meta skeleton */}
        <div className="mb-6 flex gap-2">
          <div className="prologue-shimmer h-6 w-24 rounded-full" />
          <div className="prologue-shimmer h-6 w-20 rounded-full" />
          <div className="prologue-shimmer h-6 w-16 rounded-full" />
        </div>

        {/* Divider skeleton */}
        <div className="mb-12 h-[1px] w-full bg-[#292477]/30" />

        {/* Narrative text skeleton */}
        <div className="space-y-6">
          <div className="prologue-shimmer h-5 w-full rounded" />
          <div className="prologue-shimmer h-5 w-11/12 rounded" />
          <div className="prologue-shimmer h-5 w-4/5 rounded" />
          <div className="prologue-shimmer h-5 w-3/4 rounded" />
        </div>
      </div>
      <span className="sr-only">Loading cinematic scenario prologue…</span>
    </main>
  );
}
