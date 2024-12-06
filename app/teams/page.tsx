import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import React from "react";
import Sidebar from '../(admin)/_components/Sidebar';
import TeamTable from '@/components/TeamComponent';

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
      <h1 className="text-2xl font-bold">Team Members</h1>
        <TeamTable/>
      </main>
    </div>
  );
}