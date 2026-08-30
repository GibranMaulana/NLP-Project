import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { ALL_SCENARIOS_QUERY } from "@/lib/queries";

export const revalidate = 0;

interface ScenarioItem {
  title: string;
  slug: string;
  stagesCount?: number;
}

export default async function Home() {
  const scenarios = await sanityClient.fetch<ScenarioItem[]>(ALL_SCENARIOS_QUERY);

  return (
    <div className="cinematic-grain cinematic-vignette relative flex min-h-dvh flex-col items-center bg-[#111116] px-6 py-20 text-[#e8e8ec] sm:px-10 md:py-28">
      {/* ── Background Glow ──────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-70"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(41,36,119,0.25)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6a6a7a]">
            NLP Training Platform
          </span>
          <span className="h-[3px] w-[3px] rounded-full bg-[#F46B3C]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E9E7F5]/60">
            Meta Model Simulation
          </span>
        </div>

        {/* Title */}
        <h1 className="title-glow mb-4 font-serif-editorial text-4xl font-normal tracking-tight text-[#E9E7F5] sm:text-6xl md:text-7xl">
          Daftar Skenario Simulasi
        </h1>

        <p className="mb-12 max-w-xl text-base text-[#a0a0b0] sm:text-lg">
          Pilih skenario studi kasus interaktif untuk melatih kepekaan pola Meta Model (Deletion, Distortion, Generalization).
        </p>

        {/* Scenarios Grid */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {scenarios && scenarios.length > 0 ? (
            scenarios.map((sc, i) => (
              <div
                key={sc.slug || i}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#292477]/40 bg-[#1a1a24]/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#F46B3C]/50 hover:bg-[#292477]/20"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F46B3C]">
                      Skenario 0{i + 1}
                    </span>
                    {sc.stagesCount !== undefined && (
                      <span className="rounded-full border border-[#292477]/50 bg-[#292477]/20 px-2.5 py-0.5 text-[10px] font-medium text-[#a0a0b0]">
                        {sc.stagesCount} Babak
                      </span>
                    )}
                  </div>

                  <h2 className="mb-3 font-serif-editorial text-2xl font-medium text-[#E9E7F5] group-hover:text-white">
                    {sc.title}
                  </h2>
                  <p className="text-xs text-[#7a7a8e] font-mono">
                    /scenario/{sc.slug}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#292477]/30">
                  <Link
                    href={`/scenario/${sc.slug}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#F46B3C] px-4 py-2.5 text-xs font-medium text-white shadow transition hover:bg-[#E0592B]"
                  >
                    <span>Buka Prolog</span>
                    <span>→</span>
                  </Link>

                  <Link
                    href={`/scenario/${sc.slug}/play`}
                    className="inline-flex items-center justify-center rounded-full border border-[#292477]/50 bg-[#292477]/10 px-4 py-2.5 text-xs font-medium text-[#E9E7F5] transition hover:bg-[#292477]/30"
                  >
                    <span>Langsung Chat</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-[#292477]/40 bg-[#1a1a24]/60 p-8 text-center text-[#a0a0b0]">
              Belum ada skenario di Sanity CMS.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
