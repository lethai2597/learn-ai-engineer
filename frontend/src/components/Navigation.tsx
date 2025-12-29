"use client";

import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  BookOutlined,
  ApiOutlined,
  DatabaseOutlined,
  RocketOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  HomeOutlined,
  FileTextOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { PageHeader } from "./PageHeader";

type AppMenuItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  children?: AppMenuItem[];
  disabled?: boolean;
};

const appMenuItems: AppMenuItem[] = [
  {
    key: "/",
    label: "Tổng quan",
    icon: <HomeOutlined />,
  },
  {
    key: "/project-ideas",
    label: "Project Ideas",
    icon: <BulbOutlined />,
  },
  {
    key: "/definitions",
    label: "Định nghĩa",
    icon: <FileTextOutlined />,
  },
  {
    key: "llm-fundamentals",
    icon: <BookOutlined />,
    label: "01. LLM Fundamentals",
    children: [
      {
        key: "/prompt-engineering",
        label: "01. Prompt Engineering",
      },
      {
        key: "/structured-output",
        label: "02. Structured Output",
      },
      {
        key: "/streaming",
        label: "03. Streaming",
      },
      {
        key: "/model-comparison",
        label: "04. Model Comparison",
      },
    ],
  },
  {
    key: "rag",
    icon: <DatabaseOutlined />,
    label: "02. RAG",
    children: [
      {
        key: "/rag/embeddings",
        label: "01. Embeddings",
      },
      {
        key: "/rag/vector-db",
        label: "02. Vector Database",
      },
      {
        key: "/rag/chunking-strategy",
        label: "03. Chunking Strategy",
      },
    ],
  },
  {
    key: "orchestration",
    icon: <ApiOutlined />,
    label: "03. Orchestration",
    children: [
      {
        key: "/orchestration/memory-management",
        label: "01. Memory Management",
      },
      {
        key: "/orchestration/chains-routing",
        label: "02. Chains & Routing",
      },
    ],
  },
  {
    key: "agents",
    icon: <RocketOutlined />,
    label: "04. Agents",
    children: [
      {
        key: "/agents/function-calling",
        label: "01. Function Calling",
      },
      {
        key: "/agents/react-pattern",
        label: "02. ReAct Pattern",
      },
    ],
  },
  {
    key: "production",
    icon: <SafetyOutlined />,
    label: "05. Production",
    children: [
      {
        key: "/production/evaluation",
        label: "01. Evaluation",
      },
      {
        key: "/production/observability",
        label: "02. Observability",
      },
      {
        key: "/production/cost-optimization",
        label: "03. Cost Optimization",
      },
      {
        key: "/production/security",
        label: "04. Security",
      },
      {
        key: "/production/error-handling",
        label: "05. Error Handling",
      },
    ],
  },
  {
    key: "advanced",
    icon: <ExperimentOutlined />,
    label: "06. Advanced",
    children: [
      {
        key: "/advanced/multimodal",
        label: "01. Multimodal",
      },
      {
        key: "/advanced/fine-tuning",
        label: "02. Fine-tuning",
      },
      {
        key: "/advanced/local-models",
        label: "03. Local Models",
      },
    ],
  },
];

const menuItems: MenuProps["items"] = appMenuItems;

const getDefaultOpenKeys = (items: AppMenuItem[]) => {
  return items
    .filter((item) => item.children && item.children.length > 0)
    .map((item) => item.key);
};

/**
 * Navigation Component
 * Sidebar navigation menu cho ứng dụng
 * Tuân theo UI_RULES.md: Sidebar + Main Content layout
 * Mục lục theo cấu trúc docs/
 */
export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Luôn mở tất cả các menu groups
   * Tất cả các menu items có children sẽ được mở mặc định
   */
  const allOpenKeys = useMemo(() => {
    return getDefaultOpenKeys(appMenuItems);
  }, []);

  const [openKeys, setOpenKeys] = useState<string[]>(() => allOpenKeys);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (typeof key === "string" && key.startsWith("/")) {
      router.push(key);
    }
  };

  const handleOpenChange: MenuProps["onOpenChange"] = () => {
    setOpenKeys(allOpenKeys);
  };

  return (
    <div className="w-64 shrink-0 bg-white hidden md:flex h-screen flex-col overflow-hidden">
      <div className="shrink-0">
        <PageHeader />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          openKeys={openKeys}
          items={menuItems}
          onClick={handleMenuClick}
          onOpenChange={handleOpenChange}
          className="border-0"
          style={{ borderRight: 0, background: "transparent" }}
        />
      </div>
    </div>
  );
}
