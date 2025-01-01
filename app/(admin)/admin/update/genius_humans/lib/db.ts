// db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

// Add query logging
prisma.$on('query', (event) => {
  console.log(`Query: ${event.query}`)
  console.log(`Params: ${event.params}`)
  console.log(`Duration: ${event.duration}ms`)
})

// // Add error handling
// prisma.$on('error', (err) => {
//   console.error('Prisma client error:', err)
// })

export default prisma