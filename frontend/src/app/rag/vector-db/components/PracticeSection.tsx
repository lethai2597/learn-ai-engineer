"use client";

import { Tabs } from "antd";
import { IngestDocumentsExercise } from "./IngestDocumentsExercise";
import { VectorSearchExercise } from "./VectorSearchExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "ingest",
      label: "Bài 1: Ingest Documents",
      children: <IngestDocumentsExercise />,
    },
    {
      key: "search",
      label: "Bài 2: Vector Search",
      children: <VectorSearchExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}




