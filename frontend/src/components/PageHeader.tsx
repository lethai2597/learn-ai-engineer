"use client";

import { Modal, Image, Typography, Space } from "antd";
import { LinkOutlined, CoffeeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";

const { Paragraph, Title } = Typography;

export function PageHeader() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="border-b border-gray-200 bg-white flex items-center justify-between h-[61] px-4">
        <Title level={4} style={{ marginBottom: 0 }}>
          Learn AI
        </Title>
        <div className="flex items-center gap-4">
          <Link
            href="https://lehuythai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <LinkOutlined className="text-lg" />
          </Link>

          <div
            onClick={() => setModalOpen(true)}
            className="flex items-center text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
          >
            <CoffeeOutlined className="text-lg" />
          </div>
        </div>
      </div>

      <Modal
        title="Buy me a coffee"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
      >
        <Space
          className="w-full"
          direction="vertical"
          style={{ marginTop: 20 }}
        >
          <Paragraph className="text-gray-600 mb-2">
            Dự án này được xây dựng với tâm huyết để chia sẻ kiến thức về AI/LLM
            một cách miễn phí và dễ hiểu nhất.
          </Paragraph>
          <Paragraph className="text-gray-600 mb-2">
            Nếu bạn thấy nội dung hữu ích, hãy ủng hộ mình một ly cà phê để có
            thêm động lực tạo ra nhiều bài viết và ví dụ thực tế hơn nữa nhé!
          </Paragraph>

          <div className="flex justify-center">
            <Image
              src="/groom-qr.jpg"
              alt="Buy me a coffee QR code"
              width={500}
              height={500}
              preview={false}
              className="w-full rounded-3xl"
            />
          </div>
        </Space>
      </Modal>
    </>
  );
}
