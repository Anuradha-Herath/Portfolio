import { AdminLayout } from '@/components/(admin)/AdminLayout';

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}