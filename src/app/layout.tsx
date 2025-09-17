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
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code when available
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
        url: "https://SalesHQ.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "SalesHQ - Real-Time AI Sales Assistant",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SalesHQ – Real-Time AI Sales Assistant",
    description: "SalesHQ is an AI-powered sales enablement platform that transcribes calls live, surfaces instant suggestions, and connects to your product knowledge—helping reps respond faster and close more deals.",
    images: ["https://SalesHQ.ai/og-image.png"],
    creator: "@SalesHQ",
    site: "@SalesHQ",
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
    icon: [
      { url: "/icon/favicon.ico", sizes: "any" },
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/icon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      {
        rel: "icon",
        url: "/icon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        rel: "icon",
        url: "/icon/android-chrome-512x512.png", 
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  manifest: "/icon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TVT4BKMB');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="icon" href="/icon/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/icon/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/icon/apple-touch-icon.png" />
        <link rel="manifest" href="/icon/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/icon/browserconfig.xml" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TVT4BKMB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
