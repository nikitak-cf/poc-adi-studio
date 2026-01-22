import { PrismaClient } from '@prisma/client';
import { env } from './env';

let prisma: PrismaClient;

declare global {
  var __prisma: PrismaClient | undefined;
}

if (env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  prisma = global.__prisma;
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
export default prisma;