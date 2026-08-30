import { getScenarioBySlug } from "@/lib/sanity.queries";
import { notFound } from "next/navigation";
import ScenarioGame from "./ScenarioGame";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ScenarioPage({ params }: Props) {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);

  if (!scenario) {
    notFound();
  }

  return <ScenarioGame scenario={scenario} />;
}
