import type { Metadata } from "next";
import { IBM_Plex_Sans, Libre_Baskerville } from "next/font/google";

import { SplashScreen } from "@/components/brand/splash-screen";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpeciVerse — The Living Species Guide",
  description: "A living, page-turning field guide to remarkable wild species.",
  icons: {
    icon: [
      { url: "/brand/speciverse-mark.svg", type: "image/svg+xml" },
      { url: "/brand/speciverse-mark.png", type: "image/png", sizes: "1024x1024" },
    ],
    apple: "/brand/speciverse-mark.png",
  },
  openGraph: {
    title: "SpeciVerse — The Living Species Guide",
    description: "Turn the pages of a living field guide to discover the remarkable lives of wild species.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${libreBaskerville.variable}`}>
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
