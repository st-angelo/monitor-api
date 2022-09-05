import { PrismaClient } from '@prisma/client';

const cacheMap = new Map();
const prismaOptions = { log: process.env.ENVIRONMENT === 'development' ? ['query'] : ['error'] };

function prisma() {
  let prismaClient;
  if (cacheMap.has('default')) return cacheMap.get('default');
  prismaClient = new PrismaClient(prismaOptions);
  applyMiddleware(prismaClient);
  cacheMap.set('default', prismaClient);

  return prismaClient;
}

module.exports = { prisma };
