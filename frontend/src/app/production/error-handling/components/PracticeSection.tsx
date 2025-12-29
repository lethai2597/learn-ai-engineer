"use client";

import { Tabs } from "antd";
import { RetryExercise } from "./RetryExercise";
import { CircuitBreakerExercise } from "./CircuitBreakerExercise";
import { FallbackExercise } from "./FallbackExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "retry",
      label: "Bài 1: Retry với Exponential Backoff",
      children: <RetryExercise />,
    },
    {
      key: "circuit-breaker",
      label: "Bài 2: Circuit Breaker Pattern",
      children: <CircuitBreakerExercise />,
    },
    {
      key: "fallback",
      label: "Bài 3: Fallback Strategy",
      children: <FallbackExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}




