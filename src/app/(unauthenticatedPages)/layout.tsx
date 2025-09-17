import UnauthenticatedFooter from "@/components/navigation/UnauthenticatedFooter";

export default function UnauthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <div className="px-4">
        <UnauthenticatedFooter />
      </div>
    </div>
  );
}
