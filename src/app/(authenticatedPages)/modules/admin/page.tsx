import ModuleAdmin from '@/components/modules/admin/ModuleAdmin';
import AdminRouteGuard from '@/components/admin-route-guard';

export default function ModuleAdminPage() {
  return (
    <AdminRouteGuard>
      <ModuleAdmin />
    </AdminRouteGuard>
  );
}