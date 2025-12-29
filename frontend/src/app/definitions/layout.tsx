import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Định nghĩa - Learn AI",
  description: "Từ điển thuật ngữ AI/LLM - Tra cứu nhanh các định nghĩa và khái niệm cốt lõi",
};

export default function DefinitionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}






