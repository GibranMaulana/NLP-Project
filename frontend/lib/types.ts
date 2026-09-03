import type { PortableTextBlock } from "@portabletext/react";

export interface ValueType {
  title: string;
  description?: string;
  topic?: "meta_model" | "chunking" | "language_openness";
}

export interface Reply {
  _key?: string;
  text: string;
  valueType?: ValueType;
  nextStageKey?: string; // Branching: points to next stage._key
  nextStage?: string; // Legacy/Tension compatibility
  tensionEffect?: number;
  systemFeedback?: string;
  npcReaction?: string;
}

export interface Stage {
  _key?: string;
  title: string;
  speaker?: string;
  phaseType?: "Pacing" | "Leading" | string;
  topicFocus?: "meta_model" | "chunking" | "language_openness" | "mixed"; // NLP topic focus
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
  mainQuest?: string;
}

export interface PlayScenario {
  title: string;
  slug: string;
  prologue?: PortableTextBlock[];
  mainQuest?: string;
  initialTension?: number;
  maxTension?: number;
  maxTensionDialogue?: string;
  maxTensionTargetStage?: string;
  stages: Stage[];
  diagnoses?: Diagnosis[];
}

