import { redirect } from "next/navigation";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";
import { validateRequest } from "@/auth";

export default async function Layout({
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
    <div className="flex min-h-screen flex-col">
      <Navbar session={{ user, session }} />
      <div className="flex w-full grow">
        <Sidebar 
          className="hidden h-full w-64 lg:block" 
          session={{ user, session }} 
        />
        <main className="flex-grow p-5">{children}</main>
      </div>
    </div>
  );
}