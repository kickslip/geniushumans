"use client";

import React from "react";
import { User, Session } from "lucia";
import AdminPanel from "./AdminPanel";
import { useSession } from "@/app/SessionProvider";
import Sidebar from "../_components/Sidebar";

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
        user={user?.username ?? initialUser?.username ?? undefined}
      />
    </div>
  );
}
