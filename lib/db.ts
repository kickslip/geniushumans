// lib/db.ts
import { PrismaClient } from '@prisma/client'

const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['warn', 'error']
}

const createPrismaClient = () => {
  return new PrismaClient(prismaClientOptions)
}

type GlobalThisWithPrisma = typeof globalThis & {
  prisma?: ReturnType<typeof createPrismaClient>
}

const globalForPrisma = global as GlobalThisWithPrisma

export const db = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db