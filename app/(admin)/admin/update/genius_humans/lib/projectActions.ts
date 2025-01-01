// app/actions/projectActions.ts
'use server'

import { validateRequest, hasRole } from "@/auth";
import { prisma } from "@/prisma/client";
import { ProjectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/login');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) {
    throw new Error("Project title is required");
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description: description || '',
        status: ProjectStatus.NEW,
        userId: user.id
      }
    });

    revalidatePath('/projects');
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

export async function updateProjectStatus(projectId: string, newStatus: ProjectStatus) {
  const { user } = await validateRequest();
  if (!user || !hasRole(user, 'ADMIN')) {
    throw new Error("Only admins can update project status");
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus }
    });

    revalidatePath('/admin/kanban');
    return updatedProject;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw new Error('Failed to update project status');
  }
}

export async function getUserProjects() {
  const { user } = await validateRequest();
  if (!user) {
    redirect('/login');
  }

  try {
    return await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function getAllProjects() {
  const { user } = await validateRequest();
  if (!user || !hasRole(user, 'ADMIN')) {
    throw new Error("Only admins can view all projects");
  }

  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function deleteProject(projectId: string) {
  const { user } = await validateRequest();
  if (!user || !hasRole(user, 'ADMIN')) {
    throw new Error("Only admins can delete projects");
  }

  try {
    await prisma.project.delete({
      where: { id: projectId }
    });

    revalidatePath('/admin/kanban');
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}