"use client";

import { Tabs } from "antd";
import { CalculatorExercise } from "./CalculatorExercise";
import { WeatherExercise } from "./WeatherExercise";
import { AssistantExercise } from "./AssistantExercise";

export function PracticeSection() {
  const tabItems = [
    {
      key: "calculator",
      label: "Bài 1: Calculator Tool",
      children: <CalculatorExercise />,
    },
    {
      key: "weather",
      label: "Bài 2: Weather Tool",
      children: <WeatherExercise />,
    },
    {
      key: "assistant",
      label: "Bài 3: Multi-tool Assistant",
      children: <AssistantExercise />,
    },
  ];

  return (
    <div className="px-6 py-4">
      <Tabs items={tabItems} />
    </div>
  );
}

