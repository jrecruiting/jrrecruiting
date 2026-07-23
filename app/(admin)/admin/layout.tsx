import { requireRole } from "@/lib/permissions";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("ADMIN");

  return (
    <div className="flex min-h-[calc(100dvh-0px)] flex-1 flex-col sm:flex-row">
      <AdminNav />
      <main className="flex-1 overflow-x-auto p-4 sm:p-8">{children}</main>
    </div>
  );
}
