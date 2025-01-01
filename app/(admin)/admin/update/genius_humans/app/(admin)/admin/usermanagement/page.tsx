import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "../../_components/Sidebar";
import UserManagementPage from "@/components/UserManagement";

export default async function Page() {
    const { user, session } = await validateRequest();

    // Redirect if not authenticated or not an admin
    if (!session || !user || user.role !== 'ADMIN') {
      redirect('/login');
    }

  return (
    <div className="flex min-h-screen">
        <Sidebar session={session} />
      {/* Main content */}
      <main className="flex-1 overflow-y-auto" >
        <UserManagementPage/>
      </main>
    </div>
  );
}