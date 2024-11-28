'use client';

import React from 'react';
import { User, Session } from 'lucia';
import AdminPanel from './AdminPanel';
import Sidebar from '../_components/Sidebar';
import { useSession } from '@/app/SessionProvider';

export default function AdminPageClient({
  initialUser,
  initialSession,
}: {
  initialUser: User | null;
  initialSession: Session | null;
}) {
  // Use the custom useSession hook to access context
  const { user, session } = useSession();

  return (
    <div>
      <AdminPanel />
      {/* Ensure fallback aligns with expected types */}
      <Sidebar 
        session={session ?? initialSession ?? undefined} 
        user={user ?? initialUser ?? undefined} 
      />
    </div>
  );
}
