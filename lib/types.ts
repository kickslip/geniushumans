// types.ts
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status?: Status;
}