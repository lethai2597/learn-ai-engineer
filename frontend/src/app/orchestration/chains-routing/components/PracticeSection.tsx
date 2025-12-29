"use client";

import { Tabs } from "antd";
import { SimpleChainExercise } from "./SimpleChainExercise";
import { RouterExercise } from "./RouterExercise";
import { ConditionalChainExercise } from "./ConditionalChainExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "simple-chain",
      label: "Bài 1: Simple Chain",
      children: <SimpleChainExercise />,
    },
    {
      key: "router",
      label: "Bài 2: Router Pattern",
      children: <RouterExercise />,
    },
    {
      key: "conditional-chain",
      label: "Bài 3: Conditional Chain",
      children: <ConditionalChainExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}

