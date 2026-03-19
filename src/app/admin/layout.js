import { cookies }     from 'next/headers';
import { redirect }    from 'next/navigation';
import { AdminShell }  from '@/components/layout/AdminShell';

export const metadata = { title: 'Admin · JU' };

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const session     = cookieStore.get('admin_session')?.value;
  const adminPass   = process.env.ADMIN_PASSWORD;

  // Authentication is now handled by middleware to avoid redirect loops 
  // into this nested layout.

  return <AdminShell>{children}</AdminShell>;
}
