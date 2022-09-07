import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.ENVIRONMENT === 'development' ? ['query'] : ['error'],
});

export default prisma;
