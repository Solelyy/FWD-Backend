import * as dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

// Load correct .env file based on NODE_ENV
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.NEON_DB,
  },
});
