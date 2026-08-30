"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <main className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col items-center justify-center bg-[#111116] px-6 text-[#E9E7F5]">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(244,107,60,0.15)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Error icon */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F46B3C]/40 bg-[#F46B3C]/10 text-[#F46B3C] text-2xl shadow-inner">
          ⚠️
        </div>

        <h1 className="title-glow mb-3 font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-[#E9E7F5]">
          Er is iets misgegaan
        </h1>

        <p className="mb-8 text-sm sm:text-base leading-relaxed text-[#a0a0b0]">
          Er is een onverwachte fout opgetreden bij het laden van deze simulatie. Probeer het opnieuw of keer terug naar het overzicht.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#F46B3C] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow transition hover:bg-[#E0592B]"
          >
            ↻ Probeer Opnieuw
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#292477]/50 bg-[#1a1a24] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#E9E7F5] transition hover:bg-[#292477]/30"
          >
            Terug naar Home
          </Link>
        </div>
      </div>
    </main>
  );
}
