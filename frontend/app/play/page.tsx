import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { SCENARIO_PLAY_QUERY, DEFAULT_SCENARIO_PLAY_QUERY } from "@/lib/queries";
import type { PlayScenario } from "@/lib/types";
import PlayChatBox from "@/app/components/PlayChatBox";
import ScenarioNotFound from "@/app/components/ScenarioNotFound";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ bundle?: string; slug?: string }>;
}

async function getPlayScenario(slug?: string): Promise<PlayScenario | null> {
  if (slug) {
    const scenario = await sanityClient.fetch<PlayScenario | null>(
      SCENARIO_PLAY_QUERY,
      { slug }
    );
    if (scenario) return scenario;
  }

  // Fallback to first scenario from Sanity
  return sanityClient.fetch<PlayScenario | null>(DEFAULT_SCENARIO_PLAY_QUERY);
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { bundle, slug } = await searchParams;
  const targetSlug = bundle || slug;
  const scenario = await getPlayScenario(targetSlug);

  if (!scenario) {
    return {
      title: "Percakapan Tidak Ditemukan",
    };
  }

  return {
    title: `${scenario.title} — Percakapan Simulasi`,
    description: `Simulasi interaktif NLP untuk ${scenario.title}`,
  };
}

export default async function PlayPage({ searchParams }: PageProps) {
  const { bundle, slug } = await searchParams;
  const targetSlug = bundle || slug;
  const scenario = await getPlayScenario(targetSlug);

  if (!scenario || !scenario.stages || scenario.stages.length === 0) {
    return <ScenarioNotFound />;
  }

  return <PlayChatBox scenario={scenario} />;
}
