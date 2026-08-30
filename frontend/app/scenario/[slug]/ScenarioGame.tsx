"use client";

import { Scenario } from "@/lib/sanity.queries";
import { useState } from "react";

type Props = {
  scenario: Scenario;
};

export default function ScenarioGame({ scenario }: Props) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [chosenValues, setChosenValues] = useState<string[]>([]);
  const [finalDiagnosis, setFinalDiagnosis] = useState<
    Scenario["diagnoses"][number] | null
  >(null);

  const currentStage = scenario.stages[currentStageIndex];
  const isLastStage = currentStageIndex === scenario.stages.length - 1;

  function handleReplyClick(valueTypeValue: string) {
    const updatedValues = [...chosenValues, valueTypeValue];
    setChosenValues(updatedValues);

    if (isLastStage) {
      const frequency: Record<string, number> = {};
      updatedValues.forEach((v) => {
        frequency[v] = (frequency[v] || 0) + 1;
      });
      const dominantValue = Object.entries(frequency).sort(
        (a, b) => b[1] - a[1]
      )[0][0];

      const matched = scenario.diagnoses.find(
        (d) => d.valueType.value === dominantValue
      );
      setFinalDiagnosis(matched ?? scenario.diagnoses[0]);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
  }

  if (finalDiagnosis) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
        <div className="w-full max-w-lg flex flex-col gap-6 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-zinc-400">
            Hasil Refleksi Kamu
          </span>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {finalDiagnosis.headline}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {finalDiagnosis.harshTruth}
          </p>
          <a
            href="/"
            className="mt-4 self-center rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-6 py-3 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-lg flex flex-col gap-8">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>{scenario.title}</span>
          <span>
            {currentStageIndex + 1} / {scenario.stages.length}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {currentStage.title}
            </span>
            {currentStage.speaker && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {currentStage.speaker}
              </span>
            )}
          </div>
          <p className="text-zinc-800 dark:text-zinc-100 leading-relaxed">
            {currentStage.botPrompt}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {currentStage.replies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleReplyClick(reply.valueType.value)}
              className="text-left rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              {reply.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
