'use server';

import { prisma } from '@/prisma/client';
import { validateRequest } from '@/auth';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schema
const UpdateUserSchema = z.object({
  id: z.string(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  phoneNumber: z.string().optional(),
});

export async function getAllUsers() {
  const session = await validateRequest();
  
  // Ensure only admins can list users
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function updateUserRole(formData: FormData) {
  const session = await validateRequest();
  
  // Ensure only admins can update roles
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id')?.toString();
  const role = formData.get('role')?.toString() as Role;

  if (!id || !role) {
    throw new Error('Invalid input');
  }

  await prisma.user.update({
    where: { id },
    data: { role }
  });

  revalidatePath('/admin/users');
}

export async function deleteUser(formData: FormData) {
  const session = await validateRequest();
  
  // Ensure only admins can delete users
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id')?.toString();

  if (!id) {
    throw new Error('Invalid user ID');
  }

  await prisma.user.delete({
    where: { id }
  });

  revalidatePath('/admin/users');
}

export async function updateUserPhone(formData: FormData) {
  const session = await validateRequest();
  
  // Ensure only admins can update phone numbers
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id')?.toString();
  const phoneNumber = formData.get('phoneNumber')?.toString();

  if (!id || !phoneNumber) {
    throw new Error('Invalid input');
  }

  await prisma.user.update({
    where: { id },
    data: { phoneNumber }
  });

  revalidatePath('/admin/users');
}