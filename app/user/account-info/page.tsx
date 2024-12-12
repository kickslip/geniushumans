import { validateRequest } from "@/auth";
import ProfileComponent from "@/components/ProfileComponent";
import { ProjectForm } from "@/components/user/ProjectForm";
import UkanbanBoard from "@/components/user/UkanbanBoard";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  return (
    <>
      <ProfileComponent user={user} />
      {/* <UkanbanBoard />
      <ProjectForm /> */}
    </>
  );
}