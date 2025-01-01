import Sidebar from "@/app/(admin)/_components/Sidebar";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import UserTable from "./UserTable";


export default async function KanbanPage() {
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
      <h1 className="text-3xl font-bold mb-8">UserRole Mangement</h1>
        <UserTable />
      </main>
    </div>
  );
}
