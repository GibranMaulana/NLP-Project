import type { PortableTextBlock } from "@portabletext/react";

export interface ValueType {
  title: string;
  description?: string;
}

export interface Reply {
  _key?: string;
  text: string;
  valueType?: ValueType;
}

export interface Stage {
  _key?: string;
  title: string;
  speaker?: string;
  botPrompt: string;
  replies: Reply[];
}

export interface Diagnosis {
  _id?: string;
  title: string;
  headline?: string;
  harshTruth?: string;
  conditionType?: "dominant" | "tie_2" | "tie_3" | string;
  patternTitle?: string;
  valueTypes?: string[];
  description?: string;
  dominantPattern?: string;
}

export interface Scenario {
  title: string;
  slug: string;
  prologue?: PortableTextBlock[];
}

export interface PlayScenario {
  title: string;
  slug: string;
  prologue?: PortableTextBlock[];
  stages: Stage[];
  diagnoses?: Diagnosis[];
}
