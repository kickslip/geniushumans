import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from "../_components/Sidebar";
import AdminPanel from "./AdminPanel";
import KanbanBoard from '../_components/KanbanBoard';
import ContactFormMessages from '@/components/booking/ContactFormMessages';
import UserManagement from '@/components/UserManagement';

export default async function AdminPage() {
  const { user, session } = await validateRequest();

  if (!session || !user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar session={session} />
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <AdminPanel />
        <UserManagement />
        <KanbanBoard />
        <ContactFormMessages />
      </main>
    </div>
  );
}
