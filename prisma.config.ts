import * as dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';
import { DateHelper } from './src/utils/date.utils';

// Load correct .env file based on NODE_ENV
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'production'}`,
});

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
