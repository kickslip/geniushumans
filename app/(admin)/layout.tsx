import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();

  if (!session) {
    // Redirect to the login page if no session exists
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    // Redirect to an unauthorized page if user is not an admin
    redirect("/unauthorized");
  }

  return (
    <SessionProvider value={{ user, session }}>
      {children}
    </SessionProvider>
  );
}