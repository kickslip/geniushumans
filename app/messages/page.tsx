import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import ContactFormMessages from "@/components/booking/ContactFormMessages";
import Sidebar from "../(admin)/_components/Sidebar";


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
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        <ContactFormMessages />
      </main>
    </div>
  );
}