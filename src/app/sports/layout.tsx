import type { Metadata } from "next";

// 2026-11-14: the hub's old St. Louis sports wire is superseded by iDontCry's
// Sports Desk (idontcry.com/sports). The pages stay live for anyone holding a
// link, but search engines are asked not to index them, so they never compete
// with the real desk.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
