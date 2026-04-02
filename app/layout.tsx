import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { getSiteMetadataBase } from "@/lib/site-url";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteMetadataBase(),
  title: "KJSB Benning dan Rekan - Basis Data Spasial",
  description: "Basis data spasial dan tracking progres pekerjaan",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${sourceSans.variable} ${sourceSerif.variable}`}>
      <head>
        {/* Literal meta for QA/curl/view-source (BUG-PLM-002); X-Robots-Tag di next.config.js */}
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="antialiased min-h-screen font-sans">{children}</body>
    </html>
  );
}
