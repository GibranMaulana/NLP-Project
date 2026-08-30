"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { Scenario } from "@/lib/types";
import type { PortableTextComponents } from "@portabletext/react";

/* ── Cinematic Portable Text Overrides ─────────────────── */

const prologueComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-7 text-lg leading-[1.85] text-[#c8c8d4] sm:text-xl sm:leading-[1.9] md:text-[21px] md:leading-[1.85]">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-[#F46B3C]/50 py-2 pl-6 font-serif-editorial text-xl italic text-[#E9E7F5] sm:text-2xl">
        {children}
      </blockquote>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-10 font-serif-editorial text-2xl font-semibold tracking-tight text-[#E9E7F5] sm:text-3xl">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#E9E7F5]">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="font-serif-editorial italic text-[#F46B3C]/90">
        {children}
      </em>
    ),
  },
};

/* ── Component ─────────────────────────────────────────── */

interface Props {
  scenario: Scenario;
}

export default function ScenarioPrologue({ scenario }: Props) {
  const router = useRouter();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion.current) {
      setVisibleSections(
        new Set(["bg", "number", "eyebrow", "title", "divider", "prologue", "cta"])
      );
      return;
    }

    const timers = [
      setTimeout(() => setVisibleSections((s) => new Set([...s, "bg"])), 100),
      setTimeout(() => setVisibleSections((s) => new Set([...s, "number"])), 400),
      setTimeout(() => setVisibleSections((s) => new Set([...s, "eyebrow"])), 600),
      setTimeout(() => setVisibleSections((s) => new Set([...s, "title"])), 900),
      setTimeout(() => setVisibleSections((s) => new Set([...s, "divider"])), 1300),
      setTimeout(() => setVisibleSections((s) => new Set([...s, "prologue"])), 1600),
      setTimeout(() => setVisibleSections((s) => new Set([...s, "cta"])), 2400),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = useCallback(() => {
    router.push(`/scenario/${scenario.slug}/play`);
  }, [router, scenario.slug]);

  const vis = (key: string) => visibleSections.has(key);

  return (
    <main className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col items-center overflow-hidden bg-[#111116] selection:bg-[#292477]/40 selection:text-[#E9E7F5]">
      {/* ── Cinematic Background ─────────────────────────── */}
      <div
        className={`pointer-events-none fixed inset-0 transition-opacity duration-[2000ms] ${
          vis("bg") ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {/* Subtle radial gradient — atmospheric purple light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(41,36,119,0.18)_0%,transparent_70%)]" />
        {/* Very faint coral warmth at bottom */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_90%,rgba(244,107,60,0.04)_0%,transparent_60%)]" />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <article className="relative z-10 flex w-full max-w-[780px] flex-1 flex-col px-6 py-20 sm:px-10 md:py-28 lg:py-32">

        {/* ── Header / Title Section ────────────────────── */}
        <header className="mb-14 sm:mb-18 md:mb-20">
          {/* Chapter Number */}
          <div
            className={`mb-3 transition-all duration-700 ${
              vis("number") ? "cin-animate-fade-in" : "opacity-0"
            }`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#6a6a7a]">
              01
            </span>
          </div>

          {/* Eyebrow Labels */}
          <div
            className={`mb-6 flex items-center gap-3 transition-all duration-700 ${
              vis("eyebrow") ? "cin-animate-fade-in" : "opacity-0"
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6a6a7a]">
              Pengenalan
            </span>
            <span className="h-[3px] w-[3px] rounded-full bg-[#F46B3C]" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E9E7F5]/60">
              Skenario
            </span>
          </div>

          {/* Main Title */}
          <div
            className={`mb-8 transition-all duration-[800ms] ${
              vis("title") ? "cin-animate-fade-up" : "opacity-0 translate-y-5"
            }`}
          >
            <h1 className="title-glow font-serif-editorial text-[2.75rem] font-normal leading-[1.08] tracking-tight text-[#E9E7F5] sm:text-6xl sm:leading-[1.06] md:text-7xl lg:text-8xl">
              {scenario.title}
            </h1>
          </div>

          {/* Divider */}
          <div
            className={`transition-all duration-700 ${
              vis("divider") ? "cin-animate-divider" : "opacity-0 scale-x-0"
            }`}
            aria-hidden="true"
          >
            <div className="relative flex items-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-[#F46B3C]/60 via-[#292477]/60 to-transparent" />
            </div>
          </div>
        </header>

        {/* ── Narrative Prologue Body ─────────────────────── */}
        <section
          aria-label="Proloog Skenario"
          className={`flex-1 pt-2 transition-all duration-[800ms] ${
            vis("prologue") ? "cin-animate-fade-up" : "opacity-0 translate-y-4"
          }`}
        >
          {scenario.prologue && scenario.prologue.length > 0 ? (
            <PortableText
              value={scenario.prologue}
              components={prologueComponents}
            />
          ) : (
            <div className="space-y-7">
              <p className="text-lg leading-[1.85] text-[#c8c8d4] sm:text-xl sm:leading-[1.9] md:text-[21px]">
                Bersiaplah untuk memasuki skenario ini…
              </p>
            </div>
          )}
        </section>

        {/* ── Continue CTA ───────────────────────────────── */}
        <div
          className={`mt-14 flex justify-center pb-8 transition-all duration-700 ${
            vis("cta") ? "cin-animate-cta" : "opacity-0 translate-y-3"
          }`}
        >
          <button
            onClick={handleContinue}
            className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#F46B3C] px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:bg-[#E0592B] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9E7F5] active:scale-[0.98]"
            style={{
              boxShadow: "0 8px 32px -6px rgba(244, 107, 60, 0.4), 0 0 80px -20px rgba(244, 107, 60, 0.15)",
            }}
          >
            <span>Lanjut ke Percakapan</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>

      </article>
    </main>
  );
}
