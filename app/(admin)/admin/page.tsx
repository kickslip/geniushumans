// app/admin/page.tsx
import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import AdminPageClient from './AdminPageClient';

export default async function AdminPage() {
  const { user, session } = await validateRequest();

  // Redirect if not authenticated or not an admin
  if (!session || !user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return <AdminPageClient initialUser={user} initialSession={session} />;
}
