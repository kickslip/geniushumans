// app/admin/page.tsx
import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import AdminPageClient from './AdminPageClient';
import React from "react";
import AdminPanel from "./AdminPanel";
import Sidebar from "../_components/Sidebar";

export default async function AdminPage() {
  const { user, session } = await validateRequest();



const Page = () => {
  return(
    <div className="flex">
    {/* Sidebar */}
    <div >
      <Sidebar session={undefined} />
    </div>
  
    {/* Main content */}
    <div className="flex-1">
      <AdminPanel />
    </div>
  </div>
  )
};

  // Redirect if not authenticated or not an admin
  if (!session || !user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return <AdminPageClient initialUser={user} initialSession={session} />;
}
