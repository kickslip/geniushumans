"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { deleteAccount, signOut, updateProfile } from "@/app/user/account-info/actions";

interface ProfileProps {
  user: {
    id: string;
    username: string;
  };
}

export default function ProfileComponent({ user }: ProfileProps) {
  const [username, setUsername] = useState(user.username);
  const [error, setError] = useState<string | null>(null);

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
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}
          
          <form action={async (formData: FormData) => {
            const newUsername = formData.get("username") as string;
            
            if (!newUsername) {
              setError("Username is required");
              return;
            }
            
            const result = await updateProfile(user.id, { username: newUsername });
            
            if (result.error) {
              setError(result.error);
            } else {
              setUsername(newUsername);
              setError(null);
            }
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <Button type="submit">Update Profile</Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex justify-between items-center">
          <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold">Account Actions</h2>
            
            <div className="flex space-x-4">
              <form action={signOut}>
                <Button variant="outline" type="submit">
                  Sign Out
                </Button>
              </form>

              <form action={async () => {
                const result = await deleteAccount(user.id);
                if (result.error) {
                  setError(result.error);
                }
              }}>
                <Button variant="destructive" type="submit">
                  Delete Account
                </Button>
              </form>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}