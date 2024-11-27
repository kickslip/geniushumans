// pages/admin/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar session={session} />
      <div className="flex w-full grow">
        <Sidebar className="hidden h-full w-64 lg:block" session={session} />
        <main className="flex-grow p-5">{children}</main>
      </div>
    </div>
  );
}

async function validateRequest() {
  const session = await getSession();

  if (!session) {
    // Redirect to the login page
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    // Redirect to an unauthorized page or display an error message
    redirect("/unauthorized");
  }

  return session;
}