'use client'
import { LandingNavigation } from "@/components/landing";
import FooterSection from "@/components/landing/FooterSection";
export default function UnauthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sticky top-0 z-50">
      <LandingNavigation />
      </div>
      {children}
      <FooterSection />
    </div>
  );
}
