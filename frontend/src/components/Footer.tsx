"use client";

import { Typography, Space, Popover, Image } from "antd";
import { LinkOutlined, CoffeeOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export function Footer() {
  const coffeeContent = (
    <div className="p-2">
      <Image
        src="/groom-qr.jpg"
        alt="Buy me a coffee QR code"
        width={200}
        height={200}
        preview={false}
      />
    </div>
  );

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <Space orientation="vertical" size="small" className="w-full">
        <Link
          href="https://lehuythai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <LinkOutlined />
          <Text className="text-sm">lehuythai.com</Text>
        </Link>

        <Popover
          content={coffeeContent}
          title="Buy me a coffee"
          trigger="click"
          placement="top"
        >
          <div className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors cursor-pointer">
            <CoffeeOutlined />
            <Text className="text-sm">Buy me a coffee</Text>
          </div>
        </Popover>
      </Space>
    </div>
  );
}
