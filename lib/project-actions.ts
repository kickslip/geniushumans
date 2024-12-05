"use server";

import { db } from "@/lib/db";
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(['New', 'In Progress', 'Completed'])
});

export async function createProject(data: z.infer<typeof projectSchema>) {
  try {
    const project = await db.project.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status
      }
    });
    return project;
  } catch (error) {
    console.error("Project creation error:", error);
    throw new Error("Failed to create project");
  }
}