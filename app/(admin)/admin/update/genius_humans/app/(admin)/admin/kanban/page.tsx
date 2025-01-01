import { validateRequest } from "@/auth";
import Sidebar from "../../_components/Sidebar";
import { redirect } from "next/navigation";
import KanbanBoard from "../../_components/KanbanBoard";


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
        <KanbanBoard />
      </main>
    </div>
  );
}