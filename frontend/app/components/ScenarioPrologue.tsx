"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PlayScenario } from "@/lib/types";

interface Props {
  scenario: PlayScenario;
  onContinue?: () => void;
}

const prologueComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 font-sans text-lg font-light leading-[1.85] text-[#c8c8d4] sm:text-xl sm:leading-[1.9] md:text-[21px] last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-8 font-serif-editorial text-2xl font-normal tracking-tight text-[#E9E7F5] sm:text-3xl first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-6 font-serif-editorial text-xl font-normal text-[#E9E7F5] sm:text-2xl first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-[#F46B3C]/70 pl-6 italic text-[#E9E7F5]/90 sm:pl-8">
        <p className="font-serif-editorial text-xl leading-relaxed sm:text-2xl">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#E9E7F5]">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-[#E9E7F5]/90">{children}</em>
    ),
  },
};

export default function ScenarioPrologue({ scenario, onContinue }: Props) {
  const router = useRouter();
  const params = useParams();
  const batchId = params?.batchId as string;
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const storageKey = `nlp_prologue_seen_${scenario.slug}`;
    const hasSeen = sessionStorage.getItem(storageKey);

    if (reducedMotion.current || hasSeen) {
      setVisibleSections(
        new Set(["bg", "number", "eyebrow", "title", "divider", "prologue", "cta"])
      );
      if (!hasSeen) sessionStorage.setItem(storageKey, "true");
      return;
    }

    sessionStorage.setItem(storageKey, "true");

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
  }, [scenario.slug]);

  const handleContinue = useCallback(() => {
    if (onContinue) {
      onContinue();
    } else {
      router.push(batchId ? `/b/${batchId}/${scenario.slug}` : `/`);
    }
  }, [onContinue, router, scenario.slug, batchId]);

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

      {/* ── Fixed Top Left Back to Batch (Parallel with top-right language switcher) ─── */}
      <div className="fixed top-4 left-4 sm:top-5 sm:left-6 z-50 pointer-events-auto">
        <Link
          href={batchId ? `/b/${batchId}` : "/"}
          className="group inline-flex items-center gap-2 rounded-full border border-[#292477]/50 bg-[#16161e]/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#a0a0b0] shadow-lg backdrop-blur-md transition-all duration-200 hover:border-[#F46B3C]/50 hover:bg-[#292477]/30 hover:text-white"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span>Terug naar Batch</span>
        </Link>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <article className="relative z-10 flex w-full max-w-[780px] flex-1 flex-col px-6 py-20 sm:px-10 md:py-24 lg:py-28">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="mb-14 sm:mb-18 md:mb-20 text-center">
          {/* Eyebrow / Scenario Label */}
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-semibold uppercase tracking-[0.3em] text-[#F46B3C] transition-all duration-700 ${
                vis("number") ? "cin-animate-fade-up" : "opacity-0 translate-y-2"
              }`}
            >
              Scenario
            </span>
            <span
              className={`h-1 w-1 rounded-full bg-[#F46B3C]/50 transition-opacity duration-700 ${
                vis("number") ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
            <span
              className={`text-xs font-medium uppercase tracking-[0.25em] text-[#6a6a7e] transition-all duration-700 ${
                vis("eyebrow") ? "cin-animate-fade-up" : "opacity-0 translate-y-2"
              }`}
            >
              Gesprekssimulatie
            </span>
          </div>

          {/* Title */}
          <h1
            className={`title-glow mb-8 font-serif-editorial text-4xl font-normal leading-[1.12] tracking-tight text-[#E9E7F5] transition-all duration-[900ms] sm:text-5xl md:text-6xl lg:text-[68px] ${
              vis("title") ? "cin-animate-title" : "opacity-0 translate-y-4"
            }`}
          >
            {scenario.title}
          </h1>

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
          aria-label="Scenario Prologue"
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
                Bereid u voor om dit scenario te betreden…
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
            <span>Ga door naar Gesprek</span>
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
