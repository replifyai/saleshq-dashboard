import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Replify – Real-Time AI Sales Assistant",
    template: "%s | Replify",
  },
  description:
    "Replify is an AI-powered sales enablement platform that transcribes calls live, surfaces instant suggestions, and connects to your product knowledge—helping reps respond faster and close more deals.",
  keywords: [
    "AI sales assistant",
    "live transcription",
    "real-time coaching",
    "sales enablement",
    "call coaching",
    "conversation intelligence",
    "knowledge base",
    "product library",
    "sales productivity",
    "voice to text",
    "browser tab audio capture",
    "organization chart",
    "practice quizzes",
  ],
  applicationName: "Replify",
  authors: [{ name: "Replify" }],
  creator: "Replify",
  publisher: "Replify",
  category: "Artificial Intelligence",
  themeColor: "#0EA5E9",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Replify",
    title: "Replify – Real-Time AI Sales Assistant",
    description:
      "Replify is an AI-powered sales enablement platform that transcribes calls live, surfaces instant suggestions, and connects to your product knowledge—helping reps respond faster and close more deals.",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "Replify",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Replify – Real-Time AI Sales Assistant",
    description:
      "Replify is an AI-powered sales enablement platform that transcribes calls live, surfaces instant suggestions, and connects to your product knowledge—helping reps respond faster and close more deals.",
    images: ["/vercel.svg"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
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
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
