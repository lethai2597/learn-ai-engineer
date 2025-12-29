"use client";

import { Typography, Tag, Tooltip, message } from "antd";
import { CopyOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ServiceCodeDisplayProps {
  code: string;
}

export function ServiceCodeDisplay({ code }: ServiceCodeDisplayProps) {
  const handleCopyCode = () => {
    const codeToCopy = code.replace(/\s/g, "-");
    navigator.clipboard.writeText(codeToCopy);
    message.success("Đã copy mã service vào clipboard");
  };

  const displayCode = code.replace(/\s/g, "-");

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        <Text className="text-xs text-gray-600">
          Mã Behind the Scenes
        </Text>
        <Tooltip title="Tìm kiếm mã này ở code base để biết thực sự code cho phần này là gì">
          <QuestionCircleOutlined className="text-gray-400 cursor-help text-xs" />
        </Tooltip>
      </div>
      <Tag
        color="blue"
        className="text-sm font-mono cursor-pointer"
        icon={<CopyOutlined />}
        onClick={handleCopyCode}
      >
        {displayCode}
      </Tag>
    </div>
  );
}

