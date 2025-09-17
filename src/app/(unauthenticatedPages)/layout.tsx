import UnauthenticatedFooter from "@/components/navigation/UnauthenticatedFooter";
import UnauthenticatedNavbar from "@/components/navigation/UnauthenticatedNavbar";

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
      <div className="px-4">
        <UnauthenticatedFooter />
      </div>
    </div>
  );
}
