"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContextType {
  user: User & {
    role: "USER" | "ADMIN";
  } | null;
  session: Session | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContextType }>) {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  
  return context;
}