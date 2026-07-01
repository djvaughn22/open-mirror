import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DontCloneMeTom.com — Rescue Dogs Are Already Here",
  description:
    "DontCloneMeTom.com — a playful rescue-first campaign reminding the world that original dogs are waiting for homes today. Independent, unaffiliated, and tail-wagging.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
