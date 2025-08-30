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
  title: {
    default: "SalesHQ – Real-Time AI Sales Assistant",
    template: "%s | SalesHQ",
  },
  description: "SalesHQ is an AI-powered sales enablement platform that transcribes calls live, surfaces instant suggestions, and connects to your product knowledge—helping reps respond faster and close more deals.",
  keywords: [
    "AI sales assistant",
    "sales enablement",
    "real-time transcription",
    "sales intelligence",
    "product knowledge management",
    "sales automation",
    "AI-powered sales",
    "sales productivity",
    "customer relationship management",
    "sales performance",
  ],
  authors: [{ name: "SalesHQ" }],
  creator: "SalesHQ",
  publisher: "SalesHQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://SalesHQ.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://SalesHQ.ai",
    siteName: "SalesHQ",
    title: "SalesHQ – Real-Time AI Sales Assistant",
    description: "SalesHQ is an AI-powered sales enablement platform that transcribes calls live, surfaces instant suggestions, and connects to your product knowledge—helping reps respond faster and close more deals.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SalesHQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SalesHQ – Real-Time AI Sales Assistant",
    description: "SalesHQ is an AI-powered sales enablement platform that transcribes calls live, surfaces instant suggestions, and connects to your product knowledge—helping reps respond faster and close more deals.",
    images: ["/og-image.jpg"],
  },
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
