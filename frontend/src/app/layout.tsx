import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { antdTheme } from "@/config/antd-theme";
import { QueryProvider } from "@/providers/query-provider";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tổng quan và Định nghĩa - Learn AI",
  description: "Monorepo học tập về AI/LLM với backend API, frontend web application và tài liệu học tập",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <QueryProvider>
          <AntdRegistry>
            <ConfigProvider theme={antdTheme}>
              <div className="min-h-screen flex flex-col">
                <div className="flex-1 flex min-w-0">
                  <Navigation />
                  <main className="flex-1 border-l border-gray-200 min-w-0 h-screen overflow-y-auto overflow-x-auto">{children}</main>
                </div>
              </div>
            </ConfigProvider>
          </AntdRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
