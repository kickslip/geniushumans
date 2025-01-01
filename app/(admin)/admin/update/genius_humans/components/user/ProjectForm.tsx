"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { validateRequest } from "@/auth";
import { createProject } from "@/lib/ProjectServerActions";

export function ProjectForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      toast.error("You must be logged in to create a project");
      return;
    }

    // Append user ID to the form data
    formData.append("userId", user.id);

    // Send data to server
    const result = await createProject(formData);

    // Show success or error message
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-secondary p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create New Project</h2>
      <div>
        <label htmlFor="title" className="block mb-2">
          Project Title
        </label>
        <Input
          type="text"
          name="title"
          id="title"
          required
          placeholder="Enter project title"
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2">
          Description (Optional)
        </label>
        <Textarea
          name="description"
          id="description"
          placeholder="Enter project description"
        />
      </div>
      <Button type="submit" className="w-full">
        Create Project
      </Button>
    </form>
  );
}
