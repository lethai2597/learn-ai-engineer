"use client";

import { Tabs } from "antd";
import { CalculatorExercise } from "./CalculatorExercise";
import { ResearchExercise } from "./ResearchExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "calculator",
      label: "Bài 1: ReAct Calculator Agent",
      children: <CalculatorExercise />,
    },
    {
      key: "research",
      label: "Bài 2: Research Agent",
      children: <ResearchExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}

