import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const isTestEnv = process.env.NODE_ENV === 'test';
let url = process.env.DATABASE_URL as string;

if (isTestEnv) {
  url = process.env.DATABASE_URL as string;
}

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url,
    },
  }
});

export default prismaClient;
