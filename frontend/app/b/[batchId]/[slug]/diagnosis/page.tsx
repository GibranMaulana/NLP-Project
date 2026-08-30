import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { SCENARIO_PLAY_QUERY } from "@/lib/queries";
import type { PlayScenario } from "@/lib/types";
import ScenarioNotFound from "@/app/components/ScenarioNotFound";
import DiagnosisResult from "@/app/components/DiagnosisResult";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
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
}: PageProps) {
  const { slug } = await params;
  const scenario = await getPlayScenario(slug);

  if (!scenario) {
    return <ScenarioNotFound />;
  }

  return <DiagnosisResult scenario={scenario} slug={slug} />;
}
