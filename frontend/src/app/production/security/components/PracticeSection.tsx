"use client";

import { Tabs } from "antd";
import { PromptInjectionExercise } from "./PromptInjectionExercise";
import { ContentModerationExercise } from "./ContentModerationExercise";
import { PiiDetectionExercise } from "./PiiDetectionExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "prompt-injection",
      label: "Bài 1: Prompt Injection Detection",
      children: <PromptInjectionExercise />,
    },
    {
      key: "content-moderation",
      label: "Bài 2: Content Moderation",
      children: <ContentModerationExercise />,
    },
    {
      key: "pii-detection",
      label: "Bài 3: PII Detection & Redaction",
      children: <PiiDetectionExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}




