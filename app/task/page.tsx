import { validateRequest } from '@/auth';
import { redirect } from 'next/navigation';
import React from "react";
import Sidebar from '../(admin)/_components/Sidebar';
import { getTasks } from './actions';
import TaskBoard from '@/components/TasksComponents';

export default async function AdminPage() {
  const tasks = await getTasks();
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
      <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <TaskBoard />
      </div>
    </div>
    </div>
  );
}