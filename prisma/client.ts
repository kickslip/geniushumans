// prisma/client.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error'] as Prisma.LogLevel[] // Explicitly type the array as LogLevel[]
    : ['warn', 'error'] as Prisma.LogLevel[] // Explicitly type the array as LogLevel[]
};

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
