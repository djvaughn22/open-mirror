import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OpenMirrorFooter from "../../packages/openmirror-ui/OpenMirrorFooter";
import OpenMirrorNav from "../components/OpenMirrorNav";
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
  metadataBase: new URL("https://openmirrorllc.com"),
  title: {
    default: "Open Mirror LLC — Independent Product Studio",
    template: "%s | Open Mirror LLC",
  },
  description:
    "Open Mirror LLC is an independent product studio creating useful, original products across faith, family, creativity, and play.",
  openGraph: {
    siteName: "Open Mirror LLC",
    title: "Open Mirror LLC — Independent Product Studio",
    description:
      "Open Mirror LLC is an independent product studio creating useful, original products across faith, family, creativity, and play.",
    url: "https://openmirrorllc.com",
    type: "website",
  },
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
        <VisualThemeProvider>
          <OpenMirrorNav />
          {children}
          <OpenMirrorFooter siteName="Open Mirror LLC" tagline="Independent Product Studio" />
        </VisualThemeProvider>
      </body>
    </html>
  );
}
