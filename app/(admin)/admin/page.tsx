import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import AdminPageClient from './AdminPageClient';
import React from "react";
import AdminPanel from "./AdminPanel";
import Sidebar from "../_components/Sidebar";
import KanbanBoard from '../_components/KanbanBoard';
import ContactFormMessages from '@/components/booking/ContactFormMessages';

export default async function AdminPage() {
  const { user, session } = await validateRequest();

  // Redirect if not authenticated or not an admin
  if (!session || !user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar session={session} />
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto" >
        <AdminPanel />
        <ContactFormMessages />
        <KanbanBoard />
      </main>
    </div>
  );
}