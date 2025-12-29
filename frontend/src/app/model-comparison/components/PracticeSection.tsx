"use client";

import { Tabs } from "antd";
import { ModelComparisonExercise } from "./ModelComparisonExercise";
import { ModelRouterExercise } from "./ModelRouterExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "comparison",
      label: "Bài 1: So sánh Models",
      children: <ModelComparisonExercise />,
    },
    {
      key: "router",
      label: "Bài 2: Model Router",
      children: <ModelRouterExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}




