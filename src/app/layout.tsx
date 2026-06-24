import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VisualThemeProvider from "../components/VisualThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "✝️ ❤️ 🙏 CrossHeartPray",
    template: "✝️ ❤️ 🙏 %s",
  },
  icons: {
      icon: "/crossheartpray-icon.svg",
      shortcut: "/crossheartpray-icon.svg",
      apple: "/crossheartpray-icon.svg",
    },
  description: "A simple Bible web app for Bible Bingo 7, a Bible Reading Plan, and Daily Hope.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <VisualThemeProvider>{children}</VisualThemeProvider>
      </body>
    </html>
  );
}
