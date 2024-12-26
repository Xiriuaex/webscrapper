import { PrismaClient } from '@prisma/client';
import path from 'path';

declare global {
  var prisma: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction
  ? `file:${path.resolve(__dirname, 'prisma', 'dev.db')}`
  : process.env.DATABASE_URL || 'file:./prisma/dev.db';

  console.log('Database Path:', dbPath);

export const prisma = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: dbPath,
    },
  },
});
 
if (!isProduction) globalThis.prisma = prisma;
