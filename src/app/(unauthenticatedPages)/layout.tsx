import UnauthenticatedNavbar from "@/components/navigation/UnauthenticatedNavbar";
import FooterSection from "@/components/landing/FooterSection";
export default function UnauthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4">
      <UnauthenticatedNavbar />
      </div>
      {children}
      <FooterSection />
    </div>
  );
}
