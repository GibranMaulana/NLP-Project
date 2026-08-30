import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { SCENARIO_PLAY_QUERY } from "@/lib/queries";
import type { PlayScenario } from "@/lib/types";
import ScenarioNotFound from "@/app/components/ScenarioNotFound";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ patterns?: string }>;
}

async function getPlayScenario(slug: string): Promise<PlayScenario | null> {
  return sanityClient.fetch<PlayScenario | null>(SCENARIO_PLAY_QUERY, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getPlayScenario(slug);

  if (!scenario) {
    return {
      title: "Refleksi Tidak Ditemukan",
    };
  }

  return {
    title: `Refleksi: ${scenario.title}`,
    description: `Refleksi hasil skenario ${scenario.title}`,
  };
}

export default async function ScenarioDiagnosisPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { patterns: patternsRaw } = await searchParams;
  const scenario = await getPlayScenario(slug);

  if (!scenario) {
    return <ScenarioNotFound />;
  }

  const selectedPatterns = patternsRaw ? patternsRaw.split(",") : [];

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
  if (userCondition === "tie_2") {
    if (distortionCount === countsArr[1] && !userTopPatterns.includes("distortion") && distortionCount > 0) userTopPatterns.push("distortion");
    if (generalizationCount === countsArr[1] && !userTopPatterns.includes("generalization") && generalizationCount > 0) userTopPatterns.push("generalization");
    if (deletionCount === countsArr[1] && !userTopPatterns.includes("deletion") && deletionCount > 0) userTopPatterns.push("deletion");
  }

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
          if (dValueTypes.length >= 2) {
            return userTopPatterns.every((tp) => dValueTypes.some((dvt) => dvt.includes(tp)));
          }
          return true;
        }
        if (cond === "dominant" && userCondition === "dominant") {
          const domWinner = userTopPatterns[0];
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
        if (title.includes("drie") || title.includes("tiga") || title.includes("gelijk") || title.includes("all")) return true;
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

  const harshTruth = matchedDiag?.harshTruth || matchedDiag?.description;

  return (
    <div className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col bg-[#111116] text-[#e8e8ec] selection:bg-[#292477]/40 selection:text-[#E9E7F5]">
      {/* Cinematic Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(41,36,119,0.2)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[680px] flex-1 flex-col px-6 py-20 sm:px-10 md:py-28">
        {/* Header Navigation Only */}
        <div className="mb-8 flex items-center justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#292477]/50 bg-[#1a1a24] px-4 py-2 text-xs font-medium text-[#a0a0b0] transition hover:bg-[#292477]/30 hover:text-white"
          >
            ← Kembali ke Batch Skenario
          </Link>
        </div>

        {/* Reflection Diagnosis Section */}
        <section className="space-y-8">
          {/* Punchy Headline outside the box (Centered with subtle blue atmospheric glow) */}
          {matchedDiag?.headline && (
            <div className="relative py-4">
              {/* Subtle Blue Glow Effect behind text */}
              <div 
                className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.25)_0%,rgba(41,36,119,0.15)_45%,transparent_75%)] blur-2xl opacity-90" 
                aria-hidden="true" 
              />
              <h1 className="notranslate relative z-10 text-center font-serif-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[#E9E7F5] leading-snug drop-shadow-[0_4px_16px_rgba(41,36,119,0.5)]">
                {matchedDiag.headline}
              </h1>
            </div>
          )}

          {/* Box Container strictly for Harsh Truth */}
          {(matchedDiag?.harshTruth || matchedDiag?.description) && (
            <div className="rounded-2xl border border-[#292477]/50 bg-[#1a1a24]/80 p-8 sm:p-10 shadow-xl backdrop-blur-sm">
              <p className="notranslate font-sans text-base sm:text-lg leading-[1.85] text-[#c8c8d4] font-normal whitespace-pre-wrap">
                {matchedDiag.harshTruth || matchedDiag.description}
              </p>
            </div>
          )}
          {/* Upsell / CTA Promotion */}
          <div className="rounded-2xl border border-[#F46B3C]/30 bg-[linear-gradient(135deg,rgba(41,36,119,0.25)_0%,rgba(244,107,60,0.1)_100%)] p-6 shadow-lg relative overflow-hidden mt-10">
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-[#F46B3C]/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#292477]/30 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-md text-left">
                <span className="inline-block rounded-full bg-[#F46B3C]/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#F46B3C]">
                  Upgrade Skill
                </span>
                <h4 className="mt-2 font-serif-editorial text-xl font-medium text-[#E9E7F5]">
                  Ingin Menguasai Meta Model Secara Profesional?
                </h4>
                <p className="mt-1.5 text-xs text-[#a0a0b0] leading-relaxed">
                  Akses modul pelatihan bersertifikat NLP Practitioner kami secara instan untuk mempelajari strategi bertanya tingkat lanjut dan meningkatkan presisi komunikasi Anda.
                </p>
              </div>
              <div className="flex shrink-0 items-center">
                <a
                  href="https://nlp-project-promo-placeholder.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#F46B3C] px-5 py-2.5 text-xs font-semibold tracking-wider text-white shadow-md transition hover:bg-[#E0592B]"
                >
                  Pelajari Selengkapnya →
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={`/scenario/${slug}/play?restart=true`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#292477]/60 bg-[#1a1a24] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#E9E7F5] transition hover:bg-[#292477]/30"
            >
              ↻ Ulangi Skenario
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#292477] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#E9E7F5] transition hover:bg-[#292477]/80"
            >
              Kembali ke Batch Skenario
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
