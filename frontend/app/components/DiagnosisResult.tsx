"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { PlayScenario } from "@/lib/types";

interface Props {
  scenario: PlayScenario;
  slug: string;
  courseUrl?: string;
}

export default function DiagnosisResult({
  scenario,
  slug,
  courseUrl = "https://hetnlpinstituut.nl",
}: Props) {
  const params = useParams();
  const batchId = params.batchId as string;

  const loadSavedState = () => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem(`nlp_chat_state_${slug}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore parse error
    }
    return null;
  };

  const [savedState] = useState(loadSavedState);
  const [selectedPatterns] = useState<string[]>(() =>
    Array.isArray(savedState?.selectedPatterns) ? savedState.selectedPatterns : []
  );
  const [currentTension] = useState<number | null>(() =>
    typeof savedState?.currentTension === "number" ? savedState.currentTension : null
  );
  const [isLoaded] = useState(true);

  // Count exact pattern choices made by user across chat stages
  let distortionCount = 0;
  let generalizationCount = 0;
  let deletionCount = 0;

  selectedPatterns.forEach((p) => {
    if (!p) return;
    const lower = p.toLowerCase();
    if (lower.includes("distortion") || lower.includes("distorsi")) distortionCount++;
    else if (lower.includes("generalization") || lower.includes("generalisasi")) generalizationCount++;
    else if (lower.includes("deletion") || lower.includes("delesi") || lower.includes("penghapusan")) deletionCount++;
  });

  // Determine user result type:
  // - "tie_3" if all 3 are equal (and > 0)
  // - "tie_2" if 2 top counts are equal (and > 0)
  // - "dominant" if 1 clear max
  let userCondition: "dominant" | "tie_2" | "tie_3" = "dominant";
  const countsArr = [distortionCount, generalizationCount, deletionCount].sort((a, b) => b - a);

  if (countsArr[0] > 0 && countsArr[0] === countsArr[1] && countsArr[1] === countsArr[2]) {
    userCondition = "tie_3";
  } else if (countsArr[0] > 0 && countsArr[0] === countsArr[1] && countsArr[0] > countsArr[2]) {
    userCondition = "tie_2";
  }

  // Active top pattern titles
  const userTopPatterns: string[] = [];
  if (distortionCount === countsArr[0] && distortionCount > 0) userTopPatterns.push("distortion");
  if (generalizationCount === countsArr[0] && generalizationCount > 0) userTopPatterns.push("generalization");
  if (deletionCount === countsArr[0] && deletionCount > 0) userTopPatterns.push("deletion");

  const matchedDiag =
    scenario.diagnoses?.find((d) => {
      const cond = d.conditionType;
      const dValueTypes = (d.valueTypes || []).map((vt) => vt.toLowerCase());
      const dPatternTitle = (d.patternTitle || d.dominantPattern || "").toLowerCase();
      const title = (d.title || "").toLowerCase();

      // 1. If CMS diagnosis defines conditionType explicitly
      if (cond) {
        if (cond === "tie_3" && userCondition === "tie_3") return true;
        if (cond === "tie_2" && userCondition === "tie_2") {
          if (dValueTypes.length >= 2 && userTopPatterns.length >= 2) {
            return userTopPatterns.every((tp) => dValueTypes.some((dvt) => dvt.includes(tp)));
          }
          return true;
        }
        if (cond === "dominant" && userCondition === "dominant") {
          const domWinner = userTopPatterns[0];
          if (!domWinner) return false;
          if (dValueTypes.length > 0) {
            return dValueTypes.some((dvt) => dvt.includes(domWinner));
          }
          if (dPatternTitle) {
            return dPatternTitle.includes(domWinner);
          }
        }
      }

      // 2. Fallback matching by document title
      if (userCondition === "tie_3") {
        if (title.includes("drie") || title.includes("three") || title.includes("tiga") || title.includes("gelijk") || title.includes("all")) return true;
      }
      if (userCondition === "tie_2") {
        if (userTopPatterns.includes("distortion") && userTopPatterns.includes("deletion") && (title.includes("distortion + deletion") || title.includes("distorsi + delesi"))) return true;
        if (userTopPatterns.includes("generalization") && userTopPatterns.includes("deletion") && (title.includes("generalization + deletion") || title.includes("generalisasi + delesi"))) return true;
        if (userTopPatterns.includes("distortion") && userTopPatterns.includes("generalization") && (title.includes("distortion + generalization") || title.includes("distorsi + generalisasi"))) return true;
      }
      if (userCondition === "dominant") {
        const winner = userTopPatterns[0];
        if (winner === "distortion" && (title.includes("distortion diagnosis") || (title.includes("distortion") && !title.includes("+")))) return true;
        if (winner === "generalization" && (title.includes("generalization diagnosis") || (title.includes("generalization") && !title.includes("+")))) return true;
        if (winner === "deletion" && (title.includes("deletion diagnosis") || (title.includes("deletion") && !title.includes("+")))) return true;
      }

      return false;
    }) || scenario.diagnoses?.[0];

  if (!isLoaded) {
    return (
      <div className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col bg-[#111116] text-[#e8e8ec]">
        <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(41,36,119,0.2)_0%,transparent_70%)]" />
        </div>
        <main className="relative z-10 mx-auto flex w-full max-w-[680px] flex-1 flex-col px-6 py-20 sm:px-10 md:py-28">
          <div className="py-4 flex flex-col items-center gap-3">
            <div className="prologue-shimmer h-9 w-4/5 rounded-xl sm:h-11" />
            <div className="prologue-shimmer h-9 w-3/5 rounded-xl sm:h-11" />
          </div>
          <div className="mt-8 rounded-2xl border border-[#292477]/50 bg-[#1a1a24]/80 p-8 sm:p-10 shadow-xl space-y-4">
            <div className="prologue-shimmer h-4 w-full rounded" />
            <div className="prologue-shimmer h-4 w-11/12 rounded" />
            <div className="prologue-shimmer h-4 w-4/5 rounded" />
          </div>
        </main>
      </div>
    );
  }

  const isHappyEnding = currentTension !== null && currentTension <= 1;

  return (
    <div className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col bg-[#111116] text-[#e8e8ec] selection:bg-[#292477]/40 selection:text-[#E9E7F5]">
      {/* Cinematic Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(41,36,119,0.2)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[680px] flex-1 flex-col px-6 py-20 sm:px-10 md:py-28">
        {/* Reflection Diagnosis Section */}
        <section className="space-y-8">
          {/* Ending Status Banner */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border backdrop-blur-md ${
              isHappyEnding
                ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.2)]"
                : currentTension === 2
                ? "border-amber-500/40 bg-amber-950/40 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.2)]"
                : "border-rose-500/40 bg-rose-950/40 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.2)]"
            }`}>
              <span>{isHappyEnding ? "🎯 Happy Ending: Konsensus Berhasil" : currentTension === 2 ? "⚖️ Ending Kompromi" : "🚨 Eskalasi Krisis"}</span>
            </div>
          </div>

          {/* Punchy Headline outside the box */}
          <div className="relative py-2">
            <div 
              className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.25)_0%,rgba(41,36,119,0.15)_45%,transparent_75%)] blur-2xl opacity-90" 
              aria-hidden="true" 
            />
            <h1 className="relative z-10 text-center font-serif-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[#E9E7F5] leading-snug drop-shadow-[0_4px_16px_rgba(41,36,119,0.5)]">
              {matchedDiag?.headline || matchedDiag?.title || "Reflectie op uw Communicatiestijl"}
            </h1>
          </div>

          {/* Box Container strictly for Harsh Truth */}
          <div className="rounded-2xl border border-[#292477]/50 bg-[#1a1a24]/80 p-8 sm:p-10 shadow-xl backdrop-blur-sm">
            <p className="font-sans text-base sm:text-lg leading-[1.85] text-[#c8c8d4] font-normal whitespace-pre-wrap">
              {matchedDiag?.harshTruth || matchedDiag?.description || "U heeft dit scenario doorlopen met een gevarieerde mix van Meta Model reacties. Ontdek hoe het verleggen van uw focus tussen weglatingen, aannames en generalisaties de psychologische veiligheid in uw team transformeert."}
            </p>
          </div>

          {/* Upsell / CTA Promotion */}
          <div className="rounded-2xl border border-[#F46B3C]/30 bg-[linear-gradient(135deg,rgba(41,36,119,0.25)_0%,rgba(244,107,60,0.1)_100%)] p-6 shadow-lg relative overflow-hidden mt-10">
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-[#F46B3C]/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#292477]/30 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-md text-left">
                <span className="inline-block rounded-full bg-[#F46B3C]/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#F46B3C]">
                  Executive Training
                </span>
                <h4 className="mt-2 font-serif-editorial text-xl font-medium text-[#E9E7F5]">
                  Beheers het NLP Meta Model Professioneel
                </h4>
                <p className="mt-1.5 text-xs text-[#a0a0b0] leading-relaxed">
                  Volg gecertificeerde NLP Practitioner- en leiderschapstrainingen bij Het NLP Instituut om uw gespreksprecisie en impact te vergroten.
                </p>
              </div>
              <div className="flex shrink-0 items-center">
                <a
                  href={courseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#F46B3C] px-5 py-2.5 text-xs font-semibold tracking-wider text-white shadow-md transition hover:bg-[#E0592B]"
                >
                  Ontdek Opleidingen →
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={`/b/${batchId}/${slug}?restart=true`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#292477]/60 bg-[#1a1a24] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#E9E7F5] transition hover:bg-[#292477]/30"
            >
              ↻ Scenario Opnieuw Spelen
            </Link>
            <Link
              href={`/b/${batchId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#292477] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#E9E7F5] transition hover:bg-[#292477]/80"
            >
              Terug naar Partij
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
