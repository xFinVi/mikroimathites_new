import { AdminNavbar } from "@/components/admin/admin-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-light">
      <AdminNavbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}

