import Link from "next/link";

export default function ScenarioNotFound() {
  return (
    <main className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col items-center justify-center bg-[#111116] px-6 text-[#E9E7F5]">
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon Container */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#292477]/40 bg-[#292477]/20 shadow-inner">
          <svg
            className="h-8 w-8 text-[#F46B3C]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h1 className="title-glow mb-3 font-serif-editorial text-3xl font-semibold tracking-tight text-[#E9E7F5] sm:text-4xl">
          Scenario niet gevonden
        </h1>

        <p className="mb-8 max-w-sm text-base leading-relaxed text-[#a0a0b0]">
          Het scenario dat je zoekt bestaat niet of is mogelijk verwijderd.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#F46B3C] px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-[#E0592B] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9E7F5]"
          style={{
            boxShadow: "0 4px 20px -2px rgba(244, 107, 60, 0.4)",
          }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Terug naar scenario&apos;s
        </Link>
      </div>
    </main>
  );
}
