import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { STUDIO } from "../lib/products";
import OpenMirrorFooter from "../../packages/openmirror-ui/OpenMirrorFooter";
import OpenMirrorNav from "../components/OpenMirrorNav";
import VisualThemeProvider from "../components/VisualThemeProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Studio identity comes from the product registry — one source of truth.
export const metadata: Metadata = {
  metadataBase: new URL(STUDIO.url),
  title: {
    default: STUDIO.name,
    template: `%s | ${STUDIO.name}`,
  },
  description: STUDIO.mission,
  openGraph: {
    siteName: STUDIO.name,
    title: `${STUDIO.name} — ${STUDIO.label}`,
    description: STUDIO.mission,
    url: STUDIO.url,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <VisualThemeProvider>
          <OpenMirrorNav />
          {children}
          <OpenMirrorFooter siteName={STUDIO.name} tagline={STUDIO.label} />
        </VisualThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-91WTHE5VQJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-91WTHE5VQJ');`}
        </Script>
      </body>
    </html>
  );
}
