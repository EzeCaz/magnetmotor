import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "US 4,151,431 Permanent Magnet Motor — Engineer's Build Guide",
  description:
    "A comprehensive, interactive engineering plan to build Howard R. Johnson's 1979 permanent magnet motor patent. Includes theory, bill of materials, step-by-step build guides for both linear and rotary embodiments, force simulator, and patent claims reference.",
  keywords: [
    "US4151431",
    "Permanent Magnet Motor",
    "Howard Johnson",
    "Patent Build Guide",
    "Magnetic Motor",
    "Engineering",
    "NdFeB",
    "Free Energy Patent",
  ],
  authors: [{ name: "Z.ai" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "US 4,151,431 Permanent Magnet Motor — Engineer's Build Guide",
    description: "Interactive engineering plan to build the Johnson permanent magnet motor patent",
    url: "https://chat.z.ai",
    siteName: "Z.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "US 4,151,431 — Engineer's Build Guide",
    description: "Interactive engineering plan to build the Johnson permanent magnet motor patent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
