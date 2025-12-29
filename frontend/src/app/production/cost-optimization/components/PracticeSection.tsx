"use client";

import { Tabs } from "antd";
import { TokenCountingExercise } from "./TokenCountingExercise";
import { SemanticCachingExercise } from "./SemanticCachingExercise";
import { CostDashboardExercise } from "./CostDashboardExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "token-counting",
      label: "Bài 1: Token Counting",
      children: <TokenCountingExercise />,
    },
    {
      key: "semantic-caching",
      label: "Bài 2: Semantic Caching",
      children: <SemanticCachingExercise />,
    },
    {
      key: "cost-dashboard",
      label: "Bài 3: Cost Dashboard",
      children: <CostDashboardExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}




