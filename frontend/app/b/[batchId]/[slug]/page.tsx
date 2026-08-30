import { cache } from "react";
import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { SCENARIO_PLAY_QUERY } from "@/lib/queries";
import type { PlayScenario } from "@/lib/types";
import ScenarioContainer from "@/app/components/ScenarioContainer";
import ScenarioNotFound from "@/app/components/ScenarioNotFound";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ batchId: string; slug: string }>;
}

const getPlayScenario = cache(async (slug: string): Promise<PlayScenario | null> => {
  return sanityClient.fetch<PlayScenario | null>(SCENARIO_PLAY_QUERY, { slug });
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getPlayScenario(slug);

  if (!scenario) {
    return {
      title: "Gesprek Niet Gevonden",
    };
  }

  return {
    title: `${scenario.title} — Interactieve Simulatie`,
    description: `NLP Meta Model interactieve simulatie voor ${scenario.title}`,
  };
}

export default async function ScenarioPlayPage({ params }: PageProps) {
  const { slug } = await params;
  const scenario = await getPlayScenario(slug);

  if (!scenario || !scenario.stages || scenario.stages.length === 0) {
    return <ScenarioNotFound />;
  }

  return <ScenarioContainer scenario={scenario} />;
}
