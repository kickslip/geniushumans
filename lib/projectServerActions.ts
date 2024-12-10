"use server";

import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for project validation
const ProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  userId: z.string().uuid(),
});

export async function createProject(formData: FormData) {
  try {
    // Validate form data
    const validatedFields = ProjectSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      userId: formData.get("userId"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Create project in the database
    const project = await prisma.project.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        userId: validatedFields.data.userId,
      },
    });

    // Revalidate the path to update the cache
    revalidatePath("/projects");

    return {
      success: true,
      message: "Project created successfully",
      project,
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      success: false,
      message: "Failed to create project",
    };
  }
}
