// types.ts

import { Card, Column, Board } from "@prisma/client";

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed';

// Base task interface that maps to our Card model
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Input types for task operations
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
  columnId?: string;
  order?: number;
}

// Extended types for the board system
export interface BoardWithRelations extends Board {
  Columns: ColumnWithRelations[];
}

export interface ColumnWithRelations extends Column {
  Cards: Card[];
}

// Response types for API endpoints
export interface TaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
}

export interface TasksResponse {
  success: boolean;
  data?: Task[];
  error?: string;
}

// Utility types for task operations
export interface TaskOperation {
  type: 'create' | 'update' | 'delete' | 'move';
  taskId?: string;
  data?: Partial<Task>;
}

// Type guards for runtime type checking
export function isTask(obj: any): obj is Task {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.dueDate === 'string' &&
    typeof obj.priority === 'string' &&
    typeof obj.status === 'string'
  );
}

export function isPriority(value: string): value is Priority {
  return ['low', 'medium', 'high'].includes(value);
}

export function isStatus(value: string): value is Status {
  return ['pending', 'in-progress', 'completed'].includes(value);
}

// Constants
export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
export const STATUSES: Status[] = ['pending', 'in-progress', 'completed'];

// Mapping from column names to status
export const COLUMN_STATUS_MAP: Record<string, Status> = {
  'To Do': 'pending',
  'In Progress': 'in-progress',
  'Done': 'completed',
};

// Type for task validation errors
export interface TaskValidationError {
  field: keyof Task;
  message: string;
}

// Utility type for task filters
export interface TaskFilters {
  priority?: Priority;
  status?: Status;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Type for task sorting
export interface TaskSort {
  field: keyof Task;
  direction: 'asc' | 'desc';
}