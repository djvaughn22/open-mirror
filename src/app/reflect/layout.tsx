import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reflect",
  description: "A quiet minute — one honest prompt, then a few things to sit with.",
  alternates: { canonical: "/reflect" },
};

export default function ReflectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
