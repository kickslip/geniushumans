"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for project creation
const ProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  userId: z.string().uuid(),
});

// Validation schema for project update
const ProjectUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().optional(),
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export async function createProject(formData: FormData) {
  try {
    // Validate input 
    const validatedFields = ProjectSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      userId: formData.get('userId'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input",
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    // Create project
    const project = await db.project.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        userId: validatedFields.data.userId,
      }
    });

    // Revalidate path to refresh server-side rendering
    revalidatePath('/projects');

    return {
      success: true,
      message: "Project created successfully",
      project
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      success: false,
      message: "Failed to create project"
    };
  }
}

export async function updateProjectStatus(formData: FormData) {
  try {
    const validatedFields = ProjectUpdateSchema.safeParse({
      id: formData.get('id'),
      status: formData.get('status') as any,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input",
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const { id, status } = validatedFields.data;

    // Update project status
    const updatedProject = await db.project.update({
      where: { id },
      data: { status }
    });

    // Revalidate path to refresh server-side rendering
    revalidatePath('/projects');

    return {
      success: true,
      message: "Project status updated successfully",
      project: updatedProject
    };
  } catch (error) {
    console.error("Failed to update project status:", error);
    return {
      success: false,
      message: "Failed to update project status"
    };
  }
}

export async function deleteProject(formData: FormData) {
  try {
    const id = formData.get('id') as string;

    // Delete project
    await db.project.delete({
      where: { id }
    });

    // Revalidate path to refresh server-side rendering
    revalidatePath('/projects');

    return {
      success: true,
      message: "Project deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return {
      success: false,
      message: "Failed to delete project"
    };
  }
}

export async function fetchProjects(userId: string) {
  try {
    const projects = await db.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      projects
    };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return {
      success: false,
      projects: []
    };
  }
}