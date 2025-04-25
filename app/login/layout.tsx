export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 bg-background">
        {children}
      </div>
    </div>
  );
}
