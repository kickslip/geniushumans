import { validateRequest } from "@/auth";
import ProfileComponent from "@/components/ProfileComponent";
import UserBookings from "@/components/user/UserBookings";
import UserProjects from "@/components/user/UserProjects";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  return (
    <>
      <ProfileComponent user={user} />
      {/* <UserBookings /> */}
      <UserProjects />
    </>
  );
}