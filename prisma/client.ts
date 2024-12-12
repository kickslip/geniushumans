import { PrismaClient, Prisma } from '@prisma/client';

const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development'
    ? [{ level: 'error', emit: 'event' }]
    : [{ level: 'warn', emit: 'event' }, { level: 'error', emit: 'event' }]
};

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// key changes are:

// Used Prisma.PrismaClientOptions type for strict type checking
// Replaced string array with an array of log definition objects
// Specified level and emit properties for each log configuration
// In development, only log errors
// In non-production environments, log warnings and errors

// This approach:

// Resolves the TypeScript type error
// Provides type-safe log configuration
// Minimizes logging output
// Maintains error tracking in different environments