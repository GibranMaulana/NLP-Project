import { client } from "./sanity.client";

export type ValueType = {
  title: string;
  value: string;
};

export type Reply = {
  text: string;
  valueType: ValueType;
};

export type Stage = {
  title: string;
  speaker?: string;
  botPrompt: string;
  replies: Reply[];
};

export type Diagnosis = {
  title: string;
  headline: string;
  harshTruth: string;
  valueType: ValueType;
};

export type Scenario = {
  title: string;
  slug: { current: string };
  prologue?: any[];
  stages: Stage[];
  diagnoses: Diagnosis[];
};

const ALL_SCENARIOS_QUERY = `
  *[_type == "scenario"] | order(_createdAt desc) {
    title,
    slug
  }
`;

const SCENARIO_BY_SLUG_QUERY = `
  *[_type == "scenario" && slug.current == $slug][0] {
    title,
    slug,
    prologue,
    stages[] {
      title,
      speaker,
      botPrompt,
      replies[] {
        text,
        valueType-> {
          title,
          value
        }
      }
    },
    diagnoses[]-> {
      title,
      headline,
      harshTruth,
      valueType-> {
        title,
        value
      }
    }
  }
`;

const ALL_VALUE_TYPES_QUERY = `
  *[_type == "valueType"] | order(title asc) {
    title,
    value
  }
`;

export async function getAllScenarios(): Promise<Pick<Scenario, "title" | "slug">[]> {
  return client.fetch(ALL_SCENARIOS_QUERY);
}

export async function getScenarioBySlug(slug: string): Promise<Scenario | null> {
  return client.fetch(SCENARIO_BY_SLUG_QUERY, { slug });
}

export async function getAllValueTypes(): Promise<ValueType[]> {
  return client.fetch(ALL_VALUE_TYPES_QUERY);
}
