import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { ALL_BATCHES_QUERY, SETTINGS_QUERY } from "@/lib/queries";

export const revalidate = 0;

interface BatchItem {
  title: string;
  slug: string;
  scenariosCount?: number;
}

interface Settings {
  isPrivate?: boolean;
}

export default async function Home() {
  const settings = await sanityClient.fetch<Settings | null>(SETTINGS_QUERY);
  const isPrivate = settings?.isPrivate ?? false;

  let batches: BatchItem[] = [];
  if (!isPrivate) {
    batches = await sanityClient.fetch<BatchItem[]>(ALL_BATCHES_QUERY);
  }

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
            Beleef NLP
          </span>
        </div>

        {/* Title */}
        <h1 className="title-glow mb-6 font-serif-editorial text-4xl font-normal tracking-tight text-[#E9E7F5] sm:text-6xl md:text-7xl">
          Meta Model Gevoeligheidstraining
        </h1>

        {/* Explanation Section */}
        <div className="relative mb-20 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#292477]/40 bg-gradient-to-b from-[#1a1a24]/90 to-[#111116]/80 p-8 text-left shadow-[0_0_40px_-10px_rgba(41,36,119,0.3)] backdrop-blur-xl sm:p-12">
          {/* Subtle top inner glow */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F46B3C]/30 to-transparent" />
          {/* Decorative subtle gradient blob inside the card */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#292477]/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F46B3C]/20 bg-[#F46B3C]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#F46B3C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F46B3C] animate-pulse" />
              Over dit platform
            </div>

            <h2 className="mb-6 font-serif-editorial text-3xl font-medium tracking-tight text-[#E9E7F5] sm:text-4xl">
              Voel het effect van uw taal, in plaats van theorie te memoriseren.
            </h2>

            <div className="space-y-6 text-base leading-relaxed text-[#a0a0b0] sm:text-lg">
              <p>
                Dit platform is een interactieve gesprekssimulatie ontworpen om uw
                onderbewuste gevoeligheid te vergroten voor het herkennen van{" "}
                <strong className="font-medium text-[#E9E7F5]">
                  NLP Meta Model
                </strong>{" "}
                taalpatronen.
              </p>
              <p>
                Via realistische managementgesprekken ervaart u direct de impact
                van taalvervormingen zoals{" "}
                <em className="text-[#E9E7F5]">Weglating</em>,{" "}
                <em className="text-[#E9E7F5]">Vervorming</em> en{" "}
                <em className="text-[#E9E7F5]">Generalisatie</em>. U ontdekt de
                precieze vragen om helderheid te scheppen en effectief leiding te geven.
              </p>
            </div>
          </div>
        </div>

        {!isPrivate && (
          <>
            {/* Batches Header */}
            <div className="mb-10 flex w-full items-center justify-between border-b border-[#292477]/30 pb-5">
              <h2 className="font-serif-editorial text-3xl font-normal text-[#E9E7F5] sm:text-4xl">
                Probeer nu
              </h2>
            </div>

            {/* Batches Grid */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {batches && batches.length > 0 ? (
                batches.map((batch, i) => (
                  <div
                    key={batch.slug || i}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[#292477]/40 bg-[#1a1a24]/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#F46B3C]/50 hover:bg-[#292477]/20"
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#F46B3C]">
                          Batch 0{i + 1}
                        </span>
                        {batch.scenariosCount !== undefined && (
                          <span className="rounded-full border border-[#292477]/50 bg-[#292477]/20 px-2.5 py-0.5 text-[10px] font-medium text-[#a0a0b0]">
                            {batch.scenariosCount} {batch.scenariosCount === 1 ? "Scenario" : "Scenario&apos;s"}
                          </span>
                        )}
                      </div>

                      <h2 className="mb-3 font-serif-editorial text-2xl font-medium text-[#E9E7F5] group-hover:text-[#fff]">
                        {batch.title}
                      </h2>
                    </div>

                    <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#292477]/30">
                      <Link
                        href={`/b/${batch.slug}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#F46B3C] px-4 py-2.5 text-xs font-medium text-white shadow transition hover:bg-[#E0592B]"
                      >
                        <span>Bekijk Scenario&apos;s</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-[#292477]/40 bg-[#1a1a24]/60 p-8 text-center text-[#a0a0b0]">
                  Geen actieve batches gevonden in het CMS.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
