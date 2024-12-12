"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/prisma/client"


// Schema definitions
const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["low", "medium", "high"]),
});

const UpdateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Title is required").max(100).optional(),
  description: z.string().min(1, "Description is required").max(500).optional(),
  dueDate: z.string().min(1, "Due date is required").optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export type CreateTaskInput = z.infer<typeof TaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

// Helper function to get or create default user
async function getDefaultUser() {
  const defaultUser = await prisma.user.findFirst();
  
  if (!defaultUser) {
    return await prisma.user.create({
      data: {
        name: 'Default User',
        email: 'default@example.com',
      }
    });
  }

  return defaultUser;
}

// Helper function to get or create default board
async function getDefaultBoard() {
  const defaultUser = await getDefaultUser();
  
  let defaultBoard = await prisma.board.findFirst({
    where: { userId: defaultUser.id },
    include: {
      Columns: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!defaultBoard) {
    defaultBoard = await prisma.board.create({
      data: {
        name: "My Tasks",
        userId: defaultUser.id,
        Columns: {
          create: [
            { name: "To Do", order: 0 },
            { name: "In Progress", order: 1 },
            { name: "Done", order: 2 },
          ],
        },
      },
      include: {
        Columns: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  return defaultBoard;
}

export async function createTask(input: CreateTaskInput) {
  try {
    const validatedData = TaskSchema.parse(input);
    const defaultBoard = await getDefaultBoard();
    const todoColumn = defaultBoard.Columns[0];

    // Use a transaction to ensure atomicity
    const newCard = await prisma.$transaction(async (tx) => {
      const highestOrder = await tx.card.findFirst({
        where: { columnId: todoColumn.id },
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      return await tx.card.create({
        data: {
          title: validatedData.title,
          description: `${validatedData.description}\n\nPriority: ${validatedData.priority}\nDue Date: ${validatedData.dueDate}`,
          columnId: todoColumn.id,
          order: (highestOrder?.order ?? 0) + 1, // Changed from -1 to 0
        },
      });
    });

    revalidatePath('/tasks');
    revalidatePath('/board');
    return newCard;

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors[0].message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to create task');
  }
}

export async function updateTask(input: UpdateTaskInput) {
  try {
    const validatedData = UpdateTaskSchema.parse(input);

    const existingCard = await prisma.card.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingCard) {
      throw new Error('Task not found');
    }

    const updatedCard = await prisma.card.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        description: validatedData.description
          ? `${validatedData.description}\n\nPriority: ${validatedData.priority}\nDue Date: ${validatedData.dueDate}`
          : undefined,
      },
    });

    revalidatePath('/tasks');
    revalidatePath('/board');
    return updatedCard;

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors[0].message}`);
    }
    throw error instanceof Error ? error : new Error('Failed to update task');
  }
}

export async function deleteTask(id: string) {
  try {
    const existingCard = await prisma.card.findUnique({
      where: { id },
    });

    if (!existingCard) {
      throw new Error('Task not found');
    }

    await prisma.card.delete({
      where: { id },
    });

    revalidatePath('/tasks');
    revalidatePath('/board');

  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to delete task');
  }
}

export async function getTasks() {
  try {
    const defaultBoard = await getDefaultBoard();

    const cards = await prisma.card.findMany({
      where: {
        column: {
          boardId: defaultBoard.id,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description?.split('\n\n')[0] ?? '',
      priority: (card.description?.match(/Priority: (low|medium|high)/) ?? [])[1] as 'low' | 'medium' | 'high' || 'medium',
      dueDate: (card.description?.match(/Due Date: (.+)/) ?? [])[1] ?? '',
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    }));

  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch tasks');
  }
}

export async function getTask(id: string) {
  try {
    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return null;
    }

    return {
      id: card.id,
      title: card.title,
      description: card.description?.split('\n\n')[0] ?? '',
      priority: (card.description?.match(/Priority: (low|medium|high)/) ?? [])[1] as 'low' | 'medium' | 'high' || 'medium',
      dueDate: (card.description?.match(/Due Date: (.+)/) ?? [])[1] ?? '',
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    };

  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch task');
  }
}