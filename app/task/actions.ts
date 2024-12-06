'use server'

import { CreateTaskInput, Task, UpdateTaskInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// Simulated database for demonstration
const tasks: Task[] = [];

export async function createTask(input: CreateTaskInput): Promise<Task> {
  try {
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      ...input,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(task);
    revalidatePath('/tasks');
    return task;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create task');
  }
}

export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  try {
    const taskIndex = tasks.findIndex(t => t.id === input.id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    revalidatePath('/tasks');
    return updatedTask;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update task');
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    tasks.splice(taskIndex, 1);
    revalidatePath('/tasks');
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete task');
  }
}

export async function getTasks(): Promise<Task[]> {
  try {
    return tasks;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch tasks');
  }
}

export async function getTask(id: string): Promise<Task | null> {
  try {
    const task = tasks.find(t => t.id === id);
    return task || null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch task');
  }
}