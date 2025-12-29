"use client";

import { Tabs } from "antd";
import { CreateEmbeddingsExercise } from "./CreateEmbeddingsExercise";
import { SemanticSearchExercise } from "./SemanticSearchExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "create",
      label: "Bài 1: Tạo Embeddings",
      children: <CreateEmbeddingsExercise />,
    },
    {
      key: "search",
      label: "Bài 2: Semantic Search",
      children: <SemanticSearchExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}




