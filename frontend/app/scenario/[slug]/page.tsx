import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { SCENARIO_BY_SLUG_QUERY } from "@/lib/queries";
import type { Scenario } from "@/lib/types";
import ScenarioPrologue from "@/app/components/ScenarioPrologue";
import ScenarioNotFound from "@/app/components/ScenarioNotFound";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getScenario(slug: string): Promise<Scenario | null> {
  return sanityClient.fetch<Scenario | null>(SCENARIO_BY_SLUG_QUERY, { slug });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenario(slug);

  if (!scenario) {
    return {
      title: "Scenario niet gevonden",
      description: "Het opgevraagde scenario kon niet worden gevonden.",
    };
  }

  return {
    title: `${scenario.title} — Scenario`,
    description: `Proloog voor: ${scenario.title}.`.trim(),
  };
}

export default async function ScenarioPage({ params }: PageProps) {
  const { slug } = await params;
  const scenario = await getScenario(slug);

  if (!scenario) {
    return <ScenarioNotFound />;
  }

  return <ScenarioPrologue scenario={scenario} />;
}
