import { cookies }     from 'next/headers';
import { redirect }    from 'next/navigation';
import { AdminShell }  from '@/components/layout/AdminShell';

export const metadata = { title: 'Admin · JU' };

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const session     = cookieStore.get('admin_session')?.value;
  const adminPass   = process.env.ADMIN_PASSWORD;

  // We cannot know the exact pathname inside a layout without searchParams,
  // so we rely on the x-pathname header set by middleware or just return the
  // login page bare (it has its own standalone layout).
  // If not authenticated, middleware redirect will catch sub-routes.
  const isAuthenticated = !adminPass || session === adminPass;

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
