// app/SessionProvider.tsx
"use client"

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContextType {
    user: User | null;
    session: Session | null;
}

const SessionContext = createContext<SessionContextType>({
    user: null,
    session: null
});

export default function SessionProvider({
    children,
    user,
    session
}: React.PropsWithChildren<{
    user: User | null;
    session: Session | null;
}>) {
    return (
        <SessionContext.Provider value={{ user, session }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}