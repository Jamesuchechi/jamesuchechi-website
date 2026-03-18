import { redirect }       from 'next/navigation';
import { cookies }        from 'next/headers';

export const metadata = { title: 'Admin Login · JU' };

// The login page should NOT be wrapped by the admin layout redirect.
// We handle this by having a standalone layout for the login route.
export default async function AdminLoginLayout({ children }) {
  const cookieStore = await cookies();
  const session     = cookieStore.get('admin_session')?.value;
  const adminPass   = process.env.ADMIN_PASSWORD;

  if (adminPass && session === adminPass) {
    redirect('/admin');
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-0)',
      padding: 'var(--space-6)',
    }}>
      {children}
    </div>
  );
}
