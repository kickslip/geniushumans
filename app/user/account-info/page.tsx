// app/profile/page.tsx
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { revalidatePath } from "next/cache";
import { deleteAccount, getUserProfile, signOut, updateProfile } from "./actions";

export default async function ProfilePage() {
  const { user, session } = await validateRequest();
  
  if (!user || !session) {
    redirect("/login");
  }

  const profileResult = await getUserProfile(user.id);
  
  if ("error" in profileResult) {
    return <div className="p-4">Error loading profile: {profileResult.error}</div>;
  }

  const profile = profileResult.user;

  async function handleUpdateProfile(formData: FormData) {
    "use server";
    
    const displayName = formData.get("displayName") as string;
    const username = formData.get("username") as string;

    if (!displayName || !username) {
      return { error: "All fields are required" };
    }

    const result = await updateProfile(profile.id, {
      displayName,
      username,
    });

    if (result.error) {
      return { error: result.error };
    }

    revalidatePath("/profile");
  }

  async function handleDeleteAccount() {
    "use server";
    await deleteAccount(profile.id);
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings
          </p>
        </CardHeader>
        
        <CardContent>
          <form action={handleUpdateProfile}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile.username}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={profile.displayName}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Account Created</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button type="submit">
                Update Profile
              </Button>
              
              <form action={signOut}>
                <Button variant="outline" type="submit">
                  Sign Out
                </Button>
              </form>
            </div>
          </form>
        </CardContent>

        <CardFooter className="border-t pt-6">
          <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
            <form action={handleDeleteAccount}>
              <Button variant="destructive" type="submit">
                Delete Account
              </Button>
            </form>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}