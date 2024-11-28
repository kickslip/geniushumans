// prisma/client.ts
import { PrismaClient } from '@prisma/client'

const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['warn', 'error']
}

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== 'production') global.prisma = prisma