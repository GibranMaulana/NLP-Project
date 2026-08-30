import { cache } from "react";
import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { SCENARIO_PLAY_QUERY, BUSINESS_LINK_QUERY } from "@/lib/queries";
import type { PlayScenario } from "@/lib/types";
import ScenarioNotFound from "@/app/components/ScenarioNotFound";
import DiagnosisResult from "@/app/components/DiagnosisResult";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getPlayScenario = cache(async (slug: string): Promise<PlayScenario | null> => {
  return sanityClient.fetch<PlayScenario | null>(SCENARIO_PLAY_QUERY, { slug });
});

const getBusinessLink = cache(async (): Promise<string | null> => {
  try {
    const data = await sanityClient.fetch<{ businessLink?: string } | null>(BUSINESS_LINK_QUERY);
    return data?.businessLink || null;
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getPlayScenario(slug);

  if (!scenario) {
    return {
      title: "Reflection Not Found",
    };
  }

  return {
    title: `Reflection: ${scenario.title}`,
    description: `Reflection and diagnosis results for ${scenario.title}`,
  };
}

export default async function ScenarioDiagnosisPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const [scenario, businessLink] = await Promise.all([
    getPlayScenario(slug),
    getBusinessLink(),
  ]);

  if (!scenario) {
    return <ScenarioNotFound />;
  }

  return (
    <DiagnosisResult
      scenario={scenario}
      slug={slug}
      courseUrl={businessLink || "https://hetnlpinstituut.nl"}
    />
  );
}
