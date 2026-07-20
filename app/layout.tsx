import type { Metadata } from "next";
import { Inter, Sora, Geist_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.AUTH_URL || "http://localhost:3000";
const SITE_NAME = "J.R. Recruiting";
const DEFAULT_TITLE = "JR Recruiting | Connect Student-Athletes with College Coaches";
const DEFAULT_DESCRIPTION =
  "JR Recruiting helps student-athletes get discovered by college coaches with searchable, verified player profiles by state, country, and sport.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | JR Recruiting",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
      className={`dark ${inter.variable} ${sora.variable} ${geistMono.variable} h-full antialiased [color-scheme:dark]`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
